"use client";

import React from "react";
import Link from "next/link";
import ProductCard from "./productCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorite } from "@/contexts/favoriteContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Favorites() {
  const { favorites, removeFavorite, loading } = useFavorite();

  const FavoriteSkeleton = () => (
    <div className="flex flex-col space-y-6">
      <Skeleton className="w-full aspect-[3/4] rounded-none bg-slate-50" />
      <div className="space-y-3">
        <Skeleton className="h-3 w-2/3 bg-slate-50" />
        <Skeleton className="h-3 w-1/3 bg-slate-50" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32">
        {/* Header Section - Minimalist & Editorial */}
        {!loading && favorites.length > 0 && (
          <header className="flex flex-col items-start mb-20 border-b border-slate-100 pb-12">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-light">
                Kişisel Seçki
              </span>
              <h1 className="text-4xl md:text-5xl font-extralight tracking-tight">
                Favorilerim
              </h1>
              <p className="text-slate-400 text-sm font-light max-w-md">
                Beğendiğiniz tasarımları tek bir noktada toplayın ve tarzınızı
                şekillendirin.
              </p>
            </motion.div>
          </header>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {Array.from({ length: 4 }).map((_, i) => (
              <FavoriteSkeleton key={i} />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-40 text-center"
          >
            <div className="mb-10">
              <Heart strokeWidth={0.5} className="h-16 w-16 text-slate-200" />
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-light tracking-tight text-slate-900">
                Kürasyonunuz boş görünüyor
              </h3>
              <p className="text-slate-400 max-w-xs mx-auto text-sm font-light leading-relaxed">
                Henüz hiçbir ürünü favorilerinize eklemediniz. İlham almak için
                koleksiyonlarımızı inceleyin.
              </p>
              <div className="pt-8">
                <Link href="/products">
                  <Button
                    variant="outline"
                    className="border-slate-200 text-slate-950 rounded-none px-8 py-6 text-xs tracking-widest uppercase hover:bg-slate-950 hover:text-white transition-all duration-500"
                  >
                    KOLEKSİYONU GÖR
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Ürün Listesi - Grid Gap Revizesi */
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20"
          >
            <AnimatePresence mode="popLayout">
              {favorites
                .filter((id) => id != null)
                .map((productId, index) => (
                  <motion.div
                    key={productId}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.05,
                      ease: [0.19, 1, 0.22, 1],
                    }}
                    className="relative"
                  >
                    <ProductCard id={productId} onRemove={removeFavorite} />
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
