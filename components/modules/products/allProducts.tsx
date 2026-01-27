// /components/modules/products/ProductsContent.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./productCard";
import Filter from "./filter";
import ProductTopBar from "./productTopbar";
import { cn } from "@/lib/utils";
import ProductSkeleton from "./productSkeleton";
import {
  SlidersHorizontal,
  X,
  Activity,
  ShieldCheck,
  Zap,
  Cog,
} from "lucide-react";
import MobileFilter from "./mobileFilter";

interface ProductsContentProps {
  id?: number; // undefined ise tüm ürünler
}

export default function ProductsContent({ id }: ProductsContentProps) {
  // Mevcut kategoriyi bul (id varsa)
  const [currentCategory, setCurrentCategory] = useState<any>(null);

  const [subCategoryFilter, setSubCategoryFilter] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(300000);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [sort, setSort] = useState<"az" | "za" | "priceLow" | "priceHigh">(
    "az",
  );
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);
  const [mobileGridCols, setMobileGridCols] = useState<1 | 2>(2);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Kategori bilgisini API'den çek
  useEffect(() => {
    async function fetchCategory() {
      if (!id) {
        setCurrentCategory(null);
        return;
      }

      try {
        const res = await fetch(`/api/category/${id}`);
        const data = await res.json();
        if (data) {
          setCurrentCategory(data);
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    }

    fetchCategory();
  }, [id]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        // id yoksa tüm ürünleri getir
        const url = !id ? "/api/products" : `/api/products/category/${id}`;

        const res = await fetch(url);
        const data = await res.json();
        if (data.products) setProducts(data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [id]);

  useEffect(() => {
    document.body.style.overflow = isMobileFilterOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileFilterOpen]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const subCategoryCheck =
        subCategoryFilter === "all" || p.subCategory === subCategoryFilter;
      const brandCheck =
        brandFilter === "all" || p.brandId === Number(brandFilter); // brandId number olarak karşılaştır
      return (
        p.price >= minPrice &&
        p.price <= maxPrice &&
        subCategoryCheck &&
        brandCheck
      );
    });

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
  }, [subCategoryFilter, brandFilter, minPrice, maxPrice, products, sort]);

  if (loading) return <ProductSkeleton />;

  // Kategori bulunamadıysa (id varsa ama kategori yoksa)
  if (id && !currentCategory) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-4">
            Kategori Bulunamadı
          </h1>
          <p className="text-slate-600">Aradığınız kategori mevcut değil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 selection:bg-orange-500 selection:text-white relative font-sans overflow-x-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] -z-10" />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-12 relative z-10">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 lg:gap-10 mb-8 sm:mb-16">
          <div className="relative w-full lg:w-auto">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-orange-600 animate-pulse" />
                <span className="w-2 h-2 bg-slate-300" />
                <span className="w-2 h-2 bg-slate-300" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase text-slate-400 border-l border-slate-300 pl-2 sm:pl-3">
                Industrial Safety Inventory v4.0
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase">
              {currentCategory?.name || "TÜM ÜRÜNLER"} <br />
              <span className="text-orange-600">KATALOĞU</span>
            </h1>

            <div className="mt-4 sm:mt-6 flex items-center gap-3 sm:gap-4">
              <div className="h-[2px] w-8 sm:w-12 bg-orange-600" />
              <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-relaxed">
                Saha Standartlarına Uygun{" "}
                <span className="text-slate-900">
                  {filteredProducts.length}
                </span>{" "}
                Birim Listeleniyor
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full lg:w-auto">
            {[
              {
                label: "Güvenlik Skoru",
                val: "%100",
                icon: ShieldCheck,
                color: "text-emerald-600",
              },
              {
                label: "Anlık Stok",
                val: products.length,
                icon: Activity,
                color: "text-orange-600",
              },
              {
                label: "Standartlar",
                val: "EN/ISO",
                icon: Cog,
                color: "text-blue-600",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-slate-50 p-3 sm:p-5 min-w-[100px] sm:min-w-[140px] group hover:border-b-2 hover:border-b-orange-600 transition-all duration-300"
              >
                <stat.icon
                  size={16}
                  className={`${stat.color} mb-2 sm:mb-3 group-hover:rotate-180 transition-transform duration-500`}
                />
                <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mb-1">
                  {stat.val}
                </div>
                <div className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </header>

        <div className="lg:hidden sticky top-0 z-40 mb-6 bg-slate-100/95 backdrop-blur-sm py-3 -mx-4 px-4 sm:-mx-6 sm:px-6">
          <div className="flex gap-2">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex-1 flex items-center rounded-sm justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-slate-900 text-white text-[10px] sm:text-[11px] font-black tracking-widest uppercase"
            >
              <SlidersHorizontal size={14} className="text-orange-500" />
              PARAMETRELER
            </button>
          </div>
        </div>

        <div className="hidden lg:flex sticky top-24 z-40 mb-12 items-center justify-between gap-4 p-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "flex items-center gap-4 px-8 py-4 rounded-sm transition-all font-black text-[11px] tracking-[0.2em] uppercase",
                isFilterOpen
                  ? "bg-slate-900 text-white"
                  : "bg-transparent text-slate-600 hover:bg-slate-100",
              )}
            >
              <SlidersHorizontal
                size={16}
                className={isFilterOpen ? "text-orange-500" : "text-slate-400"}
              />
              {isFilterOpen ? "Filtreyi Kapat" : "Filtrele"}
            </button>
          </div>

          <div className="flex-1 bg-slate-50">
            <ProductTopBar
              gridCols={gridCols}
              setGridCols={setGridCols}
              sort={sort}
              setSort={setSort}
            />
          </div>
        </div>

        <div className="flex flex-row items-start gap-8">
          <AnimatePresence initial={false} mode="wait">
            {isFilterOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0, marginRight: 0 }}
                animate={{ width: 320, opacity: 1, marginRight: 32 }}
                exit={{ width: 0, opacity: 0, marginRight: 0 }}
                transition={{ duration: 0.3, ease: "circOut" }}
                className="hidden lg:block sticky top-48 self-start overflow-hidden flex-shrink-0"
              >
                <div className="w-[320px] bg-slate-50 border border-slate-200 p-8 relative overflow-hidden">
                  <Filter
                    currentCategory={currentCategory}
                    subCategoryFilter={subCategoryFilter}
                    setSubCategoryFilter={setSubCategoryFilter}
                    brandFilter={brandFilter}
                    setBrandFilter={setBrandFilter}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                  />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <motion.div layout className="flex-1">
            {filteredProducts.length > 0 ? (
              <div
                className={cn(
                  "grid gap-4 sm:gap-6 lg:gap-8 transition-all duration-500",
                  mobileGridCols === 1 ? "grid-cols-1" : "grid-cols-2",
                  "sm:grid-cols-2",
                  gridCols === 2 && "lg:grid-cols-2",
                  gridCols === 3 && "lg:grid-cols-3",
                  gridCols === 4 && "lg:grid-cols-4",
                )}
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-white/50">
                <div className="relative mb-6">
                  <Zap size={64} className="text-slate-200" />
                  <X
                    size={24}
                    className="absolute top-0 right-0 text-orange-600 animate-bounce"
                  />
                </div>
                <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] text-center max-w-xs leading-loose">
                  Hata: Arama kriterlerine uygun teknik spesifikasyon
                  bulunamadı.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {isMobileFilterOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="lg:hidden fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="px-6 sm:px-8 py-6 sm:py-8 border-b-2 border-slate-900 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 bg-slate-900 flex items-center justify-center">
                  <SlidersHorizontal size={18} className="text-orange-500" />
                </div>
                <div className="flex flex-col">
                  <span className="font-black tracking-widest uppercase text-xs">
                    Konfigüratör
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                    Saha Ekipman Ayarları
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-10 rounded-sm h-10 border border-slate-200 flex items-center justify-center hover:bg-slate-50"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <MobileFilter
                currentCategory={currentCategory}
                subCategoryFilter={subCategoryFilter}
                setSubCategoryFilter={setSubCategoryFilter}
                brandFilter={brandFilter}
                setBrandFilter={setBrandFilter}
                minPrice={minPrice}
                maxPrice={maxPrice}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                mobileGridCols={mobileGridCols}
                setMobileGridCols={setMobileGridCols}
                sort={sort}
                setSort={setSort}
              />
            </div>

            <div className="p-6 sm:p-8 border-t bg-slate-50">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full rounded-sm py-5 sm:py-6 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-orange-600 transition-colors duration-500"
              >
                Sistemleri Güncelle
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
