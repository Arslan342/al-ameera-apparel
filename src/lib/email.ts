import nodemailer from "nodemailer";

export interface EmailSendResult {
  sent: boolean;
  reason?: string;
  messageId?: string;
}

interface InquiryEmailData {
  referenceNo: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  country?: string | null;
  inquiryType: string;
  message: string;
  requestedQuantity?: string | null;
  productName?: string | null;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Send inquiry confirmation to customer
 */
export async function sendCustomerInquiryConfirmation(
  data: InquiryEmailData
): Promise<EmailSendResult> {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || `"Al-Ameera Apparel" <no-reply@al-ameera.pk>`;

  if (!transporter) {
    console.info(
      `[Email Service Notice] SMTP not configured. Customer confirmation for RFQ ${data.referenceNo} was recorded in DB but email skipped.`
    );
    return { sent: false, reason: "SMTP_NOT_CONFIGURED" };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to: data.email,
      subject: `Quotation Inquiry Confirmation — Ref: ${data.referenceNo} | Al-Ameera Apparel`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 1px; text-transform: uppercase;">Al-Ameera Apparel (Pvt.) Ltd.</h1>
            <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px;">Karachi Garment Manufacturing Facility • Pakistan</p>
          </div>

          <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 12px;">Thank you for your inquiry, ${data.name}.</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            We have received your quotation request. Our production and export merchandising desk at our Korangi Industrial Area facility will review your requirements and respond promptly.
          </p>

          <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <div style="font-size: 13px; font-weight: bold; color: #1d4ed8; text-transform: uppercase; margin-bottom: 12px;">
              Quotation Reference: ${data.referenceNo}
            </div>
            <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 140px;">Inquiry Type:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${data.inquiryType}</td>
              </tr>
              ${data.productName ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Target Product:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${data.productName}</td>
              </tr>` : ""}
              ${data.requestedQuantity ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Requested Quantity:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${data.requestedQuantity}</td>
              </tr>` : ""}
              ${data.company ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Company:</td>
                <td style="padding: 6px 0; color: #0f172a;">${data.company}</td>
              </tr>` : ""}
            </table>
          </div>

          <div style="background-color: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 12px; color: #475569; margin-top: 24px;">
            <strong>Factory Coordinates:</strong> Plot 27, Mehran Town Sector 23, Korangi Industrial Area, Karachi, 74900, Pakistan.<br />
            <strong>Official Inquiries:</strong> inquiry@al-ameera.pk
          </div>
        </div>
      `,
    });

    return { sent: true, messageId: info.messageId };
  } catch (err: unknown) {
    console.error("Failed to send customer confirmation email:", err);
    return { sent: false, reason: err instanceof Error ? err.message : "SMTP_SEND_FAILED" };
  }
}

/**
 * Send alert to factory administration
 */
export async function sendAdminInquiryNotification(
  data: InquiryEmailData
): Promise<EmailSendResult> {
  const transporter = getTransporter();
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER;
  const from = process.env.SMTP_FROM || `"Al-Ameera Apparel" <no-reply@al-ameera.pk>`;

  if (!transporter || !adminEmail) {
    console.info(
      `[Email Service Notice] SMTP not configured. Admin alert for RFQ ${data.referenceNo} recorded in DB but email skipped.`
    );
    return { sent: false, reason: "SMTP_NOT_CONFIGURED" };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to: adminEmail,
      subject: `🚨 New B2B RFQ Received [${data.referenceNo}] — ${data.company || data.name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0f172a;">New Quotation Request Received</h2>
          <p><strong>Ref:</strong> ${data.referenceNo}</p>
          <p><strong>Buyer Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
          <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
          <p><strong>Country:</strong> ${data.country || "Not provided"}</p>
          <p><strong>Quantity:</strong> ${data.requestedQuantity || "Not specified"}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f1f5f9; padding: 12px; border-left: 4px solid #2563eb;">
            ${data.message.replace(/\n/g, "<br />")}
          </blockquote>
          <p style="margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/inquiries" style="background: #1d4ed8; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
              View in Admin Dashboard
            </a>
          </p>
        </div>
      `,
    });

    return { sent: true, messageId: info.messageId };
  } catch (err: unknown) {
    console.error("Failed to send admin notification email:", err);
    return { sent: false, reason: err instanceof Error ? err.message : "SMTP_SEND_FAILED" };
  }
}
