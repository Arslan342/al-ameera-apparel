"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface AdminHeaderProps {
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
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
    <header className="h-16 glass-nav border-x-0 border-t-0 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-[#526075] hidden sm:inline-block">
          Al-Ameera Apparel (Pvt.) Ltd.
        </span>
        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider bg-[#0f1a2e]/[0.07] text-[#1d3a63] border border-white/80">
          Operations
        </span>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0f1a2e] text-white flex items-center justify-center font-display font-bold text-xs shadow-xs">
            {user?.name ? user.name[0].toUpperCase() : "A"}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-[#0d1626] leading-none">
              {user?.name || "System Administrator"}
            </div>
            <div className="text-[10px] text-[#64748b] mt-0.5">
              {user?.email || "admin@al-ameera.pk"}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title="Sign out"
          className="p-2 text-[#64748b] hover:text-rose-600 hover:bg-white/70 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
