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
    <div className="min-h-screen bg-slate-50 text-slate-950 px-4 md:px-6 py-12 md:py-24 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Üst Başlık Alanı */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-20 gap-8 md:gap-12">
          <div className="max-w-2xl space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 md:w-8 md:h-8  bg-slate-950 flex items-center justify-center border border-white/20">
                <Shield className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
              </div>
              <span className="text-[8px] md:text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">
                Üst Düzey Güvenlik Çözümleri
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

          {/* Rozetler */}
          <div className="hidden md:flex gap-8 lg:gap-12 border-l border-slate-100 pl-8 lg:pl-12">
            <div className="space-y-1">
              <Award className="w-5 h-5 text-orange-600" />
              <div className="flex flex-col">
                <span className="text-base font-black text-slate-950 uppercase leading-none">
                  ISO-9001
                </span>
                <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase mt-1">
                  Sertifikalı Üretim
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <Zap className="w-5 h-5 text-orange-600" />
              <div className="flex flex-col">
                <span className="text-base font-black text-slate-950 uppercase leading-none">
                  +500B
                </span>
                <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase mt-1">
                  Aktif Kullanıcı
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Ürün Listesi */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-10 md:gap-y-20 mb-20 md:mb-32">
          {products.slice(0, 8).map((product) => (
            <div key={product.id} className="relative group ">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Kurumsal Alt Banner - Toptan Satış */}
        <footer className="relative bg-slate-950 overflow-hidden group border border-white/5 ">
          {/* Arka Plan Görseli */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80')] opacity-10 grayscale group-hover:scale-105 transition-transform duration-[3s]" />

          {/* Katman Efekti */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-0" />

          <div className="relative z-10 p-8 sm:p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-16">
            <div className="max-w-2xl space-y-4 md:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-600/10 border border-orange-600/20 text-orange-500 text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase ">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 bg-orange-500"></span>
                </span>
                B2B Kurumsal İş Ortaklığı
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase leading-[0.95] text-white">
                KURUMSAL HACİMDE <br className="hidden md:block" />
                <span className="text-orange-600">PROFESYONEL</span> TEDARİK
              </h3>

              <p className="text-slate-400 font-medium tracking-wide text-xs md:text-sm max-w-xl mx-auto lg:mx-0 opacity-80 leading-relaxed">
                Şirketinizin kurumsal kimliğine özel tasarım, yüksek adetli
                üretim kapasitesi ve lojistik gücümüzle küresel standartlarda
                çözüm sunuyoruz. Toptan satış avantajlarını keşfedin.
              </p>
            </div>

            {/* Yönlendirme Butonu */}
            <div className="w-full lg:w-auto flex flex-col items-center gap-4">
              <Link href="/products/wholesale" className="w-full md:w-auto">
                <button className="w-full rounded-sm md:w-auto flex items-center justify-center gap-4 bg-white text-slate-950 px-8 md:px-14 py-5 md:py-7 font-black text-[11px] md:text-[12px] tracking-[0.15em] transition-all duration-500 hover:bg-orange-600 hover:text-white shadow-2xl hover:shadow-orange-900/20 group">
                  TOPTAN SATIŞ MERKEZİ
                  <ArrowRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-2" />
                </button>
              </Link>
              <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase opacity-50">
                Hızlı Teklif & Kurumsal Katalog
              </span>
            </div>
          </div>

          {/* Arka Plan Dekoratif Fabrika İkonu */}
          <Factory className="absolute right-[-5%] bottom-[-10%] w-64 h-64 md:w-96 md:h-96 text-white/[0.03] -rotate-12 pointer-events-none group-hover:text-orange-600/5 transition-colors duration-1000" />
        </footer>
      </div>
    </div>
  );
}
