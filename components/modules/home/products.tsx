"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCard from "../products/productCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, ShieldCheck, Factory, HardHat } from "lucide-react";

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
  <div className="space-y-4 border border-slate-100 p-4">
    <Skeleton className="aspect-[4/5] w-full bg-slate-100 rounded-none" />
    <div className="space-y-3">
      <Skeleton className="h-3 w-1/4 bg-slate-100" />
      <Skeleton className="h-5 w-3/4 bg-slate-200" />
      <Skeleton className="h-4 w-1/2 bg-slate-100" />
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
      <div className="min-h-screen bg-white px-6 py-24 text-center">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-950 px-6 py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header - Küçültülmüş ve Modernize Edilmiş */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-orange-600 text-white text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase">
                Pro-Series 2026
              </span>
              <div className="h-[1px] w-8 bg-slate-200" />
              <span className="text-[9px] font-semibold tracking-widest uppercase text-slate-500">
                Endüstriyel Koruma
              </span>
            </div>

            <h2 className="text-3xl md:text-2xl font-bold tracking-tight leading-tight text-slate-950 uppercase">
              Saha Şartlarına <br />
              <span className="text-orange-600">Tam Adaptasyon</span>
            </h2>

            <p className="text-slate-600 text-sm md:text-sm font-normal max-w-md leading-relaxed border-l-2 border-orange-600 pl-4">
              En zorlu çalışma ortamları için uluslararası sertifikalı teknik
              tekstil çözümleri. Güvenlik bir tercih değil, standarttır.
            </p>
          </div>

          {/* İstatistik Rozetleri - Daha Kibar Fontlar */}
          <div className="hidden lg:flex gap-10 border-t border-slate-100 pt-6">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-950 uppercase">
                CE-EN
              </span>
              <span className="text-[9px] font-medium text-slate-400 tracking-wider uppercase">
                Sertifikalı
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-950">+5.000</span>
              <span className="text-[9px] font-medium text-slate-400 tracking-wider uppercase">
                Kurumsal Müşteri
              </span>
            </div>
          </div>
        </header>

        {/* Ürün Grid - Boşluklar Dengelendi */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-20">
          {products.slice(0, 8).map((product) => (
            <div key={product.id} className="group relative">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Footer Action - Daha Dengeli CTA */}
        <footer className="bg-slate-950 p-10 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 group cursor-pointer overflow-hidden relative">
          <Factory className="absolute right-[-2%] bottom-[-10%] w-64 h-64 text-white/[0.03] -rotate-12 pointer-events-none" />

          <div className="relative z-10 space-y-2 text-center md:text-left">
            <h3 className="text-white text-2xl md:text-xl font-bold tracking-tight uppercase">
              Kurumsal Çözümler <br className="hidden md:block" />& Toplu
              Tedarik
            </h3>
            <p className="text-slate-400 font-medium tracking-wide text-[11px] md:text-xs uppercase">
              Teknik şartnameye uygun teklif talebi oluşturun
            </p>
          </div>

          <Link href="/products" className="relative z-10 w-full md:w-auto">
            <button className="w-full md:w-auto flex items-center justify-center gap-4 bg-orange-600 text-white px-8 py-4 rounded-none hover:bg-white hover:text-slate-950 transition-all duration-500 shadow-xl">
              <span className="text-[10px] font-bold tracking-widest uppercase">
                Kataloğu İncele
              </span>
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
            </button>
          </Link>
        </footer>
      </div>
    </div>
  );
}
