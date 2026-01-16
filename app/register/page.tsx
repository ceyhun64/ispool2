import React from "react";
import TopBar from "@/components/layout/topbar";
import CategoryBar from "@/components/layout/categoryBar";
import Navbar from "@/components/layout/navbar";
import RegisterForm from "@/components/modules/auth/register";
import Footer from "@/components/layout/footer";

export default function Registerpage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <CategoryBar />
      <RegisterForm />
      <Footer />
    </>
  );
}
