import Navbar from "@/components/layout/navbar";
import Umbrella from "@/components/modules/products/category/umbrella";
import Footer from "@/components/layout/footer";
import Banner from "@/components/modules/home/banner";

export default function UmbrellaPage() {
  return (
    <div>
      <Navbar />
      <Umbrella />
      <Banner />
      <Footer />
    </div>
  );
}
