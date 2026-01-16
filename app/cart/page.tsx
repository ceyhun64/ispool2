import React from "react";
import Navbar from "@/components/layout/navbar";
import Cart from "@/components/modules/cart/cart";
import Footer from "@/components/layout/footer";

export default function CartPage() {
  return (
    <div>
      <Navbar />
      <Cart />
      <Footer />
    </div>
  );
}
