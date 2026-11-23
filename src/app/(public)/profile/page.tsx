import { Metadata } from "next";
import Link from "next/link";
import { Building2, MapPin, Users, Layers, ArrowRight, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import GlassCard from "@/components/motion/GlassCard";
import AnimatedCounter from "@/components/motion/AnimatedCounter";

export const metadata: Metadata = {
  title: "Corporate Datasheet | Al-Ameera Apparel (Pvt.) Ltd.",
  description:
    "Official corporate factsheet and operational specifications for Al-Ameera Apparel (Pvt.) Ltd., Karachi, Pakistan.",
};

const corporateDetails = [
  { label: "Registered Company Name", value: "Al-Ameera Apparel (Pvt.) Ltd." },
  { label: "Entity Type", value: "Private Limited Company" },
  { label: "Core Sector", value: "Apparel & Garment Manufacturing" },
  { label: "Permanent Workforce", value: "280 Skilled Personnel" },
  {
    label: "Facility Address",
    value: "Plot 27, Mehran Town Sector 23, Korangi Industrial Area, Karachi, 74900, Pakistan",
  },
  {
    label: "Export Port Proximity",
    value: "Port Qasim (~25 km), Karachi Port / KPT (~22 km), Jinnah Intl. Airport (~18 km)",
  },
  { label: "Commercial Focus", value: "B2B Contract Manufacturing, Private Label & OEM Garments" },
];

const manufacturingDivisions = [
  {
    name: "Fabric Sourcing & Inspection",
    description:
      "Inspecting incoming knitted and woven fabric rolls for GSM accuracy, shade consistency, and dimensional shrinkage testing prior to cutting.",
  },
  {
    name: "Pattern & Precision Cutting",
    description:
      "Marker optimization, tension-relaxed spreading tables, precision layered cutting, and sequential component bundle numbering.",
  },
  {
    name: "Assembly & Stitching Floor",
    description:
      "Dedicated lines for lockstitch seams, 4-thread overlock, collar setting, placket construction, and coverstitch hems.",
  },
  {
    name: "Quality Audit & Needle Scan",
    description:
      "Progressive inline inspections, tech-pack measurement tolerance verification, and 100% calibrated needle detection scans.",
  },
  {
    name: "Pressing, Finishing & Export Packing",
    description:
      "Industrial steam pressing, custom brand labels and hangtags, individual polybagging, and export master carton packing.",
  },
];

export default function CompanyProfilePage() {
  return (
    <div className="py-10 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Reveal direction="up">
          <GlassCard variant="strong" interactive={false} className="rounded-[28px] p-7 sm:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-900/10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#a67e2e]">
                  <span className="w-6 h-[1.5px] bg-[#b8913f]" />
                  <span>Corporate Datasheet</span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0d1626] tracking-[-0.025em]">
                  Al-Ameera Apparel (Pvt.) Ltd.
                </h1>
                <p className="text-sm text-[#526075]">
                  Official Company Factsheet &amp; Facility Specifications · Karachi, Pakistan
                </p>
              </div>

              <Link
                href="/contact#inquiry"
                className="glass-btn-primary inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold self-start sm:self-auto"
              >
                <span>Inquire Directly</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel-subtle rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0f1a2e]/[0.06] text-[#1d3a63] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display text-xl font-bold text-[#0d1626]">
                    <AnimatedCounter target={280} />
                  </div>
                  <div className="text-xs text-[#64748b]">Skilled Personnel</div>
                </div>
              </div>

              <div className="glass-panel-subtle rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0f1a2e]/[0.06] text-[#1d3a63] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display text-xl font-bold text-[#0d1626]">Korangi</div>
                  <div className="text-xs text-[#64748b]">Sector 23, Industrial Area</div>
                </div>
              </div>

              <div className="glass-panel-subtle rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0f1a2e]/[0.06] text-[#1d3a63] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display text-xl font-bold text-[#0d1626]">Plot 27</div>
                  <div className="text-xs text-[#64748b]">Mehran Town Facility</div>
                </div>
              </div>
            </div>

            {/* Structured Identity Table */}
            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold text-[#0d1626]">
                Company Identity &amp; Coordinates
              </h2>
              <div className="rounded-2xl overflow-hidden border border-white/80 divide-y divide-slate-900/[0.06] text-xs sm:text-sm bg-white/45">
                {corporateDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-4 py-3.5"
                  >
                    <span className="font-medium text-[#526075] sm:w-60 shrink-0">
                      {detail.label}
                    </span>
                    <span className="font-semibold text-[#0d1626] sm:text-right">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </Reveal>

        {/* Production Divisions */}
        <Reveal direction="up" delay={100}>
          <GlassCard variant="strong" interactive={false} className="rounded-[28px] p-7 sm:p-10 space-y-6">
            <div className="space-y-1">
              <h2 className="font-display text-2xl font-bold text-[#0d1626]">
                Production Organization
              </h2>
              <p className="text-sm text-[#526075]">
                Core manufacturing divisions staffed by our Karachi facility workforce.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {manufacturingDivisions.map((div) => (
                <div
                  key={div.name}
                  className="glass-panel-subtle rounded-2xl p-5 space-y-2"
                >
                  <div className="flex items-center gap-2 font-display font-bold text-[#0d1626] text-sm">
                    <Layers className="w-4 h-4 text-[#1d3a63] shrink-0" />
                    <span>{div.name}</span>
                  </div>
                  <p className="text-xs text-[#526075] leading-relaxed">{div.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-900/8 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-[#64748b]">
                Compliance &amp; third-party audit documentation available upon commercial engagement.
              </span>
              <Link
                href="/manufacturing"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0d1626] hover:text-[#1d3a63]"
              >
                <span>Explore full workflow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </div>
  );
}
