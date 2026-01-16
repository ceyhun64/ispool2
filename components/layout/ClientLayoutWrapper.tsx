"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SocialSidebar from "@/components/layout/socialSidebar";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    // DOM'da .not-found-page var mı diye kontrol et
    setIsNotFound(!!document.querySelector(".not-found-page"));
  }, [pathname]);

  const hiddenPaths = [
    "/admin",
    "/checkout",
    "/reset-password",
    "/forgot-password",
  ];

  const hideForPath = hiddenPaths.some((path) => pathname?.startsWith(path));

  const showSidebar = !hideForPath && !isNotFound;

  return (
    <>
      {children}
      {showSidebar && <SocialSidebar />}
    </>
  );
}
