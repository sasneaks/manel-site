import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getClientIp, checkRateLimit, validateEmail } from "@/lib/rate-limit";

/* ─── helpers ─── */

function sanitize(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ─── route ─── */

export async function POST(request: Request) {
  try {
    // ── Rate limiting ──
    const ip = getClientIp(request);
    const rateLimitResponse = checkRateLimit(ip);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();

    // ── Sanitize inputs ──
    const name = sanitize(body.name, 100);
    const email = sanitize(body.email, 254);
    const message = sanitize(body.message, 5000);

    // ── Validate required fields ──
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Le nom est requis." },
        { status: 400 }
      );
    }
    if (!email) {
      return NextResponse.json(
        { success: false, error: "L'email est requis." },
        { status: 400 }
      );
    }
    const emailError = validateEmail(email);
    if (emailError) return emailError;
    if (!message) {
      return NextResponse.json(
        { success: false, error: "Le message est requis." },
        { status: 400 }
      );
    }

    // ── Escape for HTML ──
    const eName = escapeHtml(name);
    const eEmail = escapeHtml(email);
    const eMessage = escapeHtml(message);

    // ── Build email HTML ──
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#F9F3F6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F3F6;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;font-family:'Helvetica Neue',Arial,sans-serif;">

        <!-- Header -->
        <tr><td style="background:#CFA4B8;border-radius:16px 16px 0 0;padding:28px 40px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">Nouveau message</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">via le formulaire de contact</p>
        </td></tr>

        <!-- Contact info -->
        <tr><td style="background:#fff;padding:32px 40px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;color:#333;">
            <tr>
              <td style="padding:8px 0;width:100px;font-weight:600;color:#555;">Nom</td>
              <td style="padding:8px 0;">${eName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600;color:#555;">Email</td>
              <td style="padding:8px 0;"><a href="mailto:${eEmail}" style="color:#CFA4B8;text-decoration:none;">${eEmail}</a></td>
            </tr>
          </table>
        </td></tr>

        <!-- Message -->
        <tr><td style="background:#fff;padding:0 40px 32px;">
          <hr style="border:none;border-top:2px solid #F6E8EF;margin:0 0 20px;" />
          <h2 style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#CFA4B8;">Message</h2>
          <div style="background:#FDF8FA;border-radius:10px;padding:20px;">
            <p style="margin:0;color:#444;font-size:15px;line-height:1.7;white-space:pre-wrap;">${eMessage}</p>
          </div>
        </td></tr>

        <!-- Reply shortcut -->
        <tr><td style="background:#fff;padding:0 40px 28px;text-align:center;">
          <a href="mailto:${eEmail}" style="display:inline-block;background:#CFA4B8;color:#fff;text-decoration:none;padding:12px 28px;border-radius:24px;font-size:14px;font-weight:600;">Répondre à ${eName}</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#FAF5F7;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#B8A0AC;">La maison des voiles — par Manel.k</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // ── Send email ──
    const apiKey = process.env.RESEND_API_KEY;
    const manelEmail = process.env.MANEL_EMAIL || "manel@example.com";

    if (apiKey && apiKey !== "your_resend_api_key_here") {
      const resend = new Resend(apiKey);

      await resend.emails.send({
        from: "La maison des voiles <contact@lamaisondesvoiles.fr>",
        to: manelEmail,
        replyTo: email,
        subject: `Nouveau message de ${name}`,
        html,
      });
    } else {
      console.log("──────────────────────────────────────────");
      console.log("[DEV] Contact message received");
      console.log("[DEV] No RESEND_API_KEY — email not sent.");
      console.log("[DEV]", { name, email, message });
      console.log("──────────────────────────────────────────");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
