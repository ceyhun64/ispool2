import React from "react";

import Navbar from "@/components/layout/navbar";
import About from "@/components/modules/footer/customer/returns";
import Footer from "@/components/layout/footer";
import TopBar from "@/components/layout/topbar";
import CategoryBar from "@/components/layout/categoryBar";
export default function AboutPage() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <About />
      <Footer />
    </div>
  );
}
