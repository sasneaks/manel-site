import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getClientIp, checkRateLimit, validateEmail } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

/* ─── helpers ─── */

function sanitize(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function sanitizeArray(value: unknown, maxItems = 20, maxLen = 100): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, maxItems)
    .map((v) => sanitize(v, maxLen))
    .filter(Boolean);
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

    // ── Turnstile verification ──
    const turnstileToken = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
    const turnstileOk = await verifyTurnstile(turnstileToken);
    if (!turnstileOk) {
      return NextResponse.json(
        { success: false, error: "Vérification anti-bot échouée. Veuillez réessayer." },
        { status: 403 }
      );
    }

    // ── Sanitize inputs ──
    const veilCount = typeof body.veilCount === "number" ? body.veilCount : 0;
    const colors = sanitizeArray(body.colors);
    const supplements = sanitizeArray(body.supplements);
    const billetsAmount = sanitize(body.billetsAmount, 20);
    const totalPrice = typeof body.totalPrice === "number" ? body.totalPrice : 0;
    const giftMessage = sanitize(body.giftMessage, 1000);
    const name = sanitize(body.name, 100);
    const email = sanitize(body.email, 254);
    const phone = sanitize(body.phone, 30);
    const address = sanitize(body.address, 500);
    const instagram = sanitize(body.instagram, 100);
    const extraMessage = sanitize(body.extraMessage, 2000);
    const deliveryChoice = sanitize(body.deliveryChoice, 30);
    const shippingPrice = typeof body.shippingPrice === "number" ? body.shippingPrice : 0;
    const postalCode = sanitize(body.postalCode, 5);
    const paymentChoice = sanitize(body.paymentChoice, 20);

    const DELIVERY_LABELS: Record<string, string> = {
      surplace: "Retrait sur place",
      mainpropre: "Livraison en main propre (30 min)",
      mondialrelay: "Mondial Relay",
    };
    const deliveryLabel = DELIVERY_LABELS[deliveryChoice] || deliveryChoice;

    // ── Validate required fields ──
    if (!veilCount || veilCount < 1) {
      return NextResponse.json(
        { success: false, error: "Le nombre de voiles est requis." },
        { status: 400 }
      );
    }
    if (colors.length === 0) {
      return NextResponse.json(
        { success: false, error: "Veuillez choisir au moins une couleur." },
        { status: 400 }
      );
    }
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
    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Le numéro de téléphone est requis." },
        { status: 400 }
      );
    }
    if (!address) {
      return NextResponse.json(
        { success: false, error: "L'adresse est requise." },
        { status: 400 }
      );
    }

    // ── Generate order number ──
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MANEL-${randomDigits}`;

    // ── Payment info ──
    const paypalLink = process.env.PAYPAL_LINK || "https://www.paypal.com/paypalme/mnlkan";
    const depositAmount = Math.ceil(totalPrice * 0.3); // 30% deposit
    const isDeposit = paymentChoice === "acompte";
    const paymentAmount = isDeposit ? depositAmount : totalPrice;
    const paypalPaymentUrl = `${paypalLink}/${paymentAmount}EUR?country.x=FR&locale.x=fr_FR`;
    const paymentLabel = isDeposit
      ? `Acompte (30%) : ${depositAmount}€`
      : `Règlement intégral : ${totalPrice}€`;

    // ── Color hex map ──
    const COLOR_HEX: Record<string, string> = {
      Blanc: "#FFFFFF", Ivoire: "#FFFDD0", "Crème": "#F5EBDC", "Jaune paille": "#F5E1A4",
      Champagne: "#E8D4A2", Nude: "#E8C4A8", Beige: "#D4B896",
      Gris: "#9CA3AF", "Gris anthracite": "#4A4A4A", Noir: "#1A1A1A",
      Camel: "#C19A6B", Caramel: "#A67B5B", Taupe: "#8B7D6B", Terracotta: "#C65D3F",
      Marron: "#6B4423", Chocolat: "#3E2723",
      "Vieux rose": "#C8A2A2", Rose: "#F9A8D4", Corail: "#FF7F50", Orange: "#E07A3C",
      Rouge: "#DC2626", Bordeaux: "#722F37",
      Moutarde: "#D4A017",
      "Vert anis": "#C5D86D", Menthe: "#98FF98", "Vert d'eau": "#A8D5D0",
      "Vert sauge": "#9CAF88", "Vert kaki": "#7C8471", "Vert olive": "#6B7349",
      "Bleu ciel": "#87CEEB", Turquoise: "#40C4BD", Bleu: "#3B82F6",
      "Bleu canard": "#2E5C6E", "Bleu marine": "#1E3A5F",
      Lavande: "#E6E6FA", Violet: "#8B5CF6",
    };

    function colorDot(colorName: string): string {
      const hex = COLOR_HEX[colorName] || "#CCC";
      const border = hex === "#FFFFFF" ? "border:1px solid #ddd;" : "";
      // Table-based dot: survit à Gmail/Outlook qui écrasent les <span> vides
      return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="display:inline-block;vertical-align:middle;margin:0 6px 0 0;border-collapse:collapse;"><tr><td width="16" height="16" bgcolor="${hex}" style="width:16px;height:16px;background:${hex};border-radius:50%;${border}line-height:16px;font-size:0;">&nbsp;</td></tr></table><span style="vertical-align:middle;">${escapeHtml(colorName)}</span>`;
    }

    // ── Escape all user-supplied strings for HTML ──
    const eName = escapeHtml(name);
    const eEmail = escapeHtml(email);
    const ePhone = escapeHtml(phone);
    const eAddress = escapeHtml(address);
    const eInstagram = escapeHtml(instagram.replace(/^@/, ""));
    const eColorsHtml = colors.map(c => colorDot(c)).join("&nbsp;&nbsp;&nbsp;");
    const eSupplements = supplements.map(escapeHtml).join(", ");
    const eBillets = escapeHtml(billetsAmount);
    const eGiftMessage = escapeHtml(giftMessage);
    const eExtraMessage = escapeHtml(extraMessage);

    // ── Build admin email (to Manel) ──
    const adminHtml = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#F9F3F6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F3F6;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;font-family:'Helvetica Neue',Arial,sans-serif;">

        <!-- Header -->
        <tr><td style="background:#CFA4B8;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:0.5px;">Nouvelle commande</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:28px;font-weight:800;letter-spacing:2px;">${orderNumber}</p>
        </td></tr>

        <!-- Payment status -->
        <tr><td style="background:#fff;padding:24px 40px 0;">
          <div style="background:${isDeposit ? "#FFF3E0" : "#E8F5E9"};border-radius:12px;padding:16px 20px;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${isDeposit ? "#E65100" : "#2E7D32"};font-weight:600;">Mode de paiement choisi</p>
            <p style="margin:0;font-size:18px;font-weight:700;color:${isDeposit ? "#E65100" : "#2E7D32"};">${escapeHtml(paymentLabel)}</p>
          </div>
        </td></tr>

        <!-- Bouquet details -->
        <tr><td style="background:#fff;padding:24px 40px 24px;">
          <h2 style="margin:0 0 20px;font-size:15px;text-transform:uppercase;letter-spacing:1px;color:#CFA4B8;border-bottom:2px solid #F6E8EF;padding-bottom:10px;">Détails du bouquet</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;color:#333;">
            <tr>
              <td style="padding:8px 0;width:160px;font-weight:600;color:#555;">Nombre de voiles</td>
              <td style="padding:8px 0;">${veilCount}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600;color:#555;">Couleurs</td>
              <td style="padding:8px 0;">${eColorsHtml}</td>
            </tr>
            ${eSupplements ? `<tr>
              <td style="padding:8px 0;font-weight:600;color:#555;">Suppléments</td>
              <td style="padding:8px 0;">${eSupplements}</td>
            </tr>` : ""}
            ${eBillets ? `<tr>
              <td style="padding:8px 0;font-weight:600;color:#555;">Billets</td>
              <td style="padding:8px 0;">${eBillets}€ + 10€</td>
            </tr>` : ""}
            <tr>
              <td style="padding:8px 0;font-weight:600;color:#555;">Livraison</td>
              <td style="padding:8px 0;">${escapeHtml(deliveryLabel)}${shippingPrice > 0 ? ` (${shippingPrice}€)` : " (Gratuit)"}</td>
            </tr>
          </table>
          <div style="margin:24px 0 0;background:#FDF8FA;border-radius:10px;padding:16px 20px;text-align:center;">
            ${shippingPrice > 0 ? `<span style="font-size:12px;color:#999;">Sous-total: ${totalPrice - shippingPrice}€ + Livraison: ${shippingPrice}€</span><br/>` : ""}
            <span style="font-size:13px;color:#999;text-transform:uppercase;letter-spacing:1px;">Total</span><br/>
            <span style="font-size:28px;font-weight:800;color:#CFA4B8;">${totalPrice}€</span>
          </div>
          ${eGiftMessage ? `
          <div style="margin:20px 0 0;background:#FFF9E6;border-left:4px solid #F5D660;border-radius:0 8px 8px 0;padding:14px 18px;">
            <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#B8A040;font-weight:600;">Message cadeau</p>
            <p style="margin:0;color:#555;font-style:italic;line-height:1.6;">${eGiftMessage}</p>
          </div>` : ""}
          ${eExtraMessage ? `
          <div style="margin:20px 0 0;background:#F0F4FF;border-left:4px solid #7B9FD4;border-radius:0 8px 8px 0;padding:14px 18px;">
            <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#5A7FB5;font-weight:600;">Note supplémentaire</p>
            <p style="margin:0;color:#555;line-height:1.6;">${eExtraMessage}</p>
          </div>` : ""}
        </td></tr>

        <!-- Customer info -->
        <tr><td style="background:#fff;padding:0 40px 32px;">
          <h2 style="margin:0 0 20px;font-size:15px;text-transform:uppercase;letter-spacing:1px;color:#CFA4B8;border-bottom:2px solid #F6E8EF;padding-bottom:10px;">Informations client</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;color:#333;">
            <tr>
              <td style="padding:8px 0;width:160px;font-weight:600;color:#555;">Nom</td>
              <td style="padding:8px 0;">${eName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600;color:#555;">Email</td>
              <td style="padding:8px 0;"><a href="mailto:${eEmail}" style="color:#CFA4B8;text-decoration:none;">${eEmail}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600;color:#555;">Téléphone</td>
              <td style="padding:8px 0;"><a href="tel:${ePhone}" style="color:#CFA4B8;text-decoration:none;">${ePhone}</a></td>
            </tr>
            ${eInstagram ? `<tr>
              <td style="padding:8px 0;font-weight:600;color:#555;">Instagram</td>
              <td style="padding:8px 0;"><a href="https://instagram.com/${eInstagram}" style="color:#CFA4B8;text-decoration:none;">@${eInstagram}</a></td>
            </tr>` : ""}
            <tr>
              <td style="padding:8px 0;font-weight:600;color:#555;vertical-align:top;">Adresse</td>
              <td style="padding:8px 0;line-height:1.5;">${eAddress}</td>
            </tr>
          </table>
        </td></tr>

        ${deliveryChoice === "mondialrelay" && postalCode ? `
        <!-- Mondial Relay action -->
        <tr><td style="background:#fff;padding:0 40px 28px;">
          <div style="background:#E3F2FD;border-radius:12px;padding:20px 24px;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#1565C0;font-weight:600;">📦 Mondial Relay — Code postal : ${escapeHtml(postalCode)}</p>
            <p style="margin:8px 0 16px;font-size:14px;color:#555;">Trouvez un point relais proche du client et créez l'envoi :</p>
            <a href="https://www.mondialrelay.fr/trouver-le-point-relais-le-plus-proche-de-chez-moi/?codePays=FR&codePostal=${escapeHtml(postalCode)}" style="display:inline-block;background:#1565C0;color:#fff;text-decoration:none;padding:12px 24px;border-radius:24px;font-size:14px;font-weight:600;margin:0 4px;">Trouver un relais</a>
            <a href="https://www.mondialrelay.fr/envoi-de-colis/" style="display:inline-block;background:#2E7D32;color:#fff;text-decoration:none;padding:12px 24px;border-radius:24px;font-size:14px;font-weight:600;margin:0 4px;">Créer l'envoi</a>
          </div>
        </td></tr>
        ` : ""}

        <!-- Footer -->
        <tr><td style="background:#FAF5F7;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#B8A0AC;">La maison des voiles — par Manel.k</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // ── Build customer confirmation email ──
    const customerHtml = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#F9F3F6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F3F6;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;font-family:'Helvetica Neue',Arial,sans-serif;">

        <!-- Header -->
        <tr><td style="background:#CFA4B8;border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">La maison des voiles</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;font-style:italic;">par Manel.k</p>
        </td></tr>

        <!-- Thank you -->
        <tr><td style="background:#fff;padding:36px 40px 20px;text-align:center;">
          <h2 style="margin:0 0 8px;color:#1A1A1A;font-size:22px;">Merci pour votre commande, ${eName} !</h2>
          <p style="margin:0;color:#888;font-size:15px;">Votre bouquet est entre de bonnes mains.</p>
        </td></tr>

        <!-- Order number -->
        <tr><td style="background:#fff;padding:0 40px 28px;text-align:center;">
          <div style="background:#FDF8FA;border-radius:12px;padding:20px;display:inline-block;min-width:220px;">
            <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#B8A0AC;">Numéro de commande</p>
            <p style="margin:0;font-size:26px;font-weight:800;color:#1A1A1A;letter-spacing:2px;">${orderNumber}</p>
          </div>
        </td></tr>

        <!-- Recap -->
        <tr><td style="background:#fff;padding:0 40px 28px;">
          <div style="border:1px solid #F6E8EF;border-radius:12px;padding:20px;">
            <h3 style="margin:0 0 14px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#CFA4B8;">Récapitulatif</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#555;">
              <tr>
                <td style="padding:6px 0;">Nombre de voiles</td>
                <td style="padding:6px 0;text-align:right;font-weight:600;color:#333;">${veilCount}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;">Couleurs</td>
                <td style="padding:6px 0;text-align:right;font-weight:600;color:#333;">${eColorsHtml}</td>
              </tr>
              ${eSupplements ? `<tr>
                <td style="padding:6px 0;">Suppléments</td>
                <td style="padding:6px 0;text-align:right;font-weight:600;color:#333;">${eSupplements}</td>
              </tr>` : ""}
              ${eBillets ? `<tr>
                <td style="padding:6px 0;">Billets</td>
                <td style="padding:6px 0;text-align:right;font-weight:600;color:#333;">${eBillets}€</td>
              </tr>` : ""}
              <tr>
                <td style="padding:6px 0;">Livraison</td>
                <td style="padding:6px 0;text-align:right;font-weight:600;color:#333;">${escapeHtml(deliveryLabel)}${shippingPrice > 0 ? ` (${shippingPrice}€)` : ""}</td>
              </tr>
            </table>
            <hr style="border:none;border-top:1px solid #F6E8EF;margin:14px 0;" />
            ${shippingPrice > 0 ? `<table width="100%"><tr>
              <td style="font-size:13px;color:#999;">Sous-total</td>
              <td style="text-align:right;font-size:13px;color:#999;">${totalPrice - shippingPrice}€</td>
            </tr><tr>
              <td style="font-size:13px;color:#999;">Livraison</td>
              <td style="text-align:right;font-size:13px;color:#999;">${shippingPrice}€</td>
            </tr></table>` : ""}
            <table width="100%"><tr>
              <td style="font-size:15px;font-weight:600;color:#333;">Total</td>
              <td style="text-align:right;font-size:22px;font-weight:800;color:#CFA4B8;">${totalPrice}€</td>
            </tr></table>
          </div>
        </td></tr>

        <!-- Payment Section -->
        <tr><td style="background:#fff;padding:0 40px 28px;">
          <div style="background:linear-gradient(135deg, #FDF8FA 0%, #F6E8EF 100%);border-radius:16px;padding:28px;text-align:center;">
            <h3 style="margin:0 0 8px;font-size:18px;color:#1A1A1A;font-weight:700;">Procédez au paiement</h3>
            <p style="margin:0 0 20px;font-size:14px;color:#888;">
              ${isDeposit
                ? `Vous avez choisi de verser un acompte de <strong style="color:#CFA4B8;">${depositAmount}€</strong> (30% du total).`
                : `Vous avez choisi le règlement intégral de <strong style="color:#CFA4B8;">${totalPrice}€</strong>.`
              }
            </p>
            <a href="${paypalPaymentUrl}" style="display:inline-block;background:#CFA4B8;color:#fff;text-decoration:none;padding:14px 36px;border-radius:30px;font-size:16px;font-weight:700;letter-spacing:0.5px;">
              Payer ${paymentAmount}€ via PayPal
            </a>
            <p style="margin:16px 0 0;font-size:12px;color:#B8A0AC;">
              Le bouton vous redirige vers PayPal pour le paiement.
            </p>
          </div>
        </td></tr>

        <!-- Next steps -->
        <tr><td style="background:#fff;padding:0 40px 32px;">
          <h3 style="margin:0 0 16px;font-size:15px;color:#1A1A1A;">Prochaines étapes</h3>
          <table cellpadding="0" cellspacing="0" style="font-size:14px;color:#555;">
            <tr>
              <td style="padding:6px 12px 6px 0;vertical-align:top;font-size:18px;">1.</td>
              <td style="padding:6px 0;">Effectuez votre paiement via le bouton ci-dessus</td>
            </tr>
            <tr>
              <td style="padding:6px 12px 6px 0;vertical-align:top;font-size:18px;">2.</td>
              <td style="padding:6px 0;">Manel confirmera votre commande par email ou Instagram</td>
            </tr>
            <tr>
              <td style="padding:6px 12px 6px 0;vertical-align:top;font-size:18px;">3.</td>
              <td style="padding:6px 0;">Votre bouquet sera préparé puis expédié ou remis en main propre</td>
            </tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#FAF5F7;border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;">
          <p style="margin:0 0 8px;font-size:14px;color:#888;">
            Une question ? Écrivez-nous sur Instagram
          </p>
          <a href="https://www.instagram.com/manel.k_95" style="display:inline-block;background:#CFA4B8;color:#fff;text-decoration:none;padding:10px 24px;border-radius:24px;font-size:14px;font-weight:600;">@manel.k_95</a>
          <p style="margin:20px 0 0;font-size:12px;color:#B8A0AC;">La maison des voiles — par Manel.k</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // ── Send emails ──
    const apiKey = process.env.RESEND_API_KEY;
    const manelEmail = process.env.MANEL_EMAIL || "manel@example.com";

    if (apiKey && apiKey !== "your_resend_api_key_here") {
      const resend = new Resend(apiKey);

      await Promise.all([
        resend.emails.send({
          from: "La maison des voiles <commandes@lamaisondesvoiles.fr>",
          to: manelEmail,
          subject: `Nouvelle commande ${orderNumber} — ${eName} — ${paymentLabel}`,
          replyTo: email,
          html: adminHtml,
        }),
        resend.emails.send({
          from: "La maison des voiles <commandes@lamaisondesvoiles.fr>",
          to: email,
          subject: `Confirmation de commande ${orderNumber} — La maison des voiles`,
          html: customerHtml,
        }),
      ]);
    } else {
      console.log("──────────────────────────────────────────");
      console.log(`[DEV] Order ${orderNumber} created`);
      console.log("[DEV] No RESEND_API_KEY — emails not sent.");
      console.log("[DEV] Payment:", paymentLabel, "→", paypalPaymentUrl);
      console.log("[DEV] Order details:", {
        veilCount,
        colors,
        supplements,
        billetsAmount,
        totalPrice,
        deliveryChoice,
        shippingPrice,
        paymentChoice,
        giftMessage,
        name,
        email,
        phone,
        address,
        instagram,
        extraMessage,
      });
      console.log("──────────────────────────────────────────");
    }

    return NextResponse.json({ success: true, orderNumber });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de la commande." },
      { status: 500 }
    );
  }
}
