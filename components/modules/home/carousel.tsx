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
  Scan,
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
    desc: "Zorlu saha koşulları için geliştirilen, yüksek dayanımlı teknik iş kıyafetleri.",
    desktopImage: "/banner/1.webp",
  },
  {
    id: 2,
    tag: "AYAK KORUMA SİSTEMLERİ",
    title: "S3 Sınıfı Maksimum",
    subtitle: "Güvenlik",
    desc: "Çelik burunlu botlarda kompozit hafiflik ve SRC kaymaz taban teknolojisi.",
    desktopImage: "/banner/2.webp",
  },
  {
    id: 3,
    tag: "PRO-TECH SERİSİ 2026",
    title: "Üst Düzey Şantiye",
    subtitle: "Performansı",
    desc: "Zorlu saha koşulları için geliştirilen, yüksek dayanımlı teknik iş kıyafetleri.",
    desktopImage: "/banner/3.webp",
  },
  {
    id: 4,
    tag: "AYAK KORUMA SİSTEMLERİ",
    title: "S3 Sınıfı Maksimum",
    subtitle: "Güvenlik",
    desc: "Çelik burunlu botlarda kompozit hafiflik ve SRC kaymaz taban teknolojisi.",
    desktopImage: "/banner/4.webp",
  },
  {
    id: 5,
    tag: "PRO-TECH SERİSİ 2026",
    title: "Üst Düzey Şantiye",
    subtitle: "Performansı",
    desc: "Zorlu saha koşulları için geliştirilen, yüksek dayanımlı teknik iş kıyafetleri.",
    desktopImage: "/banner/5.webp",
  },
  {
    id: 6,
    tag: "AYAK KORUMA SİSTEMLERİ",
    title: "S3 Sınıfı Maksimum",
    subtitle: "Güvenlik",
    desc: "Çelik burunlu botlarda kompozit hafiflik ve SRC kaymaz taban teknolojisi.",
    desktopImage: "/banner/6.webp",
  },
  {
    id: 7,
    tag: "AYAK KORUMA SİSTEMLERİ",
    title: "S3 Sınıfı Maksimum",
    subtitle: "Güvenlik",
    desc: "Çelik burunlu botlarda kompozit hafiflik ve SRC kaymaz taban teknolojisi.",
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
    <section className="relative w-full h-[85vh] md:h-screen min-h-[650px] overflow-hidden ">
      {/* 1. BACKGROUND LAYER */}
      <AnimatePresence >
        <motion.div
          key={current}
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.02, opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={DEFAULT_BANNERS[current].desktopImage}
            alt="Endüstriyel Güvenlik"
            fill
            priority
            className="object-cover object-center brightness-[0.55] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* 2. MAIN CONTENT AREA */}
      <div className="relative h-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center z-10">
        <div className="max-w-3xl">
          <div className="space-y-6 md:space-y-8">
            {/* Tagline - Daha narin tasarım */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={`tag-${current}`}
              className="flex items-center gap-4"
            >
              <span className="bg-orange-600 px-3 py-1 text-[10px] font-bold text-white tracking-[0.15em] uppercase">
                2026 EDITION
              </span>
              <span className="text-white/60 font-medium text-[11px] tracking-[0.3em] uppercase">
                {DEFAULT_BANNERS[current].tag}
              </span>
            </motion.div>

            {/* Title Section - Boyutlar Optimize Edildi */}
            <div className="space-y-1">
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  key={`title-${current}`}
                  className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[1.1]"
                >
                  {DEFAULT_BANNERS[current].title}
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  key={`subtitle-${current}`}
                  className="text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400 uppercase tracking-tight leading-[1.1]"
                >
                  {DEFAULT_BANNERS[current].subtitle}
                </motion.h2>
              </div>
            </div>

            {/* Description - Okunabilirlik artırıldı */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              key={`desc-${current}`}
              className="text-gray-400 text-sm md:text-lg max-w-lg font-normal leading-relaxed border-l-2 border-orange-600/50 pl-6"
            >
              {DEFAULT_BANNERS[current].desc}
            </motion.p>

            {/* CTA's - Daha kompakt butonlar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <button className="group relative bg-white text-black px-8 py-4 text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:bg-orange-600 hover:text-white">
                <span className="flex items-center gap-2">
                  İNCELE
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </button>

              <button className="group px-8 py-4 border border-white/20 hover:border-white/60 text-white text-[11px] font-bold tracking-widest uppercase transition-all flex items-center gap-2 backdrop-blur-sm">
                <Box size={16} className="text-orange-500" />
                KATALOG
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 3. SIDE NAVIGATION - Daha minimal noktalar */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-20 hidden lg:flex">
        <div className="flex flex-col gap-3 items-center">
          {DEFAULT_BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrent(i);
                setProgress(0);
              }}
              className={`w-1 transition-all duration-500 ${current === i ? "h-8 bg-orange-600" : "h-4 bg-white/20 hover:bg-white/40"}`}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* 4. PROGRESS BARS */}
      <div className="absolute bottom-0 left-0 w-full flex gap-1 z-30">
        {DEFAULT_BANNERS.map((_, i) => (
          <div
            key={i}
            onClick={() => {
              setCurrent(i);
              setProgress(0);
            }}
            className="flex-1 h-1 bg-white/10 cursor-pointer relative"
          >
            {current === i && (
              <motion.div
                className="absolute inset-0 bg-orange-600"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                style={{ transformOrigin: "left" }}
                transition={{ ease: "linear" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Slide Number - Daha küçük ve zarif */}
      <div className="absolute top-10 right-12 hidden lg:block select-none pointer-events-none opacity-10">
        <span className="text-8xl font-black text-white leading-none">
          0{current + 1}
        </span>
      </div>
    </section>
  );
}
