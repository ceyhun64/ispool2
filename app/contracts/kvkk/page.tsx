import React from "react";
import Navbar from "@/components/layout/navbar";
import Kvkk from "@/components/modules/contracts/kvkk";
import Footer from "@/components/layout/footer";
import TopBar from "@/components/layout/topbar";
import CategoryBar from "@/components/layout/categoryBar";
export default function KvkkPage() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <Kvkk />
      <Footer />
    </div>
  );
}
