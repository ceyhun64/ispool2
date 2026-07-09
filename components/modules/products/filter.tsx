"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  RotateCcw,
  Factory,
  Hash,
  Banknote,
  ChevronDown,
  ChevronUp,
  Tag,
  Palette,
  Ruler,
} from "lucide-react";
import { buildFilterNavUrl } from "./filterUrlParams";

// Veritabanı Tip Tanımlamaları
interface DbSubCategory {
  id: number;
  name: string;
}

interface DbMiddleCategory {
  id: number;
  name: string;
  subCategories: DbSubCategory[];
}

interface DbCategory {
  id: number;
  name: string;
  middleCategories: DbMiddleCategory[];
}

interface DbBrand {
  id: number;
  name: string;
  image?: string;
}

interface DbColor {
  id: number;
  name: string;
  hexCode: string;
}

interface DbSize {
  id: number;
  value: string;
  sortOrder: number;
}

interface FilterProps {
  currentCategory: DbCategory | null;
  subCategoryFilter: string;
  setSubCategoryFilter: (subCat: string) => void;
  brandFilter: string;
  setBrandFilter: (brandId: string) => void;
  colorFilter: string;
  setColorFilter: (colorId: string) => void;
  sizeFilter: string;
  setSizeFilter: (sizeId: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minPrice: number;
  setMinPrice: (price: number) => void;
  isDiscountMode?: boolean;
}

const Filter: React.FC<FilterProps> = ({
  currentCategory,
  subCategoryFilter,
  setSubCategoryFilter,
  brandFilter,
  setBrandFilter,
  colorFilter,
  setColorFilter,
  sizeFilter,
  setSizeFilter,
  maxPrice,
  setMaxPrice,
  minPrice,
  setMinPrice,
  isDiscountMode = false,
}) => {
  const router = useRouter();
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [colors, setColors] = useState<DbColor[]>([]);
  const [sizes, setSizes] = useState<DbSize[]>([]);
  const [allCategories, setAllCategories] = useState<DbCategory[]>([]);
  const [dbBrands, setDbBrands] = useState<DbBrand[]>([]);

  // Renk, beden, kategori ve marka verilerini API'den (gerçek DB id'leriyle) çek
  useEffect(() => {
    async function fetchFilters() {
      try {
        // Renkleri çek
        const colorsRes = await fetch("/api/color");
        const colorsData = await colorsRes.json();

        // API yanıtı: { success: true, data: Array, count: number }
        if (colorsData.success && Array.isArray(colorsData.data)) {
          setColors(colorsData.data);
        }

        // Bedenleri çek
        const sizesRes = await fetch("/api/size");
        const sizesData = await sizesRes.json();

        // API yanıtı: { success: true, data: Array, stats: {...} }
        if (sizesData.success && Array.isArray(sizesData.data)) {
          setSizes(
            [...sizesData.data].sort(
              (a: DbSize, b: DbSize) => a.sortOrder - b.sortOrder,
            ),
          );
        }

        // Kategori hiyerarşisi ve markaları çek — gerçek DB id'leri kullanılır
        const catRes = await fetch("/api/category");
        const catData = await catRes.json();
        if (catData.success) {
          if (Array.isArray(catData.categories)) {
            setAllCategories(catData.categories);
          }
          if (Array.isArray(catData.brands)) {
            setDbBrands(catData.brands);
          }
        }
      } catch (error) {
        console.error("Filtre verileri yüklenemedi:", error);
      }
    }
    fetchFilters();
  }, []);

  const toggleCategory = (categoryId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  return (
    <div className="bg-slate-50">
      {/* İNDİRİM MODU UYARISI */}
      {isDiscountMode && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={16} className="text-emerald-600" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900">
              İNDİRİM MODU AKTİF
            </h3>
          </div>
          <p className="text-[9px] text-emerald-700 leading-relaxed">
            Sadece indirimli ürünler gösteriliyor
          </p>
        </div>
      )}

      {/* KATEGORİLER BÖLÜMÜ */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Hash size={14} className="text-orange-600" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
            KATEGORİLER
          </h3>
        </div>

        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => {
              setSubCategoryFilter("all");
              router.push(
                buildFilterNavUrl(
                  "/products",
                  { brandFilter, colorFilter, sizeFilter, minPrice, maxPrice },
                  isDiscountMode ? { discount: "true" } : undefined,
                ),
              );
            }}
            className={cn(
              "group relative flex items-center rounded-sm justify-between py-2.5 px-3 transition-all duration-300",
              !currentCategory && subCategoryFilter === "all"
                ? "bg-slate-950 text-white shadow-lg shadow-slate-200"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-950",
            )}
          >
            <span className="text-[11px] font-bold tracking-tight uppercase">
              TÜMÜ
            </span>
            <ChevronRight
              size={14}
              className={cn(
                !currentCategory && subCategoryFilter === "all"
                  ? "rotate-90"
                  : "opacity-0",
              )}
            />
          </button>

          {allCategories.map((cat) => {
            const isExpanded = expandedCategories.includes(cat.id);
            const hasMiddle =
              cat.middleCategories && cat.middleCategories.length > 0;

            return (
              <div key={cat.id} className="flex flex-col">
                <div
                  className={cn(
                    "group flex items-center transition-all duration-300",
                    currentCategory?.id === cat.id
                      ? "bg-orange-50 text-orange-600"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-950",
                  )}
                >
                  <button
                    onClick={() => {
                      router.push(
                        buildFilterNavUrl(`/products/category/${cat.id}`, {
                          brandFilter,
                          colorFilter,
                          sizeFilter,
                          minPrice,
                          maxPrice,
                        }),
                      );
                      setSubCategoryFilter("all");
                    }}
                    className="flex-1 flex items-center justify-between py-2.5 px-3 text-left rounded-sm"
                  >
                    <span className="text-[11px] font-bold tracking-tight uppercase">
                      {cat.name}
                    </span>
                  </button>

                  {hasMiddle && (
                    <button
                      onClick={(e) => toggleCategory(cat.id, e)}
                      className="px-3 py-2.5 hover:bg-orange-100 transition-colors rounded-sm"
                    >
                      {isExpanded ? (
                        <ChevronUp size={14} className="text-orange-600" />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </button>
                  )}
                </div>

                {isExpanded && hasMiddle && (
                  <div className="ml-4 border-l-2 border-slate-200 pl-2 mt-1 mb-2 space-y-3">
                    {cat.middleCategories.map((mid) => (
                      <div key={mid.id}>
                        <button
                          onClick={() =>
                            router.push(
                              buildFilterNavUrl(
                                `/products/category/${cat.id}/${mid.id}`,
                                {
                                  brandFilter,
                                  colorFilter,
                                  sizeFilter,
                                  minPrice,
                                  maxPrice,
                                },
                              ),
                            )
                          }
                          className="w-full text-left py-1 px-2 hover:bg-orange-50 rounded-sm transition-colors"
                        >
                          <span className="text-[9px] font-black uppercase tracking-wider text-orange-600">
                            {mid.name}
                          </span>
                        </button>
                        <div className="flex flex-col gap-1 mt-1">
                          {mid.subCategories.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() =>
                                router.push(
                                  buildFilterNavUrl(
                                    `/products/category/${cat.id}/${mid.id}/${sub.id}`,
                                    {
                                      brandFilter,
                                      colorFilter,
                                      sizeFilter,
                                      minPrice,
                                      maxPrice,
                                    },
                                  ),
                                )
                              }
                              className={cn(
                                "text-left py-1.5 px-2 text-[10px] font-semibold transition-colors rounded-sm",
                                "text-slate-600 hover:text-orange-600 hover:bg-orange-50/50",
                              )}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ÇÖZÜM ORTAKLARI (MARKALAR) */}
      <section className="pt-8 border-t border-slate-100 mt-8">
        <div className="flex items-center gap-2 mb-6">
          <Factory size={14} className="text-orange-600" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
            ÇÖZÜM ORTAKLARI
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* TÜMÜ Butonu */}
          <button
            onClick={() => setBrandFilter("all")}
            className={cn(
              "flex items-center gap-2 py-2 px-3 border rounded-sm text-[10px] font-bold uppercase transition-all",
              brandFilter === "all"
                ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                : "border-slate-100 bg-white text-slate-600 hover:border-slate-300",
            )}
          >
            <div className="w-6 h-6 flex items-center justify-center border border-dashed border-slate-300 rounded-full text-[10px] shrink-0">
              ∞
            </div>
            <span className="truncate">TÜMÜ</span>
          </button>

          {/* Dinamik Markalar */}
          {dbBrands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setBrandFilter(String(brand.id))}
              className={cn(
                "group flex items-center gap-2 py-2 px-3 border rounded-sm text-[10px] font-bold uppercase text-left transition-all",
                brandFilter === String(brand.id)
                  ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                  : "border-slate-100 bg-white text-slate-600 hover:border-slate-300",
              )}
            >
              <div className="relative w-6 h-6 shrink-0 flex items-center justify-center">
                {brand.image ? (
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-contain transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-[8px] text-slate-400">
                    {brand.name[0]}
                  </div>
                )}
              </div>
              <span className="truncate">{brand.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* RENK FİLTRESİ */}
      <section className="pt-8 border-t border-slate-100 mt-8">
        <div className="flex items-center gap-2 mb-6">
          <Palette size={14} className="text-orange-600" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
            RENK
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* TÜMÜ Butonu */}
          <button
            onClick={() => setColorFilter("all")}
            className={cn(
              "flex items-center gap-2 py-2 px-3 border rounded-sm text-[10px] font-bold uppercase transition-all",
              colorFilter === "all"
                ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                : "border-slate-100 bg-white text-slate-600 hover:border-slate-300",
            )}
          >
            <div className="w-6 h-6 flex items-center justify-center border border-dashed border-slate-300 rounded-full text-[10px] shrink-0">
              ∞
            </div>
            <span className="truncate">TÜMÜ</span>
          </button>

          {/* Dinamik Renkler */}
          {colors?.map((color) => (
            <button
              key={color.id}
              onClick={() => setColorFilter(String(color.id))}
              className={cn(
                "group flex items-center gap-2 py-2 px-3 border rounded-sm text-[10px] font-bold uppercase text-left transition-all",
                colorFilter === String(color.id)
                  ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                  : "border-slate-100 bg-white text-slate-600 hover:border-slate-300",
              )}
            >
              <div
                className="w-6 h-6 shrink-0 rounded-full border border-slate-200 shadow-sm"
                style={{ backgroundColor: color.hexCode }}
                title={color.name} // Hover durumunda isim gösterir
              />
              <span className="truncate">{color.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* BEDEN FİLTRESİ */}
      <section className="pt-8 border-t border-slate-100 mt-8">
        <div className="flex items-center gap-2 mb-6">
          <Ruler size={14} className="text-orange-600" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
            BEDEN
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* TÜMÜ Butonu */}
          <button
            onClick={() => setSizeFilter("all")}
            className={cn(
              "flex items-center justify-center py-2.5 px-2 border rounded-sm text-[10px] font-bold uppercase transition-all",
              sizeFilter === "all"
                ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                : "border-slate-100 bg-white text-slate-600 hover:border-slate-300",
            )}
          >
            TÜMÜ
          </button>

          {/* Dinamik Bedenler */}
          {sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => setSizeFilter(String(size.id))}
              className={cn(
                "flex items-center justify-center py-2.5 px-2 border rounded-sm text-[10px] font-bold uppercase transition-all",
                sizeFilter === String(size.id)
                  ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                  : "border-slate-100 bg-white text-slate-600 hover:border-slate-300",
              )}
            >
              {size.value}
            </button>
          ))}
        </div>
      </section>

      {/* FİYAT ARALIĞI */}
      <section className="pt-8 border-t border-slate-100 mt-8">
        <div className="flex items-center gap-2 mb-8">
          <Banknote size={14} className="text-orange-600" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
            FİYAT SPEKTRUMU
          </h3>
        </div>
        <Slider
          value={[minPrice, maxPrice]}
          onValueChange={([min, max]) => {
            setMinPrice(min);
            setMaxPrice(max);
          }}
          max={300000}
          step={100}
          className="mb-8"
        />
        <div className="flex items-center gap-3">
          <div className="flex-1 p-3 bg-white border border-slate-100 text-[11px] font-bold">
            {minPrice.toLocaleString()}₺
          </div>
          <div className="flex-1 p-3 bg-white border border-slate-100 text-[11px] font-bold">
            {maxPrice.toLocaleString()}₺
          </div>
        </div>
      </section>

      {/* SIFIRLA BUTONU */}
      <button
        onClick={() => {
          setSubCategoryFilter("all");
          setBrandFilter("all");
          setColorFilter("all");
          setSizeFilter("all");
          setMinPrice(0);
          setMaxPrice(300000);
          setExpandedCategories([]);
        }}
        className="group rounded-sm w-full mt-8 py-4 flex items-center justify-center gap-3 bg-white border-2 border-slate-950 transition-all hover:bg-slate-950 hover:text-white"
      >
        <RotateCcw size={14} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
          Parametreleri Sıfırla
        </span>
      </button>
    </div>
  );
};

export default Filter;
