// /app/api/auth/register/route.ts
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

interface RegisterRequestBody {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  // Rate limiting: 15 dakikada 5 kayıt denemesi
  const ip = getClientIp(req);
  const rl = rateLimit(`register:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Çok fazla kayıt denemesi. Lütfen daha sonra tekrar deneyin." },
      { status: 429 },
    );
  }

  try {
    const { name, surname, email, password } =
      (await req.json()) as RegisterRequestBody;

    if (!name || !surname || !email || !password) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    // Şifre güç kontrolü: min 8 karakter
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Şifre en az 8 karakter olmalıdır" },
        { status: 400 },
      );
    }

    // Kullanıcı zaten kayıtlı mı kontrol et
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email zaten kayıtlı" },
        { status: 400 }, // statusText gereksiz, body üzerinden hata mesajı gönderiliyor
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcıyı oluştur
    const user = await prisma.user.create({
      data: { name, surname, email, password: hashedPassword },
    });

    // Başarılı yanıt: İstemciye oturum açma işlemi yapması gerektiğini bildirin.
    // Parolayı göndermeyin. İstemci zaten parolanın hashlenmemiş halini biliyor.
    return NextResponse.json(
      {
        message: "Kayıt başarılı",
        user: {
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    // Hata mesajı için güvenli bir mesaj kullanın
    return NextResponse.json(
      { error: "Kayıt başarısız. Lütfen tekrar deneyin." },
      {
        status: 500,
      },
    );
  }
}
