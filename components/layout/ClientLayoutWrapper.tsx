"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SocialSidebar from "@/components/layout/socialSidebar";
import Navbar from "@/components/layout/navbar"; // Navbar yolunu kontrol et
import Topbar from "@/components/layout/topbar"; // Topbar yolunu kontrol et
import Footer from "@/components/layout/footer"; // Footer yolunu kontrol et

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    // 404 sayfası kontrolü
    setIsNotFound(!!document.querySelector(".not-found-page"));
  }, [pathname]);

  // Bu sayfalarda Topbar, Navbar, Footer ve Sidebar GİZLENECEK
  const hiddenPaths = [
    "/admin",
    "/checkout",
    "/auth/reset-password",
    "/auth/forgot-password",
  ];

  const hideForPath = hiddenPaths.some((path) => pathname?.startsWith(path));

  // Görünürlük durumu: Eğer gizlenecek bir path değilse VE 404 sayfası değilse GÖSTER
  const shouldShowLayout = !hideForPath && !isNotFound;

  return (
    <>
      {/* Üst Kısım Bileşenleri */}
      {shouldShowLayout && (
        <>
          <Topbar />
          <Navbar />
        </>
      )}

      {/* Sayfa İçeriği */}
      {children}

      {/* Alt ve Yan Bileşenler */}
      {shouldShowLayout && (
        <>
          <SocialSidebar />
          <Footer />
        </>
      )}
    </>
  );
}
