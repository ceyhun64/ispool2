import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // /admin kendi özel giriş ekranını barındırır (AdminLogin), bu yüzden
    // oturumsuz ziyaretçiler için yönlendirme yapılmaz — sadece alt admin
    // sayfaları (ör. /admin/dashboard) ADMIN rolü ister.
    if (
      pathname.startsWith("/admin") &&
      pathname !== "/admin" &&
      token?.role !== "ADMIN"
    ) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Profil sayfalarına sadece oturum açmış kullanıcılar erişebilir
    if (pathname.startsWith("/profile") && !token) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Ödeme ve sipariş sayfaları oturum gerektirir
    if (
      (pathname.startsWith("/checkout") || pathname.startsWith("/favorites")) &&
      !token
    ) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Admin API'leri sadece ADMIN rolüne açık
        if (pathname.startsWith("/api/admin")) {
          return token?.role === "ADMIN";
        }

        // Admin sayfaları: oturum zorunlu (rol kontrolü middleware fonksiyonunda)
        // /admin kendi giriş ekranını gösterdiği için burada her zaman izinli.
        if (pathname.startsWith("/admin")) {
          return pathname === "/admin" || !!token;
        }

        // Korumalı sayfalar için token gerekli
        if (
          pathname.startsWith("/profile") ||
          pathname.startsWith("/checkout") ||
          pathname.startsWith("/favorites")
        ) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/checkout/:path*",
    "/favorites/:path*",
    "/api/admin/:path*",
  ],
};
