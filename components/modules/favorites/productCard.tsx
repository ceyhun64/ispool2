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
  oldPrice?: number;
  discountPercentage?: number;
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

  // Favori context kullanımı
  const { isFavorited, addFavorite, removeFavorite } = useFavorite();
  const favorited = isFavorited(id);

  // Veriyi API'den çekme (İşlev korundu)
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

  // Tasarımdaki fiyat ve indirim hesaplamaları
  const discount = product.discountPercentage || 30;
  const oldPrice = product.oldPrice || Math.round(product.price * 1.43);

  return (
    <div
      className="group relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`}>
        {/* Görsel Alanı: Aspect Square ve Gri Arka Plan */}
        <div className="relative aspect-square w-full overflow-hidden bg-[#f9f9f9]">
          {/* Favori Butonu (Yuvarlak ve Glassmorphism) */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 z-20 p-2 transition-all duration-300 group/fav bg-white/50 backdrop-blur-sm rounded-full"
            aria-label={`${product.title} ürününü favorilere ekle`}
          >
            <Heart
              className={`h-5 w-5 ${
                favorited ? "fill-red-500 text-red-500" : "text-slate-600"
              } group-hover/fav:scale-110 transition-transform`}
              strokeWidth={1.5}
            />
          </button>

          {/* Animasyonlu Resim Kaydırma */}
          <motion.div
            className="flex h-full w-[200%]"
            animate={{ x: isHovered && product.subImage ? "-50%" : "0%" }}
            transition={{ duration: 0.8, ease: [0.6, 0.01, -0.05, 0.95] }}
          >
            <div className="relative h-full w-1/2">
              <Image
                src={product.mainImage}
                alt={product.title}
                fill
                className="object-contain bg-white"
                priority
              />
            </div>

            <div className="relative h-full w-1/2">
              <Image
                src={product.subImage || product.mainImage}
                alt={`${product.title} detay`}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Hızlı Bakış Overlay (Alttan Kayarak Çıkan) */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
            <div className="bg-slate-900/90 backdrop-blur-sm py-4 text-center text-[10px] font-bold tracking-[0.2em] uppercase text-white">
              Ürünü İncele
            </div>
          </div>
        </div>

        {/* Bilgi Alanı */}
        <div className="py-4 flex flex-col space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-500">
              {product.category}
            </span>
            {discount > 0 && (
              <span className="bg-amber-200 text-amber-900 px-1.5 py-0.5 text-[9px] font-bold uppercase">
                %{discount} İndirim
              </span>
            )}
          </div>

          <h3 className="text-sm font-medium text-slate-800 line-clamp-1">
            {product.title}
          </h3>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-sm font-bold text-slate-900">
              {product.price.toLocaleString("tr-TR")} TL
            </span>
            {oldPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {oldPrice.toLocaleString("tr-TR")} TL
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
