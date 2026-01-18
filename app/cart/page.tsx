import React from "react";
import Navbar from "@/components/layout/navbar";
import Cart from "@/components/modules/cart/cart";
import Footer from "@/components/layout/footer";
import TopBar from "@/components/layout/topbar";

export default function CartPage() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <Cart />
      <Footer />
    </div>
  );
}
