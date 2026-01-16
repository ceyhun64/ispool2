import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token ve şifre gerekli" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gte: new Date() }, // token geçerlilik kontrolü
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Token geçersiz veya süresi dolmuş" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return NextResponse.json({ message: "Şifre başarıyla güncellendi" });
  } catch (err) {
    console.error("Reset password hatası:", err);
    return NextResponse.json(
      { error: "Sunucu hatası, tekrar deneyin." },
      { status: 500 }
    );
  }
}
