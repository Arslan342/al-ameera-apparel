import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database for Al-Ameera Apparel (Pvt.) Ltd. ...");

  // 1. Clean existing records in reverse order
  await prisma.inquiry.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.admin.deleteMany();

  // 2. Create Superadmin
  const hashedPassword = await bcrypt.hash("AdminPassword2026!", 10);
  const admin = await prisma.admin.create({
    data: {
      email: "admin@al-ameera.local",
      passwordHash: hashedPassword,
      name: "System Administrator",
      role: "SUPERADMIN",
    },
  });
  console.log(`✅ Created admin user: ${admin.email}`);

  // 3. Create Categories
  const categoriesData = [
    {
      name: "Knitwear & T-Shirts",
      slug: "knitwear",
      description: "High-gauge single jersey, interlock, and combed cotton crewneck t-shirts.",
      displayOrder: 1,
      image: "/images/cat-knitwear.jpg",
    },
    {
      name: "Polo Shirts & Casual Tops",
      slug: "polo-shirts",
      description: "Premium 100% cotton & CVC blended pique polos for private label collections.",
      displayOrder: 2,
      image: "/images/cat-polo.jpg",
    },
    {
      name: "Fleece, Hoodies & Sweats",
      slug: "fleece-hoodies",
      description: "Heavyweight brushed and French terry fleece hoodies, sweatshirts, and pullovers.",
      displayOrder: 3,
      image: "/images/cat-fleece.jpg",
    },
    {
      name: "Woven Shirts & Workwear",
      slug: "woven-workwear",
      description: "Durable twill work shirts, corporate oxfords, and heavy-duty uniforms.",
      displayOrder: 4,
      image: "/images/cat-woven.jpg",
    },
    {
      name: "Denim & Trousers",
      slug: "denim-trousers",
      description: "Utility cargo pants, cotton chinos, and commercial bottoms.",
      displayOrder: 5,
      image: "/images/cat-trousers.jpg",
    },
    {
      name: "Activewear & Performance",
      slug: "activewear",
      description: "Moisture-wicking poly-spandex athletic shirts, compression gear, and tracksuits.",
      displayOrder: 6,
      image: "/images/cat-activewear.jpg",
    },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({
      data: cat,
    });
    categoriesMap[cat.slug] = created.id;
  }
  console.log(`✅ Created ${Object.keys(categoriesMap).length} demo categories`);

  // 4. Create Demo Products
  const demoProducts = [
    {
      name: "[Demo Product] Men's Classic Combed Cotton Crewneck T-Shirt",
      slug: "demo-mens-classic-crewneck-tshirt",
      sku: "ALM-DEMO-001",
      description: "[Demo Product Specifications] Premium 180 GSM 100% ring-spun combed cotton crewneck t-shirt with reinforced double-needle ribbed collar and shoulder-to-shoulder taping. Designed for international private-label apparel brands.",
      fabricDetails: "180 GSM 100% Combed Cotton Single Jersey (Silicone Soft-Washed)",
      sizes: JSON.stringify(["XS", "S", "M", "L", "XL", "2XL", "3XL"]),
      colors: JSON.stringify(["Jet Black", "Heather Navy", "Optic White", "Desert Sand", "Olive Green"]),
      availability: "IN_PRODUCTION",
      minOrderQuantity: "500 pcs [Demo MOQ]",
      isFeatured: true,
      isDemo: true,
      categorySlug: "knitwear",
      images: [
        {
          url: "/images/cat-knitwear.jpg",
          alt: "Men's Classic Combed Cotton Crewneck T-Shirt",
          isPrimary: true,
        },
        {
          url: "/images/prod-tshirt-black.jpg",
          alt: "Crewneck T-Shirt Black Variation",
          isPrimary: false,
        },
      ],
    },
    {
      name: "[Demo Product] Heavyweight French Terry Pullover Hoodie",
      slug: "demo-heavyweight-french-terry-hoodie",
      sku: "ALM-DEMO-002",
      description: "[Demo Product Specifications] 380 GSM 80% cotton / 20% polyester unbrushed French terry hoodie. Features 3-panel double-layer hood, heavy rib cuffs and hem, and kangaroo pouch with bartack reinforcement.",
      fabricDetails: "380 GSM 80/20 Cotton/Polyester French Terry",
      sizes: JSON.stringify(["S", "M", "L", "XL", "2XL"]),
      colors: JSON.stringify(["Charcoal Melange", "Deep Navy", "Earth Brown", "Vintage Heather Grey"]),
      availability: "MADE_TO_ORDER",
      minOrderQuantity: "300 pcs [Demo MOQ]",
      isFeatured: true,
      isDemo: true,
      categorySlug: "fleece-hoodies",
      images: [
        {
          url: "/images/intro-knitwear.jpg",
          alt: "Heavyweight French Terry Pullover",
          isPrimary: true,
        },
      ],
    },
    {
      name: "[Demo Product] Pique Cotton CVC Corporate Polo Shirt",
      slug: "demo-pique-corporate-polo",
      sku: "ALM-DEMO-003",
      description: "[Demo Product Specifications] 220 GSM 60/40 CVC pique polo with knitted collar and cuffs, 3-button placket, and side vents with twill tape reinforcement.",
      fabricDetails: "220 GSM 60% Cotton / 40% Polyester Micro-Pique",
      sizes: JSON.stringify(["S", "M", "L", "XL", "2XL", "3XL"]),
      colors: JSON.stringify(["Royal Blue", "Forest Green", "Burgundy", "White", "Slate Grey"]),
      availability: "SAMPLE_AVAILABLE",
      minOrderQuantity: "500 pcs [Demo MOQ]",
      isFeatured: true,
      isDemo: true,
      categorySlug: "polo-shirts",
      images: [
        {
          url: "/images/cat-polo.jpg",
          alt: "Pique Cotton Corporate Polo Shirt",
          isPrimary: true,
        },
      ],
    },
    {
      name: "[Demo Product] Industrial Twill Utility Cargo Trouser",
      slug: "demo-industrial-twill-cargo-trouser",
      sku: "ALM-DEMO-004",
      description: "[Demo Product Specifications] Heavyweight 240 GSM 100% cotton twill cargo trousers engineered with multi-pocket configuration, triple-stitched seams, and reinforced knee patches.",
      fabricDetails: "240 GSM 100% Cotton Drill / Twill",
      sizes: JSON.stringify(["30", "32", "34", "36", "38", "40"]),
      colors: JSON.stringify(["Khaki", "Navy Blue", "Dark Olive", "Black"]),
      availability: "MADE_TO_ORDER",
      minOrderQuantity: "500 pcs [Demo MOQ]",
      isFeatured: false,
      isDemo: true,
      categorySlug: "denim-trousers",
      images: [
        {
          url: "/images/cat-trousers.jpg",
          alt: "Industrial Twill Cargo Trouser",
          isPrimary: true,
        },
      ],
    },
    {
      name: "[Demo Product] Performance Dry-Fit Raglan Athletic Tee",
      slug: "demo-dryfit-raglan-athletic-tee",
      sku: "ALM-DEMO-005",
      description: "[Demo Product Specifications] 150 GSM 100% micro-polyester interlock with moisture-wicking and anti-microbial finish. Flatlock ergonomic seams to prevent chafing during high exertion.",
      fabricDetails: "150 GSM 100% Polyester Micro-Mesh Interlock",
      sizes: JSON.stringify(["S", "M", "L", "XL", "2XL"]),
      colors: JSON.stringify(["Electric Blue", "Neon Lime", "Stealth Grey", "Pure Black"]),
      availability: "IN_PRODUCTION",
      minOrderQuantity: "1000 pcs [Demo MOQ]",
      isFeatured: true,
      isDemo: true,
      categorySlug: "activewear",
      images: [
        {
          url: "/images/cat-activewear.jpg",
          alt: "Dry-Fit Raglan Athletic Tee",
          isPrimary: true,
        },
      ],
    },
    {
      name: "[Demo Product] Classic Oxford Cotton Button-Down Shirt",
      slug: "demo-classic-oxford-cotton-shirt",
      sku: "ALM-DEMO-006",
      description: "[Demo Product Specifications] 160 GSM 100% yarn-dyed Oxford weave cotton button-down shirt. Features curved hem, box pleat with locker loop, and mother-of-pearl imitation buttons.",
      fabricDetails: "160 GSM 100% Combed Cotton Yarn-Dyed Oxford Weave",
      sizes: JSON.stringify(["S", "M", "L", "XL", "2XL"]),
      colors: JSON.stringify(["Sky Blue", "White", "Pink", "Navy Stripe"]),
      availability: "SAMPLE_AVAILABLE",
      minOrderQuantity: "400 pcs [Demo MOQ]",
      isFeatured: false,
      isDemo: true,
      categorySlug: "woven-workwear",
      images: [
        {
          url: "/images/cat-woven.jpg",
          alt: "Classic Oxford Button-Down Shirt",
          isPrimary: true,
        },
      ],
    },
    {
      name: "[Demo Product] Midweight Fleece Jogger Sweatpants",
      slug: "demo-midweight-fleece-jogger",
      sku: "ALM-DEMO-007",
      description: "[Demo Product Specifications] 320 GSM 70/30 cotton/poly brushed fleece jogger with elasticated waistband, braided drawcord, side seam pockets, and ribbed ankle cuffs.",
      fabricDetails: "320 GSM Cotton/Poly Brushed Fleece",
      sizes: JSON.stringify(["S", "M", "L", "XL", "2XL"]),
      colors: JSON.stringify(["Black", "Heather Grey", "Navy", "Charcoal"]),
      availability: "IN_PRODUCTION",
      minOrderQuantity: "500 pcs [Demo MOQ]",
      isFeatured: false,
      isDemo: true,
      categorySlug: "fleece-hoodies",
      images: [
        {
          url: "/images/prod-jogger.jpg",
          alt: "Fleece Jogger Sweatpants",
          isPrimary: true,
        },
      ],
    },
    {
      name: "[Demo Product] High-Impact Seamless Compression Legging",
      slug: "demo-seamless-compression-legging",
      sku: "ALM-DEMO-008",
      description: "[Demo Product Specifications] 280 GSM 75/25 nylon-spandex high-waist athletic leggings with squat-proof 4-way stretch and moisture-wicking finish.",
      fabricDetails: "280 GSM 75% Nylon / 25% Spandex Interlock Knit",
      sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
      colors: JSON.stringify(["Midnight Plum", "Onyx Black", "Teal Blue", "Sage Green"]),
      availability: "MADE_TO_ORDER",
      minOrderQuantity: "600 pcs [Demo MOQ]",
      isFeatured: false,
      isDemo: true,
      categorySlug: "activewear",
      images: [
        {
          url: "/images/prod-legging.jpg",
          alt: "Seamless Compression Legging",
          isPrimary: true,
        },
      ],
    },
  ];

  const createdProducts = [];
  for (const item of demoProducts) {
    const { categorySlug, images, ...pData } = item;
    const catId = categoriesMap[categorySlug];
    if (!catId) continue;

    const p = await prisma.product.create({
      data: {
        ...pData,
        categoryId: catId,
        images: {
          create: images,
        },
      },
    });
    createdProducts.push(p);
  }
  console.log(`✅ Created ${createdProducts.length} demo products with image specs`);

  // 5. Create Sample Inquiries
  await prisma.inquiry.create({
    data: {
      name: "John Miller",
      email: "jmiller@apexretailbrands.example.com",
      phone: "+1 (555) 234-5678",
      company: "Apex Retail Brands LLC [Demo Client]",
      inquiryType: "BULK_ORDER",
      message: "[Demo Inquiry Message] We are seeking a reliable manufacturer for 10,000 units of combed cotton crewneck t-shirts per quarter. Please provide lead times and export quotation for Karachi FOB port dispatch.",
      status: "NEW",
      productId: createdProducts[0]?.id,
      adminNotes: "Received via website demo inquiry portal. Requires costing sheet breakdown.",
    },
  });

  await prisma.inquiry.create({
    data: {
      name: "Sarah Jenkins",
      email: "s.jenkins@nordicactive.example.eu",
      phone: "+44 20 7946 0912",
      company: "Nordic Activewear AS [Demo Client]",
      inquiryType: "SAMPLE_REQUEST",
      message: "[Demo Inquiry Message] Interested in sample swatches and prototype samples for the high-impact compression leggings in Onyx Black and Teal Blue.",
      status: "IN_REVIEW",
      productId: createdProducts[7]?.id,
      adminNotes: "Sample department reviewing yarn stock availability.",
    },
  });

  await prisma.inquiry.create({
    data: {
      name: "Tariq Mahmood",
      email: "tariq@textiledistributors.com.pk",
      phone: "+92 300 1234567",
      company: "Karachi Corporate Attire [Demo Client]",
      inquiryType: "CUSTOM_MANUFACTURING",
      message: "[Demo Inquiry Message] Looking for custom corporate embroidery on 1,200 pique polo shirts for industrial workforce uniforms.",
      status: "QUOTED",
      productId: createdProducts[2]?.id,
      adminNotes: "Sent initial quotation estimate via email.",
    },
  });

  console.log(`✅ Created demo customer inquiries`);
  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
