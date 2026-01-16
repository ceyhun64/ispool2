// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // Response oluştur
  const res = NextResponse.json({ message: "Çıkış başarılı" });

  // JWT strategy kullanıyorsun → session cookie'yi silmek yeterli
  // Prod ortamda HTTPS ise cookie adı __Secure-next-auth.session-token
  const cookieName =
    process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

  // Cookie'yi sil
  res.cookies.set(cookieName, "", {
    maxAge: 0, // hemen sil
    path: "/", // tüm pathlerde geçerli
    httpOnly: true, // client JS erişimi yok
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // prod’da secure
  });

  return res;
}
