import prisma from "@/lib/prisma";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0d1626] tracking-tight">
          Garment Divisions &amp; Categories
        </h1>
        <p className="text-xs sm:text-sm text-[#526075] mt-1">
          Organize apparel styles into functional manufacturing divisions.
        </p>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  );
}
