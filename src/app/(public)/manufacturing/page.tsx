import { Metadata } from "next";
import Link from "next/link";
import {
  Factory,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Tag,
  Layers,
  Palette,
  Ship,
} from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import GlassCard from "@/components/motion/GlassCard";
import ParallaxMedia from "@/components/motion/ParallaxMedia";
import ScrollTimeline, { TimelineStep } from "@/components/motion/ScrollTimeline";
import AnimatedCounter from "@/components/motion/AnimatedCounter";

export const metadata: Metadata = {
  title: "Manufacturing Capabilities & Process | Al-Ameera Apparel",
  description:
    "Explore the 6-stage apparel manufacturing process, quality management system, and private label capabilities at Al-Ameera Apparel (Pvt.) Ltd., Karachi, Pakistan.",
};

const processSteps: TimelineStep[] = [
  {
    number: "01",
    title: "Tech Pack Review & Pre-Production Sampling",
    desc: "Detailed assessment of buyer tech packs, BOMs, grading charts, and stitch specs. Fabric swatches and strike-off approval samples are produced before bulk cutting begins.",
    icon: "clipboard",
  },
  {
    number: "02",
    title: "Fabric Sourcing & Raw Material Inspection",
    desc: "Incoming knitted and woven rolls are verified for GSM accuracy, yarn count consistency, shade uniformity, and dimensional shrinkage after test washes.",
    icon: "layers",
  },
  {
    number: "03",
    title: "Marker Planning & Precision Cutting",
    desc: "Marker grading optimized for material yield. Controlled tension fabric relaxation and spreading followed by precision layered cutting and sequential bundle numbering.",
    icon: "scissors",
  },
  {
    number: "04",
    title: "Multi-Line Stitching Assembly",
    desc: "280 specialized operators across lockstitch, 4-thread overlock, coverstitch, and specialty machines assembling collars, plackets, side seams, and hems to tight tolerances.",
    icon: "factory",
  },
  {
    number: "05",
    title: "Multi-Stage Quality Audits & Needle Detection",
    desc: "Continuous inline checks, SPI stitch density and seam tension audits, measurement checks, and 100% calibrated needle detection prior to polybagging.",
    icon: "shield",
  },
  {
    number: "06",
    title: "Pressing, Finishing & Export Packing",
    desc: "Industrial steam pressing, woven label and hangtag attachment, individual polybagging, and export master carton packing for direct Karachi port containerization.",
    icon: "package",
  },
];

const services = [
  {
    icon: Tag,
    title: "Private Label & OEM Manufacturing",
    desc: "Full garment production under buyer brand identity—custom woven neck labels, heat transfers, hangtags, care badges, and retail packaging.",
  },
  {
    icon: Layers,
    title: "Custom Fabric & Yarn Sourcing",
    desc: "Sourcing of combed cotton jersey, micro-pique, French terry, brushed fleece, cotton twill, and performance poly-spandex matched to target GSM.",
  },
  {
    icon: Palette,
    title: "Embellishment & Dye Coordination",
    desc: "Pantone lab-dip matching alongside precision screen printing, high-density graphics, multi-head embroidery, and silicone or woven patches.",
  },
  {
    icon: Ship,
    title: "FOB Export & Port Logistics",
    desc: "Export carton compliance and direct handover to Karachi Port Trust (KPT), Port Qasim, and international air freight terminals.",
  },
];

const qcCheckpoints = [
  {
    title: "Incoming Fabric Audit",
    desc: "Weight (GSM), roll-to-roll shade continuity, and pre-production wash shrinkage validation.",
  },
  {
    title: "Inline Seam & SPI Verification",
    desc: "Station-level audits measuring stitches per inch, seam elasticity, and trim placement.",
  },
  {
    title: "100% Calibrated Needle Scan",
    desc: "Every finished garment passes calibrated ferrous metal detection before final packing.",
  },
  {
    title: "Pre-Shipment Carton Inspection",
    desc: "Final random sampling validating size breakdown, barcode labels, and export carton integrity.",
  },
];

export default function ManufacturingPage() {
  return (
    <div className="space-y-20 lg:space-y-28 pb-10">
      {/* Editorial Glass Header */}
      <section className="pt-4 sm:pt-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="relative rounded-[28px] sm:rounded-[32px] overflow-hidden border border-white/75 shadow-[0_24px_60px_-20px_rgba(9,16,31,0.3)] min-h-[340px] sm:min-h-[380px] flex items-end bg-[#0b1324]">
            <div className="absolute inset-0">
              <ParallaxMedia
                src="/images/cta-fabrics.jpg"
                alt="Precision knitwear and cotton apparel production"
                className="w-full h-full"
                intensity={28}
                priority
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-[#09101f]/90 via-[#0d192e]/74 to-[#09101f]/42"
              />
            </div>

            <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-12 sm:py-16 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#e2c26b] animate-hero-in">
                <span className="w-6 h-[1.5px] bg-[#d4af37]" />
                <span>Plant Infrastructure &amp; Workflow</span>
              </div>
              <h1
                className="font-display text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-white leading-[1.1] animate-hero-in"
                style={{ animationDelay: "90ms" }}
              >
                Manufacturing Capabilities &amp; Quality Systems
              </h1>
              <p
                className="text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-2xl animate-hero-in"
                style={{ animationDelay: "180ms" }}
              >
                Structured 6-stage garment production in Korangi Industrial Area—converting raw textile rolls into export-ready apparel backed by 280 skilled personnel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facility Overview */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <Reveal direction="right" className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#a67e2e]">
                <span className="w-6 h-[1.5px] bg-[#b8913f]" />
                <span>Facility Infrastructure</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0d1626] tracking-[-0.025em]">
                Purpose-Built Production Floor in Karachi
              </h2>
              <p className="text-base text-[#526075] leading-relaxed">
                Located at{" "}
                <strong className="font-semibold text-[#0d1626]">
                  Plot 27, Mehran Town Sector 23, Korangi Industrial Area
                </strong>
                , our plant is laid out for clean material flow across fabric storage, tension-relaxed cutting tables, multi-line stitching stations, inline inspection desks, pressing units, and secure export carton staging.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <GlassCard className="p-5 rounded-2xl">
                  <div className="font-display text-2xl font-bold text-[#0d1626]">
                    <AnimatedCounter target={280} />
                  </div>
                  <div className="text-xs font-semibold text-[#1d3a63] mt-1">
                    Operations Staff
                  </div>
                </GlassCard>
                <GlassCard className="p-5 rounded-2xl">
                  <div className="font-display text-2xl font-bold text-[#0d1626]">
                    <AnimatedCounter target={6} suffix=" Stages" />
                  </div>
                  <div className="text-xs font-semibold text-[#1d3a63] mt-1">
                    Tracked Conversion Flow
                  </div>
                </GlassCard>
                <GlassCard className="p-5 rounded-2xl">
                  <div className="font-display text-2xl font-bold text-[#0d1626]">
                    <AnimatedCounter target={100} suffix="%" />
                  </div>
                  <div className="text-xs font-semibold text-[#1d3a63] mt-1">
                    Needle Detection Scan
                  </div>
                </GlassCard>
              </div>
            </Reveal>

            <Reveal direction="left" delay={100} className="lg:col-span-5">
              <div className="glass-dark rounded-[26px] p-7 sm:p-8 text-white space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-white/12">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#e2c26b] font-semibold">
                      Operations Summary
                    </div>
                    <h3 className="font-display text-lg font-bold mt-0.5">Plant Factsheet</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#e2c26b]">
                    <Factory className="w-5 h-5" />
                  </div>
                </div>

                <dl className="space-y-3.5 text-xs sm:text-sm">
                  <div className="flex justify-between gap-4 pb-3 border-b border-white/10">
                    <dt className="text-slate-400">Location</dt>
                    <dd className="text-right font-medium text-white">
                      Sector 23, Korangi, Karachi
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 pb-3 border-b border-white/10">
                    <dt className="text-slate-400">Product Scope</dt>
                    <dd className="text-right font-medium text-white">
                      Knitwear, Polos, Fleece, Wovens, Activewear
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 pb-3 border-b border-white/10">
                    <dt className="text-slate-400">Production Model</dt>
                    <dd className="text-right font-medium text-white">
                      Contract OEM &amp; Private Label
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 pb-3 border-b border-white/10">
                    <dt className="text-slate-400">Scheduling</dt>
                    <dd className="text-right font-medium text-white">
                      Aligned upon PO &amp; Lab-Dip Approval
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-400">Export Ports</dt>
                    <dd className="text-right font-medium text-slate-200">
                      Karachi Port (KPT) &amp; Port Qasim
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Scroll-Linked 6-Stage Production Timeline */}
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#a67e2e]">
              <span className="w-5 h-[1.5px] bg-[#b8913f]" />
              <span>Production Sequence</span>
              <span className="w-5 h-[1.5px] bg-[#b8913f]" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0d1626] tracking-[-0.025em]">
              Our 6-Stage Manufacturing Workflow
            </h2>
            <p className="text-sm sm:text-base text-[#526075]">
              Every commercial run progresses through six verified milestones to guarantee sizing fidelity, seam durability, and timely dispatch.
            </p>
          </Reveal>

          <ScrollTimeline steps={processSteps} />
        </div>
      </section>

      {/* Quality Management System */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <Reveal direction="right" className="lg:col-span-7">
              <GlassCard variant="strong" interactive={false} className="p-7 sm:p-10 rounded-[28px] h-full space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#a67e2e]">
                    <span className="w-6 h-[1.5px] bg-[#b8913f]" />
                    <span>Quality Assurance</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0d1626] tracking-tight">
                    Embedded Quality Management
                  </h2>
                  <p className="text-sm text-[#526075] leading-relaxed">
                    Quality is checked progressively at every station—preventing defects before garments reach final pressing or packing.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {qcCheckpoints.map((item) => (
                    <div
                      key={item.title}
                      className="glass-panel-subtle rounded-2xl p-4 space-y-1.5"
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#0d1626]">
                        <CheckCircle2 className="w-4 h-4 text-[#1d3a63] shrink-0" />
                        <span>{item.title}</span>
                      </div>
                      <p className="text-xs text-[#526075] leading-relaxed pl-6">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </Reveal>

            <Reveal direction="left" delay={100} className="lg:col-span-5">
              <div className="glass-dark rounded-[28px] p-7 sm:p-10 h-full flex flex-col justify-between text-white space-y-6">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#e2c26b]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">
                    Client Inspection &amp; Audit Policy
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    We accommodate SGS, Intertek, and buyer-nominated QA inspection agents during pre-production, inline assembly, and final carton release. Detailed capacity schedules and compliance dossiers are shared directly during commercial onboarding.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/contact#inquiry"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#0b1324] hover:bg-slate-100 text-xs font-semibold transition-all"
                  >
                    <span>Request Quality Dossier</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/products"
                    className="glass-dark-subtle inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white hover:bg-white/15 text-xs font-semibold transition-all"
                  >
                    <span>View Catalogue</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* B2B Services */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl space-y-3 mb-10">
            <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#a67e2e]">
              <span className="w-6 h-[1.5px] bg-[#b8913f]" />
              <span>Commercial Services</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0d1626] tracking-[-0.025em]">
              Solutions for Apparel Buyers
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {services.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <Reveal key={svc.title} delay={idx * 75} direction="up">
                  <GlassCard className="p-7 rounded-[24px] h-full space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0f1a2e]/[0.06] border border-white/85 text-[#1d3a63] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#0d1626]">{svc.title}</h3>
                    <p className="text-sm text-[#526075] leading-relaxed">{svc.desc}</p>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
