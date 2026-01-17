import React from "react";

import Navbar from "@/components/layout/navbar";
import CookiePolicy from "@/components/modules/institutional/security_cookie";
import Footer from "@/components/layout/footer";
import TopBar from "@/components/layout/topbar";
import CategoryBar from "@/components/layout/categoryBar";
export default function CookiePolicyPage() {
  return (
    <div>
 <TopBar />
      <Navbar />
           <CookiePolicy />
      <Footer />
    </div>
  );
}
