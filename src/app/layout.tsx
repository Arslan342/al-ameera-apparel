import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Al-Ameera Apparel (Pvt.) Ltd. | Garment Manufacturing Karachi",
    template: "%s | Al-Ameera Apparel (Pvt.) Ltd.",
  },
  description:
    "Official corporate portal and product catalogue for Al-Ameera Apparel (Pvt.) Ltd., dedicated apparel and garment manufacturer in Korangi Industrial Area, Karachi, Pakistan. 280 skilled personnel producing knitwear, polo shirts, fleece, and private label garments.",
  keywords: [
    "Al-Ameera Apparel",
    "Al-Ameera Apparel (Pvt.) Ltd.",
    "Garment Manufacturer Karachi",
    "Apparel Manufacturing Pakistan",
    "Korangi Industrial Area",
    "Textile Exporter Pakistan",
    "Knitwear Manufacturer",
    "Private Label Apparel Karachi",
    "OEM Clothing Factory",
    "B2B Garment Supplier",
  ],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/brand/favicon.svg",
  },
  openGraph: {
    title: "Al-Ameera Apparel (Pvt.) Ltd. | Garment Manufacturing Karachi",
    description:
      "Precision B2B garment and private label apparel manufacturing in Korangi Industrial Area, Karachi, Pakistan with 280 skilled personnel.",
    url: "/",
    siteName: "Al-Ameera Apparel (Pvt.) Ltd.",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/brand/logo-horizontal-dark.svg",
        width: 1200,
        height: 630,
        alt: "Al-Ameera Apparel (Pvt.) Ltd. Corporate Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Al-Ameera Apparel (Pvt.) Ltd. | Garment Manufacturing Karachi",
    description:
      "Precision B2B garment and private label apparel manufacturing in Korangi Industrial Area, Karachi, Pakistan with 280 skilled personnel.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#eef2f7] text-[#0d1626] font-sans selection:bg-[#1b2c48] selection:text-white">
        {children}
      </body>
    </html>
  );
}
