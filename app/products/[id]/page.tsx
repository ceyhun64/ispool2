import Navbar from "@/components/layout/navbar";
import TopBar from "@/components/layout/topbar";
import CategoryBar from "@/components/layout/categoryBar";
import ProductDetail from "@/components/modules/products/productDetail";
import Recommended from "@/components/modules/products/recommended";
import Footer from "@/components/layout/footer";

export default function ProductDetailPage() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <CategoryBar />
      <ProductDetail />
      <Recommended />
      <Footer />
    </div>
  );
}
