"use client";

import React from "react";
import { X, Plus, Minus, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CartItemType } from "./cart";

interface CartItemProps {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const { product, quantity, customImage } = item;
  const finalPrice = (product.price || 0) * quantity;
  const displayImage = customImage || product.mainImage;
  const isCustomized = !!customImage;

  return (
    <div className="group flex flex-row w-full gap-3 md:gap-5 py-4 md:py-6 px-2 md:px-3 bg-white border-b border-slate-100 last:border-0 transition-all">
      {/* Ürün Görseli - Responsive Boyutlandırma */}
      <Link
        href={`/products/${product.id}`}
        className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 flex-shrink-0 bg-white overflow-hidden border border-slate-100 rounded-sm"
      >
        {/* Özelleştirme Badge'i */}
        {isCustomized && (
          <div className="absolute top-0 left-0 z-10 bg-gradient-to-r from-orange-600 to-pink-600 text-white text-[7px] md:text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-tight flex items-center gap-1">
            <Sparkles size={8} className="animate-pulse" />
            <span className="hidden sm:inline">Özel</span>
          </div>
        )}

        <Image
          src={displayImage}
          alt={product.title}
          fill
          className="object-contain p-1 md:p-2 transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
      </Link>

      {/* Ürün Bilgileri */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-0.5 md:space-y-1 overflow-hidden">
            <Link href={`/products/${product.id}`}>
              <h3 className="text-xs md:text-sm font-bold tracking-tight text-slate-900 hover:text-slate-500 transition-colors uppercase leading-tight truncate md:whitespace-normal">
                {product.title}
                {isCustomized && (
                  <span className="ml-1.5 text-[9px] md:text-[10px] font-normal text-orange-600">
                    (Özelleştirilmiş)
                  </span>
                )}
              </h3>
            </Link>

            <div className="flex flex-wrap items-center gap-1 md:gap-2">
              {isCustomized ? (
                <>
                  <span className="text-[9px] md:text-[10px] tracking-wider md:tracking-[0.2em] text-orange-600 uppercase font-bold flex items-center gap-1">
                    <Sparkles size={10} className="inline" />
                    CUSTOM DESIGN
                  </span>
                  <span className="hidden xs:block w-1 h-1 rounded-full bg-orange-200" />
                </>
              ) : (
                <>
                  <span className="text-[9px] md:text-[10px] tracking-wider md:tracking-[0.2em] text-slate-400 uppercase font-semibold">
                    PRO-SERIES
                  </span>
                  <span className="hidden xs:block w-1 h-1 rounded-full bg-slate-200" />
                </>
              )}
              <span className="text-[9px] md:text-[10px] text-slate-400 font-medium">
                #{product.id}
              </span>
            </div>

            {/* Özelleştirme Bilgi Mesajı */}
            {isCustomized && (
              <div className="mt-1 md:mt-2">
                <p className="text-[8px] md:text-[9px] text-orange-600 bg-orange-50 px-2 py-1 rounded inline-block font-medium">
                  Logo veya tasarımınız ile özelleştirilmiş
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onRemove}
            className="text-slate-300 hover:text-red-600 transition-colors p-1 rounded-sm"
            aria-label="Kaldır"
          >
            <X size={16} className="md:w-5 md:h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Adet ve Fiyat Bölümü */}
        <div className="flex flex-row justify-between items-end mt-2 md:mt-4">
          {/* Kompakt Adet Kontrolü */}
          <div
            className={`flex items-center border rounded-sm ${
              isCustomized
                ? "bg-orange-50 border-orange-200"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <button
              onClick={onDecrease}
              disabled={quantity <= 1}
              className={`px-1.5 md:px-2 py-1 transition-all rounded-sm ${
                isCustomized
                  ? "text-orange-600 hover:bg-orange-100"
                  : "text-slate-500 hover:bg-slate-100"
              } disabled:opacity-30`}
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <span
              className={`w-8 md:w-10 text-center text-[11px] font-bold font-mono ${
                isCustomized ? "text-orange-900" : "text-slate-900"
              }`}
            >
              {quantity}
            </span>
            <button
              onClick={onIncrease}
              className={`px-1.5 md:px-2 py-1 transition-all rounded-sm ${
                isCustomized
                  ? "text-orange-600 hover:bg-orange-100"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>

          {/* Fiyat Bilgisi */}
          <div className="text-right ml-2">
            <p className="hidden xs:block text-[9px] md:text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-tighter">
              Birim: ₺{(product.price || 0).toLocaleString("tr-TR")}
            </p>
            <span
              className={`text-[13px] sm:text-sm md:text-base font-black tracking-tighter font-mono ${
                isCustomized ? "text-orange-900" : "text-slate-900"
              }`}
            >
              ₺
              {finalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
