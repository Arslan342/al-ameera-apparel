"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Logo from "./Logo";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Manufacturing", href: "/manufacturing" },
  { name: "Catalogue", href: "/products" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "px-3 sm:px-6 pt-2.5 sm:pt-3" : "px-3 sm:px-6 pt-3.5 sm:pt-4"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-500 ${
          scrolled
            ? "glass-nav px-4 sm:px-6 py-2.5 shadow-lg shadow-[#0f1a2e]/[0.08]"
            : "glass-panel px-4 sm:px-6 py-3"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-white/40 border border-white/60 backdrop-blur-md"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                    active
                      ? "bg-[#0f1a2e] text-white shadow-sm"
                      : "text-[#475569] hover:text-[#0d1626] hover:bg-white/70"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Primary Action */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/contact#inquiry"
              className="glass-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-xl"
            >
              <span>Request Quote</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#0d1626] bg-white/50 hover:bg-white/80 border border-white/70 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Frosted Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-7xl mx-auto mt-2 glass-panel-strong rounded-2xl p-4 space-y-1.5">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#0f1a2e] text-white"
                    : "text-[#334155] hover:bg-white/70 hover:text-[#0d1626]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-3 mt-2 border-t border-slate-900/8">
            <Link
              href="/contact#inquiry"
              onClick={() => setMobileMenuOpen(false)}
              className="glass-btn-primary w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            >
              <span>Request Quote</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
