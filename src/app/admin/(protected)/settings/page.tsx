import prisma from "@/lib/prisma";
import SettingsManager from "@/components/admin/SettingsManager";

export default async function AdminSettingsPage() {
  let settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.siteSettings.create({
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
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0d1626] tracking-tight">
          Website &amp; Facility Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#526075] mt-1">
          Manage official corporate identity, facility workforce, contact coordinates, and operating hours.
        </p>
      </div>

      <SettingsManager initialSettings={settings} />
    </div>
  );
}
