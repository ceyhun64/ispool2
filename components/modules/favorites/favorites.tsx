"use client";

import React from "react";
import Link from "next/link";
import ProductCard from "./productCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorite } from "@/contexts/favoriteContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Favorites() {
  const { favorites, removeFavorite, loading } = useFavorite();

  const FavoriteSkeleton = () => (
    <div className="flex flex-col space-y-6">
      <Skeleton className="w-full aspect-square rounded-none bg-slate-200/50" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-2/3 bg-slate-200/50" />
        <Skeleton className="h-4 w-1/3 bg-slate-200/50" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-16 py-10 md:py-24">
        {/* Header Section - Premium Industrial Aesthetic */}
        {!loading && favorites.length > 0 && (
          <header className="flex flex-col md:flex-row md:items-end justify-between mb-24 border-b border-slate-100 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-slate-900" />
                <span className="text-[11px] uppercase tracking-[0.3em] text-slate-500 font-bold">
                  Pro-Selection / 2026
                </span>
              </div>
              <h1 className="text-xl md:text-3xl font-bold tracking-tighter text-slate-900">
                FAVORİLER
              </h1>
              <p className="text-slate-500 text-sm font-medium max-w-lg leading-relaxed">
                Yüksek performanslı iş kıyafetleri ve güvenlik ekipmanlarından
                oluşan kişisel seçkinizi yönetin. Güvenliğiniz için en iyisini
                seçin.
              </p>
            </motion.div>

            <div className="hidden md:block text-right">
              <span className="text-sm font-mono text-slate-400">
                TOPLAM: {favorites.length} ÜRÜN
              </span>
            </div>
          </header>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
            {Array.from({ length: 4 }).map((_, i) => (
              <FavoriteSkeleton key={i} />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-48 text-center"
          >
            <div className="mb-12 relative">
              <div className="absolute inset-0 bg-slate-100 scale-[2.5] rounded-full -z-10 blur-2xl opacity-50" />
              <ShieldCheck
                strokeWidth={0.75}
                className="h-24 w-24 text-slate-200"
              />
            </div>

            <div className="space-y-8">
              <h3 className="text-3xl font-bold tracking-tight text-slate-900">
                Henüz bir seçim yapmadınız.
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto text-sm font-medium leading-relaxed">
                İş sahasında üstün koruma ve konfor sağlayan ekipmanları
                favorilerinize ekleyerek projenize hazırlanın.
              </p>
              <div className="pt-6">
                <Link href="/products">
                  <Button className="bg-slate-900 text-white rounded-none px-12 py-7 text-xs tracking-widest uppercase hover:bg-slate-800 transition-all duration-300 group">
                    EKİPMANLARI İNCELE
                    <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Ürün Listesi - Industrial Grid */
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-24"
          >
            <AnimatePresence mode="popLayout">
              {favorites
                .filter((id) => id != null)
                .map((productId, index) => (
                  <motion.div
                    key={productId}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.7,
                      delay: index * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative"
                  >
                    {/* Teknik detay numarası eklemesi (Opsiyonel estetik) */}
                    <div className="absolute -top-6 left-0 text-[10px] font-mono text-slate-300">
                      REF NO: 00{productId}
                    </div>
                    <ProductCard id={productId} onRemove={removeFavorite} />
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Alt Dekoratif Çizgi (Industrial Look) */}
      <div className="h-20 border-t border-slate-100 flex items-center justify-center overflow-hidden">
        <div className="whitespace-nowrap text-[10px] uppercase tracking-[1em] text-slate-200 font-black">
          ENGINEERED FOR EXTREME PERFORMANCE • SAFETY FIRST • PREMIUM QUALITY
          WORKWEAR
        </div>
      </div>
    </div>
  );
}
