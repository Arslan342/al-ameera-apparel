"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, Loader2, ArrowLeft } from "lucide-react";
import BrandMark from "@/components/common/BrandMark";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed. Please check credentials.");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1222] flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Architectural editorial background */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-atelier.jpg"
          alt=""
          className="w-full h-full object-cover opacity-25 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#09101f]/85 via-[#0d192e]/82 to-[#09101f]/95" />
      </div>

      {/* Top back link */}
      <div className="relative z-10 max-w-md w-full mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Website</span>
        </Link>
      </div>

      {/* Smoked Glass Login Card */}
      <div className="relative z-10 max-w-md w-full mx-auto glass-dark rounded-[28px] p-8 sm:p-10 space-y-6 animate-hero-in">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandMark size="lg" variant="light" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white tracking-tight">
              Administrator Portal
            </h1>
            <p className="text-xs text-[#e2c26b] tracking-[0.14em] uppercase font-medium mt-1">
              Al-Ameera Apparel (Pvt.) Ltd.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/30 text-rose-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Administrator Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@al-ameera.pk"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.06] text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#d4af37]/70 focus:bg-white/[0.1] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.06] text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#d4af37]/70 focus:bg-white/[0.1] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[#0b1324] bg-white/95 hover:bg-white disabled:opacity-50 shadow-lg shadow-black/25 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed pt-1">
          Authorized administrative access only.
        </p>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Al-Ameera Apparel (Pvt.) Ltd. · Korangi Industrial Area, Karachi
      </div>
    </div>
  );
}
