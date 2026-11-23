import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const inquiryItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  requestedQuantity: z.number().int().positive().optional().nullable(),
  size: z.string().max(50).optional().nullable(),
  color: z.string().max(50).optional().nullable(),
  specifications: z.string().max(1000).optional().nullable(),
});

export const inquiryCreateSchema = z.object({
  name: z.string().trim().min(2, "Buyer name must be at least 2 characters."),
  company: z.string().trim().max(150).optional().nullable(),
  email: z.string().trim().email("Please provide a valid business email address."),
  phone: z.string().trim().max(50).optional().nullable(),
  country: z.string().trim().max(100).optional().nullable(),
  inquiryType: z.enum([
    "BULK_ORDER",
    "SAMPLE_REQUEST",
    "CUSTOM_MANUFACTURING",
    "GENERAL",
  ]).default("BULK_ORDER"),
  message: z.string().trim().min(10, "Message must be at least 10 characters long."),
  requestedQuantity: z.string().trim().max(100).optional().nullable(),
  sizeRequirements: z.string().trim().max(250).optional().nullable(),
  colorRequirements: z.string().trim().max(250).optional().nullable(),
  fabricCustomization: z.string().trim().max(500).optional().nullable(),
  attachmentUrl: z.string().trim().max(1000).optional().nullable(),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "You must accept the privacy policy to proceed.",
  }),
  productId: z.string().optional().nullable(),
  items: z.array(inquiryItemSchema).optional(),
});

export const inquiryStatusUpdateSchema = z.object({
  status: z.enum([
    "NEW",
    "UNDER_REVIEW",
    "QUOTATION_SENT",
    "APPROVED",
    "REJECTED",
    "CLOSED",
  ]).optional(),
  adminNotes: z.string().max(2000).optional().nullable(),
});

export const productCreateSchema = z.object({
  name: z.string().trim().min(2, "Product name is required."),
  slug: z.string().trim().optional(),
  sku: z.string().trim().max(50).optional().nullable(),
  description: z.string().trim().min(5, "Product description is required."),
  fabricDetails: z.string().trim().max(500).optional().nullable(),
  sizes: z.union([z.string(), z.array(z.string())]).optional(),
  colors: z.union([z.string(), z.array(z.string())]).optional(),
  availability: z.enum(["IN_PRODUCTION", "MADE_TO_ORDER", "SAMPLE_AVAILABLE"]).default("MADE_TO_ORDER"),
  minOrderQuantity: z.string().trim().max(100).optional().nullable(),
  isFeatured: z.boolean().default(false),
  isDemo: z.boolean().default(false),
  categoryId: z.string().min(1, "Category is required."),
  imageUrl: z.string().trim().optional().nullable(),
  specifications: z
    .array(
      z.object({
        key: z.string().trim().min(1, "Specification key required"),
        value: z.string().trim().min(1, "Specification value required"),
        group: z.string().trim().default("GENERAL"),
      })
    )
    .optional(),
});

export const categoryCreateSchema = z.object({
  name: z.string().trim().min(2, "Category name is required."),
  slug: z.string().trim().optional(),
  description: z.string().trim().max(1000).optional().nullable(),
  image: z.string().trim().optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
});
