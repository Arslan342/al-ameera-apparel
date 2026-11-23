import prisma from "@/lib/prisma";
import ProductManagementTable from "@/components/admin/ProductManagementTable";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            isPrimary: true,
          },
        },
        _count: {
          select: { inquiries: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0d1626] tracking-tight">
          Catalogue &amp; Inventory Products
        </h1>
        <p className="text-xs sm:text-sm text-[#526075] mt-1">
          Manage garment specifications, sizing matrices, colorways, and manufacturing availability.
        </p>
      </div>

      <ProductManagementTable initialProducts={products} categories={categories} />
    </div>
  );
}
