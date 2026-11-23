"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Upload,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Layers,
} from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

export interface SpecificationItem {
  id?: string;
  key: string;
  value: string;
  group?: string;
}

interface ProductFormData {
  id?: string;
  name: string;
  slug?: string;
  sku?: string;
  description: string;
  fabricDetails?: string;
  categoryId: string;
  sizes: string[];
  colors: string[];
  availability: string;
  minOrderQuantity?: string;
  isFeatured: boolean;
  isDemo: boolean;
  imageUrl?: string;
  specifications?: SpecificationItem[];
}

interface ProductFormProps {
  categories: CategoryOption[];
  initialData?: ProductFormData;
  isEdit?: boolean;
}

const COMMON_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "30", "32", "34", "36", "38"];
const COMMON_COLORS = [
  "Jet Black",
  "Heather Navy",
  "Optic White",
  "Desert Sand",
  "Olive Green",
  "Charcoal Melange",
  "Royal Blue",
  "Burgundy",
];

const PRESET_GARMENT_IMAGES = [
  { label: "Knit T-Shirt", url: "/images/cat-knitwear.jpg" },
  { label: "French Terry Sweatshirt", url: "/images/intro-knitwear.jpg" },
  { label: "Pique Polo Shirt", url: "/images/cat-polo.jpg" },
  { label: "Oxford Woven Shirt", url: "/images/cat-woven.jpg" },
  { label: "Cotton Trousers", url: "/images/cat-trousers.jpg" },
  { label: "Activewear", url: "/images/cat-activewear.jpg" },
];

const COMMON_SPEC_SUGGESTIONS = [
  { key: "GSM", group: "TECHNICAL" },
  { key: "Fabric Composition", group: "GENERAL" },
  { key: "Yarn Count", group: "TECHNICAL" },
  { key: "Weave / Knit Type", group: "TECHNICAL" },
  { key: "Shrinkage Allowance", group: "TECHNICAL" },
  { key: "Dyeing / Wash Finish", group: "GENERAL" },
  { key: "Packaging Spec", group: "PACKAGING" },
];

export default function ProductForm({
  categories,
  initialData,
  isEdit = false,
}: ProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(
    initialData?.name ? initialData.name.replace(/^\[Demo Product\]\s*/i, "") : ""
  );
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [sku, setSku] = useState(initialData?.sku || "");
  const [description, setDescription] = useState(
    initialData?.description
      ? initialData.description.replace(/^\[Demo Product Specifications\]\s*/i, "")
      : ""
  );
  const [fabricDetails, setFabricDetails] = useState(initialData?.fabricDetails || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || categories[0]?.id || "");
  const [availability, setAvailability] = useState(initialData?.availability || "MADE_TO_ORDER");
  const [minOrderQuantity, setMinOrderQuantity] = useState(
    initialData?.minOrderQuantity
      ? initialData.minOrderQuantity.replace(/\s*\[Demo MOQ\]/i, "")
      : "500 pcs"
  );
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [isDemo, setIsDemo] = useState(initialData?.isDemo ?? false);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");

  const [sizes, setSizes] = useState<string[]>(
    initialData?.sizes || ["S", "M", "L", "XL", "2XL"]
  );
  const [customSize, setCustomSize] = useState("");

  const [colors, setColors] = useState<string[]>(
    initialData?.colors || ["Jet Black", "Heather Navy", "Optic White"]
  );
  const [customColor, setCustomColor] = useState("");

  const [specifications, setSpecifications] = useState<SpecificationItem[]>(
    initialData?.specifications || [
      { key: "Fabric Composition", value: "100% Combed Cotton", group: "GENERAL" },
      { key: "GSM", value: "180 GSM", group: "TECHNICAL" },
      { key: "Weave Type", value: "Single Jersey", group: "TECHNICAL" },
    ]
  );

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const toggleSize = (size: string) => {
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  };

  const addCustomSize = () => {
    if (customSize.trim() && !sizes.includes(customSize.trim())) {
      setSizes([...sizes, customSize.trim()]);
      setCustomSize("");
    }
  };

  const toggleColor = (color: string) => {
    setColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const addCustomColor = () => {
    if (customColor.trim() && !colors.includes(customColor.trim())) {
      setColors([...colors, customColor.trim()]);
      setCustomColor("");
    }
  };

  const addSpecification = (key = "", value = "", group = "GENERAL") => {
    setSpecifications([...specifications, { key, value, group }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, idx) => idx !== index));
  };

  const updateSpecification = (index: number, field: keyof SpecificationItem, val: string) => {
    const updated = [...specifications];
    updated[index] = { ...updated[index], [field]: val };
    setSpecifications(updated);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setImageUrl(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!name.trim() || !description.trim() || !categoryId) {
        throw new Error("Please fill in the Product Name, Description, and Category.");
      }

      const validSpecs = specifications.filter((s) => s.key.trim() && s.value.trim());

      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        sku: sku.trim() || undefined,
        description: description.trim(),
        fabricDetails: fabricDetails.trim() || undefined,
        categoryId,
        availability,
        minOrderQuantity: minOrderQuantity.trim() || undefined,
        isFeatured,
        isDemo,
        sizes,
        colors,
        imageUrl: imageUrl.trim() || undefined,
        specifications: validSpecs,
      };

      const url = isEdit ? `/api/products/${initialData?.id}` : "/api/products";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save product.");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526075] hover:text-[#0d1626]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product List</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50/85 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Section 1 */}
      <div className="glass-panel-strong p-6 sm:p-8 rounded-[24px] space-y-5">
        <h2 className="font-display text-base font-bold text-[#0d1626] border-b border-slate-900/[0.08] pb-3">
          1. General Garment Information
        </h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155]">
              Garment Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Heavyweight French Terry Pullover Hoodie"
              className="glass-input w-full px-4 py-2.5 rounded-xl text-xs text-[#0d1626]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#334155]">Category *</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="glass-input w-full px-3 py-2.5 rounded-xl text-xs text-[#334155]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#334155]">SKU / Factory Code</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. ALM-KNIT-001"
                className="glass-input w-full px-4 py-2.5 rounded-xl text-xs font-mono text-[#0d1626]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#334155]">Custom URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-if-empty"
                className="glass-input w-full px-4 py-2.5 rounded-xl text-xs font-mono text-[#0d1626]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155]">Fabric Overview</label>
            <input
              type="text"
              value={fabricDetails}
              onChange={(e) => setFabricDetails(e.target.value)}
              placeholder="e.g. 380 GSM 80% Cotton / 20% Polyester French Terry"
              className="glass-input w-full px-4 py-2.5 rounded-xl text-xs text-[#0d1626]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155]">
              Product Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail garment construction, ribbing, stitching, collar placket, or seam reinforcement..."
              className="glass-input w-full px-4 py-2.5 rounded-xl text-xs text-[#0d1626]"
            />
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="glass-panel-strong p-6 sm:p-8 rounded-[24px] space-y-5">
        <h2 className="font-display text-base font-bold text-[#0d1626] border-b border-slate-900/[0.08] pb-3">
          2. Availability &amp; Visibility
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155]">
              Manufacturing Availability
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="glass-input w-full px-3 py-2.5 rounded-xl text-xs text-[#334155]"
            >
              <option value="MADE_TO_ORDER">Made to Order (OEM / Contract)</option>
              <option value="IN_PRODUCTION">In Production (Active Lines)</option>
              <option value="SAMPLE_AVAILABLE">Sample Swatch Available</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155]">Minimum Order Quantity</label>
            <input
              type="text"
              value={minOrderQuantity}
              onChange={(e) => setMinOrderQuantity(e.target.value)}
              placeholder="e.g. 500 pcs"
              className="glass-input w-full px-4 py-2.5 rounded-xl text-xs text-[#0d1626]"
            />
          </div>
        </div>

        <div className="pt-2 space-y-3 border-t border-slate-900/[0.07]">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#334155] cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#0f1a2e] cursor-pointer"
            />
            <span>Feature this garment on the Homepage</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-[#334155] cursor-pointer">
            <input
              type="checkbox"
              checked={isDemo}
              onChange={(e) => setIsDemo(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-amber-600 cursor-pointer"
            />
            <span>Mark as Draft / Capability Specimen</span>
          </label>
        </div>
      </div>

      {/* Section 3 */}
      <div className="glass-panel-strong p-6 sm:p-8 rounded-[24px] space-y-5">
        <h2 className="font-display text-base font-bold text-[#0d1626] border-b border-slate-900/[0.08] pb-3">
          3. Sizing Matrix &amp; Colorways
        </h2>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#334155]">
            Selected Sizes ({sizes.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_SIZES.map((s) => {
              const active = sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    active
                      ? "bg-[#0f1a2e] text-white border-[#0f1a2e]"
                      : "bg-white/60 text-[#526075] border-white/85 hover:bg-white"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-1 max-w-xs">
            <input
              type="text"
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              placeholder="Custom size (e.g. 5XL)"
              className="glass-input px-3 py-1.5 rounded-xl text-xs flex-1 text-[#0d1626]"
            />
            <button
              type="button"
              onClick={addCustomSize}
              className="glass-btn-primary px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-900/[0.07]">
          <label className="text-xs font-semibold text-[#334155]">
            Selected Colors ({colors.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_COLORS.map((c) => {
              const active = colors.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleColor(c)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    active
                      ? "bg-[#0f1a2e] text-white border-[#0f1a2e]"
                      : "bg-white/60 text-[#526075] border-white/85 hover:bg-white"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-1 max-w-xs">
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              placeholder="Custom shade"
              className="glass-input px-3 py-1.5 rounded-xl text-xs flex-1 text-[#0d1626]"
            />
            <button
              type="button"
              onClick={addCustomColor}
              className="glass-btn-primary px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Section 4 */}
      <div className="glass-panel-strong p-6 sm:p-8 rounded-[24px] space-y-5">
        <div className="flex items-center justify-between border-b border-slate-900/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4.5 h-4.5 text-[#1d3a63]" />
            <h2 className="font-display text-base font-bold text-[#0d1626]">
              4. Technical Specifications
            </h2>
          </div>
          <button
            type="button"
            onClick={() => addSpecification("", "", "GENERAL")}
            className="glass-btn-secondary inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {COMMON_SPEC_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => addSpecification(sug.key, "", sug.group)}
              className="px-2.5 py-1 rounded-lg bg-white/65 hover:bg-white border border-white/85 text-[11px] font-medium text-[#334155] transition-colors cursor-pointer"
            >
              + {sug.key}
            </button>
          ))}
        </div>

        {specifications.length > 0 ? (
          <div className="space-y-2.5">
            {specifications.map((spec, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center p-3 rounded-xl glass-panel-subtle"
              >
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => updateSpecification(index, "key", e.target.value)}
                    placeholder="Attribute (e.g. GSM)"
                    className="glass-input w-full px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0d1626]"
                  />
                </div>
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpecification(index, "value", e.target.value)}
                    placeholder="Value (e.g. 180 GSM Single Jersey)"
                    className="glass-input w-full px-3 py-1.5 rounded-lg text-xs text-[#334155]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <select
                    value={spec.group || "GENERAL"}
                    onChange={(e) => updateSpecification(index, "group", e.target.value)}
                    className="glass-input w-full px-2 py-1.5 rounded-lg text-xs text-[#526075]"
                  >
                    <option value="GENERAL">General</option>
                    <option value="TECHNICAL">Technical</option>
                    <option value="SIZING">Sizing</option>
                    <option value="PACKAGING">Packaging</option>
                  </select>
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="p-1.5 text-[#64748b] hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-[#748299] border border-dashed border-slate-300 rounded-xl">
            No technical specifications added yet.
          </div>
        )}
      </div>

      {/* Section 5 */}
      <div className="glass-panel-strong p-6 sm:p-8 rounded-[24px] space-y-5">
        <h2 className="font-display text-base font-bold text-[#0d1626] border-b border-slate-900/[0.08] pb-3">
          5. Product Photography
        </h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155]">Image Path or URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/images/cat-knitwear.jpg or https://..."
              className="glass-input w-full px-4 py-2.5 rounded-xl text-xs text-[#0d1626]"
            />
          </div>

          <div className="p-5 rounded-2xl border border-dashed border-slate-400/40 bg-white/40 flex flex-col items-center justify-center text-center space-y-2">
            <Upload className="w-5 h-5 text-[#64748b]" />
            <div className="text-xs text-[#526075]">Upload local garment image</div>
            <label className="glass-btn-secondary cursor-pointer px-4 py-2 rounded-xl text-xs font-semibold">
              {uploading ? "Uploading..." : "Browse Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_GARMENT_IMAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setImageUrl(preset.url)}
                className="px-2.5 py-1 rounded-lg bg-white/65 hover:bg-white border border-white/85 text-[11px] text-[#334155] transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {imageUrl && (
            <div className="pt-1">
              <div className="w-36 h-36 rounded-2xl overflow-hidden border border-white/85 bg-slate-100 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href="/admin/products"
          className="glass-btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="glass-btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl disabled:opacity-60 text-xs font-semibold cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEdit ? "Update Product" : "Save Product"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
