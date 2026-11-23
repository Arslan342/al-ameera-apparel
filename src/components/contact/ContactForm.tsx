"use client";

import { useState, useTransition } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Paperclip,
  X,
  FileCheck,
  Plus,
  Shirt,
} from "lucide-react";

export interface SelectedProductQuoteItem {
  productId: string;
  name: string;
  requestedQuantity?: string;
  size?: string;
  color?: string;
}

interface ContactFormProps {
  initialProduct?: string;
  initialProductId?: string;
  initialSize?: string;
  initialColor?: string;
  availableProducts?: {
    id: string;
    name: string;
    sku?: string | null;
  }[];
}

export default function ContactForm({
  initialProduct = "",
  initialProductId = "",
  initialSize = "",
  initialColor = "",
  availableProducts = [],
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [inquiryType, setInquiryType] = useState("BULK_ORDER");
  const [targetQuantity, setTargetQuantity] = useState("");
  const [sizeRequirements, setSizeRequirements] = useState(initialSize);
  const [colorRequirements, setColorRequirements] = useState(initialColor);
  const [fabricCustomization, setFabricCustomization] = useState("");
  const [message, setMessage] = useState(
    initialProduct
      ? `Requesting formal factory quotation for: ${initialProduct}${
          initialSize ? ` | Size: ${initialSize}` : ""
        }${initialColor ? ` | Colorway: ${initialColor}` : ""}. Please provide FOB Karachi pricing, production lead time, and sample strike-off terms.`
      : ""
  );
  const [privacyConsent, setPrivacyConsent] = useState(true);

  const [selectedItems, setSelectedItems] = useState<SelectedProductQuoteItem[]>(() => {
    if (initialProductId && initialProduct) {
      return [
        {
          productId: initialProductId,
          name: initialProduct.replace(/^\[Demo Product\]\s*/i, ""),
          size: initialSize,
          color: initialColor,
        },
      ];
    }
    return [];
  });
  const [productToAdd, setProductToAdd] = useState("");

  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedAttachmentUrl, setUploadedAttachmentUrl] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
    referenceNo?: string;
  } | null>(null);

  const handleAddProduct = () => {
    if (!productToAdd) return;
    const found = availableProducts.find((p) => p.id === productToAdd);
    if (!found) return;

    if (!selectedItems.some((item) => item.productId === found.id)) {
      setSelectedItems([
        ...selectedItems,
        {
          productId: found.id,
          name: found.name.replace(/^\[Demo Product\]\s*/i, ""),
        },
      ]);
    }
    setProductToAdd("");
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedItems(selectedItems.filter((item) => item.productId !== productId));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);
    setUploadingFile(true);

    try {
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File exceeds maximum allowable size of 10MB.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("purpose", "quote_attachment");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload reference file.");
      }

      setUploadedAttachmentUrl(data.url);
      setAttachmentName(file.name);
    } catch (err: unknown) {
      setFileError(err instanceof Error ? err.message : "File upload failed.");
    } finally {
      setUploadingFile(false);
    }
  };

  const removeAttachment = () => {
    setUploadedAttachmentUrl(null);
    setAttachmentName(null);
    setFileError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please provide your full name, business email address, and quotation inquiry message.",
      });
      return;
    }

    if (!privacyConsent) {
      setStatusMessage({
        type: "error",
        text: "Please accept the privacy policy consent to proceed.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const items = selectedItems.map((item) => {
          const numQty = parseInt(item.requestedQuantity || targetQuantity || "0", 10);
          return {
            productId: item.productId,
            requestedQuantity: numQty > 0 ? numQty : null,
            size: item.size || sizeRequirements || null,
            color: item.color || colorRequirements || null,
            specifications: fabricCustomization || null,
          };
        });

        const primaryProductId = selectedItems[0]?.productId || initialProductId || null;

        const payload = {
          name,
          email,
          phone,
          company,
          country,
          inquiryType,
          message,
          requestedQuantity: targetQuantity,
          sizeRequirements,
          colorRequirements,
          fabricCustomization,
          attachmentUrl: uploadedAttachmentUrl,
          privacyConsent,
          productId: primaryProductId,
          items: items.length > 0 ? items : undefined,
        };

        const res = await fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to submit quotation request.");
        }

        setStatusMessage({
          type: "success",
          text: "Your manufacturing quotation request has been submitted.",
          referenceNo: data.referenceNo || data.inquiry?.referenceNo,
        });

        setName("");
        setEmail("");
        setPhone("");
        setCompany("");
        setCountry("");
        setTargetQuantity("");
        setSizeRequirements("");
        setColorRequirements("");
        setFabricCustomization("");
        setMessage("");
        setSelectedItems([]);
        setUploadedAttachmentUrl(null);
        setAttachmentName(null);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
        setStatusMessage({
          type: "error",
          text: msg,
        });
      }
    });
  };

  return (
    <div className="glass-panel-strong rounded-[28px] p-6 sm:p-10 space-y-6">
      <div className="space-y-1.5">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0d1626] tracking-tight">
          Request a Manufacturing Quote
        </h2>
        <p className="text-xs sm:text-sm text-[#526075] leading-relaxed">
          Share your target quantities, sizing breakdown, and tech packs. Our Karachi merchandising team responds within 24 business hours.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl text-sm flex items-start gap-3 backdrop-blur-md ${
            statusMessage.type === "success"
              ? "bg-emerald-50/85 border border-emerald-200/80 text-emerald-950"
              : "bg-rose-50/85 border border-rose-200/80 text-rose-950"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <div className="font-semibold">{statusMessage.text}</div>
            {statusMessage.referenceNo && (
              <div className="text-xs text-emerald-900 font-mono font-bold bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block mt-1">
                Reference: {statusMessage.referenceNo}
              </div>
            )}
            {statusMessage.type === "success" && (
              <p className="text-xs text-[#526075] mt-1">
                Keep this reference number for correspondence with our merchandising desk.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Multi-Product Selection */}
      <div className="glass-panel-subtle rounded-2xl p-4 space-y-3">
        <div className="text-xs font-semibold text-[#0d1626] flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5">
            <Shirt className="w-4 h-4 text-[#1d3a63]" />
            <span>Garments of Interest ({selectedItems.length})</span>
          </span>
          <span className="text-[11px] font-normal text-[#64748b] hidden sm:inline">
            Optional · Add one or multiple styles
          </span>
        </div>

        {selectedItems.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-0.5">
            {selectedItems.map((item) => (
              <div
                key={item.productId}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 border border-white text-xs text-[#0d1626] font-medium shadow-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#b8913f] shrink-0" />
                <span>{item.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(item.productId)}
                  className="text-[#748299] hover:text-rose-600 transition-colors cursor-pointer"
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {availableProducts.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              value={productToAdd}
              onChange={(e) => setProductToAdd(e.target.value)}
              className="glass-input flex-1 px-3 py-2 rounded-xl text-xs text-[#334155]"
            >
              <option value="">-- Select a catalogue style to attach --</option>
              {availableProducts
                .filter((p) => !selectedItems.some((s) => s.productId === p.id))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name.replace(/^\[Demo Product\]\s*/i, "")} {p.sku ? `(${p.sku})` : ""}
                  </option>
                ))}
            </select>
            <button
              type="button"
              onClick={handleAddProduct}
              disabled={!productToAdd}
              className="glass-btn-primary inline-flex items-center gap-1 px-3.5 py-2 rounded-xl disabled:opacity-40 text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155]">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Miller"
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-[#0d1626]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155]">Company / Brand</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Apex Apparel LLC"
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-[#0d1626]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155]">
              Business Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="buyer@brand.com"
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-[#0d1626]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155]">Phone / WhatsApp</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000 or +92..."
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-[#0d1626]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155]">Country / Region</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="United Kingdom, USA, Germany, UAE..."
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-[#0d1626]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155]">Inquiry Purpose</label>
            <select
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-[#334155]"
            >
              <option value="BULK_ORDER">Commercial Bulk Production (OEM)</option>
              <option value="SAMPLE_REQUEST">Pre-Production Sample / Strike-Off</option>
              <option value="CUSTOM_MANUFACTURING">Custom Private Label &amp; Branding</option>
              <option value="GENERAL">General Factory Inquiry</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155]">Target Quantity</label>
            <input
              type="text"
              value={targetQuantity}
              onChange={(e) => setTargetQuantity(e.target.value)}
              placeholder="e.g. 1,000 pcs"
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-[#0d1626]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155]">Size Matrix</label>
            <input
              type="text"
              value={sizeRequirements}
              onChange={(e) => setSizeRequirements(e.target.value)}
              placeholder="e.g. S – XXL"
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-[#0d1626]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#334155]">Colorways</label>
            <input
              type="text"
              value={colorRequirements}
              onChange={(e) => setColorRequirements(e.target.value)}
              placeholder="e.g. Navy, Black"
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-[#0d1626]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#334155]">
            Fabric &amp; Customization Notes
          </label>
          <input
            type="text"
            value={fabricCustomization}
            onChange={(e) => setFabricCustomization(e.target.value)}
            placeholder="e.g. 180 GSM 100% combed cotton, bio-wash, woven neck label"
            className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-[#0d1626]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#334155]">
            Detailed Specifications <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe garment specifications, target delivery timeline, destination port, and packing preferences..."
            className="glass-input w-full px-4 py-3 rounded-xl text-sm text-[#0d1626]"
          />
        </div>

        {/* Tech Pack Attachment */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5">
            <Paperclip className="w-3.5 h-3.5 text-[#1d3a63]" />
            <span>Reference Tech Pack (Optional · PDF, DOC, Images · Max 10MB)</span>
          </label>

          {uploadedAttachmentUrl ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900">
              <div className="flex items-center gap-2 truncate">
                <FileCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-semibold truncate">
                  {attachmentName || "Uploaded Tech Pack"}
                </span>
              </div>
              <button
                type="button"
                onClick={removeAttachment}
                className="text-slate-500 hover:text-rose-600 ml-2 cursor-pointer"
                aria-label="Remove uploaded file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                onChange={handleFileUpload}
                disabled={uploadingFile}
                className="block w-full text-xs text-[#526075] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-white/80 file:text-xs file:font-semibold file:bg-white/75 file:text-[#0d1626] hover:file:bg-white cursor-pointer"
              />
              {uploadingFile && (
                <div className="text-xs text-[#1d3a63] flex items-center gap-1.5 mt-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading reference document...</span>
                </div>
              )}
            </div>
          )}

          {fileError && <div className="text-xs text-rose-600 mt-1">{fileError}</div>}
        </div>

        {/* Privacy Consent */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#526075]">
            <input
              type="checkbox"
              required
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-[#0f1a2e] focus:ring-[#1d3a63] cursor-pointer"
            />
            <span>
              I consent to Al-Ameera Apparel (Pvt.) Ltd. processing these details solely for manufacturing quotation and commercial order evaluation.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isPending || uploadingFile}
          className="glass-btn-primary w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold disabled:opacity-60 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              <span>Submitting Quotation Request...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Quotation Request</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-[#748299] text-center">
          Each inquiry is assigned a tracking reference logged directly with our Karachi merchandising desk.
        </p>
      </form>
    </div>
  );
}
