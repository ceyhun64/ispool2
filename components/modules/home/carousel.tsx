"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Box,
  Zap,
} from "lucide-react";

// Tipler ve Veriler
interface BannerItem {
  id: number;
  desktopImage: string;
  tag: string;
  title: string;
  subtitle: string;
  desc: string;
}

const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: 1,
    tag: "PRO-TECH SERİSİ 2026",
    title: "Üst Düzey Şantiye",
    subtitle: "Performansı",
    desc: "Zorlu saha koşulları için geliştirilen, sıvı itici ve yüksek dayanımlı teknik iş kıyafetleri.",
    desktopImage: "/banner/1.webp",
  },
  {
    id: 2,
    tag: "AYAK KORUMA SİSTEMLERİ",
    title: "S3 Sınıfı Maksimum",
    subtitle: "Güvenlik",
    desc: "Çelik burunlu botlarda kompozit hafiflik ve SRC sertifikalı kaymaz taban teknolojisi.",
    desktopImage: "/banner/2.webp",
  },
  {
    id: 3,
    tag: "TEKNİK DIŞ GİYİM",
    title: "Su Geçirmez Ark",
    subtitle: "Koruması",
    desc: "Alev almaz ve antistatik kumaş teknolojisiyle riskli çalışma alanlarında tam izolasyon.",
    desktopImage: "/banner/3.webp",
  },
  {
    id: 4,
    tag: "KAFA VE YÜZ KORUYUCULAR",
    title: "Absorbe Edici",
    subtitle: "Darbe Yönetimi",
    desc: "Yüksek havalandırma kapasiteli, ANSI Z89 standartlarında endüstriyel baret çözümleri.",
    desktopImage: "/banner/4.webp",
  },
  {
    id: 5,
    tag: "EL KORUMA TEKNOLOJİLERİ",
    title: "Kesilmeye Karşı",
    subtitle: "Dirençli Seri",
    desc: "Nitrül kaplama ve HPPE fiber yapısı ile hassas montaj ve ağır sanayi eldivenleri.",
    desktopImage: "/banner/5.webp",
  },
  {
    id: 6,
    tag: "YÜKSEKTE ÇALIŞMA",
    title: "Düşüş Durdurucu",
    subtitle: "Ekipmanlar",
    desc: "Tam vücut emniyet kemerleri ve şok emicili lanyard sistemleri ile sıfır risk politikası.",
    desktopImage: "/banner/6.webp",
  },
  {
    id: 7,
    tag: "KURUMSAL KİMLİK",
    title: "Endüstriyel Stil",
    subtitle: "Modern Form",
    desc: "Şirket logonuzla harmonize edilen, kurumsal prestiji sahaya taşıyan özel üretim kıyafetler.",
    desktopImage: "/banner/7.webp",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((c) => (c === DEFAULT_BANNERS.length - 1 ? 0 : c + 1));
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((c) => (c === 0 ? DEFAULT_BANNERS.length - 1 : c - 1));
    setProgress(0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 70);
    if (progress === 100) nextSlide();
    return () => clearInterval(timer);
  }, [progress, nextSlide]);

  return (
    <section className="relative w-full h-[85vh] md:h-screen min-h-[650px] overflow-hidden bg-[#0a0a0b]">
      {/* 1. BACKGROUND LAYER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.05, opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={DEFAULT_BANNERS[current].desktopImage}
            alt={DEFAULT_BANNERS[current].title}
            fill
            priority
            className="object-cover object-center brightness-[0.45] contrast-[1.1]"
          />
          {/* Industrial Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b] via-[#0a0a0b]/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* 2. MAIN CONTENT AREA */}
      <div className="relative h-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center z-10">
        <div className="max-w-4xl">
          <div className="space-y-8 md:space-y-10">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={`tag-${current}`}
              className="flex items-center gap-4"
            >
              <div className="w-1 h-8 bg-orange-600" />
              <div className="flex flex-col">
                <span className="text-white font-black text-[10px] tracking-[0.3em] uppercase">
                  İşPool Engineering
                </span>
                <span className="text-orange-500 font-bold text-[9px] tracking-[0.2em] uppercase">
                  {DEFAULT_BANNERS[current].tag}
                </span>
              </div>
            </motion.div>

            {/* Title Section */}
            <div className="space-y-2">
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  key={`title-${current}`}
                  className="text-4xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] italic"
                >
                  {DEFAULT_BANNERS[current].title}
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  key={`subtitle-${current}`}
                  className="text-4xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-400 to-white/20 uppercase tracking-tighter leading-[0.9] italic"
                >
                  {DEFAULT_BANNERS[current].subtitle}
                </motion.h2>
              </div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              key={`desc-${current}`}
              className="text-slate-400 text-sm md:text-xl max-w-xl font-medium leading-relaxed opacity-80"
            >
              {DEFAULT_BANNERS[current].desc}
            </motion.p>

            {/* CTA's */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-5 pt-6"
            >
              <button className="group relative bg-orange-600 text-white px-10 py-5 text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-500 hover:bg-white hover:text-black overflow-hidden">
                <span className="relative z-10 flex items-center gap-3">
                  KOLEKSİYONU KEŞFET
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-2 transition-transform duration-500"
                  />
                </span>
              </button>

              <button className="group px-10 py-5 border border-white/10 hover:border-orange-600 text-white text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-500 flex items-center gap-3 backdrop-blur-md bg-white/5">
                <Zap
                  size={16}
                  className="text-orange-500 group-hover:scale-125 transition-transform"
                />
                TEKNİK KATALOG
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 3. SIDE NAVIGATION */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-8 z-20 hidden lg:flex">
        <div className="flex flex-col gap-4 items-center">
          {DEFAULT_BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrent(i);
                setProgress(0);
              }}
              className="group relative flex items-center justify-end"
            >
              <span
                className={`absolute right-8 text-[10px] font-black tracking-widest transition-all duration-500 ${current === i ? "opacity-100 text-orange-600" : "opacity-0 text-white group-hover:opacity-50"}`}
              >
                0{i + 1}
              </span>
              <div
                className={`w-1 transition-all duration-700 rounded-full ${current === i ? "h-12 bg-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.6)]" : "h-4 bg-white/10 hover:bg-white/40"}`}
              />
            </button>
          ))}
        </div>

        <div className="h-[1px] w-12 bg-white/10 rotate-90 my-4" />

        <div className="flex flex-col gap-3">
          <button
            onClick={prevSlide}
            className="w-12 h-12 flex items-center justify-center border border-white/5 text-white/40 hover:text-orange-600 hover:border-orange-600 transition-all duration-500"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 flex items-center justify-center border border-white/5 text-white/40 hover:text-orange-600 hover:border-orange-600 transition-all duration-500"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* 4. PROGRESS BAR (BOTTOM) */}
      <div className="absolute bottom-0 left-0 w-full flex z-30">
        {DEFAULT_BANNERS.map((_, i) => (
          <div
            key={i}
            onClick={() => {
              setCurrent(i);
              setProgress(0);
            }}
            className="flex-1 h-[2px] bg-white/5 cursor-pointer relative overflow-hidden"
          >
            {current === i && (
              <motion.div
                className="absolute inset-0 bg-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.8)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                style={{ transformOrigin: "left" }}
                transition={{ ease: "linear" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Decorative Slide Number */}
      <div className="absolute top-20 right-20 hidden xl:block select-none pointer-events-none">
        <motion.span
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.03, x: 0 }}
          className="text-[250px] font-black text-white leading-none tracking-tighter italic"
        >
          0{current + 1}
        </motion.span>
      </div>
    </section>
  );
}
