import TopBar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import CategoryBar from "@/components/layout/categoryBar";
import AnnouncementBar from "@/components/layout/announcementBar";
import CategoriesSection from "@/components/modules/home/categories";
import HeroSection from "@/components/modules/home/carousel";
import Banner from "@/components/modules/home/banner";
import Footer from "@/components/layout/footer";
import Products from "@/components/modules/home/products";
import ProductsRow from "@/components/modules/home/newArrivals";
import ShopServices from "@/components/modules/home/services";
import Testimonials from "@/components/layout/testimonial";
import BestSeller from "@/components/modules/home/bestseller";

export default function Home() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <Products />
      <Banner />
      <ShopServices />
      <BestSeller />
      <Testimonials />
      <ProductsRow />
      <Footer />
    </div>
  );
}
