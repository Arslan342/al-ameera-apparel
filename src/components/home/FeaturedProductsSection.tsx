import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard, { ProductCardProps } from "@/components/products/ProductCard";
import Reveal from "@/components/motion/Reveal";

interface FeaturedProductsSectionProps {
  products: ProductCardProps[];
}

export default function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#a67e2e]">
              <span className="w-6 h-[1.5px] bg-[#b8913f]" />
              <span>Featured Collection</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0d1626] tracking-[-0.025em]">
              Selected Garment Silhouettes
            </h2>
            <p className="text-sm sm:text-base text-[#526075] leading-relaxed">
              Representative private-label silhouettes crafted in custom GSM weights, Pantone shades, and buyer-specified trims.
            </p>
          </div>

          <Link
            href="/products"
            className="glass-btn-secondary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shrink-0 group self-start md:self-auto"
          >
            <span>Explore All Styles</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <Reveal key={product.id} delay={idx * 75} direction="up" className="h-full">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
