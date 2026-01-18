import React from "react";
import Navbar from "@/components/layout/navbar";
import Favorites from "@/components/modules/favorites/favorites";
import Footer from "@/components/layout/footer";
import Topbar from "@/components/layout/topbar";

export default function FavoritesPage() {
  return (
    <div>
      <Topbar/>
      <Navbar />
      <Favorites />
      <Footer />
    </div>
  );
}
