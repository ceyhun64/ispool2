"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface HeroSlide {
  id: number;
  tag: string | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  desktopImage: string;
  mobileImage: string | null;
  order: number;
  isActive: boolean;
}

const DEFAULT_BANNERS: HeroSlide[] = [
  {
    id: 1,
    tag: "PRO-TECH SERİSİ 2026",
    title: "Üst Düzey Şantiye",
    subtitle: "Performansı",
    description:
      "Zorlu saha koşulları için geliştirilen teknik iş kıyafetleri.",
    desktopImage: "/banner/1.webp",
    mobileImage: null,
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    tag: "AYAK KORUMA SİSTEMLERİ",
    title: "S3 Sınıfı Maksimum",
    subtitle: "Güvenlik",
    description: "Çelik burunlu botlarda kompozit hafiflik ve SRC teknolojisi.",
    desktopImage: "/banner/2.webp",
    mobileImage: null,
    order: 2,
    isActive: true,
  },
  {
    id: 3,
    tag: "TEKNİK DIŞ GİYİM",
    title: "Su Geçirmez Ark",
    subtitle: "Koruması",
    description: "Alev almaz ve antistatik kumaş teknolojisiyle tam izolasyon.",
    desktopImage: "/banner/3.webp",
    mobileImage: null,
    order: 3,
    isActive: true,
  },
];

export default function HeroSlider() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_BANNERS);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        const res = await fetch("/api/hero-slides");
        const data = await res.json();
        if (data.slides && data.slides.length > 0) {
          setHeroSlides(data.slides);
        }
      } catch (error) {
        console.error("Hero slides hatası:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHeroSlides();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((c) => (c === heroSlides.length - 1 ? 0 : c + 1));
    setProgress(0);
  }, [heroSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((c) => (c === 0 ? heroSlides.length - 1 : c - 1));
    setProgress(0);
  }, [heroSlides.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 70);
    if (progress === 100) nextSlide();
    return () => clearInterval(timer);
  }, [progress, nextSlide]);

  const currentSlide = heroSlides[current];
  const hasText =
    currentSlide.tag || currentSlide.title || currentSlide.subtitle;

  return (
    <section className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] xl:aspect-[2.5/1] overflow-hidden group/hero bg-slate-950">
      {/* 1. ARKA PLAN VE ANA LİNK */}
      <Link
        href="/products"
        className="absolute inset-0 z-0 block cursor-pointer"
        aria-label={`${currentSlide.title || "Ürünleri"} keşfedin`}
      >
        <AnimatePresence>
          <motion.div
            key={current}
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.03, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={currentSlide.desktopImage}
              alt={currentSlide.title || "İş güvenliği ekipmanları"}
              fill
              priority
              quality={90}
              className={`object-cover object-center transition-all duration-700 group-hover/hero:scale-105 ${
                hasText ? "brightness-[0.45]" : "brightness-100"
              }`}
            />
            {hasText && (
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
            )}
          </motion.div>
        </AnimatePresence>
      </Link>

      {/* 2. METİN İÇERİĞİ */}
      <div className="relative h-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center z-10 pointer-events-none">
        <div className="max-w-3xl">
          <div className="space-y-4 md:space-y-6">
            {currentSlide.tag && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={`tag-${current}`}
                className="flex items-center gap-3"
              >
                <span className="bg-orange-800 px-3 py-1 text-[10px] font-black text-white tracking-widest uppercase">
                  2026 EDITION
                </span>
                <span className="text-white/70 font-bold text-[10px] tracking-widest uppercase">
                  {currentSlide.tag}
                </span>
              </motion.div>
            )}

            <div className="space-y-2">
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  key={`title-${current}`}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl sm:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-[0.95]"
                >
                  {currentSlide.title}
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  key={`sub-${current}`}
                  transition={{
                    duration: 0.8,
                    delay: 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-3xl sm:text-5xl lg:text-7xl font-black text-orange-500 italic uppercase tracking-tighter leading-[0.95]"
                >
                  {currentSlide.subtitle}
                </motion.h2>
              </div>
            </div>

            {currentSlide.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={`desc-${current}`}
                transition={{ delay: 0.4 }}
                className="text-slate-300 text-sm md:text-lg max-w-lg leading-relaxed border-l-4 border-orange-600 pl-6"
              >
                {currentSlide.description}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {/* 3. YAN NAVİGASYON (DESKTOP) - Dokunma Hedefleri Optimize Edildi */}
      <div className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-8 z-20 hidden md:flex">
        <div className="flex flex-col gap-2 items-center">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrent(i);
                setProgress(0);
              }}
              aria-label={`Slayt ${i + 1}`}
              className="group relative p-3" // Görünmez dokunma alanını genişlettik (Padding)
            >
              <div
                className={`w-1.5 rounded-full transition-all duration-500 ${
                  current === i
                    ? "h-10 bg-orange-600"
                    : "h-4 bg-white/20 group-hover:bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={prevSlide}
            aria-label="Önceki slayt"
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-orange-600 hover:border-orange-600 transition-all duration-300 shadow-xl"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Sonraki slayt"
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-orange-600 hover:border-orange-600 transition-all duration-300 shadow-xl"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* 4. ALT PROGRESS BARLAR - Dokunma Hedefleri (48px yükseklik) */}
      <div className="absolute bottom-0 left-0 w-full flex items-end z-30">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrent(i);
              setProgress(0);
            }}
            aria-label={`Slayt ${i + 1}'e git`}
            className="flex-1 group relative h-14 flex items-end cursor-pointer"
          >
            {/* Görsel Bar Bölümü */}
            <div className="w-full h-1.5 md:h-2 bg-white/10 relative overflow-hidden transition-all group-hover:h-3">
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
            {/* Görünmez Hitbox - Kullanıcının parmağı buraya değdiğinde algılar */}
            <div className="absolute inset-0 bg-transparent group-hover:bg-white/5 transition-colors" />
          </button>
        ))}
      </div>

      {/* Slayt Numarası Dekoru */}
      <div className="absolute top-10 right-12 hidden xl:block select-none pointer-events-none opacity-[0.03]">
        <span className="text-[12rem] font-black text-white leading-none">
          0{current + 1}
        </span>
      </div>
    </section>
  );
}
