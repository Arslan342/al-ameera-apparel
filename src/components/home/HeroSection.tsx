import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ParallaxMedia from "@/components/motion/ParallaxMedia";
import AnimatedCounter from "@/components/motion/AnimatedCounter";

const fabricCapabilities = [
  "Combed Cotton Single Jersey",
  "Heavyweight French Terry",
  "CVC Micro-Pique",
  "Yarn-Dyed Oxford Weave",
  "Industrial Cotton Twill",
  "Moisture-Wicking Interlock",
  "Custom Pantone Dyeing",
  "Private Label & OEM Production",
];

export default function HeroSection() {
  return (
    <section className="pt-4 sm:pt-6 pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-5">
        {/* Architectural Glass-Framed Hero Showcase */}
        <div className="relative rounded-[28px] sm:rounded-[32px] overflow-hidden border border-white/75 shadow-[0_28px_70px_-24px_rgba(9,16,31,0.34)] min-h-[560px] lg:min-h-[640px] flex flex-col justify-between bg-[#0b1324]">
          {/* Parallax Editorial Atelier Visual */}
          <div className="absolute inset-0">
            <ParallaxMedia
              src="/images/hero-atelier.jpg"
              alt="Al-Ameera Apparel minimalist garment collection studio"
              className="w-full h-full"
              intensity={38}
              priority
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#09101f]/90 via-[#0d192e]/72 to-[#09101f]/38"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#09101f]/85 via-transparent to-[#09101f]/25"
            />
          </div>

          {/* Primary Editorial Content */}
          <div className="relative z-10 px-6 sm:px-10 lg:px-14 pt-14 sm:pt-20 pb-10 max-w-3xl space-y-6">
            <div
              className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#e2c26b] animate-hero-in"
              style={{ animationDelay: "40ms" }}
            >
              <span className="w-7 h-[1.5px] bg-[#d4af37]" />
              <span>Korangi Industrial Area · Karachi</span>
            </div>

            <h1
              className="font-display text-4xl sm:text-5xl lg:text-[58px] font-bold tracking-[-0.03em] text-white leading-[1.06] animate-hero-in"
              style={{ animationDelay: "120ms" }}
            >
              Precision Garment Manufacturing for Modern Brands
            </h1>

            <p
              className="text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-xl font-normal animate-hero-in"
              style={{ animationDelay: "200ms" }}
            >
              Al-Ameera Apparel (Pvt.) Ltd. partners with domestic and international labels to engineer knitwear, fleece, polos, and woven apparel with consistent export quality.
            </p>

            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 animate-hero-in"
              style={{ animationDelay: "280ms" }}
            >
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-[#0b1324] bg-white/95 hover:bg-white shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5"
              >
                <span>Explore Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact#inquiry"
                className="glass-dark-subtle inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white hover:bg-white/15 transition-all hover:-translate-y-0.5"
              >
                <span>Request Manufacturing Quote</span>
                <ArrowUpRight className="w-4 h-4 opacity-80" />
              </Link>
            </div>
          </div>

          {/* Floating Smoked-Glass Metrics Dock */}
          <div
            className="relative z-10 px-4 sm:px-8 lg:px-10 pb-5 sm:pb-7 animate-hero-in"
            style={{ animationDelay: "360ms" }}
          >
            <div className="glass-dark rounded-2xl px-5 sm:px-8 py-5 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-white/12">
              <div className="lg:pr-6">
                <div className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  <AnimatedCounter target={280} />
                </div>
                <div className="text-xs text-slate-300/85 mt-1">
                  Skilled Manufacturing Staff
                </div>
              </div>

              <div className="lg:px-6">
                <div className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Sector 23
                </div>
                <div className="text-xs text-slate-300/85 mt-1">
                  Plot 27, Mehran Town, Korangi
                </div>
              </div>

              <div className="lg:px-6">
                <div className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  <AnimatedCounter target={4} suffix="-Tier" />
                </div>
                <div className="text-xs text-slate-300/85 mt-1">
                  Quality &amp; Needle Audit Flow
                </div>
              </div>

              <div className="lg:pl-6">
                <div className="font-display text-2xl sm:text-3xl font-bold text-[#e2c26b] tracking-tight">
                  OEM &amp; FOB
                </div>
                <div className="text-xs text-slate-300/85 mt-1">
                  Private Label · Direct Karachi Ports
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Frosted Textile Capability Strip */}
        <div className="glass-panel-subtle rounded-2xl py-3.5 overflow-hidden">
          <div className="animate-marquee items-center">
            {[...fabricCapabilities, ...fabricCapabilities].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-6 px-6 text-xs font-medium tracking-[0.08em] uppercase text-[#475569] whitespace-nowrap"
              >
                <span>{item}</span>
                <span className="w-1 h-1 rounded-full bg-[#b8913f]/70" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
