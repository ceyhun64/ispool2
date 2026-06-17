"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SocialSidebar from "@/components/layout/socialSidebar";
import Navbar from "@/components/layout/Navbar";
import Topbar from "@/components/layout/topbar";
import Footer from "@/components/layout/Footer";
import AdminSidebar from "@/components/modules/admin/sideBar";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const [isNotFound, setIsNotFound] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    setIsNotFound(!!document.querySelector(".not-found-page"));
  }, [pathname]);

  // Admin dashboard path kontrolü - /admin login hariç tüm /admin/* sayfaları
  const isDashboardPath =
    pathname.startsWith("/admin") && pathname !== "/admin";

  const hiddenPaths = [
    "/admin",
    "/checkout",
    "/auth/reset-password",
    "/auth/forgot-password",
  ];

  const hideForPath = hiddenPaths.some((path) => pathname.startsWith(path));

  // --- DURUM 1: ADMIN DASHBOARD (Sidebarlı yapı) ---
  if (isDashboardPath) {
    return (
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div
          className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ${
            isSidebarCollapsed
              ? "md:ml-[60px] lg:ml-[80px]"
              : "md:ml-[240px] lg:ml-[250px]"
          }`}
        >
          <div className="flex-1 overflow-y-auto transition-all duration-300">
            {children}
          </div>
        </div>
      </div>
    );
  }

  // --- DURUM 2: NORMAL KULLANICI VEYA ADMIN LOGIN ---
  const shouldShowLayout = !hideForPath && !isNotFound;

  return (
    <>
      {shouldShowLayout && (
        <>
          <Topbar />
          <Navbar />
        </>
      )}

      {children}

      {/* Mobil alt bar için sayfa sonu boşluğu */}
      {shouldShowLayout && <div className="lg:hidden h-16" />}

      {shouldShowLayout && (
        <>
          <SocialSidebar />
          <Footer />
        </>
      )}
    </>
  );
}
