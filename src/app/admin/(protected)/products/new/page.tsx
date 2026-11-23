import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0d1626] tracking-tight">
          Add Garment Specification
        </h1>
        <p className="text-xs sm:text-sm text-[#526075] mt-1">
          Create a new product entry with fabric specs, sizing matrix, and colorways.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
