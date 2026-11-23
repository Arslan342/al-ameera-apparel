import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
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

    return NextResponse.json({ settings });
  } catch (error: unknown) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json({ error: "Failed to fetch site settings" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { companyName, industry, workforce, address, postalCode, email, phone, workingHours } = body;

    const updated = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        ...(companyName ? { companyName: companyName.trim() } : {}),
        ...(industry ? { industry: industry.trim() } : {}),
        ...(workforce ? { workforce: Number(workforce) } : {}),
        ...(address ? { address: address.trim() } : {}),
        ...(postalCode ? { postalCode: postalCode.trim() } : {}),
        ...(email ? { email: email.trim().toLowerCase() } : {}),
        ...(phone ? { phone: phone.trim() } : {}),
        ...(workingHours ? { workingHours: workingHours.trim() } : {}),
      },
      create: {
        id: "default",
        companyName: companyName || "Al-Ameera Apparel (Pvt.) Ltd.",
        industry: industry || "Apparel and Garment Manufacturing",
        workforce: workforce ? Number(workforce) : 280,
        address: address || "Plot 27, Mehran Town Sector 23, Korangi Industrial Area, Karachi, 74900, Pakistan",
        postalCode: postalCode || "74900",
        email: email || "inquiry@al-ameera.pk",
        phone: phone || "+92 21 3500 0000",
        workingHours: workingHours || "Mon – Sat: 8:00 AM – 6:00 PM PKT",
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: unknown) {
    console.error("Error updating site settings:", error);
    return NextResponse.json({ error: "Failed to update site settings" }, { status: 500 });
  }
}
