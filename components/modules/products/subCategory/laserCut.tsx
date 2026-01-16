"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "../productCard";
import Filter from "../filter";
import ProductTopBar from "../productTopbar";
import { cn } from "@/lib/utils";
import ProductSkeleton from "../productSkeleton";
import { SlidersHorizontal } from "lucide-react";

export default function SeatingSets() {
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(300000);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [sort, setSort] = useState<"az" | "za" | "priceLow" | "priceHigh">(
    "az"
  );
  const [gridCols, setGridCols] = useState<1 | 2 | 3 | 4>(3);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products/category/1");
        const data = await res.json();
        if (data.products) setProducts(data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    // 1. Önce Filtreleme
    let result = products.filter((p) => {
      const colorCheck = colorFilter === "all" || p.color === colorFilter;
      return p.price >= minPrice && p.price <= maxPrice && colorCheck;
    });

    // 2. Sonra Sıralama (Sort)
    return result.sort((a, b) => {
      switch (sort) {
        case "az":
          return a.title.localeCompare(b.title);
        case "za":
          return b.title.localeCompare(a.title);
        case "priceLow":
          return a.price - b.price;
        case "priceHigh":
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }, [colorFilter, minPrice, maxPrice, products, sort]); // sort bağımlılığını eklemeyi unutmayın
  if (loading) return <ProductSkeleton />;

  return (
    // Arka plan rengi slate-50 ve yazı tipi slate-900 olarak güncellendi
    <div className="min-h-screen bg-slate-100 text-slate-900 selection:bg-slate-900 selection:text-white overflow-x-hidden relative">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@200;300;400;500&display=swap");
        .luxury-serif {
          font-family: "Playfair Display", serif;
        }
        .modern-sans {
          font-family: "Inter", sans-serif;
        }
      `}</style>

      <main className="container mx-auto px-6 md:px-12 py-24 lg:py-24 relative z-10">
        {/* --- HEADER BÖLÜMÜ (İkinci kod stilinde) --- */}
        <header className="max-w-3xl mb-16 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-slate-900" />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-slate-600">
              Küratörlü Koleksiyon
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl luxury-serif italic tracking-tight">
            Oturma Grupları
          </h2>
          <p className="modern-sans text-slate-500 text-sm md:text-base font-light max-w-lg leading-relaxed">
            {filteredProducts.length} seçkin model, dış mekan yaşam alanınızı
            rafine birer sanat eserine dönüştürmek için bekliyor.
          </p>
        </header>

        {/* Toolbar & Filter Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 border-b border-slate-200 pb-8">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="group flex items-center gap-3 modern-sans text-[11px] tracking-[0.2em] uppercase text-slate-500 hover:text-black transition-all"
          >
            <div
              className={cn(
                "p-2 border border-slate-200 rounded-full transition-colors group-hover:bg-slate-900 group-hover:text-white",
                isFilterOpen && "bg-slate-900 text-white"
              )}
            >
              <SlidersHorizontal size={14} />
            </div>
            {isFilterOpen ? "Filtreleri Gizle" : "Filtreleri Göster"}
          </button>

          <ProductTopBar
            gridCols={gridCols}
            setGridCols={setGridCols}
            sort={sort}
            setSort={setSort}
          />
        </div>

        <div className="flex flex-row items-start">
          {/* --- ANIMATED SIDEBAR --- */}
          <motion.aside
            initial={false}
            animate={{
              width: isFilterOpen ? "300px" : "0px",
              opacity: isFilterOpen ? 1 : 0,
              marginRight: isFilterOpen ? "60px" : "0px",
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block overflow-hidden flex-shrink-0 sticky top-32"
          >
            <div className="w-[300px]">
              <Filter
                colorFilter={colorFilter}
                setColorFilter={setColorFilter}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
              />
            </div>
          </motion.aside>

          {/* --- PRODUCT FEED --- */}
          <motion.div
            layout
            className="flex-1"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {filteredProducts.length > 0 ? (
              <div
                className={cn(
                  "grid gap-x-8 gap-y-20", // Boşluklar ikinci koda göre açıldı
                  gridCols === 1
                    ? "grid-cols-1"
                    : gridCols === 2
                    ? "grid-cols-1 md:grid-cols-2"
                    : gridCols === 3
                    ? "grid-cols-1 md:grid-cols-3"
                    : "grid-cols-1 md:grid-cols-4"
                )}
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-[40vh] flex flex-col items-center justify-center border border-dashed border-slate-200">
                <p className="luxury-serif text-2xl italic text-slate-400">
                  Sonuç bulunamadı.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* İkinci kodun can alıcı arka plan detayı */}
    </div>
  );
}
