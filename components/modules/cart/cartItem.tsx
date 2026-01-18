"use client";

import React from "react";
import { X, Plus, Minus } from "lucide-react";
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
  const { product, quantity } = item;
  const finalPrice = (product.price || 0) * quantity;

  console.log("product", item);

  return (
    <div className="group flex flex-row w-full gap-5 py-6 bg-white border-b border-slate-100 last:border-0 transition-all">
      {/* Ürün Görseli - Teknik ve Net */}
      <Link
        href={`/products/${product.id}`}
        className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-slate-50 overflow-hidden border border-slate-100"
      >
        <Image
          src={product.mainImage}
          alt={product.title}
          fill
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
      </Link>

      {/* Ürün Bilgileri */}
      <div className="flex-1 flex flex-col justify-between py-0.5">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <Link href={`/products/${product.id}`}>
              <h3 className="text-[13px] md:text-sm font-bold tracking-tight text-slate-900 hover:text-slate-500 transition-colors uppercase leading-tight">
                {product.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.2em] text-slate-400 uppercase font-semibold">
                PRO-SERIES
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-200" />
              <span className="text-[10px] text-slate-400 font-medium">
                REF: #{product.id}
              </span>
            </div>
          </div>

          <button
            onClick={onRemove}
            className="text-slate-300 hover:text-red-600 transition-colors p-1 -mr-1"
            aria-label="Kaldır"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="flex flex-row justify-between items-end mt-4">
          {/* Modern & Kompakt Adet Kontrolü */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-none overflow-hidden">
            <button
              onClick={onDecrease}
              disabled={quantity <= 1}
              className="px-2 py-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-all"
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <span className="w-10 text-center text-[11px] font-bold text-slate-900 font-mono">
              {quantity}
            </span>
            <button
              onClick={onIncrease}
              className="px-2 py-1.5 text-slate-500 hover:bg-slate-100 transition-all"
            >
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>

          {/* Fiyat Bilgisi - Tipografik Odak */}
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-tighter">
              Birim: ₺{(product.price || 0).toLocaleString("tr-TR")}
            </p>
            <span className="text-sm md:text-base font-black tracking-tighter text-slate-900 font-mono">
              ₺
              {finalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
