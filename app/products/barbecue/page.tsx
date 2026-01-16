import Navbar from "@/components/layout/navbar";
import Barbecue from "@/components/modules/products/category/barbecue";
import Footer from "@/components/layout/footer";
import Banner from "@/components/modules/home/banner";

export default function BarbecuePage() {
  return (
    <div>
      <Navbar />
      <Barbecue />
      <Banner />

      <Footer />
    </div>
  );
}
