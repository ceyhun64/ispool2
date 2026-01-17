import React from "react";
import Navbar from "@/components/layout/navbar";
import PaymentOptions from "@/components/modules/contracts/paymentOptions";
import Footer from "@/components/layout/footer";
import TopBar from "@/components/layout/topbar";
import CategoryBar from "@/components/layout/categoryBar";

export default function PaymentOptionsPage() {
  return (
    <div>
 <TopBar />
      <Navbar />
            <PaymentOptions />
      <Footer />
    </div>
  );
}
