"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus } from "lucide-react";
import { CartItemType } from "./cartDropdown";

interface CartItemDropdownProps {
  item: CartItemType;
  onQuantityChange: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

const CartItem: React.FC<CartItemDropdownProps> = ({
  item,
  onQuantityChange,
  onRemove,
}) => {
  const unitPrice = item.product.price || 0;
  const totalPrice = unitPrice * (item.quantity || 1);

  return (
    <div className="group flex items-center gap-4 py-3 transition-all duration-200">
      {/* Ürün Görseli - Daha yumuşak köşeler ve temiz arka plan */}
      <div className="relative w-20 h-20 flex-shrink-0 bg-secondary/30 overflow-hidden">
        <img
          src={item.product.mainImage}
          alt={item.product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Ürün Bilgileri */}
      <div className="flex flex-col flex-1 min-w-0 gap-1">
        <h4 className="text-[13px] font-medium text-slate-800 truncate leading-none">
          {item.product.title}
        </h4>

        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-slate-900">
            ₺{totalPrice.toLocaleString("tr-TR")}
          </span>
          {item.quantity > 1 && (
            <span className="text-[10px] text-slate-400">
              (₺{unitPrice.toLocaleString("tr-TR")})
            </span>
          )}
        </div>

        {/* Adet Kontrolü - Minimal ve Satır İçi */}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center border border-slate-100 rounded-lg bg-slate-50/50 p-0.5">
            <button
              onClick={() => onQuantityChange(item.id, -1)}
              disabled={item.quantity <= 1}
              className="p-1 hover:bg-white rounded-md disabled:opacity-30 transition-colors"
            >
              <Minus className="h-3 w-3 text-slate-500" />
            </button>
            <span className="text-[11px] font-medium w-5 text-center text-slate-700">
              {item.quantity}
            </span>
            <button
              onClick={() => onQuantityChange(item.id, 1)}
              className="p-1 hover:bg-white rounded-md transition-colors"
            >
              <Plus className="h-3 w-3 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Kaldır Butonu - Sadece hover durumunda daha belirgin */}
      <button
        onClick={() => onRemove(item.id)}
        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
        title="Kaldır"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CartItem;
