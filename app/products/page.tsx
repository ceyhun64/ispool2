import TopBar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import AllProducts from "@/components/modules/products/allProducts";
import CategoryBar from "@/components/layout/categoryBar";
import Banner from "@/components/modules/home/banner";
import Footer from "@/components/layout/footer";

export default function AllProductsPage() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <AllProducts />
      <Footer />
    </div>
  );
}
