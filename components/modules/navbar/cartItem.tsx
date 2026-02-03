"use client";

import React from "react";
import { Trash2, Minus, Plus, Sparkles, Ruler } from "lucide-react";
import { CartItemType } from "./cartDropdown";

interface CartItemDropdownProps {
  item: CartItemType;
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
  onQuantityChange,
  onRemove,
  isLoggedIn,
}) => {
  const unitPrice = item.product.price || 0;
  const totalPrice = unitPrice * (item.quantity || 1);
  const displayImage = item.customImage || item.product.mainImage;
  const isCustomized = !!item.customImage;

  // guest'te id = productId, logged-in'de id = CartItem.id (DB)
  const callId = isLoggedIn ? item.id : item.productId;

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
        <img
          src={displayImage}
          alt={item.product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Ürün Bilgileri */}
      <div className="flex flex-col flex-1 min-w-0 gap-1">
        {/* Başlık */}
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

        {/* Özelleştirme bilgisi */}
        {isCustomized && (
          <div className="flex items-center gap-1 mb-0.5">
            <Sparkles size={8} className="text-orange-600" />
            <span className="text-[8px] text-orange-600 font-bold uppercase tracking-wide">
              Özelleştirilmiş Tasarım
            </span>
          </div>
        )}

        {/* ─── Beden badge ──────────────────────────────────────────────── */}
        {item.sizeId && (
          <div className="flex items-center gap-1">
            <Ruler size={9} className="text-indigo-500" />
            <span className="text-[9px] text-indigo-600 font-bold uppercase tracking-wide">
              Beden:{" "}
              {item.size?.value // API'den gelen size detay
                ? item.size.value
                : item.sizeId}{" "}
            </span>
          </div>
        )}

        {/* Fiyat */}
        <div className="flex items-baseline gap-2">
          <span
            className={`text-sm font-semibold ${isCustomized ? "text-orange-900" : "text-slate-900"}`}
          >
            ₺{totalPrice.toLocaleString("tr-TR")}
          </span>
          {item.quantity > 1 && (
            <span className="text-[10px] text-slate-400">
              (₺{unitPrice.toLocaleString("tr-TR")})
            </span>
          )}
        </div>

        {/* Adet kontrolü */}
        <div className="flex items-center gap-2 mt-1">
          <div
            className={`flex items-center border rounded-lg p-0.5 ${
              isCustomized
                ? "border-orange-200 bg-orange-50/50"
                : "border-slate-100 bg-slate-50/50"
            }`}
          >
            <button
              onClick={() =>
                onQuantityChange(callId, -1, item.sizeId, item.customImage)
              }
              disabled={item.quantity <= 1}
              className={`p-1 rounded-sm disabled:opacity-30 transition-colors ${
                isCustomized ? "hover:bg-orange-100" : "hover:bg-white"
              }`}
            >
              <Minus
                className={`h-3 w-3 ${isCustomized ? "text-orange-600" : "text-slate-500"}`}
              />
            </button>
            <span
              className={`text-[11px] font-medium w-5 text-center ${isCustomized ? "text-orange-900" : "text-slate-700"}`}
            >
              {item.quantity}
            </span>
            <button
              onClick={() =>
                onQuantityChange(callId, 1, item.sizeId, item.customImage)
              }
              className={`p-1 rounded-sm transition-colors ${
                isCustomized ? "hover:bg-orange-100" : "hover:bg-white"
              }`}
            >
              <Plus
                className={`h-3 w-3 ${isCustomized ? "text-orange-600" : "text-slate-500"}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Kaldır */}
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
