import Navbar from "@/components/layout/navbar";
import SeatingSets from "@/components/modules/products/category/seating_sets";
import Footer from "@/components/layout/footer";
import Banner from "@/components/modules/home/banner";

export default function SeatingSetsPage() {
  return (
    <div>
      <Navbar />
      <SeatingSets />
      <Banner />
      <Footer />
    </div>
  );
}
