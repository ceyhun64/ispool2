import React from "react";

import Navbar from "@/components/layout/navbar";
import Addresses from "@/components/modules/profile/addresses";
import Footer from "@/components/layout/footer";
import TopBar from "@/components/layout/topbar";
import CategoryBar from "@/components/layout/categoryBar";

export default function AddressesPage() {
  return (
    <div>
      <TopBar/>
      <Navbar />
   <Addresses />
      <Footer />
    </div>
  );
}
