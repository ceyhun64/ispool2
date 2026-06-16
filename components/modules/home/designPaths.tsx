"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  ScanEye,
  Upload,
  Layers,
  Wand2,
  Palette,
  Download,
  Move,
  CheckCircle2,
} from "lucide-react";

const FEATURES = [
  {
    icon: Upload,
    title: "Logo Yükleme",
    desc: "PNG, JPG veya SVG formatında logonuzu saniyeler içinde yükleyin",
  },
  {
    icon: Wand2,
    title: "Arka Plan Kaldırma",
    desc: "Yapay zeka destekli araçla logonuzun arka planını tek tıkla temizleyin",
  },
  {
    icon: Palette,
    title: "Renk Paleti Düzenleme",
    desc: "Çok renkli logolarda her rengi bağımsız olarak değiştirin",
  },
  {
    icon: Move,
    title: "Sürükle & Konumlandır",
    desc: "Logonuzu ürün üzerinde istediğiniz noktaya serbestçe taşıyın ve boyutlandırın",
  },
  {
    icon: Layers,
    title: "Çok Katman Desteği",
    desc: "Aynı tasarıma birden fazla logo veya grafik katmanı ekleyin",
  },
  {
    icon: Download,
    title: "Yüksek Çözünürlük Çıktı",
    desc: "Tasarımınızı 2× piksel oranında baskıya hazır PNG olarak dışa aktarın",
  },
];

const STEPS = [
  { num: "01", label: "Logo Yükle" },
  { num: "02", label: "Konumlandır" },
  { num: "03", label: "Özelleştir" },
  { num: "04", label: "Kaydet" },
];

export default function CategoriesSection() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-slate-100 py-12 md:py-24 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 md:px-12 relative z-10">
        {/* Başlık */}
        <div className="mb-10 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-10">
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-3">
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
            <p className="text-slate-800 text-sm md:text-base font-semibold leading-relaxed italic">
              "Hayal ettiğiniz profesyonel görünümü, gelişmiş tasarım
              araçlarımızla sadece birkaç tıklamayla gerçeğe dönüştürün."
            </p>
          </div>
        </div>

        {/* Ana Kart */}
        {loading ? (
          <Skeleton className="w-full h-125 rounded-xl bg-slate-200" />
        ) : (
          <div className="relative overflow-hidden rounded-xl bg-slate-950 border border-white/10 shadow-2xl">
            {/* Tarayıcı çizgisi */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-orange-500/80 shadow-[0_0_15px_rgba(234,88,12,0.9)] z-30" />
            {/* Köşe detayları */}
            <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-orange-500 z-30" />
            <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-orange-500 z-30" />

            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-120 md:min-h-140">
              {/* Sol: İçerik */}
              <div className="flex flex-col justify-between p-8 sm:p-10 md:p-14 z-20 relative">
                {/* Üst bilgi */}
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 md:p-4 bg-white/10 backdrop-blur-md rounded-sm border border-white/20">
                    <ScanEye className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                  </div>
                  <div className="flex flex-col items-end opacity-60">
                    <span className="text-white font-mono text-[8px] md:text-[10px] tracking-widest uppercase">
                      System.Process // 01
                    </span>
                    <Layers size={12} className="text-orange-500 mt-1" />
                  </div>
                </div>

                {/* Başlık grubu */}
                <div className="space-y-3 mb-8">
                  <p className="text-orange-400 text-[11px] md:text-xs font-black tracking-[0.15em] uppercase">
                    Gerçekliği siparişten önce görün.
                  </p>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl text-white font-black tracking-tighter uppercase leading-none drop-shadow-lg">
                    DİJİTAL<br />ÖNİZLEME
                  </h3>
                  <p className="text-slate-300 text-sm md:text-base max-w-md leading-relaxed font-medium">
                    Logonuzu yükleyin, yerleşimini seçin ve ürünün üzerinde
                    nasıl duracağını gelişmiş tasarım araçlarımızla anında
                    inceleyin. Siparişten önce tam kontrol sizde.
                  </p>
                </div>

                {/* Adımlar */}
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  {STEPS.map((step, i) => (
                    <React.Fragment key={step.num}>
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded px-3 py-1.5 border border-white/10">
                        <span className="text-orange-400 font-mono text-[10px] font-black">
                          {step.num}
                        </span>
                        <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-wide">
                          {step.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <ArrowRight size={12} className="text-orange-500/60" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href="/products"
                  className="self-start flex items-center gap-3 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded transition-all duration-300 text-[11px] md:text-xs font-black tracking-[0.2em] uppercase group"
                >
                  TASARIMA BAŞLA
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>

              {/* Sağ: Görsel + Özellik Listesi */}
              <div className="flex flex-col">
                {/* Görsel — mobilde arka plan, masaüstünde sıralı üst blok */}
                <div className="relative min-h-60 lg:flex-1">
                  <Image
                    src="/categories/1.jpg"
                    alt="Dijital Önizleme"
                    fill
                    className="object-cover lg:object-contain object-center opacity-60 transition-opacity duration-700"
                  />
                  {/* Sadece mobilede sol kenar geçiş gradyanı */}
                  <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/10 to-transparent lg:hidden" />
                </div>

                {/* Özellikler paneli — her zaman görselin altında */}
                <div className="flex items-end">
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-px bg-white/5 border-t border-white/10">
                    {FEATURES.map((f) => {
                      const Icon = f.icon;
                      return (
                        <div
                          key={f.title}
                          className="flex items-start gap-3 bg-slate-950/80 backdrop-blur-sm px-5 py-3.5 hover:bg-white/5 transition-colors"
                        >
                          <div className="shrink-0 mt-0.5 p-1.5 rounded bg-orange-500/10 border border-orange-500/20">
                            <Icon size={13} className="text-orange-400" />
                          </div>
                          <div>
                            <p className="text-white text-[11px] md:text-xs font-bold uppercase tracking-wide leading-tight">
                              {f.title}
                            </p>
                            <p className="text-slate-400 text-[10px] md:text-[11px] leading-relaxed mt-0.5">
                              {f.desc}
                            </p>
                          </div>
                          <CheckCircle2
                            size={12}
                            className="shrink-0 ml-auto mt-0.5 text-orange-500/60"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
