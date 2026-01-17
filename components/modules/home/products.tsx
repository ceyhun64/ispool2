"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCard from "../products/productCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Factory, Shield, Award, Zap } from "lucide-react";

interface ProductData {
  id: number;
  title: string;
  mainImage: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  category: string;
}

const ProductCardSkeleton = () => (
  <div className="space-y-4 p-4 bg-slate-50/50">
    <Skeleton className="aspect-[3/4] w-full bg-slate-200 rounded-none" />
    <div className="space-y-3">
      <Skeleton className="h-2 w-1/4 bg-slate-200" />
      <Skeleton className="h-4 w-3/4 bg-slate-300" />
    </div>
  </div>
);

export default function Products() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-white px-6 py-12 md:py-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-950 px-4 md:px-6 py-12 md:py-24 relative overflow-hidden">
      {/* Arka Plan Dokusu */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header - Boyutlar Küçültüldü */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-20 gap-8 md:gap-12">
          <div className="max-w-2xl space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-950 flex items-center justify-center border border-white/20">
                <Shield className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
              </div>
              <span className="text-[8px] md:text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">
                Premium Safety Solutions
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-900 leading-[1.1] uppercase">
              YÜKSEK <span className="text-orange-600">PERFORMANS</span> <br />
              MÜHENDİSLİĞİ
            </h2>

            <div className="flex gap-3 md:gap-4 items-start">
              <div className="w-[2px] h-8 md:h-12 bg-orange-600 mt-1" />
              <p className="text-slate-500 text-xs md:text-base font-medium max-w-sm leading-relaxed">
                Endüstriyel standartların ötesinde, dayanıklılık ve konforun
                zirvesinde teknik ekipmanlar.
              </p>
            </div>
          </div>

          {/* Rozetler - Mobilde Gizlendi, Masaüstünde Daha Zarif */}
          <div className="hidden md:flex gap-8 lg:gap-12 border-l border-slate-100 pl-8 lg:pl-12">
            <div className="space-y-1">
              <Award className="w-5 h-5 text-orange-600" />
              <div className="flex flex-col">
                <span className="text-base font-black text-slate-950 uppercase leading-none">
                  ISO-9001
                </span>
                <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase mt-1">
                  Sertifikalı
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <Zap className="w-5 h-5 text-orange-600" />
              <div className="flex flex-col">
                <span className="text-base font-black text-slate-950 uppercase leading-none">
                  +500k
                </span>
                <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase mt-1">
                  Kullanıcı
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Ürün Grid - Boşluklar Mobilde Daraltıldı */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-10 md:gap-y-20 mb-20 md:mb-32">
          {products.slice(0, 8).map((product) => (
            <div
              key={product.id}
              className="relative group "
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Kurumsal Banner - Mobilde Daha Okunaklı */}
        <footer className="relative bg-slate-950 overflow-hidden group border border-white/5">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80')] opacity-5 grayscale group-hover:scale-105 transition-transform duration-[2s]" />

          <div className="relative z-10 p-6 sm:p-12 lg:p-20 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 text-center md:text-left">
            <div className="space-y-3 md:space-y-4">
              <div className="inline-block px-2 py-0.5 bg-orange-600 text-white text-[8px] md:text-[9px] font-black tracking-[0.2em] uppercase">
                B2B Özel Tedarik
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tighter uppercase leading-none text-white">
                KURUMSAL PROJE <br className="hidden md:block" /> ÇÖZÜMLERİ
              </h3>
              <p className="text-slate-400 font-medium tracking-wide text-[10px] md:text-sm max-w-md uppercase opacity-70">
                Şirketinize özel teknik şartname ve yüksek adetli üretim
                operasyonları.
              </p>
            </div>

            <Link href="/products" className="w-full md:w-auto">
              <button className="w-full md:w-auto flex items-center justify-center gap-4 bg-white text-slate-950 px-8 md:px-12 py-4 md:py-6 rounded-none font-black text-[10px] md:text-[11px] tracking-[0.1em] transition-all duration-500 hover:bg-orange-600 hover:text-white">
                TEKLİF TALEBİ OLUŞTUR
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-500 group-hover:translate-x-2" />
              </button>
            </Link>
          </div>

          <Factory className="absolute right-[-10%] top-[-10%] w-48 h-48 md:w-96 md:h-96 text-white/[0.02] -rotate-12 pointer-events-none" />
        </footer>
      </div>
    </div>
  );
}
