import prisma from "@/lib/prisma";
import InquiryManager from "@/components/admin/InquiryManager";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0d1626] tracking-tight">
          Buyer Inquiries &amp; RFQs
        </h1>
        <p className="text-xs sm:text-sm text-[#526075] mt-1">
          Review incoming buyer quotation requests, track statuses, download tech packs, and log internal costing notes.
        </p>
      </div>

      <InquiryManager initialInquiries={inquiries} />
    </div>
  );
}
