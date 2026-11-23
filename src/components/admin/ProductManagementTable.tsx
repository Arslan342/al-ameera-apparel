"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import SafeImage from "@/components/common/SafeImage";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  availability: string;
  minOrderQuantity?: string | null;
  isFeatured: boolean;
  isDemo: boolean;
  category?: {
    id: string;
    name: string;
  } | null;
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
  }[];
  _count?: {
    inquiries: number;
  };
}

export default function ProductManagementTable({
  initialProducts,
  categories,
}: {
  initialProducts: ProductRow[];
  categories: { id: string; name: string }[];
}) {
  const [products, setProducts] = useState<ProductRow[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the product catalogue?`)) {
      return;
    }

    setDeletingId(id);
    setMessage(null);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete product.");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setMessage({ type: "success", text: `Product "${name}" was successfully removed.` });
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to delete product.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (categoryFilter && p.category?.id !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku ? p.sku.toLowerCase().includes(q) : false;
      return matchName || matchSku;
    }
    return true;
  });

  const getAvailBadge = (availability: string) => {
    switch (availability) {
      case "IN_PRODUCTION":
        return "bg-emerald-100/85 text-emerald-900 border-emerald-200/80";
      case "SAMPLE_AVAILABLE":
        return "bg-slate-200/85 text-[#1d3a63] border-white/80";
      case "MADE_TO_ORDER":
      default:
        return "bg-amber-100/80 text-amber-900 border-amber-200/80";
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between backdrop-blur-md ${
            message.type === "success"
              ? "bg-emerald-50/85 border border-emerald-200 text-emerald-900"
              : "bg-rose-50/85 border border-rose-200 text-rose-900"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-xs font-bold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel-strong p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="glass-input w-full pl-9 pr-4 py-2 rounded-xl text-xs text-[#0d1626]"
            />
          </div>

          <div className="shrink-0 w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs text-[#334155]"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Link
          href="/admin/products/new"
          className="glass-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Table Card */}
      <div className="glass-panel-strong rounded-[24px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-white/50 border-b border-slate-900/[0.08] text-[#64748b] font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Garment Item</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4">MOQ</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/[0.06]">
              {filteredProducts.map((p) => {
                const cleanName = p.name.replace(/^\[Demo Product\]\s*/i, "");
                const img =
                  p.images.find((i) => i.isPrimary)?.url ||
                  p.images[0]?.url ||
                  "/images/cat-knitwear.jpg";

                return (
                  <tr key={p.id} className="hover:bg-white/45 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-200/60 overflow-hidden shrink-0 border border-white/80">
                          <SafeImage
                            src={img}
                            fallbackSrc="/images/cat-knitwear.jpg"
                            alt={cleanName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-[#0d1626] line-clamp-1">
                            {cleanName}
                          </div>
                          <div className="text-[10px] text-[#748299]">ID: {p.id.slice(0, 10)}...</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[#526075]">{p.sku || "—"}</td>

                    <td className="py-3 px-4 font-medium text-[#334155]">
                      {p.category?.name || "Unassigned"}
                    </td>

                    <td className="py-3 px-4">
                      {p.isDemo ? (
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50/90 text-amber-800 border border-amber-200/80">
                          Draft
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50/90 text-emerald-800 border border-emerald-200/80">
                          Confirmed
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${getAvailBadge(
                          p.availability
                        )}`}
                      >
                        {p.availability.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[#526075]">
                      {p.minOrderQuantity
                        ? p.minOrderQuantity.replace(/\s*\[Demo MOQ\]/i, "")
                        : "500 pcs"}
                    </td>

                    <td className="py-3 px-4">
                      {p.isFeatured ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#0f1a2e] text-white">
                          Featured
                        </span>
                      ) : (
                        <span className="text-[#748299] text-[10px]">Standard</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/products/${p.id}`}
                          target="_blank"
                          title="View public page"
                          className="p-1.5 rounded-lg text-[#64748b] hover:text-[#1d3a63] hover:bg-white/80 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          title="Edit product"
                          className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0d1626] hover:bg-white/80 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, cleanName)}
                          disabled={deletingId === p.id}
                          title="Delete product"
                          className="p-1.5 rounded-lg text-[#64748b] hover:text-rose-600 hover:bg-rose-50/80 transition-colors cursor-pointer"
                        >
                          {deletingId === p.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-[#64748b] text-xs">
            No products match the selected criteria.
          </div>
        )}
      </div>
    </div>
  );
}
