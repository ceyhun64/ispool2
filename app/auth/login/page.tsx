import React from "react";
import TopBar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import CategoryBar from "@/components/layout/categoryBar";
import LoginForm from "@/components/modules/auth/login";
import Footer from "@/components/layout/footer";

export default function Loginpage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <LoginForm />
      <Footer />
    </>
  );
}
