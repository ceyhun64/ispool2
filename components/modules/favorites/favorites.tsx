"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "./productCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ArrowRight, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorite } from "@/contexts/favoriteContext";
import { motion, AnimatePresence } from "framer-motion";

interface FavoriteProduct {
  id: number;
  title: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  mainImage: string;
  subImage?: string;
  category: string;
}

export default function Favorites() {
  const { favorites, removeFavorite, loading } = useFavorite();
  const [products, setProducts] = useState<Record<number, FavoriteProduct>>({});

  // Kart başına ayrı istek yerine tüm favori ürünler tek seferde toplu çekilir.
  useEffect(() => {
    const ids = favorites.filter((id) => id != null);
    if (ids.length === 0) {
      setProducts({});
      return;
    }

    let cancelled = false;
    fetch(`/api/products?ids=${ids.join(",")}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.products) return;
        const map: Record<number, FavoriteProduct> = {};
        for (const p of data.products) {
          map[p.id] = {
            id: p.id,
            title: p.title,
            price: p.price,
            oldPrice: p.oldPrice,
            discountPercentage: p.discountPercentage,
            mainImage: p.mainImage,
            subImage: p.subImage,
            category: p.category,
          };
        }
        setProducts(map);
      })
      .catch((err) => console.error("Favori ürünler alınamadı:", err));

    return () => {
      cancelled = true;
    };
  }, [favorites]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 selection:bg-amber-600 selection:text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-24">
        {/* ÜST BİLGİ: Minimalist ve Prestijli */}
        {!loading && (
          <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                <Heart size={14} fill="currentColor" />
                <span className="text-[10px] tracking-[0.4em] font-bold uppercase">
                  Size Özel Seçki
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extralight tracking-tighter text-slate-900">
                Favori <span className="font-bold">Ürünlerim</span>
              </h1>
            </div>

            {favorites.length > 0 && (
              <div className="flex flex-col items-end">
                <span className="text-5xl font-black text-slate-200 leading-none tabular-nums">
                  {favorites.length.toString().padStart(2, "0")}
                </span>
                <span className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold">
                  Kaydedilen Ürün
                </span>
              </div>
            )}
          </header>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-6">
                <Skeleton className="aspect-[3/4] w-full bg-slate-200/50 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-2/3 bg-slate-200/50" />
                  <Skeleton className="h-4 w-1/2 bg-slate-200/50" />
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          /* BOŞ DURUM: Modern & Sade */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-5 text-center space-y-10"
          >
            <div className="relative">
              <Heart
                size={100}
                strokeWidth={0.5}
                className="text-slate-200 scale-125"
              />
              <Minus className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400 w-16" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-light tracking-tight text-slate-800">
                Listeniz henüz boş.
              </h3>
              <p className="text-slate-500 text-base max-w-sm mx-auto leading-relaxed font-light">
                İş güvenliğinde en yüksek standartları ve yenilikçi tasarımları
                keşfetmek için ürünlerimize göz atın.
              </p>
            </div>
            <Link href="/products">
              <Button
                variant="outline"
                className="rounded-sm px-12 py-7 border-slate-300 hover:bg-slate-950 hover:text-white transition-all duration-500 text-[11px] tracking-[0.2em] uppercase font-bold"
              >
                Keşfetmeye Başla <ArrowRight size={16} className="ml-3" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          /* ÜRÜN IZGARASI: Butik Galeri Görünümü */
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="group"
                  >
                    <ProductCard
                      id={productId}
                      product={products[productId]}
                      onRemove={removeFavorite}
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

   
    </div>
  );
}
