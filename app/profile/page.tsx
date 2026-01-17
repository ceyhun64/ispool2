import React from "react";

import Navbar from "@/components/layout/navbar";
import MyPersonalInformation from "@/components/modules/profile/myPersonalInformation";
import Footer from "@/components/layout/footer";
import TopBar from "@/components/layout/topbar";
import CategoryBar from "@/components/layout/categoryBar";

export default function MyPersonalInformationPage() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <MyPersonalInformation />
      <Footer />
    </div>
  );
}
