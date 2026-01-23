// api/send-mail/route.ts
import nodemailer from "nodemailer";

interface EmailRequestBody {
  recipients: string[];
  subject: string;
  message: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { recipients, subject, message }: EmailRequestBody = await req.json();

    if (!recipients || recipients.length === 0) {
      return Response.json({ error: "Alıcı listesi boş" }, { status: 400 });
    }

    if (!subject || !message) {
      return Response.json({ error: "Konu ve mesaj gerekli" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Siyah Arka Planlı Logo İçin Minimal & Lüks HTML Template
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  
  <div style="padding: 40px 10px;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">

      <div style="background-color: #FF7F00; padding: 45px 40px; text-align: center;">
        <img 
          src="cid:ispool-logo" 
          alt="İşPool" 
          style="width: 160px; height: auto; display: inline-block;"
        />
      </div>

      <div style="padding: 40px 40px 30px 40px;">
        <div style="display: inline-block; background-color: #7B0323; color: #ffffff; padding: 5px 12px; border-radius: 4px; font-size: 10px; font-weight: 700; letter-spacing: 1px; margin-bottom: 20px; text-transform: uppercase;">
          Yeni Bildirim
        </div>
        
        <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #1a1a1a; margin-bottom: 20px;">
          İletişim Formu Detayları
        </h2>

        <div style="border-left: 3px solid #7B0323; padding-left: 20px; margin-bottom: 30px;">
          <p style="margin: 0; font-size: 15px; color: #444444; line-height: 1.8; font-style: italic;">
            "${message}"
          </p>
        </div>

        <a href="mailto:ispoolofficial@gmail.com" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 13px;">
          Hızlıca Yanıtla
        </a>
      </div>

      <div style="padding: 30px 40px; border-top: 1px solid #eeeeee; background-color: #fafafa;">
        <p style="margin: 0 0 15px 0; font-size: 13px; font-weight: 700; color: #1a1a1a; letter-spacing: 0.5px;">İşPool</p>
        
        <div style="font-size: 12px; color: #777777; line-height: 1.6;">
          <p style="margin: 0 0 5px 0;">📍 Merkez/Uşak</p>
          <p style="margin: 0 0 5px 0;">📞 +90 534 352 94 20</p>
          <p style="margin: 0;">✉️ <span style="color: #7B0323;">ispoolofficial@gmail.com</span></p>
        </div>
        
        <p style="margin: 25px 0 0 0; font-size: 11px; color: #bbbbbb; border-top: 1px solid #f0f0f0; padding-top: 15px;">
          © ${new Date().getFullYear()} İşPool. Tüm hakları saklıdır.
        </p>
      </div>

    </div>
  </div>

</body>
</html>
    `;

    await transporter.sendMail({
      from: `"İşPool" <${process.env.EMAIL_USER}>`,
      to: recipients.join(", "),
      subject,
      text: message,
      html: htmlTemplate,
      attachments: [
        {
          filename: "logois2.png",
          path: "./public/logo/logois2.png",
          cid: "ispool-logo",
          contentDisposition: "inline",
        },
      ],
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Mail gönderim hatası:", err);
    return Response.json({ error: "Mail gönderilemedi." }, { status: 500 });
  }
}
