import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        specifications: {
          orderBy: { displayOrder: "asc" },
        },
      },
    }),
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  if (!product) {
    notFound();
  }

  // Parse sizes safely
  let parsedSizes: string[] = [];
  try {
    parsedSizes = Array.isArray(product.sizes)
      ? product.sizes
      : JSON.parse(product.sizes || "[]");
  } catch {
    parsedSizes = product.sizes ? product.sizes.split(",") : [];
  }

  // Parse colors safely
  let parsedColors: string[] = [];
  try {
    parsedColors = Array.isArray(product.colors)
      ? product.colors
      : JSON.parse(product.colors || "[]");
  } catch {
    parsedColors = product.colors ? product.colors.split(",") : [];
  }

  const initialFormData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku || "",
    description: product.description,
    fabricDetails: product.fabricDetails || "",
    categoryId: product.categoryId,
    sizes: parsedSizes,
    colors: parsedColors,
    availability: product.availability,
    minOrderQuantity: product.minOrderQuantity || "",
    isFeatured: product.isFeatured,
    isDemo: product.isDemo,
    imageUrl: product.images[0]?.url || "",
    specifications: product.specifications.map((s) => ({
      key: s.key,
      value: s.value,
      group: s.group,
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0d1626] tracking-tight">
          Edit Product: {product.name.replace(/^\[Demo Product\]\s*/i, "")}
        </h1>
        <p className="text-xs sm:text-sm text-[#526075] mt-1">
          Update garment specifications, availability, colorways, or fabric composition.
        </p>
      </div>

      <ProductForm
        categories={categories}
        initialData={initialFormData}
        isEdit={true}
      />
    </div>
  );
}
