import { Metadata } from "next";
import prisma from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import CompanyIntro from "@/components/home/CompanyIntro";
import CategoryPreviewSection from "@/components/home/CategoryPreviewSection";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CtaBanner from "@/components/home/CtaBanner";

export const metadata: Metadata = {
  title: "Al-Ameera Apparel (Pvt.) Ltd. | Garment Manufacturing Karachi",
  description:
    "Al-Ameera Apparel (Pvt.) Ltd. is a B2B apparel and garment manufacturer in Korangi Industrial Area, Karachi, Pakistan with 280 skilled personnel. Specialized in knitwear, woven garments, and private label production.",
};

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true },
      take: 8,
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
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  return (
    <div>
      <HeroSection />
      <CompanyIntro />
      <CategoryPreviewSection categories={categories} />
      <FeaturedProductsSection products={featuredProducts} />
      <WhyChooseUs />
      <CtaBanner />
    </div>
  );
}
