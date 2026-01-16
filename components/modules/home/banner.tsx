"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, ShieldCheck, Factory, Gauge } from "lucide-react";
import Link from "next/link";

interface BannerData {
  title: string;
  subtitle: string;
}

export default function Banner() {
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<BannerData | null>(null);

  const defaultContent: BannerData = {
    title: "SAHA ŞARTLARINDA ÜSTÜN KORUMA PERFORMANSI",
    subtitle:
      "Uluslararası standartlarda sertifikalandırılmış teknik tekstil ve iş güvenliği ekipmanlarıyla iş gücünüzü en yüksek seviyede güvence altına alıyoruz.",
  };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch("/api/banner");
        const data = await res.json();
        if (data.banners && data.banners.length > 0) {
          setBanner(data.banners[0]);
        }
      } catch (error) {
        console.error("Banner hatası:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanner();
  }, []);

  const activeContent = {
    title: banner?.title || defaultContent.title,
    subtitle: banner?.subtitle || defaultContent.subtitle,
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[70vh] rounded-none bg-slate-950" />;
  }

  return (
    <section className="relative w-full min-h-[75vh] flex items-center overflow-hidden bg-slate-950 py-16 border-b-2 border-orange-600">
      {/* ARKA PLAN */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
        <motion.div
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/2 -right-1/4 w-[60%] h-[60%] bg-orange-600 rounded-full blur-[150px] -z-10"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Üst Bilgi Rozeti */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="flex -space-x-1.5">
              <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center border-2 border-slate-950">
                <ShieldCheck size={12} className="text-white" />
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-950">
                <Gauge size={12} className="text-orange-500" />
              </div>
            </div>
            <span className="text-[10px] tracking-[0.2em] text-orange-500 uppercase font-bold">
              Endüstriyel Güvenlik Çözümleri
            </span>
          </motion.div>

          {/* Ana Başlık - Boyut Optimize Edildi */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl text-white font-bold leading-[1.1] tracking-tight mb-6 uppercase"
          >
            {activeContent.title.split(" ").map((word, i) => (
              <span key={i} className={i === 2 ? "text-orange-600" : ""}>
                {word}{" "}
              </span>
            ))}
          </motion.h1>

          {/* Alt Metin - Daha Küçük ve Okunaklı */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-sm md:text-sm font-normal max-w-xl mx-auto leading-relaxed mb-10"
          >
            {activeContent.subtitle}
          </motion.p>

          {/* Aksiyon Butonları */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              href="/products"
              className="group relative flex items-center gap-3 px-8 py-3.5 bg-orange-600 hover:bg-white transition-all duration-300"
            >
              <span className="text-[11px] tracking-widest uppercase text-white group-hover:text-slate-950 font-bold">
                Üretim Kataloğu
              </span>
              <ArrowRight
                className="text-white group-hover:text-slate-950 group-hover:translate-x-1 transition-transform"
                size={16}
              />
            </Link>

            <Link
              href="/teklif"
              className="group flex items-center gap-3 px-8 py-3.5 border border-slate-700 hover:border-orange-600 transition-all duration-300"
            >
              <span className="text-[11px] tracking-widest uppercase text-slate-300 group-hover:text-white font-bold">
                Teklif Al
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Dekoratif İkon Küçültüldü */}
      <div className="absolute right-0 bottom-[-5%] opacity-[0.02] hidden lg:block">
        <Factory size={400} className="text-white rotate-[-10deg]" />
      </div>

      {/* Alt Teknik Bilgi Şeridi - Daha Kibar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-8 text-center">
        <div className="flex flex-col">
          <span className="text-white font-bold text-lg tracking-tight">
            EN ISO 20471
          </span>
          <span className="text-slate-500 text-[8px] uppercase tracking-widest font-semibold">
            Yüksek Görünürlük
          </span>
        </div>
        <div className="w-[1px] h-6 bg-slate-800" />
        <div className="flex flex-col">
          <span className="text-white font-bold text-lg tracking-tight">
            CE CERTIFIED
          </span>
          <span className="text-slate-500 text-[8px] uppercase tracking-widest font-semibold">
            Avrupa Standartları
          </span>
        </div>
      </div>
    </section>
  );
}
