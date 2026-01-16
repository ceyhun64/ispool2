import React from "react";
import Navbar from "@/components/layout/navbar";
import PersonalData from "@/components/modules/contracts/personalData";
import Footer from "@/components/layout/footer";
import TopBar from "@/components/layout/topbar";
import CategoryBar from "@/components/layout/categoryBar";

export default function PersonalDataPage() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <CategoryBar /> <PersonalData />
      <Footer />
    </div>
  );
}
