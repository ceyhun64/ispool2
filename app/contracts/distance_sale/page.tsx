import React from "react";
import Navbar from "@/components/layout/navbar";
import DistanceSale from "@/components/modules/contracts/distanceSale";
import Footer from "@/components/layout/footer";
import TopBar from "@/components/layout/topbar";
import CategoryBar from "@/components/layout/categoryBar";
export default function DİstanceSalePage() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <CategoryBar /> <DistanceSale />
      <Footer />
    </div>
  );
}
