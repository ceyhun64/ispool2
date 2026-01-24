"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Cpu, ScanEye, Layers } from "lucide-react";

interface CategoryData {
  id: number;
  name: string;
  subTitle: string;
  image: string;
  href: string;
  accentColor: string;
}

const initialCategories: CategoryData[] = [
  {
    id: 1,
    name: "KENDİN TASARLA",
    subTitle: "Kurumsal kimliğinizi iş kıyafetlerinize yansıtın.",
    image: "/categories/1.webp",
    href: "/tasarla",
    accentColor: "border-orange-600",
  },
  {
    id: 2,
    name: "DİJİTAL ÖNİZLEME",
    subTitle: "Sipariş öncesi ürünleri model üzerinde görün.",
    image: "/categories/2.webp",
    href: "/onizleme",
    accentColor: "border-orange-600",
  },
];

export default function CategoriesSection() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-slate-100 py-12 md:py-24 relative overflow-hidden">
      {/* Arka Plan Teknik Detaylar */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-12 relative z-10">
        {/* Başlık Alanı */}
        <div className="mb-10 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-10">
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-8 md:w-12 bg-orange-600" />
              <span className="text-orange-600 font-black tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] uppercase">
                İnovasyon Merkezi v2.0
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-900 leading-[1.1] uppercase">
              GELECEĞİN İŞ GÜVENLİĞİ <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-800">
                DENEYİMİ
              </span>
            </h2>
          </div>

          <div className="max-w-md border-l-2 md:border-l border-orange-600/20 md:border-white/10 pl-4 md:pl-8 py-1">
            <p className="text-slate-600 text-xs md:text-sm font-medium leading-relaxed">
              En son teknoloji ile donatılmış iş elbiselerini kişiselleştirin ve
              operasyonel verimliliğinizi artırın.
            </p>
          </div>
        </div>

        {/* Grid Alanı */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {loading
            ? Array.from({ length: 2 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="aspect-[16/9] w-full rounded-none bg-slate-200"
                />
              ))
            : initialCategories.map((category) => (
                <ModernCategoryCard key={category.id} category={category} />
              ))}
        </div>
      </div>
    </section>
  );
}

function ModernCategoryCard({ category }: { category: CategoryData }) {
  return (
    <Link
      href={category.href}
      className="group relative block overflow-hidden bg-black aspect-[4/3] sm:aspect-[16/9] border border-white/5 "
    >
      {/* Görsel Katmanı */}
      <div className="relative w-full h-full">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105 opacity-60 group-hover:opacity-40 grayscale-[0.5] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/40 to-orange-950/30" />
      </div>

      {/* İçerik Katmanı */}
      <div className="absolute inset-0 p-6 sm:p-10 md:p-14 flex flex-col justify-between z-20">
        <div className="flex justify-between items-start">
          <div className="bg-orange-600 p-3 md:p-4  -translate-y-1 md:-translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            {category.id === 1 ? (
              <Cpu className="w-5 h-5 md:w-6 md:h-6 text-white" />
            ) : (
              <ScanEye className="w-5 h-5 md:w-6 md:h-6 text-white" />
            )}
          </div>

          <div className="flex flex-col items-end opacity-40">
            <span className="text-white font-mono text-[8px] md:text-[10px] tracking-widest">
              UNIT_CODE: {category.id}00-X
            </span>
            <Layers size={12} className="text-white mt-1" />
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="relative">
            <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl text-white font-black tracking-tighter uppercase leading-none">
              {category.name}
            </h3>
            {/* Mobilde çizgiyi gizle veya küçült (Opsiyonel: md:block) */}
            <div
              className={`hidden md:block absolute -left-14 top-1/2 w-10 h-[2px] bg-orange-600 opacity-0 group-hover:opacity-100 transition-all duration-500`}
            />
          </div>

          <p className="text-slate-300 text-xs md:text-base max-w-[280px] sm:max-w-sm leading-snug tracking-tight">
            {category.subTitle}
          </p>

          <div className="flex items-center gap-4 md:gap-6 pt-2 md:pt-6">
            <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.2em] md:tracking-[0.3em] group-hover:text-orange-500 transition-colors duration-300">
              HEMEN KEŞFET
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 transition-transform duration-500 group-hover:translate-x-2" />
            </div>
            <div className="flex-1 h-[1px] bg-white/10 group-hover:bg-orange-600/30 transition-colors duration-500" />
          </div>
        </div>
      </div>

      {/* Tarayıcı Çizgisi Animasyonu */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-orange-600/20  -translate-y-full group-hover:animate-scan pointer-events-none" />

      {/* Köşe Detayları */}
      <div className="absolute top-3 left-3 md:top-4 md:left-4 w-2 h-2 border-t border-l border-white/20" />
      <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-2 h-2 border-b border-r border-white/20" />
    </Link>
  );
}
