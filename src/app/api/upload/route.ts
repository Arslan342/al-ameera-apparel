import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { getSession } from "@/lib/auth";
import {
  storage,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_DOCUMENT_EXTENSIONS,
  MAX_IMAGE_SIZE_BYTES,
  MAX_DOCUMENT_SIZE_BYTES,
} from "@/lib/storage";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const purpose = (formData.get("purpose") as string) || "product_image";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";

    const ext = path.extname(file.name || "").toLowerCase();

    if (purpose === "quote_attachment") {
      // Rate limit quotation file uploads
      const rate = checkRateLimit(`upload_quote:${ip}`, { limit: 10, windowMs: 60000 });
      if (!rate.success) {
        return NextResponse.json(
          { error: "Upload rate limit exceeded. Please try again shortly." },
          { status: 429 }
        );
      }

      // Validate document file type and extension
      if (!ALLOWED_DOCUMENT_TYPES.includes(file.type) || !ALLOWED_DOCUMENT_EXTENSIONS.includes(ext)) {
        return NextResponse.json(
          { error: "Invalid document type. Allowed formats: PDF, Word DOC/DOCX, PNG, JPG, WebP." },
          { status: 400 }
        );
      }

      // Validate size
      if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
        return NextResponse.json(
          { error: "File exceeds maximum size limit of 10MB." },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const result = await storage.upload(buffer, file.name, file.type, "inquiries");

      return NextResponse.json({
        success: true,
        url: result.url,
        fileName: result.fileName,
      });
    }

    // Default: Product image upload requires admin session
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type) || !ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: "Invalid image format. Allowed formats: JPG, PNG, WebP, AVIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image exceeds maximum allowed size of 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await storage.upload(buffer, file.name, file.type, "products");

    return NextResponse.json({
      success: true,
      url: result.url,
      fileName: result.fileName,
    });
  } catch (error: unknown) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file." },
      { status: 500 }
    );
  }
}
