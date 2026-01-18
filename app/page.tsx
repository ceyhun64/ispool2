import CategoriesSection from "@/components/modules/home/categories";
import HeroSection from "@/components/modules/home/carousel";
import Banner from "@/components/modules/home/banner";
import Products from "@/components/modules/home/products";
import ProductsRow from "@/components/modules/home/newArrivals";
import ShopServices from "@/components/modules/home/services";
import Testimonials from "@/components/modules/home/testimonial";
import BestSeller from "@/components/modules/home/bestseller";

export default function Home() {
  return (
    <div>
     
      <HeroSection />
      <CategoriesSection />
      <Products />
      <Banner />
      <ShopServices />
      <BestSeller />
      <Testimonials />
      <ProductsRow />
    </div>
  );
}
