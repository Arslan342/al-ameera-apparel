import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function setupAdmin() {
  const email = (process.env.INITIAL_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.INITIAL_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "";
  const name = (process.env.INITIAL_ADMIN_NAME || process.env.ADMIN_NAME || "Corporate Administrator").trim();

  if (!email || !password) {
    console.error("❌ Error: INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD environment variables are required.");
    console.error("Usage: INITIAL_ADMIN_EMAIL=admin@example.com INITIAL_ADMIN_PASSWORD=YourSecurePassword123! npx tsx scripts/setup-admin.ts");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌ Error: Password must be at least 8 characters long.");
    process.exit(1);
  }

  console.log(`Setting up initial administrator account for: ${email}...`);

  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.admin.findUnique({
    where: { email },
  });

  if (existing) {
    await prisma.admin.update({
      where: { email },
      data: {
        passwordHash,
        name,
        role: "SUPERADMIN",
      },
    });
    console.log(`✅ Administrator ${email} updated successfully.`);
  } else {
    await prisma.admin.create({
      data: {
        email,
        passwordHash,
        name,
        role: "SUPERADMIN",
      },
    });
    console.log(`✅ New Superadmin account created for ${email}.`);
  }
}

setupAdmin()
  .catch((e) => {
    console.error("Failed to setup admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
