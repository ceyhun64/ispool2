// api/send-mail/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";

interface EmailRequestBody {
  recipients: string[];
  subject: string;
  message: string;
}

export async function POST(req: Request): Promise<Response> {
  // Sadece ADMIN rolü bu endpoint'i çağırabilir
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return Response.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const { recipients, subject, message }: EmailRequestBody = await req.json();

    if (!recipients || recipients.length === 0) {
      return Response.json({ error: "Alıcı listesi boş" }, { status: 400 });
    }

    if (!subject || !message) {
      return Response.json({ error: "Konu ve mesaj gerekli" }, { status: 400 });
    }

    await sendMail({ to: recipients, subject, message });

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Mail gönderim hatası:", err);
    return Response.json({ error: "Mail gönderilemedi." }, { status: 500 });
  }
}
