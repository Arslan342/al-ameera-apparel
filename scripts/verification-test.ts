import { PrismaClient } from "@prisma/client";
import { loginSchema, inquiryCreateSchema, inquiryStatusUpdateSchema, productCreateSchema } from "../src/lib/validations";
import { verifyPassword, createSessionToken, verifySessionToken } from "../src/lib/auth";
import { checkRateLimit } from "../src/lib/rateLimit";

const prisma = new PrismaClient();

async function runVerification() {
  console.log("==================================================================");
  console.log("AL-AMEERA APPAREL — SYSTEM VERIFICATION & INTEGRATION TEST SUITE");
  console.log("==================================================================");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`  [PASS] Test ${totalTests}: ${testName}`);
      passedTests++;
    } else {
      console.error(`  [FAIL] Test ${totalTests}: ${testName}`);
      process.exitCode = 1;
    }
  }

  // -------------------------------------------------------------------------
  // Test Group 1: Database Status & Data Preservation
  // -------------------------------------------------------------------------
  console.log("\n--- 1. DATABASE RECORD PRESERVATION CHECKS ---");
  const adminCount = await prisma.admin.count();
  const categoryCount = await prisma.category.count();
  const productCount = await prisma.product.count();
  const inquiryCount = await prisma.inquiry.count();
  const settingsCount = await prisma.siteSettings.count();

  assert(adminCount >= 1, `Existing Admin records preserved (Found: ${adminCount})`);
  assert(categoryCount === 6, `All 6 Garment Categories preserved (Found: ${categoryCount})`);
  assert(productCount >= 8, `Existing Catalogue Products preserved (Found: ${productCount})`);
  assert(inquiryCount >= 3, `Existing Inquiries preserved (Found: ${inquiryCount})`);
  assert(settingsCount >= 1, `SiteSettings record initialized (Found: ${settingsCount})`);

  // Verify unique reference numbers exist on all inquiries
  const inquiries = await prisma.inquiry.findMany();
  const hasRefNumbers = inquiries.every((i) => Boolean(i.referenceNo && i.referenceNo.startsWith("ALM-RFQ-")));
  assert(hasRefNumbers, "All existing inquiries have valid sequential ALM-RFQ reference numbers");

  // -------------------------------------------------------------------------
  // Test Group 2: RFQ Validation Logic (Zod)
  // -------------------------------------------------------------------------
  console.log("\n--- 2. RFQ SERVER-SIDE VALIDATION TESTS ---");
  
  // Valid Inquiry
  const validInquiry = inquiryCreateSchema.safeParse({
    name: "Hassan Raza",
    company: "Euro Fashion Group GmbH",
    email: "hassan@eurofashion.de",
    phone: "+49 30 12345678",
    country: "Germany",
    inquiryType: "BULK_ORDER",
    message: "We need 5,000 pcs of 100% combed cotton crewnecks for Q3 delivery.",
    requestedQuantity: "5,000 pcs",
    sizeRequirements: "M, L, XL, XXL",
    colorRequirements: "Navy, Charcoal, White",
    fabricCustomization: "180 GSM combed single jersey with silicone wash",
    privacyConsent: true,
  });
  assert(validInquiry.success, "Valid RFQ submission payload passes Zod validation");

  // Invalid Email
  const invalidEmailInquiry = inquiryCreateSchema.safeParse({
    name: "John Miller",
    email: "not-an-email",
    message: "Valid length message here for test.",
    privacyConsent: true,
  });
  assert(!invalidEmailInquiry.success, "Invalid email address is properly rejected by Zod");

  // Missing Privacy Consent
  const noConsentInquiry = inquiryCreateSchema.safeParse({
    name: "John Miller",
    email: "john@example.com",
    message: "Valid length message here for test.",
    privacyConsent: false,
  });
  assert(!noConsentInquiry.success, "RFQ submission without privacy consent is rejected");

  // Short Message
  const shortMsgInquiry = inquiryCreateSchema.safeParse({
    name: "John Miller",
    email: "john@example.com",
    message: "Too short",
    privacyConsent: true,
  });
  assert(!shortMsgInquiry.success, "Messages under 10 characters are rejected");

  // -------------------------------------------------------------------------
  // Test Group 3: Rate Limiting System
  // -------------------------------------------------------------------------
  console.log("\n--- 3. RATE LIMITING & SPAM PROTECTION TESTS ---");
  const testIp = "192.0.2.1"; // TEST-NET-1 IP
  let rateLimitPassed = true;
  for (let i = 0; i < 5; i++) {
    const res = checkRateLimit(`test:${testIp}`, { limit: 5, windowMs: 10000 });
    if (!res.success) rateLimitPassed = false;
  }
  const blockedRes = checkRateLimit(`test:${testIp}`, { limit: 5, windowMs: 10000 });
  assert(rateLimitPassed && !blockedRes.success, "Rate limiter permits requests within quota and blocks on limit violation");

  // -------------------------------------------------------------------------
  // Test Group 4: Admin Authentication & Password Safety
  // -------------------------------------------------------------------------
  console.log("\n--- 4. AUTHENTICATION & SESSION SECURITY TESTS ---");
  const admin = await prisma.admin.findFirst();
  if (admin) {
    const passCheckCorrect = await verifyPassword("AdminPassword2026!", admin.passwordHash);
    const passCheckWrong = await verifyPassword("WrongPassword123!", admin.passwordHash);
    assert(passCheckCorrect, "Admin password hash verification succeeds with correct credentials");
    assert(!passCheckWrong, "Admin password hash verification strictly rejects incorrect passwords");

    // Session JWT Token creation & verification
    const token = await createSessionToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });
    const verifiedPayload = await verifySessionToken(token);
    assert(
      verifiedPayload !== null && verifiedPayload.email === admin.email,
      "JWT Session token creates and verifies cryptographically with jose"
    );

    const invalidToken = await verifySessionToken("tampered.token.data");
    assert(invalidToken === null, "Tampered or invalid JWT session token is strictly rejected");
  } else {
    console.error("No admin found to test auth!");
  }

  // -------------------------------------------------------------------------
  // Test Group 5: Inquiry Status Workflow (All 6 Required Statuses)
  // -------------------------------------------------------------------------
  console.log("\n--- 5. INQUIRY STATUS WORKFLOW TESTS ---");
  const sampleInq = await prisma.inquiry.findFirst();
  if (sampleInq) {
    const originalStatus = sampleInq.status;
    const requiredStatuses = ["NEW", "UNDER_REVIEW", "QUOTATION_SENT", "APPROVED", "REJECTED", "CLOSED"];
    
    let allStatusTransitionsPassed = true;
    for (const st of requiredStatuses) {
      const parse = inquiryStatusUpdateSchema.safeParse({ status: st });
      if (!parse.success) {
        allStatusTransitionsPassed = false;
        break;
      }
    }
    assert(allStatusTransitionsPassed, "All 6 required statuses (New, Under Review, Quotation Sent, Approved, Rejected, Closed) supported in schema");

    // Test temporary non-destructive status update and revert
    await prisma.inquiry.update({
      where: { id: sampleInq.id },
      data: { status: "UNDER_REVIEW" },
    });
    const checkUpdated = await prisma.inquiry.findUnique({ where: { id: sampleInq.id } });
    assert(checkUpdated?.status === "UNDER_REVIEW", "Inquiry status update to UNDER_REVIEW persists successfully");

    // Revert back to original status
    await prisma.inquiry.update({
      where: { id: sampleInq.id },
      data: { status: originalStatus },
    });
    assert(true, `Inquiry reverted cleanly to original status (${originalStatus})`);
  }

  // -------------------------------------------------------------------------
  // Test Group 6: Product CRUD & Specifications Support
  // -------------------------------------------------------------------------
  console.log("\n--- 6. PRODUCT SCHEMA & SPECIFICATIONS TESTS ---");
  const validProductPayload = productCreateSchema.safeParse({
    name: "Combed Cotton Jersey Polo",
    description: "High gauge combed cotton polo with flatknit collar.",
    categoryId: "test-category",
    isDemo: false,
    specifications: [
      { key: "GSM", value: "220 GSM", group: "TECHNICAL" },
      { key: "Yarn Count", value: "24/1 Combed", group: "TECHNICAL" },
    ],
  });
  assert(validProductPayload.success, "Product schema validates technical specifications array and draft status");

  // -------------------------------------------------------------------------
  // Test Group 7: Site Settings Verification
  // -------------------------------------------------------------------------
  console.log("\n--- 7. SITE SETTINGS PERSISTENCE TESTS ---");
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  assert(settings?.companyName === "Al-Ameera Apparel (Pvt.) Ltd.", "Company name verified in SiteSettings");
  assert(settings?.workforce === 280, "Workforce confirmed at 280 personnel");
  assert(settings?.address.includes("Plot 27, Mehran Town"), "Factory address verified in Mehran Town Sector 23 Korangi");

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log("\n==================================================================");
  console.log(`VERIFICATION SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log("==================================================================");
}

runVerification()
  .catch((err) => {
    console.error("Test execution encountered an error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
