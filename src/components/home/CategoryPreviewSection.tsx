import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import SafeImage from "@/components/common/SafeImage";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  _count?: {
    products: number;
  };
}

interface CategoryPreviewSectionProps {
  categories: Category[];
}

export default function CategoryPreviewSection({ categories }: CategoryPreviewSectionProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#a67e2e]">
              <span className="w-6 h-[1.5px] bg-[#b8913f]" />
              <span>Garment Divisions</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0d1626] tracking-[-0.025em]">
              Capabilities by Product Line
            </h2>
            <p className="text-sm sm:text-base text-[#526075] leading-relaxed">
              Engineered across combed cotton jersey, French terry, corporate pique, and structured wovens tailored strictly to client specifications.
            </p>
          </div>

          <Link
            href="/products"
            className="glass-btn-secondary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shrink-0 group self-start md:self-auto"
          >
            <span>Full Catalogue</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const cleanDesc = (
              cat.description ||
              "Customized fabric construction, dyeing, cutting, and private label finishes."
            ).replace(/^\[Demo Category\]\s*/i, "");

            return (
              <Reveal key={cat.id} delay={idx * 70} direction="up">
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group relative block rounded-[24px] overflow-hidden border border-white/80 shadow-[0_18px_42px_-18px_rgba(15,26,46,0.2)] aspect-[4/3] bg-[#0f1a2e] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_54px_-18px_rgba(15,26,46,0.28)]"
                >
                  {/* Background photography */}
                  <SafeImage
                    src={cat.image || "/images/cat-knitwear.jpg"}
                    fallbackSrc="/images/cat-knitwear.jpg"
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#09101f]/85 via-[#09101f]/25 to-transparent"
                  />

                  {/* Top subtle model count chip */}
                  {cat._count?.products !== undefined && cat._count.products > 0 && (
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full glass-dark-subtle text-[11px] font-medium text-white/95">
                      {cat._count.products} {cat._count.products === 1 ? "Style" : "Styles"}
                    </div>
                  )}

                  {/* Bottom Frosted Smoked-Glass Caption Dock */}
                  <div className="absolute inset-x-3.5 bottom-3.5 z-10 glass-dark rounded-2xl p-4 sm:p-5 transition-colors duration-300 group-hover:border-white/30">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="font-display text-lg font-bold text-white leading-snug">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed">
                          {cleanDesc}
                        </p>
                      </div>
                      <span className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-white group-hover:text-[#0b1324]">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
