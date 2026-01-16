import React from "react";
import Navbar from "@/components/layout/navbar";
import Favorites from "@/components/modules/favorites/favorites";
import Footer from "@/components/layout/footer";

export default function FavoritesPage() {
  return (
    <div>
      <Navbar />
      <Favorites />
      <Footer />
    </div>
  );
}
