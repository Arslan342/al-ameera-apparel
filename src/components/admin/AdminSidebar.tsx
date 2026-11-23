"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Shirt,
  FolderTree,
  Inbox,
  PlusCircle,
  ExternalLink,
  LogOut,
  Factory,
  Settings,
} from "lucide-react";
import BrandMark from "@/components/common/BrandMark";

const navigationItems = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "All Products", href: "/admin/products", icon: Shirt },
  { name: "Add Product", href: "/admin/products/new", icon: PlusCircle },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Inquiries", href: "/admin/inquiries", icon: Inbox },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  return (
    <aside className="w-64 bg-[#0b1324]/95 backdrop-blur-2xl text-slate-300 flex flex-col justify-between shrink-0 border-r border-white/10 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <BrandMark size="md" variant="light" />
            <div>
              <div className="font-display font-bold text-white text-sm tracking-[0.12em] uppercase leading-none">
                Al-Ameera
              </div>
              <div className="text-[9.5px] text-[#e2c26b] font-semibold uppercase tracking-[0.18em] mt-1.5 leading-none">
                Management Portal
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 px-3 py-1.5">
            Operations
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : item.href === "/admin/products"
                ? pathname === "/admin/products" ||
                  (pathname.startsWith("/admin/products/") &&
                    !pathname.startsWith("/admin/products/new"))
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-white/12 text-white border border-white/15 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${isActive ? "text-[#e2c26b]" : "text-slate-400"}`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <div className="p-3 rounded-xl glass-dark-subtle text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-white font-semibold mb-0.5">
            <Factory className="w-3.5 h-3.5 text-[#e2c26b]" />
            <span>Korangi Plant</span>
          </div>
          <p className="text-[10px] text-slate-400">Plot 27, Mehran Town Sector 23</p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/15 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
