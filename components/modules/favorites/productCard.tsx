"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useFavorite } from "@/contexts/favoriteContext";
import { motion } from "framer-motion";

interface ProductData {
  id: number;
  title: string;
  price: number;
  mainImage: string;
  subImage?: string;
  category: string;
}

interface ProductCardProps {
  id: number;
  onRemove?: (productId: number) => void;
}

export default function ProductCard({ id, onRemove }: ProductCardProps) {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Favorite context
  const { isFavorited, addFavorite, removeFavorite } = useFavorite();
  const favorited = isFavorited(id);

  // Veriyi API'den çekme (Eski mantık korundu)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) return;
        const data: { product: ProductData } = await res.json();
        setProduct(data.product);
      } catch (err) {
        console.error("Ürün çekme hatası:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (favorited) {
      removeFavorite(id);
      if (onRemove) onRemove(id);
    } else {
      addFavorite(id);
    }
  };

  if (!product) return null;

  // İkinci tasarımdaki fiyat hesaplama mantığı
  const discount = 30; // Sabit veya API'den gelebilir
  const oldPrice = Math.round(product.price * 1.43);

  return (
    <div
      className="group relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`}>
        {/* Ana Konteyner: 5/3 oranı */}
        <div className="relative aspect-[5/3] w-full overflow-hidden bg-white">
          {/* Favori Butonu */}
          {/* Favori Butonu - DÜZELTİLDİ */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 z-20 p-3 transition-all duration-300 group/fav"
            /* p-3 ekleyerek tıklama alanını genişlettik (44px+ hedefi için) */
            aria-label={`${product.title} ürününü favorilere ekle`}
          >
            <Heart
              className={`h-6 w-6 ${
                // İkon boyutunu hafif artırmak tıklamayı kolaylaştırır
                favorited ? "fill-slate-800 text-slate-800" : "text-slate-600"
              } group-hover/fav:scale-110 transition-transform`}
              strokeWidth={1.2}
            />
          </button>

          {/* Animasyonlu Resim Alanı */}
          <motion.div
            className="flex h-full w-[200%]"
            animate={{ x: isHovered && product.subImage ? "-50%" : "0%" }}
            transition={{ duration: 0.8, ease: [0.6, 0.01, -0.05, 0.95] }}
          >
            {/* İlk Resim */}
            <div className="relative h-full w-1/2 p-2">
              <Image
                src={product.mainImage}
                alt={product.title}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* İkinci Resim (SubImage yoksa MainImage gösterilir) */}
            <div className="relative h-full w-1/2 p-2">
              <Image
                src={product.subImage || product.mainImage}
                alt={`${product.title} detay`}
                fill
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* Quick Look Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-4 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-sm w-full py-3 text-center text-[10px] font-bold tracking-[0.2em] uppercase text-slate-900 border border-slate-100 shadow-sm">
              Detayları Keşfet
            </div>
          </div>
        </div>

        {/* İçerik Alanı */}
        <div className="py-5 flex flex-col items-start space-y-1.5">
          <div className="flex justify-between items-start w-full">
            <span className="text-[9px] uppercase tracking-[0.4em] text-slate-400 font-bold">
              {product.category}
            </span>
            {discount > 0 && (
              <span className="text-[10px] font-sans font-bold text-amber-800">
                -%{discount}
              </span>
            )}
          </div>

          <h3 className="text-[14px] font-sans text-slate-800 tracking-tight leading-snug">
            {product.title}
          </h3>

          <div className="flex items-baseline gap-2 pt-1 font-sans">
            <span className="text-sm font-semibold text-slate-900">
              {product.price.toLocaleString("tr-TR")} TL
            </span>
            <span className="text-[10px] text-slate-600 line-through font-light">
              {oldPrice.toLocaleString("tr-TR")} TL
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
