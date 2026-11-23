import Link from "next/link";
import { ArrowRight, Layers, Scissors, CheckCircle2, PackageCheck, MapPin } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import GlassCard from "@/components/motion/GlassCard";
import ParallaxMedia from "@/components/motion/ParallaxMedia";

const productionSteps = [
  {
    num: "01",
    icon: Layers,
    title: "Fabric Sourcing & Audit",
    desc: "Incoming GSM verification, shade matching, and shrinkage testing prior to spreading.",
  },
  {
    num: "02",
    icon: Scissors,
    title: "Precision Cutting",
    desc: "Optimized marker grading and layered cutting engineered for accurate panel tolerances.",
  },
  {
    num: "03",
    icon: CheckCircle2,
    title: "Multi-Line Assembly",
    desc: "Dedicated lockstitch, overlock, and flatlock stitching lines operated by 280 specialists.",
  },
  {
    num: "04",
    icon: PackageCheck,
    title: "Inspection & Export",
    desc: "Inline checks, calibrated needle detection, steam finishing, and export carton packing.",
  },
];

export default function CompanyIntro() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Visual Editorial Frame */}
          <Reveal direction="right" className="lg:col-span-5">
            <div className="relative rounded-[28px] overflow-hidden border border-white/85 shadow-[0_24px_60px_-20px_rgba(15,26,46,0.18)] aspect-[4/5] min-h-[420px] bg-slate-200">
              <div className="absolute inset-0">
                <ParallaxMedia
                  src="/images/intro-knitwear.jpg"
                  alt="Combed cotton sweatshirt and tailored knitwear flat-lay"
                  className="w-full h-full"
                  intensity={28}
                />
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#09101f]/65 via-transparent to-transparent"
              />
              {/* Floating Frosted Coordinate Tag */}
              <div className="absolute bottom-5 left-5 right-5 glass-dark rounded-2xl p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#e2c26b] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#e2c26b]">
                      Karachi Textile Cluster
                    </div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      Plot 27, Mehran Town Sector 23
                    </div>
                    <div className="text-xs text-slate-300/80 mt-0.5">
                      Direct corridor to Port Qasim &amp; Karachi Port
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Narrative + 4-Step Frosted Glass Grid */}
          <div className="lg:col-span-7 space-y-8">
            <Reveal direction="up" className="space-y-4">
              <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#a67e2e]">
                <span className="w-6 h-[1.5px] bg-[#b8913f]" />
                <span>About Our Facility</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0d1626] tracking-[-0.025em] leading-[1.15]">
                Structured Apparel Conversion From Yarn to Export Carton
              </h2>

              <p className="text-base text-[#526075] leading-relaxed">
                Operating from Korangi Industrial Area in Karachi, Al-Ameera Apparel (Pvt.) Ltd. combines experienced garment craftsmanship with disciplined plant workflows—delivering dependable private-label production for commercial buyers and fashion houses.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-1">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#0d1626] hover:text-[#1d3a63] group"
                >
                  <span>Company Profile</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/manufacturing"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#526075] hover:text-[#0d1626] group"
                >
                  <span>6-Stage Workflow</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {productionSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <Reveal key={step.num} delay={idx * 80} direction="up">
                    <GlassCard className="p-6 rounded-2xl h-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#0f1a2e]/[0.06] border border-white/80 text-[#1d3a63] flex items-center justify-center">
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <span className="font-mono text-xs font-semibold text-[#b8913f]">
                          {step.num}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-[#0d1626] text-[15px] mb-1.5">
                        {step.title}
                      </h3>
                      <p className="text-xs text-[#526075] leading-relaxed">{step.desc}</p>
                    </GlassCard>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
