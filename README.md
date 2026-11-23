# Al-Ameera Apparel (Pvt.) Ltd.
### B2B Garment Manufacturing Corporate Platform & Digital Catalogue

Official B2B website and Request for Quotation (RFQ) management platform for **Al-Ameera Apparel (Pvt.) Ltd.**, an apparel and garment manufacturing company operating in Korangi Industrial Area, Karachi, Pakistan.

---

## 1. Company Information

- **Company Name:** Al-Ameera Apparel (Pvt.) Ltd.
- **Industry:** Apparel and Garment Manufacturing
- **Workforce:** 280 Skilled Personnel
- **Facility Address:** Plot 27, Mehran Town, Sector 23, Korangi Industrial Area, Karachi, 74900, Pakistan
- **Business Model:** B2B Product Catalogue + Request for Quotation (RFQ)
- **Primary Export Coordinates:** Direct arterial access to Port Qasim (~25 km) and Karachi Port Trust (KPT, ~22 km)

---

## 2. Technology Stack & Architecture

- **Framework:** Next.js (App Router, Turbopack)
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** Tailwind CSS
- **Database & ORM:** Prisma ORM with SQLite for local development (`dev.db`), compatible with PostgreSQL for production
- **Authentication & Sessions:** Cryptographic password hashing via `bcryptjs` and stateless JWT session cookies via `jose`
- **Validation:** Zod schemas for all API payloads and forms
- **Icons:** Lucide React icons
- **Brand Assets:** Scalable SVG vector identity (`/public/brand/`)

---

## 3. Core Features

### Public Website
1. **Home (`/`)**: Corporate positioning, verified company facts (280 workforce, Korangi Industrial Area), core garment collections preview, manufacturing overview, and RFQ calls-to-action.
2. **About Us (`/about`)**: Company narrative, workforce structure across cutting, stitching assembly, quality control, and finishing, facility factsheet, and logistics coordinates.
3. **Manufacturing (`/manufacturing`)**: 6-stage apparel conversion workflow (tech pack review, fabric inspection, marker planning, multi-line assembly, 100% metal/needle detection, export packaging), and client inspection policies.
4. **Product Catalogue (`/products`)**: Filterable garment range by category, search by name/GSM/fabric/SKU, production availability tags, and transparent capability specimen badges.
5. **Product Details (`/products/[id]`)**: Full gallery switcher, technical garment specifications, available size matrix, colorway options, production MOQ, and direct quotation linking.
6. **Contact & Commercial RFQ (`/contact`)**: B2B quotation request form with multi-product selection support, target quantities, sizes, colors, fabric customization notes, reference document upload (tech packs), and automated tracking reference generation.
7. **Corporate Factsheet (`/profile`)**: Printable company datasheet with verified legal details, logistics proximity, and departmental organizational overview.

### Secure Admin Management Portal (`/admin`)
1. **Dashboard (`/admin/dashboard`)**: Live operational metrics computed directly from database records (total products, categories, active inquiries, new RFQs).
2. **Product Management (`/admin/products`)**: Search, filter, add, edit, and delete products with visibility and draft/verified status control.
3. **Product Specifications Builder (`/admin/products/new`, `/admin/products/[id]/edit`)**: Dynamic key-value technical specifications builder (GSM, Weave Type, Yarn Count, Shrinkage, Care Instructions), image uploader/selector, and size/color matrix manager.
4. **Category Manager (`/admin/categories`)**: Add, edit, reorder, or delete garment divisions.
5. **Customer Inquiries & RFQs (`/admin/inquiries`)**: Comprehensive inquiry manager with search, status workflow (`NEW`, `UNDER_REVIEW`, `QUOTATION_SENT`, `APPROVED`, `REJECTED`, `CLOSED`), multi-product review, reference document download, and internal costing notes.
6. **Website Settings Management (`/admin/settings`)**: Live management of corporate details, address, workforce count, contact email, phone, and operating schedule.

---

## 4. Local Development Setup

### Prerequisites
- Node.js 18.17+ or 20+
- npm

### Installation Steps

1. **Clone or enter the project directory:**
   ```bash
   cd d:\al-ameera-portfolio
   ```

2. **Configure Environment Variables:**
   Create `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Initialize Database:**
   ```bash
   npx prisma db push
   ```

5. **Provision Initial Administrator Account:**
   ```bash
   npm run admin:setup
   ```
   *To customize the admin credentials, set `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD` in your environment or `.env` file before running the script.*

6. **Start the Development Server:**
   ```bash
   npm run dev
   ```

7. **Access the Application:**
   - Public Website: [http://localhost:3000](http://localhost:3000)
   - Admin Management Portal: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 5. Administration & Provisioning

To set up or update the initial administrative account safely without exposing passwords:

```bash
INITIAL_ADMIN_EMAIL="admin@al-ameera.pk" INITIAL_ADMIN_PASSWORD="YourSecurePassword123!" npm run admin:setup
```

The admin setup script:
- Enforces an 8-character minimum password length.
- Hashes passwords using bcrypt with 12 salt rounds.
- Upserts the admin record as `SUPERADMIN` role.
- Never logs sensitive credentials to disk.

---

## 6. Email & Storage Configuration

### Transactional Email (SMTP)
Configured in `.env`:
```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT=587
SMTP_USER="postmaster@your-domain.com"
SMTP_PASS="your-smtp-password"
SMTP_FROM="\"Al-Ameera Apparel\" <inquiry@al-ameera.pk>"
ADMIN_NOTIFICATION_EMAIL="merchandising@al-ameera.pk"
```
*Note: If SMTP credentials are omitted, inquiries and attachments are safely recorded in the SQLite database and email dispatch is gracefully skipped without breaking the user experience or reporting false success.*

### File & Object Storage
- **Local Storage (Default):** Uploads are stored in `public/uploads/` and organized into `inquiries/` and `products/` subdirectories with sanitized filenames.
- **S3 / Cloudflare R2 / MinIO:** Set `STORAGE_PROVIDER="s3"` and provide `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, and optional `S3_ENDPOINT` in `.env`.

---

## 7. Production Deployment & Database Migration

To deploy to production (Vercel, AWS, Railway, Docker):

1. **Switch Database to PostgreSQL:**
   In `prisma/schema.prisma`, update the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. **Apply Migrations:**
   ```bash
   npx prisma migrate deploy
   ```
3. **Build the Production Bundle:**
   ```bash
   npm run build
   ```
4. **Start the Production Service:**
   ```bash
   npm run start
   ```

---

## 8. Verification & Test Suite

Run the following commands to verify code quality and production readiness:

```bash
# 1. TypeScript Compiler Check
npx tsc --noEmit

# 2. ESLint Static Analysis
npm run lint

# 3. Production Build Compilation
npm run build
```

---

## 9. Brand Assets Directory

The official concept vector assets are stored under `public/brand/`:
- `brandmark-light.svg`: Standalone AA monogram for light backgrounds.
- `brandmark-dark.svg`: Standalone AA monogram for dark backgrounds.
- `logo-horizontal-light.svg`: Primary horizontal logo with company typography.
- `logo-horizontal-dark.svg`: Primary horizontal logo for dark surfaces.
- `favicon.svg`: High-contrast app icon and browser favicon.
- Component integration: `src/components/common/Logo.tsx`
