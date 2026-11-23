import { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Users, Factory, ExternalLink } from "lucide-react";
import prisma from "@/lib/prisma";
import ContactForm from "@/components/contact/ContactForm";
import Reveal from "@/components/motion/Reveal";
import GlassCard from "@/components/motion/GlassCard";

export const metadata: Metadata = {
  title: "Contact Us & Quotation Inquiries | Al-Ameera Apparel (Pvt.) Ltd.",
  description:
    "Contact Al-Ameera Apparel (Pvt.) Ltd. in Korangi Industrial Area, Karachi for commercial manufacturing quotations, private label programs, and garment strike-offs.",
};

interface ContactPageProps {
  searchParams: Promise<{
    product?: string;
    id?: string;
    size?: string;
    color?: string;
  }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;

  const [settings, products] = await Promise.all([
    prisma.siteSettings.findUnique({
      where: { id: "default" },
    }),
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const companyAddress =
    settings?.address ||
    "Plot 27, Mehran Town Sector 23, Korangi Industrial Area, Karachi, 74900, Pakistan";
  const companyEmail = settings?.email || "inquiry@al-ameera.pk";
  const companyPhone = settings?.phone || "Provided upon formal RFQ review";
  const workforce = settings?.workforce || 280;
  const workingHours = settings?.workingHours || "Mon – Sat: 8:00 AM – 6:00 PM PKT";

  return (
    <div className="py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Clean Editorial Header */}
        <Reveal direction="up" className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#a67e2e]">
            <span className="w-6 h-[1.5px] bg-[#b8913f]" />
            <span>Factory Desk &amp; Commercial RFQ</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#0d1626] tracking-[-0.025em]">
            Connect with Our Karachi Facility
          </h1>
          <p className="text-sm sm:text-base text-[#526075] leading-relaxed">
            Request sample strike-offs, FOB Karachi container pricing, or tailored private-label specifications directly from our plant operations desk.
          </p>
        </Reveal>

        {/* Form & Coordinates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: RFQ Form */}
          <Reveal direction="up" delay={60} className="lg:col-span-7">
            <div id="inquiry">
              <ContactForm
                initialProduct={params.product}
                initialProductId={params.id}
                initialSize={params.size}
                initialColor={params.color}
                availableProducts={products}
              />
            </div>
          </Reveal>

          {/* Right: Plant Coordinates */}
          <Reveal direction="left" delay={120} className="lg:col-span-5 space-y-6">
            <GlassCard variant="strong" interactive={false} className="rounded-[28px] p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-900/[0.08]">
                <div className="w-9 h-9 rounded-xl bg-[#0f1a2e]/[0.06] text-[#1d3a63] flex items-center justify-center">
                  <Factory className="w-4.5 h-4.5" />
                </div>
                <h2 className="font-display text-lg font-bold text-[#0d1626]">
                  Manufacturing Plant Coordinates
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#526075]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4.5 h-4.5 text-[#1d3a63] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#0d1626]">Plant Address</div>
                    <div className="mt-0.5 leading-relaxed">{companyAddress}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-4.5 h-4.5 text-[#1d3a63] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#0d1626]">Workforce</div>
                    <div className="mt-0.5">{workforce} Skilled Production Personnel</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4.5 h-4.5 text-[#1d3a63] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#0d1626]">Operating Hours</div>
                    <div className="mt-0.5">{workingHours}</div>
                    <div className="text-[11px] text-[#748299]">Sunday: Closed</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4.5 h-4.5 text-[#1d3a63] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#0d1626]">Commercial Desk</div>
                    <a
                      href={`mailto:${companyEmail}`}
                      className="mt-0.5 font-mono text-xs text-[#1d3a63] hover:underline block"
                    >
                      {companyEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4.5 h-4.5 text-[#1d3a63] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#0d1626]">Telephone</div>
                    <div className="mt-0.5">{companyPhone}</div>
                  </div>
                </div>
              </div>

              {/* Architectural Location Card */}
              <div className="pt-4 border-t border-slate-900/[0.08] space-y-3">
                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-white/80 bg-[#0b1324]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hero-atelier.jpg"
                    alt="Korangi Industrial Area Karachi Facility"
                    className="w-full h-full object-cover opacity-45"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09101f]/90 via-[#09101f]/45 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 glass-dark rounded-xl p-3.5 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-white">
                        Sector 23, Mehran Town, Korangi
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Karachi · Port Qasim &amp; KPT Export Corridor
                      </div>
                    </div>
                    <MapPin className="w-5 h-5 text-[#e2c26b] shrink-0" />
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=Mehran+Town+Sector+23+Korangi+Industrial+Area+Karachi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1d3a63] hover:text-[#0d1626]"
                >
                  <span>Open Location in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </GlassCard>

            {/* Direct Factory Assurance */}
            <div className="glass-dark rounded-[24px] p-6 text-slate-300 space-y-2 text-xs">
              <div className="font-display font-bold text-white text-sm">
                Direct Factory Engagement
              </div>
              <p className="leading-relaxed">
                All quotations and sampling schedules are issued directly by our Karachi plant management team—with no intermediary brokers.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
