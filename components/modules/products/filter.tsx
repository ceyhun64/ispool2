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
} from "lucide-react";

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

interface FilterProps {
  currentCategory: DbCategory | null;
  subCategoryFilter: string;
  setSubCategoryFilter: (subCat: string) => void;
  brandFilter: string;
  setBrandFilter: (brandId: string) => void; // brandId olarak güncellendi
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minPrice: number;
  setMinPrice: (price: number) => void;
}

const Filter: React.FC<FilterProps> = ({
  currentCategory,
  subCategoryFilter,
  setSubCategoryFilter,
  brandFilter,
  setBrandFilter,
  maxPrice,
  setMaxPrice,
  minPrice,
  setMinPrice,
}) => {
  const router = useRouter();
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [allCategories, setAllCategories] = useState<DbCategory[]>([]);
  const [dbBrands, setDbBrands] = useState<DbBrand[]>([]); // Markalar için state

  // API'den hem kategorileri hem markaları çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setAllCategories(data.categories || []);
        setDbBrands(data.brands || []); // Markaları state'e kaydet
      } catch (error) {
        console.error("Filtre verileri yüklenirken hata:", error);
      }
    };
    fetchData();
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
              router.push("/products");
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
                      router.push(`/products/category/${cat.id}`);
                      setSubCategoryFilter("all");
                    }}
                    className="flex-1 flex items-center justify-between py-2.5 px-3 text-left"
                  >
                    <span className="text-[11px] font-bold tracking-tight uppercase">
                      {cat.name}
                    </span>
                  </button>

                  {hasMiddle && (
                    <button
                      onClick={(e) => toggleCategory(cat.id, e)}
                      className="px-3 py-2.5 hover:bg-orange-100 transition-colors"
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
                        <div className="py-1 px-2">
                          <span className="text-[9px] font-black uppercase tracking-wider text-orange-600">
                            {mid.name}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                          {mid.subCategories.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => setSubCategoryFilter(sub.name)}
                              className={cn(
                                "text-left py-1.5 px-2 text-[10px] font-semibold transition-colors rounded-sm",
                                subCategoryFilter === sub.name
                                  ? "text-orange-600 bg-orange-50"
                                  : "text-slate-600 hover:text-orange-600 hover:bg-orange-50/50",
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
          {/* TÜMÜ Butonu - Diğer markalarla aynı grid yapısında */}
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

          {/* Dinamik Markalar - brandId kullanarak filtreleme */}
          {dbBrands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setBrandFilter(String(brand.id))} // brandId string olarak gönderiliyor
              className={cn(
                "group flex items-center gap-2 py-2 px-3 border rounded-sm text-[10px] font-bold uppercase text-left transition-all",
                brandFilter === String(brand.id)
                  ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                  : "border-slate-100 bg-white text-slate-600 hover:border-slate-300",
              )}
            >
              {/* Marka Logosu Konteynırı */}
              <div className="relative w-6 h-6 shrink-0 flex items-center justify-center">
                {brand.image ? (
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="
                      w-full h-full object-contain transition-all duration-300"
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
