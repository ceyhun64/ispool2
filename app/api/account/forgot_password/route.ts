// app/api/account/forgot_password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limiting: 5 dakikada 3 istek
  const ip = getClientIp(req);
  const rl = rateLimit(`forgot:${ip}`, 3, 5 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Çok fazla istek. Lütfen birkaç dakika bekleyin." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
      },
    );
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "E-posta gerekli" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Güvenlik için kullanıcı olmasa bile aynı mesaj dön
    if (!user) {
      return NextResponse.json(
        { message: "Eğer e-posta kayıtlıysa şifre sıfırlama linki gönderildi" },
        { status: 200 },
      );
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetTokenExpires = new Date(Date.now() + 1000 * 60 * 30);

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpires },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;

    await sendMail({
      to: email,
      subject: "Şifre Sıfırlama Talebi",
      message: `Merhaba ${user.name || ""},\n\nŞifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:\n${resetLink}\n\nBu bağlantı 30 dakika boyunca geçerlidir.\nEğer bu işlemi siz başlatmadıysanız, lütfen bu e-postayı dikkate almayın.`,
    });

    return NextResponse.json(
      { message: "Şifre sıfırlama linki e-posta adresinize gönderildi" },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Forgot password hatası:", err);
    return NextResponse.json(
      { error: "Sunucu hatası, tekrar deneyin." },
      { status: 500 },
    );
  }
}
