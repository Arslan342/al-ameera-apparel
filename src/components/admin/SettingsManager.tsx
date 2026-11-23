"use client";

import { useState } from "react";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  MapPin,
  Mail,
  Phone,
  Clock,
} from "lucide-react";

interface SiteSettingsData {
  id: string;
  companyName: string;
  industry: string;
  workforce: number;
  address: string;
  postalCode: string;
  email: string;
  phone: string;
  workingHours: string;
}

export default function SettingsManager({
  initialSettings,
}: {
  initialSettings: SiteSettingsData;
}) {
  const [formData, setFormData] = useState({
    companyName: initialSettings.companyName || "Al-Ameera Apparel (Pvt.) Ltd.",
    industry: initialSettings.industry || "Apparel and Garment Manufacturing",
    workforce: initialSettings.workforce || 280,
    address:
      initialSettings.address ||
      "Plot 27, Mehran Town Sector 23, Korangi Industrial Area, Karachi, 74900, Pakistan",
    postalCode: initialSettings.postalCode || "74900",
    email: initialSettings.email || "inquiry@al-ameera.pk",
    phone: initialSettings.phone || "+92 21 3500 0000",
    workingHours: initialSettings.workingHours || "Mon – Sat: 8:00 AM – 6:00 PM PKT",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update settings.");
      }

      setMessage({
        type: "success",
        text: "Corporate website settings and factory information updated successfully.",
      });
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error saving settings.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-2.5 backdrop-blur-md ${
            message.type === "success"
              ? "bg-emerald-50/85 border border-emerald-200 text-emerald-900"
              : "bg-rose-50/85 border border-rose-200 text-rose-900"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Corporate Identity */}
      <div className="glass-panel-strong p-6 sm:p-8 rounded-[24px] space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-900/[0.08] pb-3">
          <Building2 className="w-4.5 h-4.5 text-[#1d3a63]" />
          <h2 className="font-display text-base font-bold text-[#0d1626]">
            1. Company Identity &amp; Workforce
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155]">Official Company Name</label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-xs text-[#0d1626]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155]">Industry / Sector</label>
            <input
              type="text"
              required
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-xs text-[#0d1626]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#1d3a63]" />
              <span>Permanent Workforce</span>
            </label>
            <input
              type="number"
              required
              min={1}
              value={formData.workforce}
              onChange={(e) => setFormData({ ...formData, workforce: Number(e.target.value) })}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-xs text-[#0d1626]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#1d3a63]" />
              <span>Plant Operating Hours</span>
            </label>
            <input
              type="text"
              required
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-xs text-[#0d1626]"
            />
          </div>
        </div>
      </div>

      {/* Location & Contact */}
      <div className="glass-panel-strong p-6 sm:p-8 rounded-[24px] space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-900/[0.08] pb-3">
          <MapPin className="w-4.5 h-4.5 text-[#1d3a63]" />
          <h2 className="font-display text-base font-bold text-[#0d1626]">
            2. Physical Facility Coordinates
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155]">Factory Plot Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-xs text-[#0d1626]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#334155]">Postal Code</label>
              <input
                type="text"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="glass-input w-full px-4 py-2.5 rounded-xl text-xs text-[#0d1626]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#1d3a63]" />
                <span>Commercial Email</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="glass-input w-full px-4 py-2.5 rounded-xl text-xs text-[#0d1626]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#1d3a63]" />
                <span>Plant Telephone</span>
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="glass-input w-full px-4 py-2.5 rounded-xl text-xs text-[#0d1626]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="glass-btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl disabled:opacity-60 text-xs font-semibold cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Website Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
