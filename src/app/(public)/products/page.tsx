import { Metadata } from "next";
import prisma from "@/lib/prisma";
import ProductCatalogClient from "@/components/products/ProductCatalogClient";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Garment Catalogue & Specifications | Al-Ameera Apparel (Pvt.) Ltd.",
  description:
    "Explore Al-Ameera Apparel's garment production catalogue: knitwear, fleece, corporate polos, cargo trousers, and performance sportswear. B2B private label manufacturing specifications and custom OEM silhouettes.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const initialCategory = params.category || "";

  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    prisma.product.findMany({
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
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <div className="py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Clean Editorial Header */}
        <Reveal direction="up" className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#a67e2e]">
            <span className="w-6 h-[1.5px] bg-[#b8913f]" />
            <span>Garment Catalogue</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#0d1626] tracking-[-0.025em]">
            Apparel Collections &amp; Specifications
          </h1>
          <p className="text-sm sm:text-base text-[#526075] leading-relaxed">
            Explore baseline silhouettes produced for private-label and contract OEM programs. All fabric GSM weights, Pantone shades, and trims are tailored directly to client tech packs.
          </p>
        </Reveal>

        <ProductCatalogClient
          initialProducts={products}
          categories={categories}
          selectedCategorySlug={initialCategory}
        />
      </div>
    </div>
  );
}
