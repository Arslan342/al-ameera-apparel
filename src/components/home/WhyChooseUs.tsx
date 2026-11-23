import { Users, ShieldCheck, Scissors, Ship } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import GlassCard from "@/components/motion/GlassCard";
import ParallaxMedia from "@/components/motion/ParallaxMedia";
import AnimatedCounter from "@/components/motion/AnimatedCounter";

const pillars = [
  {
    icon: Users,
    title: "280 Skilled Personnel",
    description:
      "Dedicated specialists across cutting tables, multi-line sewing floors, pressing stations, and inline quality assurance.",
  },
  {
    icon: ShieldCheck,
    title: "4-Tier Quality Control",
    description:
      "Incoming fabric GSM verification, progressive seam audits, 100% calibrated needle detection, and pre-shipment carton checks.",
  },
  {
    icon: Scissors,
    title: "Tailored Private Label OEM",
    description:
      "Custom yarn sourcing, Pantone lab-dip dyeing, woven neck labels, embroidery coordination, and export retail packaging.",
  },
  {
    icon: Ship,
    title: "Direct Export Port Access",
    description:
      "Strategic Korangi base connecting smoothly to Karachi Port (KPT), Port Qasim, and international air cargo corridors.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl space-y-3 mb-12">
          <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#a67e2e]">
            <span className="w-6 h-[1.5px] bg-[#b8913f]" />
            <span>Operational Advantage</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0d1626] tracking-[-0.025em]">
            Built for Dependable Commercial Supply
          </h2>
          <p className="text-sm sm:text-base text-[#526075] leading-relaxed">
            Combining Karachi&apos;s established textile ecosystem with transparent sampling, ethical workplace standards, and direct factory accountability.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Architectural Visual Showcase */}
          <Reveal direction="right" className="lg:col-span-5 flex">
            <div className="relative w-full rounded-[28px] overflow-hidden border border-white/85 shadow-[0_24px_60px_-20px_rgba(15,26,46,0.18)] min-h-[380px] flex flex-col justify-end bg-[#0f1a2e]">
              <div className="absolute inset-0">
                <ParallaxMedia
                  src="/images/why-atelier.jpg"
                  alt="Organized apparel racks and quality inspection line"
                  className="w-full h-full"
                  intensity={28}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#09101f]/88 via-[#09101f]/30 to-transparent"
                />
              </div>

              <div className="relative z-10 p-5 sm:p-6">
                <div className="glass-dark rounded-2xl p-5 grid grid-cols-3 gap-4 divide-x divide-white/12">
                  <div>
                    <div className="font-display text-xl sm:text-2xl font-bold text-white">
                      <AnimatedCounter target={100} suffix="%" />
                    </div>
                    <div className="text-[11px] text-slate-300/80 mt-0.5">Needle Scan</div>
                  </div>
                  <div className="pl-4">
                    <div className="font-display text-xl sm:text-2xl font-bold text-white">
                      <AnimatedCounter target={22} suffix=" km" />
                    </div>
                    <div className="text-[11px] text-slate-300/80 mt-0.5">Karachi Port</div>
                  </div>
                  <div className="pl-4">
                    <div className="font-display text-xl sm:text-2xl font-bold text-[#e2c26b]">
                      <AnimatedCounter target={24} suffix="h" />
                    </div>
                    <div className="text-[11px] text-slate-300/80 mt-0.5">RFQ Desk</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right 2x2 Frosted Glass Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.title} delay={idx * 80} direction="up" className="h-full">
                  <GlassCard className="p-7 rounded-[24px] h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="w-11 h-11 rounded-2xl bg-[#0f1a2e]/[0.06] border border-white/85 text-[#1d3a63] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-[#0d1626] tracking-tight">
                        {pillar.title}
                      </h3>
                      <p className="text-sm text-[#526075] leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
