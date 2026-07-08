// api/send-mail/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { isInternalRequest } from "@/lib/internalAuth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

interface EmailRequestBody {
  recipients: string[];
  subject: string;
  message: string;
}

// Oturumsuz/anonim çağrılarda (iletişim formu, kariyer, toptan/özel üretim
// talebi vb.) mail yalnızca sabit kurumsal adrese gönderilebilir; bu, endpoint'in
// açık bir mail relay/spam aracı olarak kötüye kullanılmasını engeller.
const PUBLIC_ALLOWED_RECIPIENTS = ["info@ispool.com.tr"];

export async function POST(req: Request): Promise<Response> {
  const internal = isInternalRequest(req);
  const session = internal ? null : await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  try {
    const { recipients, subject, message }: EmailRequestBody = await req.json();

    if (!recipients || recipients.length === 0) {
      return Response.json({ error: "Alıcı listesi boş" }, { status: 400 });
    }

    if (!subject || !message) {
      return Response.json({ error: "Konu ve mesaj gerekli" }, { status: 400 });
    }

    // Sunucu içi (order/order-user) ve ADMIN çağrıları serbest; diğer tüm
    // (anonim/oturumsuz) çağrılar hız sınırlı ve sabit alıcıyla kısıtlı.
    if (!internal && !isAdmin) {
      const ip = getClientIp(req);
      const rl = rateLimit(`send-mail:${ip}`, 5, 10 * 60 * 1000);
      if (!rl.success) {
        return Response.json(
          { error: "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin." },
          { status: 429 },
        );
      }

      const hasDisallowedRecipient = recipients.some(
        (r) => !PUBLIC_ALLOWED_RECIPIENTS.includes(r),
      );
      if (hasDisallowedRecipient) {
        return Response.json({ error: "Yetkisiz erişim" }, { status: 401 });
      }
    }

    await sendMail({ to: recipients, subject, message });

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Mail gönderim hatası:", err);
    return Response.json({ error: "Mail gönderilemedi." }, { status: 500 });
  }
}
