"use client";

import React from "react";
import { X, Plus, Minus, Sparkles, Ruler, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CartItemType } from "./cart";
import { withKdv } from "@/lib/pricing";

interface CartItemProps {
  item: CartItemType;
  maxQuantity?: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export default function CartItem({
  item,
  maxQuantity = Infinity,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const { product, quantity, customImage } = item;
  const displayImage = customImage || product.mainImage;
  const isCustomized = !!customImage;

  // Fiyat ve indirim kontrolleri (Sıfır kontrolü eklendi) — KDV dahil gösterilir
  const unitPrice = withKdv(product.price || 0);

  const hasBulkDiscount = !!(
    product.bulkDiscountQty &&
    product.bulkDiscountRate &&
    quantity >= product.bulkDiscountQty
  );

  let finalPrice = unitPrice * quantity;
  let discountAmount = 0;

  if (hasBulkDiscount && product.bulkDiscountRate) {
    discountAmount = (finalPrice * product.bulkDiscountRate) / 100;
    finalPrice = finalPrice - discountAmount;
  }

  // Fiyat yoksa bileşeni render etmemek veya alternatif göstermek isterseniz burayı kullanabilirsiniz
  if (!unitPrice && !finalPrice) return null;

  return (
    <div className="group flex flex-row w-full gap-3 md:gap-5 py-4 md:py-6 px-2 md:px-3 bg-white border-b border-slate-100 last:border-0 transition-all">
      {/* Ürün Görseli */}
      <Link
        href={`/products/${product.id}`}
        className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 flex-shrink-0 bg-white overflow-hidden border border-slate-100 rounded-sm"
      >
        {isCustomized && (
          <div className="absolute top-0 left-0 z-10 bg-gradient-to-r from-orange-600 to-pink-600 text-white text-[7px] md:text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-tight flex items-center gap-1">
            <Sparkles size={8} className="animate-pulse" />
            <span className="hidden sm:inline">Özel</span>
          </div>
        )}
        {hasBulkDiscount && !isCustomized && (
          <div className="absolute top-0 left-0 z-10 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[7px] md:text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-tight flex items-center gap-1">
            <Tag size={8} />
            <span className="hidden sm:inline">İndirim</span>
          </div>
        )}
        {displayImage && (
          <Image
            src={displayImage}
            alt={product.title || "Ürün"}
            fill
            className="object-contain p-1 md:p-2 transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        )}
      </Link>

      {/* Ürün Bilgileri */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-0.5 md:space-y-1 overflow-hidden">
            {/* Başlık */}
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

            {/* Meta satır */}
            <div className="flex flex-wrap items-center gap-1 md:gap-2">
              {isCustomized ? (
                <>
                  <span className="text-[9px] md:text-[10px] tracking-wider md:tracking-[0.2em] text-orange-600 uppercase font-bold flex items-center gap-1">
                    <Sparkles size={10} className="inline" />
                    OZELLESTIRILMIS
                  </span>
                  <span className="hidden xs:block w-1 h-1 rounded-full bg-orange-200" />
                </>
              ) : hasBulkDiscount ? (
                <>
                  <span className="text-[9px] md:text-[10px] tracking-wider md:tracking-[0.2em] text-emerald-600 uppercase font-bold flex items-center gap-1">
                    <Tag size={10} className="inline" />
                    TOPLU ALIM
                  </span>
                  <span className="hidden xs:block w-1 h-1 rounded-full bg-emerald-200" />
                </>
              ) : (
                <>
                  <span className="text-[9px] md:text-[10px] tracking-wider md:tracking-[0.2em] text-slate-400 uppercase font-semibold">
                    PRO-SERIES
                  </span>
                  <span className="hidden xs:block w-1 h-1 rounded-full bg-slate-200" />
                </>
              )}
              {product.id && (
                <span className="text-[9px] md:text-[10px] text-slate-400 font-medium">
                  #{product.id}
                </span>
              )}
            </div>

            {/* Toplu Alım İndirim Bildirimi */}
            {hasBulkDiscount && product.bulkDiscountRate && (
              <div className="flex items-center gap-1 mt-1">
                <Tag size={9} className="text-emerald-600" />
                <span className="text-[8px] md:text-[9px] text-emerald-600 font-bold uppercase tracking-wide">
                  %{product.bulkDiscountRate} Toplu Alım İndirimi Uygulandı
                </span>
              </div>
            )}

            {/* Beden badge */}
            {item.sizeId && (
              <div className="flex items-center gap-1 mt-0.5">
                <Ruler size={10} className="text-indigo-500" />
                <span className="text-[9px] md:text-[10px] text-indigo-600 font-bold uppercase tracking-wide">
                  Beden: {item.size?.value || item.sizeId}
                </span>
              </div>
            )}

            {/* İndirim tasarruf bilgisi - Sadece 0'dan büyükse gösterilir */}
            {hasBulkDiscount && discountAmount > 0 && (
              <div className="mt-1">
                <p className="text-[8px] md:text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block font-medium">
                  ₺
                  {discountAmount.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  tasarruf ettiniz
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

        {/* Adet + Fiyat */}
        <div className="flex flex-row justify-between items-end mt-2 md:mt-4">
          {/* Adet kontrolü */}
          <div
            className={`flex items-center border rounded-sm ${
              isCustomized
                ? "bg-orange-50 border-orange-200"
                : hasBulkDiscount
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-slate-50 border-slate-200"
            }`}
          >
            <button
              onClick={onDecrease}
              disabled={quantity <= 1}
              className="px-1.5 md:px-2 py-1 transition-all rounded-sm disabled:opacity-30"
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <span className="w-8 md:w-10 text-center text-[11px] font-bold font-mono">
              {quantity}
            </span>
            <button
              onClick={onIncrease}
              disabled={quantity >= maxQuantity}
              className="px-1.5 md:px-2 py-1 transition-all rounded-sm disabled:opacity-30"
            >
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>

          {/* Fiyat Bölümü */}
          <div className="text-right ml-2">
            {hasBulkDiscount ? (
              <>
                {/* Eski fiyat sadece indirim varsa ve 0 değilse */}
                {unitPrice * quantity > 0 && (
                  <p className="text-[9px] md:text-[10px] text-slate-400 line-through mb-0.5 uppercase tracking-tighter">
                    ₺
                    {(unitPrice * quantity).toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                )}
                <span className="text-[13px] sm:text-sm md:text-base font-black tracking-tighter font-mono text-emerald-700">
                  ₺
                  {finalPrice.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </>
            ) : (
              <>
                {unitPrice > 0 && (
                  <p className="hidden xs:block text-[9px] md:text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-tighter">
                    Birim: ₺
                    {unitPrice.toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                )}
                <span
                  className={`text-[13px] sm:text-sm md:text-base font-black tracking-tighter font-mono ${
                    isCustomized ? "text-orange-900" : "text-slate-900"
                  }`}
                >
                  {finalPrice > 0
                    ? `₺${finalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`
                    : ""}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Kalan adet bilgisi */}
       
        {(() => {
          const remainingQty = (product.bulkDiscountQty || 0) - quantity;

          // Eğer indirim zaten uygulanmadıysa VE indirim için gereken miktar 0'dan büyükse göster
          if (
            !hasBulkDiscount &&
            remainingQty > 0 &&
            product.bulkDiscountRate
          ) {
            return (
              <div className="mt-2 text-left">
                <p className="text-[8px] md:text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded inline-block">
                  +{remainingQty} adet daha al, %{product.bulkDiscountRate}{" "}
                  indirim kazan
                </p>
              </div>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
}
