import React from "react";

import Navbar from "@/components/layout/navbar";
import WhyUs from "@/components/modules/institutional/why_us";
import Footer from "@/components/layout/footer";
import TopBar from "@/components/layout/topbar";
import CategoryBar from "@/components/layout/categoryBar";
export default function DocumentsPage() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <CategoryBar /> <WhyUs />
      <Footer />
    </div>
  );
}
