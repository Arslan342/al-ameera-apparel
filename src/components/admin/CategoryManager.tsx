"use client";

import { useState } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  X,
} from "lucide-react";
import GlassCard from "@/components/motion/GlassCard";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  displayOrder: number;
  _count?: {
    products: number;
  };
}

export default function CategoryManager({
  initialCategories,
}: {
  initialCategories: CategoryItem[];
}) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setImage("");
    setDisplayOrder(categories.length + 1);
    setIsEditing(null);
    setIsCreating(false);
  };

  const startEdit = (cat: CategoryItem) => {
    setName(cat.name);
    setSlug(cat.slug);
    setDescription((cat.description || "").replace(/^\[Demo Category\]\s*/i, ""));
    setImage(cat.image || "");
    setDisplayOrder(cat.displayOrder);
    setIsEditing(cat.id);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        name,
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
        image: image.trim() || undefined,
        displayOrder,
      };

      const url = isEditing ? `/api/categories/${isEditing}` : "/api/categories";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save category.");
      }

      if (isEditing) {
        setCategories((prev) =>
          prev.map((c) => (c.id === isEditing ? { ...c, ...data.category } : c))
        );
        setMessage({ type: "success", text: `Category "${name}" updated successfully.` });
      } else {
        setCategories((prev) => [...prev, data.category]);
        setMessage({ type: "success", text: `Category "${name}" created successfully.` });
      }

      resetForm();
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error saving category.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete category "${catName}"? Any products assigned to this category may be affected.`
      )
    ) {
      return;
    }

    setDeletingId(id);
    setMessage(null);

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete category.");
      }

      setCategories((prev) => prev.filter((c) => c.id !== id));
      setMessage({ type: "success", text: `Category "${catName}" removed successfully.` });
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error deleting category.",
      });
    } finally {
      setDeletingId(null);
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

      <div className="flex items-center justify-between">
        <span className="text-xs text-[#526075] font-medium">
          Total Categories: <strong className="text-[#0d1626]">{categories.length}</strong>
        </span>

        {!isCreating && !isEditing && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsCreating(true);
            }}
            className="glass-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Category</span>
          </button>
        )}
      </div>

      {(isCreating || isEditing) && (
        <form onSubmit={handleSave} className="glass-panel-strong p-6 rounded-[24px] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900/[0.08] pb-3">
            <h3 className="font-display font-bold text-[#0d1626] text-sm">
              {isEditing ? "Edit Garment Category" : "Add New Garment Category"}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 rounded-lg text-[#64748b] hover:text-[#0d1626]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#334155]">Category Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fleece & Hoodies"
                className="glass-input w-full px-3 py-2 rounded-xl text-xs text-[#0d1626]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#334155]">Category Slug (URL)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. fleece-hoodies (auto-generated if blank)"
                className="glass-input w-full px-3 py-2 rounded-xl text-xs font-mono text-[#0d1626]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#334155]">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Heavyweight brushed fleece and French terry garments"
              className="glass-input w-full px-3 py-2 rounded-xl text-xs text-[#0d1626]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#334155]">Banner Image Path or URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/images/cat-knitwear.jpg or https://..."
                className="glass-input w-full px-3 py-2 rounded-xl text-xs text-[#0d1626]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#334155]">Display Order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                className="glass-input w-full px-3 py-2 rounded-xl text-xs text-[#0d1626]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-900/[0.08]">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#526075] hover:bg-white/70 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="glass-btn-primary inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isEditing ? "Update Category" : "Save Category"}</span>
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <GlassCard key={cat.id} className="p-5 rounded-2xl h-full">
            <div className="flex flex-col justify-between h-full space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/70 border border-white/85 text-[#526075]">
                    Order #{cat.displayOrder}
                  </span>
                  <span className="text-xs font-semibold text-[#1d3a63] bg-white/70 border border-white/85 px-2.5 py-0.5 rounded-md">
                    {cat._count?.products ?? 0} Styles
                  </span>
                </div>

                <h4 className="font-display font-bold text-[#0d1626] text-base">{cat.name}</h4>
                <div className="text-[11px] font-mono text-[#748299]">/{cat.slug}</div>

                {cat.description && (
                  <p className="text-xs text-[#526075] leading-relaxed line-clamp-2">
                    {cat.description.replace(/^\[Demo Category\]\s*/i, "")}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-900/[0.07] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(cat)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#334155] hover:text-[#1d3a63] transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  disabled={deletingId === cat.id}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                >
                  {deletingId === cat.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
