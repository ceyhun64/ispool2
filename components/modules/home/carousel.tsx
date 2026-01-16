// components/HeroSection.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Zap,
  Box,
} from "lucide-react";

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
    desktopImage: "/banner/2.webp",
  },
  {
    id: 2,
    tag: "AYAK KORUMA SİSTEMLERİ",
    title: "S3 Sınıfı Maksimum",
    subtitle: "Güvenlik",
    desc: "Çelik burunlu botlarda kompozit hafiflik ve SRC kaymaz taban teknolojisi.",
    desktopImage: "/banner/2.png",
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
    <section className="relative w-full h-[55vh] min-h-[550px] overflow-hidden bg-[#0A0C10]">
      {/* 1. BACKGROUND LAYER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.05, opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={DEFAULT_BANNERS[current].desktopImage}
            alt="Endüstriyel Güvenlik"
            fill
            priority
            className="object-cover object-center brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0C10] via-[#0A0C10]/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* 2. MAIN CONTENT AREA */}
      <div className="relative h-full container mx-auto px-6 md:px-12 flex items-center z-10">
        <div className="max-w-3xl">
          <div className="space-y-6">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={`tag-${current}`}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-[1px] bg-orange-600" />
              <span className="text-orange-500 font-black text-[10px] tracking-[0.4em] uppercase">
                {DEFAULT_BANNERS[current].tag}
              </span>
            </motion.div>

            {/* Title Section - Dengeli Boyutlar */}
            <div className="space-y-1">
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6 }}
                  key={`title-${current}`}
                  className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none"
                >
                  {DEFAULT_BANNERS[current].title}
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  key={`subtitle-${current}`}
                  className="text-4xl md:text-6xl font-black text-orange-600 uppercase tracking-tight leading-none"
                >
                  {DEFAULT_BANNERS[current].subtitle}
                </motion.h2>
              </div>
            </div>

            {/* Description - Okunabilir Punto */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              key={`desc-${current}`}
              className="text-slate-400 text-sm md:text-base max-w-lg font-medium leading-relaxed"
            >
              {DEFAULT_BANNERS[current].desc}
            </motion.p>

            {/* CTA's - Kompakt ve Teknik */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <button className="h-12 px-8 bg-orange-600 hover:bg-white hover:text-black text-white text-[11px] font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-2">
                İNCELE <ArrowRight size={14} />
              </button>

              <button className="h-12 px-8 border border-white/10 hover:border-orange-600 text-white text-[11px] font-black tracking-widest uppercase transition-all flex items-center gap-2">
                <Box size={14} className="text-orange-600" /> KATALOG
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 3. SIDE NAVIGATION - Minimalist */}
      <div className="absolute right-0 top-0 h-full w-20 border-l border-white/5 bg-black/20 backdrop-blur-sm hidden lg:flex flex-col items-center justify-between py-12 z-20">
        <span className="text-[10px] font-black text-white/20 rotate-90 tracking-[0.5em] uppercase">
          İşPool Systems
        </span>

        <div className="flex flex-col gap-4">
          <button
            onClick={prevSlide}
            className="group p-2 border border-white/5 hover:border-orange-600 transition-all"
          >
            <ChevronLeft
              size={18}
              className="text-white/40 group-hover:text-orange-600"
            />
          </button>
          <button
            onClick={nextSlide}
            className="group p-2 border border-white/5 hover:border-orange-600 transition-all"
          >
            <ChevronRight
              size={18}
              className="text-white/40 group-hover:text-orange-600"
            />
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 font-black">
          <span className="text-orange-600 text-sm">0{current + 1}</span>
          <div className="w-[1px] h-8 bg-white/10" />
          <span className="text-white/20 text-[10px]">
            0{DEFAULT_BANNERS.length}
          </span>
        </div>
      </div>

      {/* 4. INFO BADGE */}
      <div className="absolute bottom-10 left-10 hidden md:flex items-center gap-4 z-20 opacity-50">
        <ShieldCheck className="text-orange-600" size={20} />
        <span className="text-[9px] font-black text-white tracking-[0.3em] uppercase">
          ISO Certified Security 2026
        </span>
      </div>

      {/* 5. PROGRESS BARS */}
      <div className="absolute bottom-0 left-0 w-full flex gap-[2px] z-30">
        {DEFAULT_BANNERS.map((_, i) => (
          <div
            key={i}
            onClick={() => {
              setCurrent(i);
              setProgress(0);
            }}
            className="flex-1 h-[2px] bg-white/5 cursor-pointer relative"
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
    </section>
  );
}
