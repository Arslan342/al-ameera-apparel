import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ParallaxMedia from "@/components/motion/ParallaxMedia";
import Reveal from "@/components/motion/Reveal";

export default function CtaBanner() {
  return (
    <section className="py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <div className="relative rounded-[32px] overflow-hidden border border-white/75 shadow-[0_28px_68px_-24px_rgba(9,16,31,0.32)] py-16 sm:py-20 px-6 sm:px-12 bg-[#0b1324]">
            {/* Parallax Fabric Stack Backdrop */}
            <div className="absolute inset-0">
              <ParallaxMedia
                src="/images/cta-fabrics.jpg"
                alt="Curated cotton garment textiles ready for private label production"
                className="w-full h-full"
                intensity={32}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[#09101f]/72"
              />
            </div>

            {/* Centered Frosted Smoked-Glass Panel */}
            <div className="relative z-10 max-w-3xl mx-auto glass-dark rounded-[24px] p-8 sm:p-12 text-center space-y-6">
              <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#e2c26b]">
                <span className="w-5 h-[1.5px] bg-[#d4af37]" />
                <span>Direct Factory Engagement</span>
                <span className="w-5 h-[1.5px] bg-[#d4af37]" />
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-[-0.025em] leading-tight">
                Ready to Discuss Your Next Production Run?
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
                Share your technical packs, target GSM specifications, or sample strike-off requirements directly with our Karachi merchandising desk.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                <Link
                  href="/contact#inquiry"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-[#0b1324] bg-white/95 hover:bg-white shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <span>Submit Production RFQ</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products"
                  className="w-full sm:w-auto glass-dark-subtle inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white hover:bg-white/15 transition-all hover:-translate-y-0.5"
                >
                  <span>Browse Catalogue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
