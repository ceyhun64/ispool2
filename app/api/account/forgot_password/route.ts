// app/api/forgotPassword/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "E-posta gerekli" }, { status: 400 });
    }

    // Kullanıcı var mı kontrol et
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Güvenlik için kullanıcı olmasa bile aynı mesaj dön
    if (!user) {
      return NextResponse.json(
        { message: "Eğer e-posta kayıtlıysa şifre sıfırlama linki gönderildi" },
        { status: 200 },
      );
    }

    // 🔹 Reset token oluştur
    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetTokenExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 dakika geçerli

    // 🔹 Tokeni DB’ye kaydet
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: resetToken || null, // tip güvenliği
        resetTokenExpires: resetTokenExpires || null,
      },
    });

    // 🔹 Mail içeriğini hazırla
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;
    const subject = "Şifre Sıfırlama Talebi";
    const message = `
Merhaba ${user.name || ""},

Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:
${resetLink}

Bu bağlantı 30 dakika boyunca geçerlidir.
Eğer bu işlemi siz başlatmadıysanız, lütfen bu e-postayı dikkate almayın.
`;

    // 🔹 /api/send-mail endpoint’ini çağır
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-mail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipients: [email],
        subject,
        message,
      }),
    });

    return NextResponse.json(
      { message: "Şifre sıfırlama linki e-posta adresinize gönderildi" },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Forgot password hatası:", err);
    return NextResponse.json(
      { error: err.message || "Sunucu hatası, tekrar deneyin." },
      { status: 500 },
    );
  }
}
