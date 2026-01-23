"use client";

import React from "react";
import Link from "next/link";
import ProductCard from "./productCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ArrowRight, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorite } from "@/contexts/favoriteContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Favorites() {
  const { favorites, removeFavorite, loading } = useFavorite();

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-orange-600 selection:text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-20 md:py-32">
        {/* HEADER: Minimalist & Clean */}
        {!loading && (
          <header className="mb-24 flex flex-col md:flex-row justify-between items-baseline gap-8 border-b border-slate-100 pb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-600">
                <Heart size={14} fill="currentColor" />
                <span className="text-[10px] tracking-[0.4em] font-bold uppercase">
                  Kişisel Seçki
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extralight tracking-tighter">
                Favori <span className="font-bold">Ürünler</span>
              </h1>
            </div>

            {favorites.length > 0 && (
              <div className="flex flex-col items-end">
                <span className="text-4xl font-black text-slate-100 leading-none tabular-nums">
                  {favorites.length.toString().padStart(2, "0")}
                </span>
                <span className="text-[10px] tracking-widest text-slate-400 uppercase font-medium">
                  Toplam Ürün
                </span>
              </div>
            )}
          </header>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-6">
                <Skeleton className="aspect-[3/4] w-full bg-slate-50 rounded-none" />
                <Skeleton className="h-4 w-2/3 bg-slate-50" />
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          /* EMPTY STATE: Minimalist Center */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-40 text-center space-y-10"
          >
            <div className="relative">
              <Heart
                size={80}
                strokeWidth={0.5}
                className="text-slate-100 scale-150"
              />
              <Minus className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300 w-12" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-light tracking-tight">
                Listeniz şu an boş.
              </h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                İş güvenliğinde yeni standartları keşfetmek için
                koleksiyonlarımıza göz atın.
              </p>
            </div>
            <Link href="/products">
              <Button
                variant="outline"
                className="rounded-full px-10 py-6 border-slate-200 hover:bg-slate-900 hover:text-white transition-all text-[11px] tracking-widest uppercase font-bold"
              >
                Keşfetmeye Başla <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          /* GRID: Boutique Gallery Look */
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
          >
            <AnimatePresence mode="popLayout">
              {favorites
                .filter((id) => id != null)
                .map((productId) => (
                  <motion.div
                    key={productId}
                    layout
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    className="group"
                  >
                    <ProductCard id={productId} onRemove={removeFavorite} />
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* FOOTER ACCENT: Editoryal Tipografi */}
      <footer className="py-12 border-t border-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center text-[9px] tracking-[0.5em] text-slate-300 font-bold uppercase">
          <span>IsPool Performance</span>
          <span className="hidden md:block">Selection Series // 2026</span>
          <span>© All Rights Reserved</span>
        </div>
      </footer>
    </div>
  );
}
