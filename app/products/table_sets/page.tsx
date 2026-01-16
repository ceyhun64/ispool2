import Navbar from "@/components/layout/navbar";
import TableSets from "@/components/modules/products/category/table_sets";
import Footer from "@/components/layout/footer";
import Banner from "@/components/modules/home/banner";

export default function TableSetsPage() {
  return (
    <div>
      <Navbar />
      <TableSets />
            <Banner />
      
      <Footer />
    </div>
  );
}
