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
    <div className="group flex flex-row w-full gap-6 py-8 bg-white border-b border-slate-100 last:border-0 transition-all">
      {/* Ürün Görseli - Daha Keskin ve Sade */}
      <Link
        href={`/products/${product.id}`}
        className="relative w-32 h-20 md:w-64 md:h-40 flex-shrink-0 bg-slate-50 overflow-hidden"
      >
        <Image
          src={product.mainImage}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
      </Link>

      {/* Ürün Bilgileri */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Link href={`/products/${product.id}`}>
              <h3 className="text-sm md:text-base font-light tracking-tight text-slate-900 hover:text-slate-500 transition-colors uppercase">
                {product.title}
              </h3>
            </Link>
            <p className="text-[11px] tracking-widest text-slate-400 uppercase">
              Koleksiyon
            </p>
          </div>

          <button
            onClick={onRemove}
            className="text-slate-300 hover:text-slate-950 transition-colors p-1"
            aria-label="Kaldır"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-row justify-between items-end">
          {/* Minimalist Adet Kontrolü */}
          <div className="flex items-center border border-slate-200 px-2 py-1">
            <button
              onClick={onDecrease}
              disabled={quantity <= 1}
              className="p-1 text-slate-400 hover:text-slate-950 disabled:opacity-20 transition-colors"
            >
              <Minus size={14} strokeWidth={1.5} />
            </button>
            <span className="w-8 text-center text-xs font-medium text-slate-900">
              {quantity}
            </span>
            <button
              onClick={onIncrease}
              className="p-1 text-slate-400 hover:text-slate-950 transition-colors"
            >
              <Plus size={14} strokeWidth={1.5} />
            </button>
          </div>

          {/* Fiyat Bilgisi */}
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-light mb-1">
              Birim: ₺{(product.price || 0).toLocaleString("tr-TR")}
            </p>
            <span className="text-sm md:text-base font-medium tracking-tight text-slate-950">
              ₺{finalPrice.toLocaleString("tr-TR")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
