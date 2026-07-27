import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

const BRAND_COLOR = "#ea580c"; // Ana turuncu renk

function buildHtmlTemplate(subject: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <div style="padding:40px 10px;">
    <div style="max-width:500px;margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">

      <div style="background-color:${BRAND_COLOR};padding:36px 40px;text-align:center;">
        <img src="cid:ispool-logo" alt="İşPool" style="width:160px;height:auto;display:inline-block;" />
      </div>

      <div style="padding:36px 40px 28px 40px;">
        <div style="display:inline-block;background-color:#1e293b;color:#ffffff;padding:4px 10px;font-size:10px;font-weight:700;letter-spacing:1px;margin-bottom:20px;text-transform:uppercase;">
          Bildirim
        </div>
        <h2 style="margin:0 0 20px 0;font-size:20px;font-weight:600;color:#1a1a1a;">${subject}</h2>
        <div style="border-left:3px solid ${BRAND_COLOR};padding-left:20px;margin-bottom:28px;">
          <p style="margin:0;font-size:15px;color:#444;line-height:1.8;white-space:pre-line;">${message}</p>
        </div>
        <a href="mailto:info@ispool.com.tr" style="display:inline-block;background-color:#0f172a;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:500;font-size:13px;">
          Hızlıca Yanıtla
        </a>
      </div>

      <div style="padding:24px 40px;border-top:1px solid #eeeeee;background-color:#fafafa;">
        <p style="margin:0 0 12px 0;font-size:13px;font-weight:700;color:#1a1a1a;">İşPool Endüstriyel Güvenlik</p>
        <div style="font-size:12px;color:#777;line-height:1.6;">
          <p style="margin:0 0 4px 0;">📍 Merkez / Uşak</p>
          <p style="margin:0 0 4px 0;">📞 +90 534 352 94 20</p>
          <!-- Yetkili numara: +90 534 352 94 20 -->
          <p style="margin:0;">✉️ info@ispool.com.tr</p>
        </div>
        <p style="margin:20px 0 0 0;font-size:11px;color:#bbb;border-top:1px solid #f0f0f0;padding-top:14px;">
          © ${new Date().getFullYear()} İşPool. Tüm hakları saklıdır.
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;
}

export async function sendMail({
  to,
  subject,
  message,
}: {
  to: string | string[];
  subject: string;
  message: string;
}): Promise<void> {
  const transporter = createTransporter();
  const recipients = Array.isArray(to) ? to.join(", ") : to;

  await transporter.sendMail({
    from: `"İşPool" <${process.env.EMAIL_USER}>`,
    to: recipients,
    subject,
    text: message,
    html: buildHtmlTemplate(subject, message),
    attachments: [
      {
        filename: "logoyeni.png",
        path: "./public/logo/logoyeni.png",
        cid: "ispool-logo",
        contentDisposition: "inline",
      },
    ],
  });
}
