// components/modules/admin/products/productForm/variant.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductFormData, ProductVariant } from "@/types/product";

interface Size {
  id: number;
  value: string;
  sortOrder: number;
  isActive?: boolean;
}

interface VariantsSectionProps {
  allSizes: Size[];
  selectedSizeIds: number[];
  setSelectedSizeIds: React.Dispatch<React.SetStateAction<number[]>>;
  productData: ProductFormData;
  setProductData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

const SIZE_CATEGORIES = {
  ALL: { label: "Tümü", filter: () => true },
  PANTS: {
    label: "Pantolon",
    filter: (value: string) => {
      const num = parseInt(value);
      return !isNaN(num) && num >= 36 && num <= 72 && num % 2 === 0;
    },
  },
  TSHIRT: {
    label: "T-Shirt",
    filter: (value: string) => {
      const sizes = [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "2XL",
        "XXL",
        "3XL",
        "4XL",
        "5XL",
        "6XL",
        "7XL",
        "8XL",
      ];
      return sizes.includes(value.toUpperCase());
    },
  },
  SHOE: {
    label: "Ayakkabı",
    filter: (value: string) => {
      const num = parseInt(value);
      return !isNaN(num) && num >= 35 && num <= 48;
    },
  },
} as const;

type SizeCategory = keyof typeof SIZE_CATEGORIES;

export default function VariantsSection({
  allSizes,
  selectedSizeIds,
  setSelectedSizeIds,
  productData,
  setProductData,
}: VariantsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<SizeCategory>("ALL");

  const filteredSizes = useMemo(() => {
    return allSizes
      .filter((s) => s.isActive !== false)
      .filter((s) => SIZE_CATEGORIES[activeFilter].filter(s.value))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [allSizes, activeFilter]);

  const toggleSizeSelection = (sizeId: number) => {
    setSelectedSizeIds((prev) => {
      if (prev.includes(sizeId)) {
        setProductData((data) => ({
          ...data,
          stock: data.stock.filter((s) => s.sizeId !== sizeId),
        }));
        return prev.filter((id) => id !== sizeId);
      } else {
        setProductData((data) => ({
          ...data,
          stock: [
            ...data.stock,
            {
              sizeId,
              stock: 0,
              priceModifier: 0,
            },
          ],
        }));
        return [...prev, sizeId];
      }
    });
  };

  const updateStock = (
    sizeId: number,
    field: keyof ProductVariant,
    value: number,
  ) => {
    setProductData((prev) => {
      const existingStock = prev.stock.find((s) => s.sizeId === sizeId);

      if (existingStock) {
        return {
          ...prev,
          stock: prev.stock.map((s) =>
            s.sizeId === sizeId ? { ...s, [field]: value } : s,
          ),
        };
      } else {
        return {
          ...prev,
          stock: [
            ...prev.stock,
            {
              sizeId,
              stock: field === "stock" ? value : 0,
              priceModifier: field === "priceModifier" ? value : 0,
            },
          ],
        };
      }
    });
  };

  const toggleAllSizes = () => {
    const allFilteredIds = filteredSizes.map((s) => s.id);
    const allSelected = allFilteredIds.every((id) =>
      selectedSizeIds.includes(id),
    );

    if (allSelected) {
      setSelectedSizeIds((prev) =>
        prev.filter((id) => !allFilteredIds.includes(id)),
      );
      setProductData((data) => ({
        ...data,
        stock: data.stock.filter(
          (s) => !allFilteredIds.includes(s.sizeId as number),
        ),
      }));
    } else {
      const newIds = allFilteredIds.filter(
        (id) => !selectedSizeIds.includes(id),
      );
      setSelectedSizeIds((prev) => [...prev, ...newIds]);

      const newStockRecords = newIds.map((sizeId) => ({
        sizeId,
        stock: 0,
        priceModifier: 0,
      }));

      setProductData((data) => ({
        ...data,
        stock: [...data.stock, ...newStockRecords],
      }));
    }
  };

  return (
    <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-6">
      <div>
        <h3 className="font-semibold text-slate-900 text-base mb-1">
          Beden Varyantları
        </h3>
        <p className="text-sm text-slate-500">Beden ve stok ayarları</p>
      </div>

      {/* Size Selection */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          {(Object.keys(SIZE_CATEGORIES) as SizeCategory[]).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                activeFilter === category
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {SIZE_CATEGORIES[category].label}
            </button>
          ))}

          {filteredSizes.length > 0 && (
            <button
              type="button"
              onClick={toggleAllSizes}
              className="ml-auto px-4 py-2 text-sm font-semibold rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
            >
              {filteredSizes.every((s) => selectedSizeIds.includes(s.id))
                ? "Tümünü Kaldır"
                : "Tümünü Seç"}
            </button>
          )}
        </div>

        {filteredSizes.length > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {filteredSizes.map((size) => {
              const isSelected = selectedSizeIds.includes(size.id);
              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => toggleSizeSelection(size.id)}
                  className={`h-11 px-3 border-2 rounded-xl transition-all text-sm font-semibold ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-300 hover:border-slate-900"
                  }`}
                >
                  {size.value}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-sm text-slate-500">Bu kategoride beden yok</p>
          </div>
        )}
      </div>

      {selectedSizeIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-sm text-blue-800 font-medium">
            ✓ {selectedSizeIds.length} beden seçildi
          </p>
        </div>
      )}

      {/* Stock Management */}
      {selectedSizeIds.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-900 text-sm">
              Stok Ayarları
            </h4>
            <p className="text-xs text-slate-500">
              Her beden için stok miktarı ve fiyat farkı belirleyin
            </p>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedSizeIds
              .sort((a, b) => {
                const sizeA = allSizes.find((s) => s.id === a);
                const sizeB = allSizes.find((s) => s.id === b);
                return (sizeA?.sortOrder || 0) - (sizeB?.sortOrder || 0);
              })
              .map((sizeId) => {
                const size = allSizes.find((s) => s.id === sizeId);
                const stockData = productData.stock.find(
                  (s) => s.sizeId === sizeId,
                );

                return (
                  <div
                    key={sizeId}
                    className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors"
                  >
                    <div className="w-20 flex items-center justify-center">
                      <span className="text-sm font-bold text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200">
                        {size?.value}
                      </span>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-slate-600 mb-1.5 block font-semibold">
                          Stok Adedi
                        </Label>
                        <input
                          type="number"
                          min={0}
                          value={
                            stockData?.stock === 0
                              ? ""
                              : (stockData?.stock ?? "")
                          }
                          onChange={(e) =>
                            updateStock(sizeId, "stock", Number(e.target.value))
                          }
                          placeholder="0"
                          className="h-10 w-full px-3 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-400 transition-colors
    [appearance:textfield]
    [&::-webkit-outer-spin-button]:appearance-auto
    [&::-webkit-inner-spin-button]:appearance-auto
    [&::-webkit-outer-spin-button]:opacity-100
    [&::-webkit-inner-spin-button]:opacity-100
    [&::-webkit-outer-spin-button]:cursor-pointer
    [&::-webkit-inner-spin-button]:cursor-pointer"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 mb-1.5 block font-semibold">
                          Fiyat Farkı (₺)
                        </Label>
                        <input
                          type="number"
                          step="0.01"
                          value={
                            stockData?.priceModifier === 0
                              ? ""
                              : (stockData?.priceModifier ?? "")
                          }
                          onChange={(e) =>
                            updateStock(
                              sizeId,
                              "priceModifier",
                              Number(e.target.value),
                            )
                          }
                          placeholder="0"
                          className="h-10 w-full px-3 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-400 transition-colors
    [appearance:textfield]
    [&::-webkit-outer-spin-button]:appearance-auto
    [&::-webkit-inner-spin-button]:appearance-auto
    [&::-webkit-outer-spin-button]:opacity-100
    [&::-webkit-inner-spin-button]:opacity-100
    [&::-webkit-outer-spin-button]:cursor-pointer
    [&::-webkit-inner-spin-button]:cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {selectedSizeIds.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
          <p className="text-sm text-amber-800">
            ⚠️ En az bir beden seçmeniz gerekmektedir.
          </p>
        </div>
      )}
    </div>
  );
}
