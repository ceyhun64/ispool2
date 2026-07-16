"use client";

import React from "react";
import { Ruler, Palette, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { withKdv } from "@/lib/pricing";

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

interface ColorOption {
  id: number;
  title: string;
  price: number;
  oldPrice: number | null;
  mainImage: string;
  color: { id: number; name: string; hexCode: string } | null;
  hasDiscount: boolean;
  discountPercentage: number;
  availableSizes: Size[];
  stockMatrix: StockEntry[];
}

interface ProductVariantSelectorProps {
  availableSizes: Size[];
  stockMatrix: StockEntry[];
  selectedSizeIds: number[];
  onSizeToggle: (sizeId: number) => void;
  // Color selection props
  productGroupId: string | null;
  currentProductId: number;
  currentColor: { id: number; name: string; hexCode: string } | null;
  currentMainImage: string;
  currentTitle: string;
  otherColors: ColorOption[];
  selectedColorIds: number[];
  onColorToggle: (colorId: number) => void;
}

export default function ProductVariantSelector({
  availableSizes,
  stockMatrix,
  selectedSizeIds,
  onSizeToggle,
  productGroupId,
  currentProductId,
  currentColor,
  currentMainImage,
  currentTitle,
  otherColors,
  selectedColorIds,
  onColorToggle,
}: ProductVariantSelectorProps) {
  // Her beden için stok bilgisini stockMatrix'ten çek
  const getSizeStock = (sizeId: number): number => {
    const entry = stockMatrix.find((s) => s.sizeId === sizeId);
    return entry?.stock ?? 0;
  };

  const hasColorOptions = productGroupId && otherColors.length > 0;
  const hasSizeOptions = availableSizes.length > 0;

  // Eğer ne renk ne de beden seçeneği yoksa hiçbir şey gösterme
  if (!hasColorOptions && !hasSizeOptions) return null;

  const selectedStockEntries = selectedSizeIds
    .map((sizeId) => stockMatrix.find((s) => s.sizeId === sizeId))
    .filter((s): s is StockEntry => !!s);

  return (
    <div className="space-y-6">
      {/* RENK SEÇİMİ */}
      {hasColorOptions && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-amber-600" />
            <label className="text-sm font-bold text-slate-900">
              Renk Seçenekleri
            </label>
            <span className="text-[10px] text-slate-400 font-medium">
              (birden fazla seçebilirsiniz)
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
            {/* Mevcut ürün - her zaman seçili */}
            <button
              type="button"
              className="relative group border-2 border-purple-600 bg-purple-50 rounded-sm p-1.5 sm:p-2 cursor-default"
              title={currentColor?.name || "Mevcut Renk"}
            >
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                <Check size={10} className="text-white" strokeWidth={3} />
              </div>
              <div className="aspect-square rounded overflow-hidden bg-white mb-1 sm:mb-2">
                <img
                  src={currentMainImage}
                  alt={currentTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              {currentColor && (
                <div className="flex items-center gap-1 justify-center">
                  <div
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-slate-300 shrink-0"
                    style={{ backgroundColor: currentColor.hexCode }}
                  />
                  <span className="hidden sm:inline text-[10px] font-semibold text-purple-700 truncate">
                    {currentColor.name}
                  </span>
                </div>
              )}
            </button>

            {/* Diğer renkler - toggle seçim */}
            {otherColors.map((colorOption) => {
              const isSelected = selectedColorIds.includes(colorOption.id);
              return (
                <button
                  type="button"
                  key={colorOption.id}
                  onClick={() => onColorToggle(colorOption.id)}
                  className={cn(
                    "relative group bg-white border-2 rounded-sm p-1.5 sm:p-2 transition-all",
                    isSelected
                      ? "border-purple-600 bg-purple-50"
                      : "border-slate-200 hover:border-purple-400",
                  )}
                  title={colorOption.color?.name || colorOption.title}
                >
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center z-10">
                      <Check size={10} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                  <div className="aspect-square rounded overflow-hidden bg-white mb-1 sm:mb-2">
                    <img
                      src={colorOption.mainImage}
                      alt={colorOption.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  {colorOption.color && (
                    <div className="flex items-center gap-1 justify-center">
                      <div
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-slate-300 shrink-0"
                        style={{
                          backgroundColor: colorOption.color.hexCode,
                        }}
                      />
                      <span className="hidden sm:inline text-[10px] font-medium text-slate-600 truncate max-w-15">
                        {colorOption.color.name}
                      </span>
                    </div>
                  )}
                  {colorOption.hasDiscount && (
                    <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-red-500 text-white text-[8px] font-bold px-1 sm:px-1.5 py-0.5 rounded">
                      -{colorOption.discountPercentage}%
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* BEDEN SEÇİMİ */}
      {hasSizeOptions && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Ruler size={16} className="text-indigo-600" />
            <label className="text-sm font-bold text-slate-900">
              Beden Seçin
            </label>
            <span className="text-[10px] text-slate-400 font-medium">
              (birden fazla seçebilirsiniz)
            </span>
            {selectedSizeIds.length > 0 && (
              <span className="ml-auto text-indigo-600 text-xs font-bold">
                {selectedSizeIds.length} beden seçildi
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {availableSizes.map((size) => {
              const stock = getSizeStock(size.id);
              const isOutOfStock = stock <= 0;
              const isSelected = selectedSizeIds.includes(size.id);

              return (
                <button
                  type="button"
                  key={size.id}
                  onClick={() => !isOutOfStock && onSizeToggle(size.id)}
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
      )}

      {/* Seçili beden bilgisi */}
      {selectedStockEntries.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3">
          {selectedStockEntries.map((stockEntry) => {
            const size = availableSizes.find(
              (s) => s.id === stockEntry.sizeId,
            );
            return (
              <div
                key={stockEntry.sizeId}
                className="flex items-center justify-between pb-2 border-b border-slate-200 last:border-b-0 last:pb-0"
              >
                <span className="text-sm font-semibold text-slate-700">
                  Beden {size?.value}:
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-sm font-bold",
                      stockEntry.stock > 10
                        ? "text-emerald-600"
                        : stockEntry.stock > 0
                          ? "text-orange-600"
                          : "text-red-600",
                    )}
                  >
                    {stockEntry.stock > 0
                      ? `${stockEntry.stock} adet`
                      : "Tükendi"}
                  </span>
                  {stockEntry.priceModifier !== 0 && (
                    <span
                      className={cn(
                        "text-sm font-bold",
                        stockEntry.priceModifier > 0
                          ? "text-orange-600"
                          : "text-emerald-600",
                      )}
                    >
                      {stockEntry.priceModifier > 0 ? "+" : ""}
                      {withKdv(stockEntry.priceModifier).toLocaleString(
                        "tr-TR",
                      )}{" "}
                      TL
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Beden seçimi beklendiğinde uyarı */}
      {selectedSizeIds.length === 0 && hasSizeOptions && (
        <div className="bg-amber-50 border border-amber-200 rounded p-3">
          <p className="text-xs text-amber-800 font-medium">
            ⚠️ Lütfen en az bir beden seçin
          </p>
        </div>
      )}
    </div>
  );
}
