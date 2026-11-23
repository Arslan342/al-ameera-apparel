import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { categoryCreateSchema } from "@/lib/validations";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ categories });
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const parseResult = categoryCreateSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Invalid category payload.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, slug, description, image, displayOrder } = parseResult.data;

    const catSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: catSlug,
        description: description ? description.trim() : null,
        image: image ? image.trim() : null,
        displayOrder,
      },
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category. Ensure name and slug are unique." },
      { status: 500 }
    );
  }
}
