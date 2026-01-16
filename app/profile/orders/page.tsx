import React from "react";

import Navbar from "@/components/layout/navbar";
import Orders from "@/components/modules/profile/orders";
import Footer from "@/components/layout/footer";
import TopBar from "@/components/layout/topbar";
import CategoryBar from "@/components/layout/categoryBar";

export default function OrdersPage() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <CategoryBar /> <Orders />
      <Footer />
    </div>
  );
}
