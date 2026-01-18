"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import ProductCard from "../productCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface ProductData {
  id: number;
  title: string;
  mainImage: string;
  price: number;
  category: string;
}

const CarouselSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="space-y-4">
        <Skeleton className="aspect-[3/4] w-full bg-slate-100 rounded-lg" />
        <Skeleton className="h-4 w-2/3 bg-slate-100" />
      </div>
    ))}
  </div>
);
export default function YeniUrunlerCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.products) setProducts(data.products);
      } catch (error) {
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20">
        <CarouselSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-slate-100 py-20 border-t px-12 border-slate-50 overflow-hidden">
      <div className="container mx-auto relative">
        {/* Modern Header - Boyut Optimize Edildi */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-3"
            >
              <Activity className="w-3.5 h-3.5 text-orange-600" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-orange-600">
                Performans Serisi
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-2xl font-bold text-slate-950 tracking-tight leading-tight uppercase">
              ÖNERİLEN{" "}
              <span className="text-slate-400 font-medium">ÜRÜNLER</span>
            </h2>
          </div>

          {/* Kontrol Ünitesi - Küçültüldü */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => api?.scrollPrev()}
              className="group flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 hover:bg-slate-950 transition-all duration-300"
              aria-label="Geri"
            >
              <ChevronLeft
                className="text-slate-900 group-hover:text-white transition-colors"
                size={20}
              />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="group flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 hover:bg-slate-950 transition-all duration-300"
              aria-label="İleri"
            >
              <ChevronRight
                className="text-slate-900 group-hover:text-white transition-colors"
                size={20}
              />
            </button>
          </div>
        </div>

        {/* Carousel Alanı */}
        <div className="relative">
          <Carousel
            opts={{ align: "start", loop: true }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Alt Bilgi Şeridi - Daha Kibar */}
          <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-6">
            <div className="flex items-center gap-5">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Aşama
                </span>
                <span className="text-lg font-bold text-slate-950">
                  0{current + 1} <span className="text-slate-300 mx-1">/</span>{" "}
                  0{products.length}
                </span>
              </div>

              <div className="relative h-1 w-32 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{
                    width: `${((current + 1) / products.length) * 100}%`,
                  }}
                  className="absolute inset-0 h-full bg-orange-600"
                />
              </div>
            </div>

            <div className="hidden md:block text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
              Saha Testleri Tamamlandı — v.2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
