"use client";

import { useState, useMemo } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  Building,
  Shirt,
  MessageSquare,
  FileEdit,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Paperclip,
  Globe,
  Tag,
  Download,
} from "lucide-react";

export interface InquiryProductItem {
  id: string;
  requestedQuantity?: number | null;
  size?: string | null;
  color?: string | null;
  specifications?: string | null;
  product: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface InquiryItem {
  id: string;
  referenceNo?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  country?: string | null;
  inquiryType: string;
  message: string;
  requestedQuantity?: string | null;
  sizeRequirements?: string | null;
  colorRequirements?: string | null;
  fabricCustomization?: string | null;
  attachmentUrl?: string | null;
  privacyConsent?: boolean;
  status: string;
  adminNotes?: string | null;
  createdAt: Date | string;
  product?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  items?: InquiryProductItem[];
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Inquiries" },
  { value: "NEW", label: "New" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "QUOTATION_SENT", label: "Quotation Sent" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CLOSED", label: "Closed" },
];

export default function InquiryManager({
  initialInquiries,
}: {
  initialInquiries: InquiryItem[];
}) {
  const [inquiries, setInquiries] = useState<InquiryItem[]>(initialInquiries);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const normalizeStatus = (status: string) => {
    if (status === "IN_REVIEW") return "UNDER_REVIEW";
    if (status === "QUOTED") return "QUOTATION_SENT";
    return status;
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const normStatus = normalizeStatus(inq.status);
      if (activeTab !== "ALL" && normStatus !== activeTab) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const refMatch = inq.referenceNo ? inq.referenceNo.toLowerCase().includes(q) : false;
        const nameMatch = inq.name.toLowerCase().includes(q);
        const emailMatch = inq.email.toLowerCase().includes(q);
        const companyMatch = inq.company ? inq.company.toLowerCase().includes(q) : false;
        const countryMatch = inq.country ? inq.country.toLowerCase().includes(q) : false;
        const msgMatch = inq.message.toLowerCase().includes(q);
        const prodMatch = inq.product?.name ? inq.product.name.toLowerCase().includes(q) : false;

        return refMatch || nameMatch || emailMatch || companyMatch || countryMatch || msgMatch || prodMatch;
      }

      return true;
    });
  }, [inquiries, activeTab, searchQuery]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    setMessage(null);

    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update inquiry status");
      }

      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      setMessage({
        type: "success",
        text: `Inquiry status changed to "${newStatus.replace(/_/g, " ")}".`,
      });
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error updating status.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async (id: string) => {
    setUpdatingId(id);
    setMessage(null);

    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: tempNotes }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save admin notes");
      }

      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, adminNotes: tempNotes } : item))
      );
      setEditingNotesId(null);
      setMessage({ type: "success", text: "Internal notes updated successfully." });
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error saving notes.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, senderName: string) => {
    if (!confirm(`Are you sure you want to delete the quotation request from "${senderName}"?`)) {
      return;
    }

    setUpdatingId(id);
    setMessage(null);

    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete inquiry");
      }

      setInquiries((prev) => prev.filter((item) => item.id !== id));
      setMessage({ type: "success", text: "Inquiry record deleted successfully." });
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error deleting inquiry.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const norm = normalizeStatus(status);
    switch (norm) {
      case "NEW":
        return "bg-amber-100/90 text-amber-900 border-amber-200";
      case "UNDER_REVIEW":
        return "bg-slate-200/85 text-[#1d3a63] border-white";
      case "QUOTATION_SENT":
        return "bg-indigo-100/85 text-indigo-900 border-indigo-200";
      case "APPROVED":
        return "bg-emerald-100/90 text-emerald-900 border-emerald-200";
      case "REJECTED":
        return "bg-rose-100/90 text-rose-900 border-rose-200";
      case "CLOSED":
      default:
        return "bg-slate-100/90 text-slate-700 border-slate-200";
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

      {/* Search & Filter Bar */}
      <div className="glass-panel-strong p-5 rounded-[24px] space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reference number (e.g. ALM-RFQ), buyer name, company, email, country, or message..."
            className="glass-input w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm text-[#0d1626]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#0d1626]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-900/[0.07]">
          {STATUS_OPTIONS.map((tab) => {
            const count =
              tab.value === "ALL"
                ? inquiries.length
                : inquiries.filter((i) => normalizeStatus(i.status) === tab.value).length;
            const isActive = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#0f1a2e] text-white shadow-sm"
                    : "text-[#526075] hover:text-[#0d1626] hover:bg-white/70"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive ? "bg-white/15 text-slate-200" : "bg-white/70 text-[#64748b]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.map((inq) => {
          const isExpanded = expandedId === inq.id;
          const normStatus = normalizeStatus(inq.status);

          return (
            <div
              key={inq.id}
              className="glass-panel-strong rounded-[22px] overflow-hidden transition-all"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/40 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {inq.referenceNo && (
                      <span className="font-mono text-xs font-bold text-[#1d3a63] bg-white/80 px-2 py-0.5 rounded-md border border-white">
                        {inq.referenceNo}
                      </span>
                    )}
                    <span className="font-bold text-[#0d1626] text-sm">{inq.name}</span>
                    {inq.company && (
                      <span className="text-xs text-[#526075] font-medium">
                        · {inq.company.replace(/\s*\[Demo Client\]/i, "")}
                      </span>
                    )}
                    {inq.country && (
                      <span className="text-xs text-[#748299]">({inq.country})</span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                        inq.status
                      )}`}
                    >
                      {normStatus.replace(/_/g, " ")}
                    </span>
                  </div>

                  <p className="text-xs text-[#526075] line-clamp-1 max-w-2xl">
                    {inq.message.replace(/^\[Demo Inquiry Message\]\s*/i, "")}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-[11px] text-[#748299]">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </span>
                  <div className="p-1 rounded-lg text-[#64748b]">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-6 pt-3 border-t border-slate-900/[0.07] space-y-5 bg-white/30 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                    <div className="glass-panel-subtle p-3 rounded-xl space-y-1">
                      <div className="text-[#748299] font-medium flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#1d3a63]" />
                        <span>Business Email</span>
                      </div>
                      <a
                        href={`mailto:${inq.email}`}
                        className="font-semibold text-[#1d3a63] hover:underline block truncate"
                      >
                        {inq.email}
                      </a>
                    </div>

                    <div className="glass-panel-subtle p-3 rounded-xl space-y-1">
                      <div className="text-[#748299] font-medium flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#1d3a63]" />
                        <span>Phone / WhatsApp</span>
                      </div>
                      <div className="font-semibold text-[#0d1626]">
                        {inq.phone || "Not specified"}
                      </div>
                    </div>

                    <div className="glass-panel-subtle p-3 rounded-xl space-y-1">
                      <div className="text-[#748299] font-medium flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-[#1d3a63]" />
                        <span>Country / Region</span>
                      </div>
                      <div className="font-semibold text-[#0d1626]">
                        {inq.country || "Not specified"}
                      </div>
                    </div>

                    <div className="glass-panel-subtle p-3 rounded-xl space-y-1">
                      <div className="text-[#748299] font-medium flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-[#1d3a63]" />
                        <span>Inquiry Type</span>
                      </div>
                      <div className="font-semibold text-[#0d1626]">
                        {inq.inquiryType.replace(/_/g, " ")}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="glass-panel-subtle p-3 rounded-xl space-y-1">
                      <span className="text-[#748299] font-medium">Requested Quantity</span>
                      <div className="font-bold text-[#0d1626]">
                        {inq.requestedQuantity || "Not specified"}
                      </div>
                    </div>

                    <div className="glass-panel-subtle p-3 rounded-xl space-y-1">
                      <span className="text-[#748299] font-medium">Size Requirements</span>
                      <div className="font-semibold text-[#0d1626]">
                        {inq.sizeRequirements || "Not specified"}
                      </div>
                    </div>

                    <div className="glass-panel-subtle p-3 rounded-xl space-y-1">
                      <span className="text-[#748299] font-medium">Color Requirements</span>
                      <div className="font-semibold text-[#0d1626]">
                        {inq.colorRequirements || "Not specified"}
                      </div>
                    </div>
                  </div>

                  {inq.fabricCustomization && (
                    <div className="glass-panel-subtle p-3.5 rounded-xl space-y-1">
                      <span className="text-[#748299] font-medium">
                        Fabric / Customization Requirements
                      </span>
                      <div className="font-medium text-[#0d1626] leading-relaxed">
                        {inq.fabricCustomization}
                      </div>
                    </div>
                  )}

                  {inq.product && (
                    <div className="p-3.5 rounded-xl bg-white/75 border border-white text-[#0d1626] flex items-center gap-2">
                      <Shirt className="w-4 h-4 text-[#1d3a63] shrink-0" />
                      <span>
                        Target Style:{" "}
                        <strong>{inq.product.name.replace(/^\[Demo Product\]\s*/i, "")}</strong>
                      </span>
                    </div>
                  )}

                  {inq.items && inq.items.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-bold text-[#0d1626] flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-[#1d3a63]" />
                        <span>Products in Quotation ({inq.items.length})</span>
                      </div>
                      <div className="border border-white/80 rounded-xl overflow-hidden divide-y divide-slate-900/[0.06] bg-white/60">
                        {inq.items.map((it) => (
                          <div
                            key={it.id}
                            className="p-3 flex items-center justify-between text-xs"
                          >
                            <span className="font-semibold text-[#0d1626]">
                              {it.product.name.replace(/^\[Demo Product\]\s*/i, "")}
                            </span>
                            <div className="flex items-center gap-3 text-[#526075]">
                              {it.requestedQuantity && (
                                <span>
                                  Qty: <strong>{it.requestedQuantity}</strong>
                                </span>
                              )}
                              {it.size && (
                                <span>
                                  Size: <strong>{it.size}</strong>
                                </span>
                              )}
                              {it.color && (
                                <span>
                                  Color: <strong>{it.color}</strong>
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {inq.attachmentUrl && (
                    <div className="glass-panel-subtle p-3.5 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-[#1d3a63] shrink-0" />
                        <span className="font-semibold text-[#0d1626]">
                          Attached Tech Pack / File
                        </span>
                      </div>
                      <a
                        href={inq.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0f1a2e] text-white hover:bg-[#1d3a63] font-semibold text-xs transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="font-bold text-[#0d1626] flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-[#1d3a63]" />
                      <span>Quotation Request Details</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/75 border border-white text-[#334155] leading-relaxed whitespace-pre-wrap">
                      {inq.message.replace(/^\[Demo Inquiry Message\]\s*/i, "")}
                    </div>
                  </div>

                  {/* Internal Notes */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-[#0d1626] flex items-center gap-1.5">
                        <FileEdit className="w-4 h-4 text-[#1d3a63]" />
                        <span>Internal Factory Notes</span>
                      </div>
                      {editingNotesId !== inq.id && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNotesId(inq.id);
                            setTempNotes(inq.adminNotes || "");
                          }}
                          className="text-[11px] font-semibold text-[#1d3a63] hover:underline cursor-pointer"
                        >
                          {inq.adminNotes ? "Edit Notes" : "+ Add Notes"}
                        </button>
                      )}
                    </div>

                    {editingNotesId === inq.id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={3}
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          placeholder="Record costing notes, yarn availability, buyer follow-ups..."
                          className="glass-input w-full p-3 rounded-xl text-xs text-[#0d1626]"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingNotesId(null)}
                            className="px-3 py-1.5 rounded-lg bg-white/70 border border-white text-[#526075] hover:bg-white cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveNotes(inq.id)}
                            disabled={updatingId === inq.id}
                            className="glass-btn-primary px-4 py-1.5 rounded-lg font-semibold cursor-pointer"
                          >
                            Save Notes
                          </button>
                        </div>
                      </div>
                    ) : inq.adminNotes ? (
                      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-950 leading-relaxed">
                        {inq.adminNotes}
                      </div>
                    ) : (
                      <div className="text-[#748299] italic">No internal notes added yet.</div>
                    )}
                  </div>

                  {/* Status Bar */}
                  <div className="pt-4 border-t border-slate-900/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#334155]">Update Status:</span>
                      <select
                        value={normStatus}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        disabled={updatingId === inq.id}
                        className="glass-input px-3 py-1.5 rounded-xl text-xs font-semibold text-[#0d1626]"
                      >
                        <option value="NEW">New</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="QUOTATION_SENT">Quotation Sent</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                      {updatingId === inq.id && (
                        <Loader2 className="w-4 h-4 animate-spin text-[#1d3a63] ml-1" />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(inq.id, inq.name)}
                      disabled={updatingId === inq.id}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors self-end sm:self-auto cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Inquiry</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredInquiries.length === 0 && (
          <div className="glass-panel-strong rounded-[24px] p-12 text-center text-[#64748b] text-xs">
            No quotation inquiries found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
