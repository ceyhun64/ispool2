import React from "react";

import Navbar from "@/components/layout/navbar";
import WhyUs from "@/components/modules/footer/institutional/why_us";
import Footer from "@/components/layout/footer";
import TopBar from "@/components/layout/topbar";

export default function DocumentsPage() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <WhyUs />
      <Footer />
    </div>
  );
}
