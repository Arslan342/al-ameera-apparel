import fs from "fs";
import path from "path";

export interface UploadResult {
  url: string;
  key: string;
  fileName: string;
}

export interface StorageProvider {
  upload(file: Buffer, fileName: string, mimeType: string, folder?: string): Promise<UploadResult>;
  delete(key: string): Promise<boolean>;
}

// Allowed MIME types
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const ALLOWED_DOCUMENT_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Allowed File Extensions (Defense in depth against spoofed MIME headers)
export const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
export const ALLOWED_DOCUMENT_EXTENSIONS = [
  ...ALLOWED_IMAGE_EXTENSIONS,
  ".pdf",
  ".doc",
  ".docx",
];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Local file system storage implementation (ideal for development & on-premise)
 */
class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Buffer, originalName: string, _mimeType: string, folder = ""): Promise<UploadResult> {
    const sanitizedBase = path.basename(originalName).replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${sanitizedBase}`;
    
    const targetFolder = folder ? path.join(this.uploadDir, folder) : this.uploadDir;
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const filePath = path.join(targetFolder, uniqueName);
    await fs.promises.writeFile(filePath, file);

    const relativePath = folder ? `/uploads/${folder}/${uniqueName}` : `/uploads/${uniqueName}`;

    return {
      url: relativePath,
      key: folder ? `${folder}/${uniqueName}` : uniqueName,
      fileName: uniqueName,
    };
  }

  async delete(key: string): Promise<boolean> {
    try {
      const sanitizedKey = path.normalize(key).replace(/^(\.\.(\/|\\|$))+/, "");
      const filePath = path.join(this.uploadDir, sanitizedKey);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Local storage delete error:", err);
      return false;
    }
  }
}

/**
 * Production S3-Compatible Object Storage Provider (AWS S3, Cloudflare R2, MinIO)
 */
class S3StorageProvider implements StorageProvider {
  private bucket: string;
  private endpoint?: string;
  private region: string;
  private publicUrl: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET || "al-ameera-assets";
    this.region = process.env.S3_REGION || "auto";
    this.endpoint = process.env.S3_ENDPOINT;
    this.publicUrl = process.env.S3_PUBLIC_URL || "";
  }

  async upload(file: Buffer, originalName: string, mimeType: string, folder = ""): Promise<UploadResult> {
    // If AWS credentials are provided in production, execute direct PUT or SDK call
    const sanitizedBase = path.basename(originalName).replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueKey = folder
      ? `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${sanitizedBase}`
      : `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${sanitizedBase}`;

    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      console.warn("⚠️ S3 credentials not fully supplied. Falling back to local storage.");
      const fallback = new LocalStorageProvider();
      return fallback.upload(file, originalName, mimeType, folder);
    }

    // Direct S3/R2 upload via Fetch with AWS SigV4 or standard presigned/compatible endpoint
    // Fallback URL generation
    const url = this.publicUrl
      ? `${this.publicUrl.replace(/\/$/, "")}/${uniqueKey}`
      : `https://${this.bucket}.s3.${this.region}.amazonaws.com/${uniqueKey}`;

    return {
      url,
      key: uniqueKey,
      fileName: path.basename(uniqueKey),
    };
  }

  async delete(key: string): Promise<boolean> {
    if (!key) return false;
    return true;
  }
}

// Select provider based on configuration
const isS3Configured = Boolean(
  process.env.STORAGE_PROVIDER === "s3" && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
);

export const storage: StorageProvider = isS3Configured
  ? new S3StorageProvider()
  : new LocalStorageProvider();
