import Link from "next/link";
import { MapPin, Mail, Clock, ArrowUpRight } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-[#0a1222]/95 backdrop-blur-2xl text-slate-300 border-t border-white/10">
      {/* Subtle architectural upper warmth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[640px] h-48 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(ellipse, rgba(212, 175, 55, 0.35) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand Overview */}
          <div className="lg:col-span-4 space-y-5">
            <Logo variant="light" showSubtitle />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Dedicated B2B apparel and private label garment manufacturing facility operating from Korangi Industrial Area, Karachi with a permanent team of 280 skilled personnel.
            </p>
            <div className="pt-1">
              <Link
                href="/contact#inquiry"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e2c26b] hover:text-white transition-colors"
              >
                <span>Submit a Manufacturing Inquiry</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[11px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/manufacturing"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Manufacturing
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-slate-300 hover:text-white transition-colors">
                  Product Catalogue
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-slate-300 hover:text-white transition-colors">
                  Corporate Datasheet
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">
                  Contact &amp; RFQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Divisions */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-[11px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
              Garment Divisions
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link
                  href="/products?category=knitwear"
                  className="hover:text-white transition-colors"
                >
                  Knitwear &amp; T-Shirts
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=polo-shirts"
                  className="hover:text-white transition-colors"
                >
                  Polo Shirts &amp; Casual Tops
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=fleece-hoodies"
                  className="hover:text-white transition-colors"
                >
                  Fleece, Hoodies &amp; Sweats
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=woven-workwear"
                  className="hover:text-white transition-colors"
                >
                  Woven Shirts &amp; Workwear
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=denim-trousers"
                  className="hover:text-white transition-colors"
                >
                  Denim &amp; Cargo Trousers
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=activewear"
                  className="hover:text-white transition-colors"
                >
                  Activewear &amp; Performance
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Facility Details */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-[11px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
              Karachi Facility
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>
                  Plot 27, Mehran Town Sector 23, Korangi Industrial Area, Karachi 74900, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a
                  href="mailto:inquiry@al-ameera.pk"
                  className="hover:text-white transition-colors"
                >
                  inquiry@al-ameera.pk
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Mon – Sat: 8:00 AM – 6:00 PM PKT</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            Al-Ameera Apparel (Pvt.) Ltd. — Registered Garment Manufacturer, Karachi, Pakistan.
          </p>
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} Al-Ameera Apparel (Pvt.) Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
