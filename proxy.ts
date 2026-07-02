import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin sayfalarına sadece ADMIN rolü erişebilir
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
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
        if (pathname.startsWith("/admin")) {
          return !!token; // tokensiz kullanıcı → next-auth login sayfasına yönlendirir
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
