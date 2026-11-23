import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        images: true,
        specifications: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: unknown) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to retrieve product" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

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
    } = body;

    const dataToUpdate: Prisma.ProductUpdateInput = {};
    if (name !== undefined) dataToUpdate.name = name.trim();
    if (slug !== undefined) dataToUpdate.slug = slug.trim();
    if (sku !== undefined) dataToUpdate.sku = sku.trim();
    if (description !== undefined) dataToUpdate.description = description.trim();
    if (fabricDetails !== undefined) dataToUpdate.fabricDetails = fabricDetails.trim();
    if (sizes !== undefined) {
      dataToUpdate.sizes = typeof sizes === "string" ? sizes : JSON.stringify(sizes);
    }
    if (colors !== undefined) {
      dataToUpdate.colors = typeof colors === "string" ? colors : JSON.stringify(colors);
    }
    if (availability !== undefined) dataToUpdate.availability = availability;
    if (minOrderQuantity !== undefined) dataToUpdate.minOrderQuantity = minOrderQuantity;
    if (isFeatured !== undefined) dataToUpdate.isFeatured = Boolean(isFeatured);
    if (isDemo !== undefined) dataToUpdate.isDemo = Boolean(isDemo);
    if (categoryId !== undefined) {
      dataToUpdate.category = { connect: { id: categoryId } };
    }

    const updated = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
      include: {
        category: true,
        images: true,
      },
    });

    // If new image provided, create product image
    if (imageUrl) {
      await prisma.productImage.create({
        data: {
          productId: id,
          url: imageUrl.trim(),
          alt: `${updated.name} Photography`,
          isPrimary: updated.images.length === 0,
        },
      });
    }

    // If specifications provided, update specifications
    if (body.specifications && Array.isArray(body.specifications)) {
      await prisma.productSpecification.deleteMany({
        where: { productId: id },
      });
      const validSpecs = body.specifications.filter(
        (s: { key?: string; value?: string }) => s.key && s.value && s.key.trim() && s.value.trim()
      );
      if (validSpecs.length > 0) {
        await prisma.productSpecification.createMany({
          data: validSpecs.map((s: { key: string; value: string; group?: string }, idx: number) => ({
            productId: id,
            key: s.key.trim(),
            value: s.value.trim(),
            group: s.group ? s.group.trim() : "GENERAL",
            displayOrder: idx + 1,
          })),
        });
      }
    }

    const finalProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        specifications: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    return NextResponse.json({ success: true, product: finalProduct });
  } catch (error: unknown) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: unknown) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
