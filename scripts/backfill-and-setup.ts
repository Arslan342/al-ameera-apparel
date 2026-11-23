import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking database records and backfilling reference numbers...");

  // Backfill existing inquiries without referenceNo
  const inquiriesWithoutRef = await prisma.inquiry.findMany({
    where: { referenceNo: null },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Found ${inquiriesWithoutRef.length} inquiries without reference number.`);
  let count = 1;
  for (const inq of inquiriesWithoutRef) {
    const year = new Date(inq.createdAt).getFullYear() || 2026;
    const ref = `ALM-RFQ-${year}-${String(count).padStart(4, "0")}`;
    await prisma.inquiry.update({
      where: { id: inq.id },
      data: { referenceNo: ref },
    });
    console.log(`Updated inquiry ${inq.id} with reference: ${ref}`);
    count++;
  }

  // Ensure default SiteSettings exists
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    await prisma.siteSettings.create({
      data: {
        id: "default",
        companyName: "Al-Ameera Apparel (Pvt.) Ltd.",
        industry: "Apparel and Garment Manufacturing",
        workforce: 280,
        address: "Plot 27, Mehran Town Sector 23, Korangi Industrial Area, Karachi, 74900, Pakistan",
        postalCode: "74900",
        email: "inquiry@al-ameera.pk",
        phone: "+92 21 3500 0000",
        workingHours: "Mon – Sat: 8:00 AM – 6:00 PM PKT",
      },
    });
    console.log("Initialized default SiteSettings.");
  } else {
    console.log("SiteSettings already initialized.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
