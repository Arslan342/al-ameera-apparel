"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Layers,
  MessageSquareQuote,
  ShieldCheck,
  Ruler,
  Palette,
  FileText,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import ProductCard, { ProductCardProps } from "./ProductCard";
import Reveal from "@/components/motion/Reveal";
import SafeImage from "@/components/common/SafeImage";

interface ProductDetailViewProps {
  product: {
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
    isFeatured: boolean;
    isDemo?: boolean;
    createdAt: Date | string;
    category: {
      id: string;
      name: string;
      slug: string;
    } | null;
    images: {
      id: string;
      url: string;
      alt?: string | null;
      isPrimary: boolean;
    }[];
    specifications?: {
      id: string;
      key: string;
      value: string;
      group?: string;
    }[];
  };
  relatedProducts: ProductCardProps[];
}

export default function ProductDetailView({
  product,
  relatedProducts,
}: ProductDetailViewProps) {
  const cleanName = product.name.replace(/^\[Demo Product\]\s*/i, "");
  const cleanDescription = product.description.replace(/^\[Demo Product Specifications\]\s*/i, "");
  const cleanMoq = product.minOrderQuantity
    ? product.minOrderQuantity.replace(/\s*\[Demo MOQ\]/i, "").replace(/\s*\[Production MOQ\]/i, "")
    : "500 pcs";

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

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(parsedSizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(parsedColors[0] || "");

  const displayImages =
    product.images && product.images.length > 0
      ? product.images
      : [
          {
            id: "fallback",
            url: "/images/cat-knitwear.jpg",
            alt: cleanName,
            isPrimary: true,
          },
        ];

  const currentImage = displayImages[activeImageIndex] || displayImages[0];

  const getAvailabilityMeta = (status: string) => {
    switch (status) {
      case "IN_PRODUCTION":
        return { label: "In Production", dot: "bg-emerald-500" };
      case "SAMPLE_AVAILABLE":
        return { label: "Sample Swatch Ready", dot: "bg-[#386194]" };
      case "MADE_TO_ORDER":
      default:
        return { label: "Made to Order (OEM)", dot: "bg-[#c59b3e]" };
    }
  };

  const avail = getAvailabilityMeta(product.availability);

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Clean Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs text-[#64748b]">
          <Link href="/" className="hover:text-[#0d1626] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <Link href="/products" className="hover:text-[#0d1626] transition-colors">
            Catalogue
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-[#0d1626] transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-[#0d1626] font-semibold truncate max-w-xs">{cleanName}</span>
        </nav>

        {/* Main Elevated Frosted Glass Showcase */}
        <Reveal direction="up">
          <div className="glass-panel-strong rounded-[30px] p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
              {/* Left Column: Gallery */}
              <div className="lg:col-span-6 space-y-4">
                <div className="relative aspect-[4/3] rounded-[22px] overflow-hidden bg-slate-200/70 border border-white/80 shadow-md">
                  <SafeImage
                    key={currentImage.url}
                    src={currentImage.url}
                    fallbackSrc="/images/cat-knitwear.jpg"
                    alt={currentImage.alt || cleanName}
                    loading="eager"
                    className="w-full h-full object-cover object-center transition-all duration-500"
                  />

                  {product.category && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-[#0b1324]/75 text-white backdrop-blur-md border border-white/15">
                        {product.category.name}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white/88 text-[#0d1626] backdrop-blur-md border border-white shadow-sm">
                      <span className={`w-2 h-2 rounded-full ${avail.dot}`} />
                      <span>{avail.label}</span>
                    </span>
                  </div>
                </div>

                {/* Thumbnails */}
                {displayImages.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-1">
                    {displayImages.map((img, idx) => (
                      <button
                        key={img.id || idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          activeImageIndex === idx
                            ? "border-[#0f1a2e] ring-2 ring-[#0f1a2e]/20 scale-[1.02]"
                            : "border-white/70 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <SafeImage
                          src={img.url}
                          fallbackSrc="/images/cat-knitwear.jpg"
                          alt={`View ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Quality Standard Note */}
                <div className="glass-panel-subtle rounded-2xl p-4 space-y-1.5 text-xs text-[#526075]">
                  <div className="flex items-center gap-2 font-semibold text-[#0d1626]">
                    <ShieldCheck className="w-4 h-4 text-[#1d3a63]" />
                    <span>Manufacturing &amp; Audit Assurance</span>
                  </div>
                  <p className="leading-relaxed">
                    Produced at our Korangi Industrial Area facility in Karachi. Audited for stitch density, seam tension, dimensional stability, and calibrated needle detection.
                  </p>
                </div>
              </div>

              {/* Right Column: Specifications & Quote Action */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    {product.category && (
                      <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a67e2e]">
                        <span className="w-5 h-[1.5px] bg-[#b8913f]" />
                        <span>{product.category.name}</span>
                      </div>
                    )}

                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0d1626] tracking-[-0.02em] leading-snug">
                      {cleanName}
                    </h1>

                    {product.sku && (
                      <div className="text-xs font-mono text-[#748299]">
                        SKU: <span className="text-[#334155] font-semibold">{product.sku}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-[#526075] leading-relaxed">{cleanDescription}</p>

                  {/* Fabric Spec Highlight */}
                  {product.fabricDetails && (
                    <div className="glass-panel-subtle rounded-2xl p-4 text-xs text-[#334155] flex items-start gap-2.5">
                      <Layers className="w-4 h-4 text-[#1d3a63] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-[#0d1626]">Fabric Construction: </span>
                        <span>{product.fabricDetails}</span>
                      </div>
                    </div>
                  )}

                  {/* Size Grading */}
                  {parsedSizes.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#0d1626] flex items-center gap-1.5">
                          <Ruler className="w-3.5 h-3.5 text-[#1d3a63]" />
                          <span>Size Grading</span>
                        </span>
                        <span className="text-[#64748b]">
                          Selected: <strong className="text-[#0d1626]">{selectedSize}</strong>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {parsedSizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              selectedSize === size
                                ? "bg-[#0f1a2e] text-white border-[#0f1a2e] shadow-sm"
                                : "bg-white/65 text-[#334155] border-white/85 hover:bg-white"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Colorways */}
                  {parsedColors.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#0d1626] flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5 text-[#1d3a63]" />
                          <span>Colorways</span>
                        </span>
                        <span className="text-[#64748b]">
                          Selected: <strong className="text-[#0d1626]">{selectedColor}</strong>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {parsedColors.map((col) => (
                          <button
                            key={col}
                            type="button"
                            onClick={() => setSelectedColor(col)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                              selectedColor === col
                                ? "bg-[#0f1a2e] text-white border-[#0f1a2e] shadow-sm"
                                : "bg-white/65 text-[#334155] border-white/85 hover:bg-white"
                            }`}
                          >
                            {col}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-[#748299]">
                        Custom Pantone lab-dip dyeing available for commercial bulk programs.
                      </p>
                    </div>
                  )}

                  {/* Technical Specifications */}
                  {product.specifications && product.specifications.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-xs font-semibold text-[#0d1626] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#1d3a63]" />
                        <span>Technical Specifications</span>
                      </span>
                      <div className="rounded-2xl overflow-hidden border border-white/80 divide-y divide-slate-900/[0.06] text-xs bg-white/45">
                        {product.specifications.map((spec) => (
                          <div key={spec.id} className="flex justify-between gap-4 px-3.5 py-2.5">
                            <span className="font-medium text-[#526075]">{spec.key}</span>
                            <span className="font-semibold text-[#0d1626] text-right">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Commercial Parameters */}
                  <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="glass-panel-subtle rounded-2xl p-3.5">
                      <div className="text-[#748299] font-medium">Production MOQ</div>
                      <div className="font-display font-bold text-[#0d1626] mt-0.5 text-sm">
                        {cleanMoq}
                      </div>
                    </div>
                    <div className="glass-panel-subtle rounded-2xl p-3.5">
                      <div className="text-[#748299] font-medium">Lead Time</div>
                      <div className="font-display font-bold text-[#0d1626] mt-0.5 text-sm">
                        Confirmed upon PO
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary RFQ CTA */}
                <div className="space-y-2.5 pt-5 border-t border-slate-900/[0.08]">
                  <Link
                    href={`/contact?product=${encodeURIComponent(cleanName)}&id=${product.id}&size=${encodeURIComponent(selectedSize)}&color=${encodeURIComponent(selectedColor)}#inquiry`}
                    className="glass-btn-primary w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold"
                  >
                    <MessageSquareQuote className="w-4.5 h-4.5" />
                    <span>Request Factory Quote for this Style</span>
                  </Link>
                  <p className="text-center text-[11px] text-[#748299]">
                    B2B contract manufacturing · Custom tech pack &amp; strike-off approvals supported
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Related Garments */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0d1626]">
                Related Garments
              </h2>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1d3a63] hover:text-[#0d1626]"
              >
                <span>Full Catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((p, idx) => (
                <Reveal key={p.id} delay={idx * 70} direction="up" className="h-full">
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
