import React from "react";

import Navbar from "@/components/layout/navbar";
import CargoTracking from "@/components/modules/profile/cargoTracking";
import Footer from "@/components/layout/footer";
import TopBar from "@/components/layout/topbar";
import CategoryBar from "@/components/layout/categoryBar";

export default function CargoTrackingPage() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <CargoTracking />
      <Footer />
    </div>
  );
}
