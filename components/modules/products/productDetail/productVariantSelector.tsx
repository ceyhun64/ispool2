"use client";

import React from "react";
import { Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------- İNTERFACES ----------
interface Size {
  id: number;
  value: string;
  type: string;
  sortOrder: number;
}

interface StockEntry {
  id: number;
  sizeId: number | null;
  stock: number;
  priceModifier: number;
}

interface ProductVariantSelectorProps {
  availableSizes: Size[]; // ProductSize → Size listesi
  stockMatrix: StockEntry[]; // ProductStock satırları
  selectedSizeId: number | null;
  selectedStock: StockEntry | null;
  onSizeChange: (sizeId: number) => void;
}

export default function ProductVariantSelector({
  availableSizes,
  stockMatrix,
  selectedSizeId,
  selectedStock,
  onSizeChange,
}: ProductVariantSelectorProps) {
  // Beden seçimi gösterilmez: varyant yok veya beden listesi boş
  if ( availableSizes.length === 0) return null;

  // Her beden için stok bilgisini stockMatrix'ten çek
  const getSizeStock = (sizeId: number): number => {
    const entry = stockMatrix.find((s) => s.sizeId === sizeId);
    return entry?.stock ?? 0;
  };

  return (
    <div className="space-y-6">
      {/* BEDEN SEÇİMİ */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Ruler size={16} className="text-indigo-600" />
          <label className="text-sm font-bold text-slate-900">
            Beden Seçin
            {selectedSizeId && (
              <span className="ml-2 text-indigo-600">
                ({availableSizes.find((s) => s.id === selectedSizeId)?.value})
              </span>
            )}
          </label>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {availableSizes.map((size) => {
            const stock = getSizeStock(size.id);
            const isOutOfStock = stock <= 0;
            const isSelected = selectedSizeId === size.id;

            return (
              <button
                key={size.id}
                onClick={() => !isOutOfStock && onSizeChange(size.id)}
                disabled={isOutOfStock}
                className={cn(
                  "h-12 border-2 rounded-sm font-bold text-sm transition-all relative",
                  isSelected
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : isOutOfStock
                      ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                      : "border-slate-200 bg-white hover:border-slate-400",
                )}
              >
                {size.value}
                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-0.5 bg-red-400 rotate-45" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Seçili beden bilgisi */}
      {selectedStock && selectedSizeId && (
        <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">
              Seçili Beden:
            </span>
            <span className="text-sm font-bold text-slate-900">
              {availableSizes.find((s) => s.id === selectedSizeId)?.value}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="text-sm text-slate-600">Stok Durumu:</span>
            <span
              className={cn(
                "text-sm font-bold",
                selectedStock.stock > 10
                  ? "text-emerald-600"
                  : selectedStock.stock > 0
                    ? "text-orange-600"
                    : "text-red-600",
              )}
            >
              {selectedStock.stock > 0
                ? `${selectedStock.stock} adet`
                : "Tükendi"}
            </span>
          </div>

          {selectedStock.priceModifier !== 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-sm text-slate-600">Fiyat Farkı:</span>
              <span
                className={cn(
                  "text-sm font-bold",
                  selectedStock.priceModifier > 0
                    ? "text-orange-600"
                    : "text-emerald-600",
                )}
              >
                {selectedStock.priceModifier > 0 ? "+" : ""}
                {selectedStock.priceModifier.toLocaleString("tr-TR")} TL
              </span>
            </div>
          )}
        </div>
      )}

      {/* Beden seçimi beklendiğinde uyarı */}
      {!selectedSizeId && availableSizes.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded p-3">
          <p className="text-xs text-amber-800 font-medium">
            ⚠️ Lütfen bir beden seçin
          </p>
        </div>
      )}
    </div>
  );
}
