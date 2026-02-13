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
  description: string;
}

const initialCategories: CategoryData[] = [
  {
    id: 1,
    name: "KENDİN TASARLA",
    subTitle: "Sınırları siz çizin, biz dikelim.",
    description:
      "Kumaş türünden cep detayına, renk kombinasyonlarından fonksiyonel eklentilere kadar her şeyi markanıza özel dijital ortamda yapılandırın.",
    image: "/categories/3.png",
    href: "/products",
  },
  {
    id: 2,
    name: "DİJİTAL ÖNİZLEME",
    subTitle: "Gerçekliği siparişten önce görün.",
    description:
      "Logonuzu yükleyin, yerleşimini seçin ve ürünün üzerinde nasıl duracağını 3D simülasyon teknolojimizle anında yüksek çözünürlükte inceleyin.",
    image: "/categories/4.png",
    href: "/products",
  },
];

export default function CategoriesSection() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    // Arka planı biraz daha belirginleştirdik veya metinleri koyulaştırdık
    <section className="bg-slate-100 py-12 md:py-24 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 md:px-12 relative z-10">
        {/* Başlık Alanı */}
        <div className="mb-10 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-10">
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-3">
              {/* KONTRAST DÜZELTMESİ: orange-600 -> orange-700 (Okunabilirlik için) */}
              <span className="h-[2px] w-8 md:w-12 bg-orange-700" />
              <span className="text-orange-700 font-black tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-[11px] uppercase">
                İnovasyon Merkezi v2.0
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-slate-950 leading-[1.1] uppercase">
              GELECEĞİN İŞ GÜVENLİĞİ <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-900">
                DENEYİMİ
              </span>
            </h2>
          </div>

          <div className="max-w-md border-l-2 md:border-l border-orange-700/30 pl-4 md:pl-8 py-1">
            {/* KONTRAST DÜZELTMESİ: text-slate-600 -> text-slate-800 */}
            <p className="text-slate-800 text-sm md:text-base font-semibold leading-relaxed italic">
              "Hayal ettiğiniz profesyonel görünümü, gelişmiş tasarım
              araçlarımızla sadece birkaç tıklamayla gerçeğe dönüştürün."
            </p>
          </div>
        </div>

        {/* Grid Alanı */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 ">
          {loading
            ? Array.from({ length: 2 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="aspect-[16/9] w-full rounded-xl bg-slate-200"
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
      className="group relative block overflow-hidden bg-slate-950 aspect-[11/9] sm:aspect-[11/9] rounded-xl border border-white/10 shadow-2xl"
    >
      {/* Görsel Katmanı */}
      <div className="relative w-full h-full rounded-xl">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover rounded-xl transition-transform duration-1000 ease-out group-hover:scale-105 opacity-60 group-hover:opacity-80 grayscale-[0.2] group-hover:grayscale-0"
        />
        {/* Gradient koyuluğu artırıldı (Metin kontrastı için) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent z-10" />
      </div>

      {/* İçerik Katmanı */}
      <div className="absolute inset-0 p-6 sm:p-10 md:p-12 flex flex-col justify-between z-20">
        <div className="flex justify-between items-start">
          <div className="p-3 md:p-4 -translate-y-1 md:-translate-y-2 group-hover:translate-y-0 transition-transform duration-500 bg-white/10 backdrop-blur-md rounded-sm border border-white/20">
            {category.id === 1 ? (
              <Cpu className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
            ) : (
              <ScanEye className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
            )}
          </div>

          <div className="flex flex-col items-end opacity-60 group-hover:opacity-100 transition-opacity">
            <span className="text-white font-mono text-[8px] md:text-[10px] tracking-widest uppercase">
              System.Process // {category.id}
            </span>
            <Layers size={12} className="text-orange-500 mt-1" />
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl text-white font-black tracking-tighter uppercase leading-none drop-shadow-lg">
              {category.name}
            </h3>
            {/* KONTRAST DÜZELTMESİ: Turuncu tonu metin üzerinde daha parlak yapıldı */}
            <p className="text-orange-400 text-[11px] md:text-xs font-black tracking-[0.15em] uppercase">
              {category.subTitle}
            </p>
          </div>

          <p className="text-slate-100 text-xs md:text-sm max-w-[280px] sm:max-w-sm leading-relaxed tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 font-medium">
            {category.description}
          </p>

          <div className="flex items-center gap-4 md:gap-6 pt-2 md:pt-4">
            <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-[11px] font-black text-white uppercase tracking-[0.2em] md:tracking-[0.3em] group-hover:text-orange-400 transition-colors duration-300">
              TASARIMA BAŞLA
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 transition-transform duration-500 group-hover:translate-x-2" />
            </div>
            <div className="flex-1 h-[1px] bg-white/30 group-hover:bg-orange-500/50 transition-colors duration-500" />
          </div>
        </div>
      </div>

      {/* Tarayıcı Çizgisi Animasyonu */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-orange-500/80 -translate-y-full group-hover:animate-scan pointer-events-none z-30 shadow-[0_0_15px_rgba(234,88,12,0.9)]" />

      {/* Köşe Detayları */}
      <div className="absolute top-3 left-3 md:top-4 md:left-4 w-4 h-4 border-t-2 border-l-2 border-orange-500/0 group-hover:border-orange-500 transition-all duration-500 z-30" />
      <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-4 h-4 border-b-2 border-r-2 border-orange-500/0 group-hover:border-orange-500 transition-all duration-500 z-30" />
    </Link>
  );
}
