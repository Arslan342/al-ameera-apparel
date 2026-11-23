import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductDetailView from "@/components/products/ProductDetailView";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: id }, { slug: id }],
    },
    select: {
      name: true,
      description: true,
    },
  });

  if (!product) {
    return {
      title: "Product Not Found | Al-Ameera Apparel",
    };
  }

  const cleanName = product.name.replace(/^\[Demo Product\]\s*/i, "");

  return {
    title: `${cleanName} | Al-Ameera Apparel (Pvt.) Ltd.`,
    description: product.description.replace(/^\[Demo Product Specifications\]\s*/i, ""),
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;

  // Find product by id or slug
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: id }, { slug: id }],
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      images: {
        select: {
          id: true,
          url: true,
          alt: true,
          isPrimary: true,
        },
        orderBy: { isPrimary: "desc" },
      },
      specifications: {
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      images: {
        select: {
          id: true,
          url: true,
          alt: true,
          isPrimary: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
