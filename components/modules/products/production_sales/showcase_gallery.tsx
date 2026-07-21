"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Images, Loader2, X } from "lucide-react";

interface ShowcaseImageItem {
  id: number;
  image: string;
  title: string | null;
}

const ShowcaseGallery: React.FC = () => {
  const [images, setImages] = useState<ShowcaseImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<ShowcaseImageItem | null>(
    null,
  );

  useEffect(() => {
    fetch("/api/showcase")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.images)) setImages(data.images);
      })
      .catch((err) =>
        console.error("Örnek çalışma verileri alınamadı:", err),
      )
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white font-sans">
      {/* --- HERO --- */}
      <section className="bg-slate-100 border-b border-slate-200">
        <div className="max-w-350 mx-auto px-6 py-16 md:py-24">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-6 h-[1.5px] bg-orange-700" aria-hidden="true" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-orange-900 uppercase">
              Saha Uygulamaları
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1.05] uppercase max-w-4xl">
            Özel Üretim <br />
            <span className="text-slate-600">Örnek Çalışmalarımız</span>
          </h1>
          <p className="mt-6 text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            Kurumsal kimliğe özel tasarladığımız ve sahada giyilen iş
            elbiselerinden, logolu ekipman setlerine kadar tamamladığımız
            projelerden bir seçki. Kendi projenizi başlatmak için bizimle
            iletişime geçin.
          </p>
          <Link
            href="/products/special_production"
            className="inline-flex items-center gap-2 mt-8 bg-slate-900 hover:bg-orange-700 text-white px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-colors rounded-sm"
          >
            Özel Proje Başlatın
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* --- GALLERY --- */}
      <section className="max-w-350 mx-auto px-6 py-16 md:py-20">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {images.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxImage(item)}
                className="group relative w-full aspect-4/5 overflow-hidden bg-slate-100 border border-slate-200 cursor-zoom-in"
              >
                <Image
                  src={item.image}
                  alt={item.title || "Özel üretim örnek çalışma"}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {item.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-white text-[11px] font-black uppercase tracking-wider">
                      {item.title}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center border border-dashed border-slate-200">
            <Images className="w-10 h-10 text-slate-300" aria-hidden="true" />
            <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">
              Henüz örnek çalışma eklenmedi.
            </p>
          </div>
        )}
      </section>

      {/* --- LIGHTBOX --- */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
            onClick={() => setLightboxImage(null)}
          >
            <button
              type="button"
              className="absolute top-5 right-5 sm:top-8 sm:right-8 text-white/80 hover:text-white"
              onClick={() => setLightboxImage(null)}
              aria-label="Kapat"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-4xl h-[70vh] sm:h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxImage.image}
                alt={lightboxImage.title || "Özel üretim örnek çalışma büyük görünüm"}
                fill
                className="object-contain"
              />
            </motion.div>
            {lightboxImage.title && (
              <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/90 text-xs font-black uppercase tracking-widest">
                {lightboxImage.title}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShowcaseGallery;
