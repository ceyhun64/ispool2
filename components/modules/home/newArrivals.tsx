"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import ProductCard from "../products/productCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductData {
  id: number;
  title: string;
  mainImage: string;
  price: number;
  category: string;
}

const CarouselSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="space-y-4">
        <Skeleton className="aspect-[3/4] w-full bg-slate-200/60 rounded-xl" />
        <Skeleton className="h-4 w-2/3 bg-slate-200/60" />
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
      <div className="container mx-auto px-4 py-12 md:py-20">
        <CarouselSkeleton />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 text-slate-950 px-4 md:px-6 py-12 md:py-24 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header - Mobil Uyumlu Düzen */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-14 gap-6">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-3"
            >
              <Activity className="w-4 h-4 text-orange-600" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-orange-600">
                Performans Serisi
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 leading-none uppercase">
              YENİ <span className="text-slate-400 font-medium">NESİL</span>
              <br />
              ZIRHLAR
            </h2>
          </div>

          {/* Kontrol Butonları - Mobilde Gizlenebilir veya Küçültülebilir */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => api?.scrollPrev()}
              className="group flex rounded-sm items-center justify-center w-10 h-10 md:w-12 md:h-12 border border-slate-200 bg-white hover:bg-slate-950 transition-all duration-300 active:scale-95"
              aria-label="Geri"
            >
              <ChevronLeft
                className="text-slate-900 group-hover:text-white transition-colors"
                size={20}
              />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="group flex rounded-sm items-center justify-center w-10 h-10 md:w-12 md:h-12 border border-slate-200 bg-white hover:bg-slate-950 transition-all duration-300 active:scale-95"
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
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true, // Mobilde daha akıcı kaydırma deneyimi
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div className="h-full py-2">
                    {" "}
                    {/* Kart gölgeleri kesilmesin diye */}
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Progress Bar & Counter */}
          <div className="mt-10 md:mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-200 pt-8">
            <div className="flex items-center gap-6 w-full sm:w-auto">
              <div className="flex flex-col min-w-[60px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Aşama
                </span>
                <div className="text-xl font-mono font-bold text-slate-950 flex items-baseline">
                  <span>0{current + 1}</span>
                  <span className="text-slate-300 mx-2 text-sm">/</span>
                  <span className="text-slate-400 text-sm">
                    0{products.length}
                  </span>
                </div>
              </div>

              <div className="relative h-[2px] flex-1 sm:w-48 bg-slate-200 overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{
                    width: `${((current + 1) / products.length) * 100}%`,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0 h-full bg-orange-600"
                />
              </div>
            </div>

            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] bg-slate-100 px-4 py-2 rounded-full hidden md:block">
              Saha Testleri Tamamlandı — v.2026
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
