import React from "react";
import Navbar from "@/components/layout/navbar";
import Blog from "@/components/modules/blog/blog";
import Footer from "@/components/layout/footer";

export default function BlogPage() {
  return (
    <div>
      <Navbar />
      <Blog />
      <Footer />
    </div>
  );
}
