import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  Shirt,
  FolderTree,
  Inbox,
  Clock,
  PlusCircle,
  ExternalLink,
  Users,
  ArrowRight,
} from "lucide-react";
import GlassCard from "@/components/motion/GlassCard";
import SafeImage from "@/components/common/SafeImage";

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    totalCategories,
    totalInquiries,
    newInquiries,
    recentInquiries,
    recentProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: { name: true },
        },
      },
    }),
    prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: { name: true },
        },
        images: {
          select: { url: true },
          take: 1,
        },
      },
    }),
  ]);

  const statCards = [
    {
      title: "Catalogue Products",
      value: totalProducts,
      desc: "Garment styles in catalogue",
      icon: Shirt,
      link: "/admin/products",
    },
    {
      title: "Garment Divisions",
      value: totalCategories,
      desc: "Active product categories",
      icon: FolderTree,
      link: "/admin/categories",
    },
    {
      title: "Total Inquiries",
      value: totalInquiries,
      desc: "Recorded buyer RFQs",
      icon: Inbox,
      link: "/admin/inquiries",
    },
    {
      title: "New Inquiries",
      value: newInquiries,
      desc: "Awaiting merchandising review",
      icon: Clock,
      link: "/admin/inquiries?status=NEW",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0d1626] tracking-tight">
            Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#526075] mt-1">
            Al-Ameera Apparel (Pvt.) Ltd. · Korangi Industrial Area, Karachi
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="glass-btn-primary inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/products"
            target="_blank"
            className="glass-btn-secondary inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Catalogue</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.link} className="block h-full">
              <GlassCard className="p-6 rounded-2xl h-full space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#526075]">{stat.title}</span>
                  <div className="w-9 h-9 rounded-xl bg-[#0f1a2e]/[0.06] border border-white/85 text-[#1d3a63] flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-[#0d1626]">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#64748b] mt-1">{stat.desc}</div>
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>

      {/* Facility Baseline Smoked Glass Bar */}
      <div className="glass-dark rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#e2c26b] shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display text-sm font-bold">Facility Baseline</div>
            <div className="text-xs text-slate-300 mt-0.5">
              280 Dedicated Personnel · Plot 27, Mehran Town Sector 23, Korangi, Karachi
            </div>
          </div>
        </div>
        <Link
          href="/admin/settings"
          className="text-xs font-semibold text-[#e2c26b] hover:text-white transition-colors shrink-0"
        >
          Manage Settings &rarr;
        </Link>
      </div>

      {/* Two Column Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 glass-panel-strong rounded-[24px] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900/[0.08] pb-4">
            <div>
              <h2 className="font-display text-base font-bold text-[#0d1626]">
                Recent Buyer Inquiries
              </h2>
              <p className="text-xs text-[#64748b]">Incoming quotation requests &amp; RFQs</p>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-xs font-semibold text-[#1d3a63] hover:text-[#0d1626] flex items-center gap-1"
            >
              <span>View All ({totalInquiries})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentInquiries.length > 0 ? (
            <div className="divide-y divide-slate-900/[0.06]">
              {recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="py-3.5 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#0d1626]">{inquiry.name}</span>
                      {inquiry.company && (
                        <span className="text-[#64748b]">
                          ({inquiry.company.replace(/\s*\[Demo Client\]/i, "")})
                        </span>
                      )}
                    </div>
                    <p className="text-[#526075] line-clamp-1">
                      {inquiry.message.replace(/^\[Demo Inquiry Message\]\s*/i, "")}
                    </p>
                    {inquiry.product && (
                      <div className="text-[11px] text-[#1d3a63] font-medium">
                        Style: {inquiry.product.name.replace(/^\[Demo Product\]\s*/i, "")}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                        inquiry.status === "NEW"
                          ? "bg-amber-100/90 text-amber-900"
                          : inquiry.status === "QUOTED" || inquiry.status === "QUOTATION_SENT"
                          ? "bg-emerald-100/90 text-emerald-900"
                          : "bg-slate-200/80 text-[#1d3a63]"
                      }`}
                    >
                      {inquiry.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] text-[#748299]">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-[#64748b]">
              No inquiries received yet.
            </div>
          )}
        </div>

        <div className="lg:col-span-5 glass-panel-strong rounded-[24px] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900/[0.08] pb-4">
            <div>
              <h2 className="font-display text-base font-bold text-[#0d1626]">
                Latest Catalogue Styles
              </h2>
              <p className="text-xs text-[#64748b]">Recently added or edited items</p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-[#1d3a63] hover:text-[#0d1626] flex items-center gap-1"
            >
              <span>Manage ({totalProducts})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-900/[0.06]">
            {recentProducts.map((p) => {
              const cleanName = p.name.replace(/^\[Demo Product\]\s*/i, "");
              return (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-200/70 overflow-hidden shrink-0 border border-white/80">
                      <SafeImage
                        src={p.images[0]?.url || "/images/cat-knitwear.jpg"}
                        fallbackSrc="/images/cat-knitwear.jpg"
                        alt={cleanName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#0d1626] truncate">{cleanName}</h3>
                      <div className="text-[11px] text-[#64748b]">{p.category?.name}</div>
                    </div>
                  </div>

                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="px-2.5 py-1 rounded-lg bg-white/70 hover:bg-white border border-white/85 text-[#0d1626] text-[11px] font-semibold shrink-0 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
