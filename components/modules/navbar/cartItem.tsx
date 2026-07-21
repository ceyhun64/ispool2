"use client";

import React from "react";
import { Trash2, Minus, Plus, Sparkles, Ruler, Tag } from "lucide-react";
import { CartItemType } from "./cartDropdown";
import { withKdv } from "@/lib/pricing";

interface CartItemDropdownProps {
  item: CartItemType;
  maxQuantity?: number;
  onQuantityChange: (
    id: number,
    delta: number,
    sizeId?: number | null,
    customImage?: string | null,
  ) => void;
  onRemove: (
    cartItemId: number,
    productId: number,
    sizeId?: number | null,
    customImage?: string | null,
  ) => void;
  isLoggedIn: boolean;
}

const CartItemDropdown: React.FC<CartItemDropdownProps> = ({
  item,
  maxQuantity = Infinity,
  onQuantityChange,
  onRemove,
  isLoggedIn,
}) => {
  const unitPrice = withKdv(item.product.price || 0);
  const displayImage = item.customImage || item.product.mainImage;
  const isCustomized = !!item.customImage;

  const callId = isLoggedIn ? item.id : item.productId;

  const hasBulkDiscount = !!(
    item.product.bulkDiscountQty &&
    item.product.bulkDiscountRate &&
    item.quantity >= item.product.bulkDiscountQty
  );

  let totalPrice = unitPrice * item.quantity;
  let discountAmount = 0;

  if (hasBulkDiscount && item.product.bulkDiscountRate) {
    discountAmount = (totalPrice * item.product.bulkDiscountRate) / 100;
    totalPrice = totalPrice - discountAmount;
  }

  // Fiyat bilgisi hiç yoksa render'ı kısıtlayabilirsiniz (Opsiyonel)
  if (!unitPrice && totalPrice === 0) return null;

  return (
    <div className="group flex items-center gap-4 py-3 transition-all duration-200">
      {/* Ürün Görseli */}
      <div className="relative w-20 h-20 flex-shrink-0 bg-secondary/30 overflow-hidden">
        {isCustomized && (
          <div className="absolute top-0 left-0 z-10 bg-gradient-to-r from-orange-600 to-pink-600 text-white text-[7px] font-bold px-1.5 py-0.5 uppercase tracking-tight flex items-center gap-1">
            <Sparkles size={7} className="animate-pulse" />
            ÖZEL
          </div>
        )}
        {hasBulkDiscount && !isCustomized && (
          <div className="absolute top-0 left-0 z-10 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[7px] font-bold px-1.5 py-0.5 uppercase tracking-tight flex items-center gap-1">
            <Tag size={7} />
            İNDİRİM
          </div>
        )}
        {displayImage && (
          <img
            src={displayImage}
            alt={item.product.title || "Ürün"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      {/* Ürün Bilgileri */}
      <div className="flex flex-col flex-1 min-w-0 gap-1">
        {/* Başlık */}
        {item.product.title && (
          <h4
            className={`text-[13px] font-medium leading-none truncate ${
              isCustomized ? "text-orange-900" : "text-slate-800"
            }`}
          >
            {item.product.title}
            {isCustomized && (
              <span className="ml-1 text-[9px] font-normal text-orange-600">
                (Özel)
              </span>
            )}
          </h4>
        )}

        {/* Özelleştirme bilgisi */}
        {isCustomized && (
          <div className="flex items-center gap-1 mb-0.5">
            <Sparkles size={8} className="text-orange-600" />
            <span className="text-[8px] text-orange-600 font-bold uppercase tracking-wide">
              Özelleştirilmiş Tasarım
            </span>
          </div>
        )}

        {/* Toplu Alım İndirim Bildirimi */}
        {hasBulkDiscount && item.product.bulkDiscountRate && (
          <div className="flex items-center gap-1 mb-0.5">
            <Tag size={8} className="text-emerald-600" />
            <span className="text-[8px] text-emerald-600 font-bold uppercase tracking-wide">
              %{item.product.bulkDiscountRate} Toplu Alım İndirimi
            </span>
          </div>
        )}

        {/* Beden badge */}
        {item.sizeId && (
          <div className="flex items-center gap-1">
            <Ruler size={9} className="text-indigo-500" />
            <span className="text-[9px] text-indigo-600 font-bold uppercase tracking-wide">
              Beden: {item.size?.value || item.sizeId}
            </span>
          </div>
        )}

        {/* Fiyat Bölümü */}
        <div className="flex items-baseline gap-2">
          {hasBulkDiscount ? (
            <>
              {totalPrice > 0 && (
                <span className="text-sm font-semibold text-emerald-700">
                  ₺
                  {totalPrice.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              )}
              {unitPrice * item.quantity > 0 && (
                <span className="text-[10px] text-slate-400 line-through">
                  ₺
                  {(unitPrice * item.quantity).toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              )}
            </>
          ) : (
            <>
              {totalPrice > 0 && (
                <span
                  className={`text-sm font-semibold ${isCustomized ? "text-orange-900" : "text-slate-900"}`}
                >
                  ₺
                  {totalPrice.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              )}
              {item.quantity > 1 && unitPrice > 0 && (
                <span className="text-[10px] text-slate-400">
                  (₺
                  {unitPrice.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })}
                  )
                </span>
              )}
            </>
          )}
        </div>

        {/* İndirim miktarı (tasarruf) */}
        {hasBulkDiscount && discountAmount > 0 && (
          <span className="text-[10px] text-emerald-600 font-medium">
            ₺
            {discountAmount.toLocaleString("tr-TR", {
              minimumFractionDigits: 2,
            })}{" "}
            tasarruf
          </span>
        )}

        {/* Adet kontrolü */}
        <div className="flex items-center gap-2 mt-1">
          <div
            className={`flex items-center border rounded-lg p-0.5 ${
              isCustomized
                ? "border-orange-200 bg-orange-50/50"
                : hasBulkDiscount
                  ? "border-emerald-200 bg-emerald-50/50"
                  : "border-slate-100 bg-slate-50/50"
            }`}
          >
            <button
              onClick={() =>
                onQuantityChange(callId, -1, item.sizeId, item.customImage)
              }
              disabled={item.quantity <= 1}
              className="p-1 rounded-sm disabled:opacity-30 transition-colors hover:bg-white/50"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-[11px] font-medium w-5 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                onQuantityChange(callId, 1, item.sizeId, item.customImage)
              }
              disabled={item.quantity >= maxQuantity}
              className="p-1 rounded-sm transition-colors hover:bg-white/50 disabled:opacity-30"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Kalan adet bilgisi */}
          {/* Kalan adet bilgisi */}
          {(() => {
            const remainingQty =
              (item.product.bulkDiscountQty || 0) - item.quantity;

            // Sadece indirim uygulanmadıysa VE gerçekten kalan bir miktar varsa VE indirim oranı tanımlıysa göster
            if (
              !hasBulkDiscount &&
              remainingQty > 0 &&
              item.product.bulkDiscountRate
            ) {
              return (
                <span className="text-[10px] text-slate-400 font-medium animate-in fade-in duration-300">
                  +{remainingQty} adet daha al, %{item.product.bulkDiscountRate}{" "}
                  kazan
                </span>
              );
            }
            return null;
          })()}
        </div>
      </div>

      {/* Kaldır butonu */}
      <button
        onClick={() =>
          onRemove(item.id, item.productId, item.sizeId, item.customImage)
        }
        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all duration-200"
        title="Kaldır"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CartItemDropdown;
