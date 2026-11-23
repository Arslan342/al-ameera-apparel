import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { productCreateSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const availability = searchParams.get("availability");
    const search = searchParams.get("search");

    const where: Prisma.ProductWhereInput = {};

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (availability) {
      where.availability = availability;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: true,
        specifications: {
          orderBy: { displayOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error: unknown) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
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
    const parseResult = productCreateSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Invalid product data.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const {
      name,
      slug,
      sku,
      description,
      fabricDetails,
      sizes,
      colors,
      availability,
      minOrderQuantity,
      isFeatured,
      isDemo,
      categoryId,
      imageUrl,
      specifications,
    } = parseResult.data;

    // Generate slug if not provided
    const productSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
        "-" +
        Date.now().toString().slice(-4);

    const sizesJson = typeof sizes === "string" ? sizes : JSON.stringify(sizes || []);
    const colorsJson = typeof colors === "string" ? colors : JSON.stringify(colors || []);

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: productSlug,
        sku: sku ? sku.trim() : null,
        description: description.trim(),
        fabricDetails: fabricDetails ? fabricDetails.trim() : null,
        sizes: sizesJson,
        colors: colorsJson,
        availability,
        minOrderQuantity: minOrderQuantity || "500 pcs [Production MOQ]",
        isFeatured,
        isDemo: Boolean(isDemo),
        categoryId,
        images: imageUrl
          ? {
              create: [
                {
                  url: imageUrl.trim(),
                  alt: `${name} Photography`,
                  isPrimary: true,
                },
              ],
            }
          : undefined,
        specifications:
          specifications && specifications.length > 0
            ? {
                create: specifications.map((s, idx) => ({
                  key: s.key,
                  value: s.value,
                  group: s.group || "GENERAL",
                  displayOrder: idx + 1,
                })),
              }
            : undefined,
      },
      include: {
        category: true,
        images: true,
        specifications: true,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product. Ensure slug or name is unique." },
      { status: 500 }
    );
  }
}
