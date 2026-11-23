import { Metadata } from "next";
import Link from "next/link";
import {
  Factory,
  MapPin,
  ShieldCheck,
  PackageCheck,
  Scissors,
  ArrowRight,
  ArrowUpRight,
  Eye,
  Target,
  FileCheck2,
} from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import GlassCard from "@/components/motion/GlassCard";
import ParallaxMedia from "@/components/motion/ParallaxMedia";
import AnimatedCounter from "@/components/motion/AnimatedCounter";

export const metadata: Metadata = {
  title: "About Us | Al-Ameera Apparel (Pvt.) Ltd.",
  description:
    "Learn about Al-Ameera Apparel (Pvt.) Ltd., a dedicated garment manufacturing facility in Korangi Industrial Area, Karachi, Pakistan with 280 skilled personnel.",
};

const departments = [
  {
    icon: Scissors,
    title: "Pattern & Cutting",
    tag: "Cutting Room",
    desc: "Marker optimization, layered fabric spreading with tension relaxation, precision cutting, and sequential bundle numbering.",
  },
  {
    icon: Factory,
    title: "Stitching Assembly",
    tag: "Production Lines",
    desc: "Organized assembly cells equipped with lockstitch, 4-thread overlock, coverstitch hem lines, and collar setting workstations.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    tag: "Inspection",
    desc: "Progressive inline checks, seam tension verification, tech-pack measurement tolerances, and 100% calibrated needle detection.",
  },
  {
    icon: PackageCheck,
    title: "Finishing & Export",
    tag: "Packing Cell",
    desc: "Industrial steam pressing, brand hangtag attachment, polybagging, and export master carton packing for direct port handover.",
  },
];

const logisticsRoutes = [
  { name: "Port Qasim (PQA)", distance: 25, detail: "Arterial export shipping corridor" },
  { name: "Karachi Port (KPT)", distance: 22, detail: "Major container terminal access" },
  { name: "Jinnah Intl. Airport", distance: 18, detail: "Priority courier & air freight" },
];

export default function AboutPage() {
  return (
    <div className="space-y-20 lg:space-y-28 pb-10">
      {/* Editorial Glass Header */}
      <section className="pt-4 sm:pt-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="relative rounded-[28px] sm:rounded-[32px] overflow-hidden border border-white/75 shadow-[0_24px_60px_-20px_rgba(9,16,31,0.3)] min-h-[340px] sm:min-h-[380px] flex items-end bg-[#0b1324]">
            <div className="absolute inset-0">
              <ParallaxMedia
                src="/images/why-atelier.jpg"
                alt="Garment studio and apparel collection at Al-Ameera Apparel"
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
                <span>Corporate Profile</span>
              </div>
              <h1
                className="font-display text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-white leading-[1.1] animate-hero-in"
                style={{ animationDelay: "90ms" }}
              >
                Manufacturing Discipline, Crafted in Karachi
              </h1>
              <p
                className="text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-2xl animate-hero-in"
                style={{ animationDelay: "180ms" }}
              >
                Operating from Korangi Industrial Area with 280 dedicated professionals, Al-Ameera Apparel (Pvt.) Ltd. delivers consistent knitwear, casualwear, and private-label apparel manufacturing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facility Overview & Identity Factsheet */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <Reveal direction="right" className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#a67e2e]">
                <span className="w-6 h-[1.5px] bg-[#b8913f]" />
                <span>Company Overview</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0d1626] tracking-[-0.025em] leading-tight">
                Dedicated Craftsmanship Backed by Structured Workflows
              </h2>

              <p className="text-base text-[#526075] leading-relaxed">
                Al-Ameera Apparel (Pvt.) Ltd. operates from{" "}
                <strong className="font-semibold text-[#0d1626]">
                  Plot 27, Mehran Town Sector 23, Korangi Industrial Area, Karachi
                </strong>
                . Positioned inside one of South Asia&apos;s primary textile hubs, our facility integrates experienced garment specialists with orderly production lines.
              </p>

              <p className="text-sm sm:text-base text-[#526075] leading-relaxed">
                We run an end-to-end apparel conversion model—transforming inspected knitted and woven fabrics into export-ready collections across combed cotton t-shirts, corporate polos, heavyweight French terry hoodies, woven workwear, and performance activewear.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <GlassCard className="p-5 rounded-2xl">
                  <div className="font-display text-3xl font-bold text-[#0d1626]">
                    <AnimatedCounter target={280} />
                  </div>
                  <div className="text-sm font-semibold text-[#1d3a63] mt-1">
                    Permanent Personnel
                  </div>
                  <div className="text-xs text-[#64748b] mt-0.5">
                    Cutting, stitching, quality control &amp; finishing
                  </div>
                </GlassCard>

                <GlassCard className="p-5 rounded-2xl">
                  <div className="font-display text-3xl font-bold text-[#0d1626]">
                    Sector 23
                  </div>
                  <div className="text-sm font-semibold text-[#1d3a63] mt-1">
                    Korangi Industrial Area
                  </div>
                  <div className="text-xs text-[#64748b] mt-0.5">
                    Plot 27, Mehran Town, Karachi 74900
                  </div>
                </GlassCard>
              </div>
            </Reveal>

            {/* Smoked Glass Facility Factsheet */}
            <Reveal direction="left" delay={100} className="lg:col-span-5">
              <div className="glass-dark rounded-[26px] p-7 sm:p-8 text-white space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/12">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#e2c26b] font-semibold">
                      Registered Entity
                    </div>
                    <h3 className="font-display text-lg font-bold mt-0.5">Facility Profile</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#e2c26b]">
                    <Factory className="w-5 h-5" />
                  </div>
                </div>

                <dl className="space-y-3.5 text-xs sm:text-sm">
                  <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/10">
                    <dt className="text-slate-400 shrink-0">Company</dt>
                    <dd className="text-right font-medium text-white">
                      Al-Ameera Apparel (Pvt.) Ltd.
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/10">
                    <dt className="text-slate-400 shrink-0">Industry</dt>
                    <dd className="text-right font-medium text-white">
                      Apparel &amp; Garment Manufacturing
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/10">
                    <dt className="text-slate-400 shrink-0">Workforce</dt>
                    <dd className="text-right font-medium text-white">280 Skilled Personnel</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/10">
                    <dt className="text-slate-400 shrink-0">Plant Address</dt>
                    <dd className="text-right font-medium text-slate-200">
                      Plot 27, Mehran Town Sector 23, Korangi, Karachi
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/10">
                    <dt className="text-slate-400 shrink-0">Port Access</dt>
                    <dd className="text-right font-medium text-slate-200">
                      Karachi Port (KPT) &amp; Port Qasim
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-slate-400 shrink-0">Inspections</dt>
                    <dd className="text-right font-medium text-slate-200">
                      Third-party &amp; buyer audits welcomed
                    </dd>
                  </div>
                </dl>

                <Link
                  href="/profile"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e2c26b] hover:text-white transition-colors pt-1"
                >
                  <span>View Corporate Datasheet</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl space-y-3 mb-10">
            <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#a67e2e]">
              <span className="w-6 h-[1.5px] bg-[#b8913f]" />
              <span>Guiding Principles</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0d1626] tracking-[-0.025em]">
              Mission &amp; Vision
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal delay={0} direction="up">
              <GlassCard variant="strong" className="p-8 rounded-[26px] h-full space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-[#0f1a2e]/[0.06] border border-white/85 text-[#1d3a63] flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#0d1626]">Our Mission</h3>
                <p className="text-sm sm:text-base text-[#526075] leading-relaxed">
                  To deliver precision-crafted apparel meeting exacting commercial specifications through ethical manufacturing, multi-stage quality verification, workforce welfare, and dependable export execution.
                </p>
              </GlassCard>
            </Reveal>

            <Reveal delay={100} direction="up">
              <GlassCard variant="strong" className="p-8 rounded-[26px] h-full space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-[#0f1a2e]/[0.06] border border-white/85 text-[#1d3a63] flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#0d1626]">Our Vision</h3>
                <p className="text-sm sm:text-base text-[#526075] leading-relaxed">
                  To stand as a preferred private-label apparel manufacturing partner in Karachi, trusted by international and domestic brands for consistent stitch accuracy, responsive sampling, and technical integrity.
                </p>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Departmental Organization */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl space-y-3 mb-10">
            <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#a67e2e]">
              <span className="w-6 h-[1.5px] bg-[#b8913f]" />
              <span>Workforce Organization</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0d1626] tracking-[-0.025em]">
              Organized Production Cells
            </h2>
            <p className="text-sm sm:text-base text-[#526075]">
              Our 280 specialists operate in dedicated departmental units to preserve accountability from fabric intake to final master carton sealing.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {departments.map((dept, idx) => {
              const Icon = dept.icon;
              return (
                <Reveal key={dept.title} delay={idx * 75} direction="up" className="h-full">
                  <GlassCard className="p-6 rounded-2xl h-full flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-[#0f1a2e]/[0.06] border border-white/85 text-[#1d3a63] flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#b8913f]">
                          {dept.tag}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-[#0d1626] text-base">
                        {dept.title}
                      </h3>
                      <p className="text-xs text-[#526075] leading-relaxed">{dept.desc}</p>
                    </div>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Strategic Logistics & Audits */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <Reveal direction="right" className="lg:col-span-7">
              <GlassCard variant="strong" interactive={false} className="p-7 sm:p-9 rounded-[26px] h-full space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#a67e2e]">
                    <span className="w-6 h-[1.5px] bg-[#b8913f]" />
                    <span>Export Corridors</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0d1626] tracking-tight">
                    Prime Karachi Logistics Advantage
                  </h2>
                  <p className="text-sm text-[#526075] leading-relaxed">
                    Korangi Industrial Area offers immediate proximity to yarn suppliers, knitting mills, dye houses, testing labs, and international shipping terminals.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  {logisticsRoutes.map((route) => (
                    <div
                      key={route.name}
                      className="glass-panel-subtle rounded-2xl p-4 space-y-1"
                    >
                      <div className="flex items-center gap-1.5 text-[#1d3a63] font-display text-xl font-bold">
                        <MapPin className="w-4 h-4 text-[#b8913f] shrink-0" />
                        <span>
                          ~<AnimatedCounter target={route.distance} suffix=" km" />
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-[#0d1626]">{route.name}</div>
                      <div className="text-[11px] text-[#64748b]">{route.detail}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </Reveal>

            <Reveal direction="left" delay={100} className="lg:col-span-5">
              <GlassCard variant="strong" interactive={false} className="p-7 sm:p-9 rounded-[26px] h-full flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#0f1a2e]/[0.06] border border-white/85 text-[#1d3a63] flex items-center justify-center">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#0d1626]">
                    Client &amp; Third-Party Audits
                  </h3>
                  <p className="text-sm text-[#526075] leading-relaxed">
                    We welcome buyer teams and independent inspection firms (SGS, Intertek, or nominated QA auditors) to inspect factory conditions, quality systems, and active production lines prior to and during bulk runs.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/contact#inquiry"
                    className="glass-btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold"
                  >
                    <span>Coordinate Factory Visit</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/manufacturing"
                    className="glass-btn-secondary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold"
                  >
                    <span>Production Workflow</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
