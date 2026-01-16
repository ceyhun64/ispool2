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
import { ChevronLeft, ChevronRight, Zap, Target, Shield } from "lucide-react";
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
        <Skeleton className="aspect-[3/4] w-full bg-slate-200/50" />
        <Skeleton className="h-4 w-2/3 bg-slate-200/50" />
      </div>
    ))}
  </div>
);

export default function ÇokSatanlarCarousel() {
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
        // Çok satanlar mantığı: Gerçek API'nizde limit veya filter ekleyebilirsiniz
        if (data.products) setProducts(data.products.slice(0, 8));
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
    <div className="bg-white py-24 border-y border-slate-100 px-6 md:px-12 overflow-hidden relative">
      {/* Arka Plan Dekoratif Yazı */}
      <div className="absolute top-10 right-[-5%] text-[12rem] font-black text-slate-50 select-none pointer-events-none tracking-tighter uppercase leading-none z-0">
        Bestsellers
      </div>

      <div className="container mx-auto relative z-10">
        {/* --- HEADER: OPERASYONEL ÖNCELİK --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="bg-slate-950 p-1.5">
                <Target className="w-4 h-4 text-orange-500" />
              </div>
              <span className="text-[11px] font-black tracking-[0.3em] uppercase text-slate-950">
                Saha Favorileri / En Çok Tercih Edilenler
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-3xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase ">
              EN ÇOK SATAN <br />
              <span className="text-orange-600">EKİPMANLAR</span>
            </h2>
          </div>

          {/* Kontrol Ünitesi - Endüstriyel Butonlar */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-sm">
            <button
              onClick={() => api?.scrollPrev()}
              className="group flex items-center justify-center w-14 h-14 bg-white hover:bg-orange-600 transition-all duration-500 shadow-sm"
              aria-label="Geri"
            >
              <ChevronLeft
                className="text-slate-900 group-hover:text-white transition-colors"
                size={24}
              />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="group flex items-center justify-center w-14 h-14 bg-white hover:bg-orange-600 transition-all duration-500 shadow-sm"
              aria-label="İleri"
            >
              <ChevronRight
                className="text-slate-900 group-hover:text-white transition-colors"
                size={24}
              />
            </button>
          </div>
        </div>

        {/* --- CAROUSEL: ÜRÜN KONVOYU --- */}
        <div className="relative">
          <Carousel
            opts={{ align: "start", loop: true }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-8">
              {products.map((product, index) => (
                <CarouselItem
                  key={product.id}
                  className="pl-4 md:pl-8 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Popülerlik Rozeti */}
                    <div className="absolute top-4 left-4 z-20 bg-orange-600 text-white text-[9px] font-black px-3 py-1 uppercase tracking-widest shadow-xl">
                      En Çok Satan
                    </div>
                    <ProductCard product={product} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* --- FOOTER: DURUM GÖSTERGESİ --- */}
          <div className="mt-16 flex flex-col md:flex-row items-center justify-between border-t border-slate-200 pt-10 gap-8">
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  Envanter Akışı
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-950">
                    {current + 1 < 10 ? `0${current + 1}` : current + 1}
                  </span>
                  <span className="text-slate-300 font-bold text-xl">/</span>
                  <span className="text-slate-400 font-bold text-sm">
                    {products.length < 10
                      ? `0${products.length}`
                      : products.length}
                  </span>
                </div>
              </div>

              {/* Dinamik Progress Bar */}
              <div className="relative h-1.5 w-48 bg-slate-100 overflow-hidden rounded-full">
                <motion.div
                  initial={false}
                  animate={{
                    width: `${((current + 1) / products.length) * 100}%`,
                  }}
                  className="absolute inset-0 h-full bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.5)]"
                />
              </div>
            </div>

            {/* Teknik Bilgi Etiketleri */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-orange-500" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  Hızlı Teslimat
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-orange-500" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  Onaylı Stok
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
