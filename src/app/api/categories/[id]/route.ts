import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, slug, description, image, displayOrder } = body;

    const data: Prisma.CategoryUpdateInput = {};
    if (name !== undefined) data.name = name.trim();
    if (slug !== undefined) data.slug = slug.trim();
    if (description !== undefined) data.description = description.trim();
    if (image !== undefined) data.image = image.trim();
    if (displayOrder !== undefined) data.displayOrder = Number(displayOrder);

    const updated = await prisma.category.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error: unknown) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category." },
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
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error: unknown) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category." },
      { status: 500 }
    );
  }
}
