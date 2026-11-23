import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { inquiryCreateSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rateLimit";
import {
  sendCustomerInquiryConfirmation,
  sendAdminInquiryNotification,
} from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    // 1. IP rate limiting: max 10 submissions per 10 minutes per IP
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const rateCheck = checkRateLimit(`inquiry:${ip}`, { limit: 10, windowMs: 600000 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many quotation requests submitted. Please wait before submitting another." },
        { status: 429 }
      );
    }

    // 2. Body validation with Zod
    const body = await req.json();
    const parseResult = inquiryCreateSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Invalid inquiry payload.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const {
      name,
      email,
      phone,
      company,
      country,
      inquiryType,
      message,
      requestedQuantity,
      sizeRequirements,
      colorRequirements,
      fabricCustomization,
      attachmentUrl,
      privacyConsent,
      productId,
      items,
    } = parseResult.data;

    // 3. Generate collision-resistant sequential reference number
    const year = new Date().getFullYear();
    const count = await prisma.inquiry.count();
    let counter = count + 1;
    let referenceNo = `ALM-RFQ-${year}-${String(counter).padStart(4, "0")}`;
    let existingRef = await prisma.inquiry.findUnique({ where: { referenceNo } });
    while (existingRef) {
      counter++;
      referenceNo = `ALM-RFQ-${year}-${String(counter).padStart(4, "0")}`;
      existingRef = await prisma.inquiry.findUnique({ where: { referenceNo } });
    }

    // 4. Create inquiry and relational inquiry items in database
    const inquiry = await prisma.inquiry.create({
      data: {
        referenceNo,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        company: company ? company.trim() : null,
        country: country ? country.trim() : null,
        inquiryType: inquiryType || "BULK_ORDER",
        message: message.trim(),
        requestedQuantity: requestedQuantity ? requestedQuantity.trim() : null,
        sizeRequirements: sizeRequirements ? sizeRequirements.trim() : null,
        colorRequirements: colorRequirements ? colorRequirements.trim() : null,
        fabricCustomization: fabricCustomization ? fabricCustomization.trim() : null,
        attachmentUrl: attachmentUrl || null,
        privacyConsent,
        status: "NEW",
        productId: productId || null,
        items: items && items.length > 0
          ? {
              create: items.map((item) => ({
                productId: item.productId,
                requestedQuantity: item.requestedQuantity,
                size: item.size,
                color: item.color,
                specifications: item.specifications,
              })),
            }
          : undefined,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    // 5. Fire transactional emails asynchronously without blocking response or losing RFQ if SMTP fails
    try {
      const emailPayload = {
        referenceNo: inquiry.referenceNo || referenceNo,
        name: inquiry.name,
        email: inquiry.email,
        company: inquiry.company,
        phone: inquiry.phone,
        country: inquiry.country,
        inquiryType: inquiry.inquiryType,
        message: inquiry.message,
        requestedQuantity: inquiry.requestedQuantity,
        productName: inquiry.product?.name,
      };

      // Send customer confirmation & admin alert
      await Promise.allSettled([
        sendCustomerInquiryConfirmation(emailPayload),
        sendAdminInquiryNotification(emailPayload),
      ]);
    } catch (emailErr) {
      console.warn("Email dispatch error (inquiry saved safely):", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your inquiry has been received successfully. Our merchandising desk will follow up.",
        referenceNo: inquiry.referenceNo,
        inquiry,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: "Internal server error saving inquiry. Please try again or email us directly." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const whereClause: { status?: string } = {};
    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    const inquiries = await prisma.inquiry.findMany({
      where: whereClause,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ inquiries });
  } catch (error: unknown) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries." },
      { status: 500 }
    );
  }
}
