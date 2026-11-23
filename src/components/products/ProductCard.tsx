import Link from "next/link";
import { Layers, ArrowUpRight, MessageSquareQuote } from "lucide-react";
import GlassCard from "@/components/motion/GlassCard";
import SafeImage from "@/components/common/SafeImage";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  description: string;
  fabricDetails?: string | null;
  sizes: string;
  colors: string;
  availability: string;
  minOrderQuantity?: string | null;
  isDemo?: boolean;
  category?: {
    name: string;
    slug: string;
  } | null;
  images: {
    id?: string;
    url: string;
    alt?: string | null;
    isPrimary?: boolean;
  }[];
}

export default function ProductCard({ product }: { product: ProductCardProps }) {
  let parsedSizes: string[] = [];
  try {
    parsedSizes = Array.isArray(product.sizes)
      ? product.sizes
      : JSON.parse(product.sizes || "[]");
  } catch {
    parsedSizes = product.sizes ? product.sizes.split(",") : [];
  }

  let parsedColors: string[] = [];
  try {
    parsedColors = Array.isArray(product.colors)
      ? product.colors
      : JSON.parse(product.colors || "[]");
  } catch {
    parsedColors = product.colors ? product.colors.split(",") : [];
  }

  const cleanName = product.name.replace(/^\[Demo Product\]\s*/i, "");
  const cleanDescription = product.description.replace(/^\[Demo Product Specifications\]\s*/i, "");
  const cleanMoq = product.minOrderQuantity
    ? product.minOrderQuantity.replace(/\s*\[Demo MOQ\]/i, "")
    : null;

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    "/images/cat-knitwear.jpg";

  const getAvailabilityMeta = (status: string) => {
    switch (status) {
      case "IN_PRODUCTION":
        return { label: "In Production", dot: "bg-emerald-500" };
      case "SAMPLE_AVAILABLE":
        return { label: "Sample Ready", dot: "bg-[#386194]" };
      case "MADE_TO_ORDER":
      default:
        return { label: "Made to Order", dot: "bg-[#c59b3e]" };
    }
  };

  const avail = getAvailabilityMeta(product.availability);

  return (
    <GlassCard className="group rounded-[24px] h-full">
      <div className="flex flex-col h-full p-2.5">
        {/* Framed Editorial Image */}
        <Link
          href={`/products/${product.id}`}
          className="relative aspect-[4/3] w-full rounded-[18px] overflow-hidden bg-slate-200/70 block"
        >
          <SafeImage
            src={primaryImage}
            fallbackSrc="/images/cat-knitwear.jpg"
            alt={cleanName}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#09101f]/35 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"
          />

          {/* Top-left single frosted category pill */}
          {product.category && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-wide bg-[#0b1324]/75 text-white backdrop-blur-md border border-white/15">
                {product.category.name}
              </span>
            </div>
          )}

          {/* Top-right clean status pill */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/85 text-[#0d1626] backdrop-blur-md border border-white/80 shadow-sm">
              <span className={`w-1.5 h-1.5 rounded-full ${avail.dot}`} />
              <span>{avail.label}</span>
            </span>
          </div>
        </Link>

        {/* Product Details */}
        <div className="px-2.5 pt-4 pb-2 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            {product.sku && (
              <div className="text-[10px] font-mono tracking-wider text-[#748299] uppercase">
                {product.sku}
              </div>
            )}

            <h3 className="font-display font-bold text-[#0d1626] text-[15px] leading-snug group-hover:text-[#1d3a63] transition-colors line-clamp-2">
              <Link href={`/products/${product.id}`}>{cleanName}</Link>
            </h3>

            <p className="text-xs text-[#526075] line-clamp-2 leading-relaxed">
              {cleanDescription}
            </p>

            {product.fabricDetails && (
              <div className="flex items-center gap-1.5 text-[11px] text-[#334155] bg-white/60 px-2.5 py-1.5 rounded-lg border border-white/80">
                <Layers className="w-3.5 h-3.5 text-[#1d3a63] shrink-0" />
                <span className="truncate">{product.fabricDetails}</span>
              </div>
            )}
          </div>

          {/* Compact Specs */}
          <div className="space-y-2 pt-3 border-t border-slate-900/[0.07] text-xs">
            {parsedSizes.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#748299]">
                  Sizes
                </span>
                <div className="flex flex-wrap gap-1">
                  {parsedSizes.slice(0, 5).map((size) => (
                    <span
                      key={size}
                      className="px-1.5 py-0.5 rounded-md text-[10px] bg-white/65 border border-white/80 text-[#334155] font-mono"
                    >
                      {size}
                    </span>
                  ))}
                  {parsedSizes.length > 5 && (
                    <span className="text-[10px] text-[#748299] self-center">
                      +{parsedSizes.length - 5}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-[#526075]">
              {parsedColors.length > 0 && (
                <span className="truncate pr-2">
                  {parsedColors.length} {parsedColors.length === 1 ? "Shade" : "Shades"}
                </span>
              )}
              {cleanMoq && (
                <span className="font-semibold text-[#0d1626] shrink-0">MOQ {cleanMoq}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2.5 border-t border-slate-900/[0.07] flex items-center gap-2">
            <Link
              href={`/products/${product.id}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#0d1626] bg-white/65 hover:bg-white border border-white/85 transition-all"
            >
              <span>Specifications</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </Link>

            <Link
              href={`/contact?product=${encodeURIComponent(cleanName)}&id=${product.id}#inquiry`}
              className="glass-btn-primary inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold"
            >
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>RFQ</span>
            </Link>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
