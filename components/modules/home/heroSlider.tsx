"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// HeroSlide tipini tanımlıyoruz
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
  {
    id: 4,
    tag: "KAFA VE YÜZ KORUYUCULAR",
    title: "Absorbe Edici",
    subtitle: "Darbe Yönetimi",
    description: "Yüksek havalandırma kapasiteli endüstriyel baret çözümleri.",
    desktopImage: "/banner/4.webp",
    mobileImage: null,
    order: 4,
    isActive: true,
  },
  {
    id: 5,
    tag: "EL KORUMA TEKNOLOJİLERİ",
    title: "Kesilmeye Karşı",
    subtitle: "Dirençli Seri",
    description:
      "Nitrül kaplama ve HPPE fiber yapısı ile ağır sanayi eldivenleri.",
    desktopImage: "/banner/5.webp",
    mobileImage: null,
    order: 5,
    isActive: true,
  },
  {
    id: 6,
    tag: "YÜKSEKTE ÇALIŞMA",
    title: "Düşüş Durdurucu",
    subtitle: "Ekipmanlar",
    description: "Tam vücut emniyet kemerleri ile sıfır risk politikası.",
    desktopImage: "/banner/6.webp",
    mobileImage: null,
    order: 6,
    isActive: true,
  },
  {
    id: 7,
    tag: "KURUMSAL KİMLİK",
    title: "Endüstriyel Stil",
    subtitle: "Modern Form",
    description: "Kurumsal prestiji sahaya taşıyan özel üretim kıyafetler.",
    desktopImage: "/banner/7.webp",
    mobileImage: null,
    order: 7,
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
  const hasImage = currentSlide.desktopImage;
  const hasText =
    currentSlide.tag ||
    currentSlide.title ||
    currentSlide.subtitle ||
    currentSlide.description;
  const shouldShowDefaultText = !hasImage && !hasText;

  const getDefaultValue = (value: string | null, defaultValue: string) => {
    if (shouldShowDefaultText) return defaultValue;
    if (hasText) return value || defaultValue;
    return "";
  };

  const displayTag = getDefaultValue(currentSlide.tag, "2026 EDITION");
  const displayTitle = getDefaultValue(
    currentSlide.title,
    "Premium Koleksiyon",
  );
  const displaySubtitle = getDefaultValue(
    currentSlide.subtitle,
    "Yüksek Performans",
  );
  const displayDescription = getDefaultValue(
    currentSlide.description,
    "En yüksek kalite standartlarında üretilmiş ürünler.",
  );

  return (
    <section className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] xl:aspect-[2.5/1] overflow-hidden group/hero">
      {/* 1. BACKGROUND LAYER (TIKLANABİLİR ALAN) */}
      <Link
        href="/products"
        className="absolute inset-0 z-0 block cursor-pointer"
      >
        <AnimatePresence>
          <motion.div
            key={current}
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.02, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="absolute inset-0"
          >
            {hasImage && (
              <>
                <Image
                  src={currentSlide.desktopImage}
                  alt={displayTitle}
                  fill
                  priority
                  quality={90}
                  sizes="100vw"
                  className={`object-cover object-center contrast-[1.05] transition-all duration-700 group-hover/hero:scale-105 ${
                    hasText ? "brightness-[0.55]" : "brightness-100"
                  }`}
                />
                {/* Sadece metin varsa karartma katmanını göster */}
                {hasText && (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </Link>

      {/* 2. MAIN CONTENT AREA */}
      <div className="relative h-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center z-10 pointer-events-none">
        <div className="max-w-3xl py-12 md:py-0">
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            {/* Tagline */}
            {displayTag && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={`tag-${current}`}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 md:gap-4 flex-wrap"
              >
                <span className="bg-orange-600 px-2.5 md:px-3 py-1 text-[9px] md:text-[10px] font-bold text-white tracking-[0.15em] uppercase">
                  2026 EDITION
                </span>
                <span className="text-white/60 font-medium text-[10px] md:text-[11px] tracking-[0.25em] md:tracking-[0.3em] uppercase">
                  {displayTag}
                </span>
              </motion.div>
            )}

            {/* Title Section */}
            {(displayTitle || displaySubtitle) && (
              <div className="space-y-1">
                {displayTitle && (
                  <div className="overflow-hidden">
                    <motion.h2
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      key={`title-${current}`}
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white uppercase tracking-tight leading-[1.1]"
                    >
                      {displayTitle}
                    </motion.h2>
                  </div>
                )}
                {displaySubtitle && (
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
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400 uppercase tracking-tight leading-[1.1]"
                    >
                      {displaySubtitle}
                    </motion.h2>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {displayDescription && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                key={`desc-${current}`}
                className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg max-w-lg font-normal leading-relaxed border-l-2 border-orange-600 pl-4 md:pl-6"
              >
                {displayDescription}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {/* 3. SIDE NAVIGATION - Desktop Only */}
      <div className="absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 lg:gap-6 z-20 hidden md:flex">
        <div className="flex flex-col gap-2 lg:gap-3 items-center">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrent(i);
                setProgress(0);
              }}
              aria-label={`Slayt ${i + 1}`}
              className={`w-1 rounded-sm transition-all duration-500 ${current === i ? "h-6 lg:h-8 bg-orange-600" : "h-3 lg:h-4 bg-white/20 hover:bg-white/40"}`}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={prevSlide}
            aria-label="Önceki slayt"
            className="w-9 h-9 lg:w-10 lg:h-10 rounded-sm border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Sonraki slayt"
            className="w-9 h-9 lg:w-10 lg:h-10 rounded-sm border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* 4. PROGRESS BARS */}
      <div className="absolute bottom-0 left-0 w-full flex gap-0.5 md:gap-1 z-30">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrent(i);
              setProgress(0);
            }}
            aria-label={`Slayt ${i + 1}'e git`}
            className="flex-1 h-0.5 md:h-1 bg-white/10 cursor-pointer relative overflow-hidden"
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
          </button>
        ))}
      </div>

      {/* Slide Number - Desktop Only */}
      <div className="absolute top-8 lg:top-10 right-8 lg:right-12 hidden lg:block select-none pointer-events-none opacity-10">
        <span className="text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-none">
          0{current + 1}
        </span>
      </div>
    </section>
  );
}
