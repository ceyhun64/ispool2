// /components/modules/products/filter.tsx
"use client";
import React, { useState } from "react";
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
import { CATEGORIES } from "@/data/categories";

interface FilterProps {
  currentCategory: any;
  subCategoryFilter: string;
  setSubCategoryFilter: (subCat: string) => void;
  brandFilter: string;
  setBrandFilter: (brand: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minPrice: number;
  setMinPrice: (price: number) => void;
}

const brands = [
  "U-Power",
  "Base",
  "3M",
  "Delta Plus",
  "Ansell",
  "Portwest",
  "Polyboot",
];

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
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Toggle kategori açma/kapama
  const toggleCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const sectionTitle = currentCategory ? "ALT KATEGORİLER" : "KATEGORİLER";

  // Ana kategoriler (tüm ürünler sayfasında)
  const mainCategories = CATEGORIES.filter(
    (cat) => cat.megaMenu && !cat.megaMenu.isBrands,
  );

  // Alt kategoriler (kategori sayfasında)
  const subCategories = currentCategory?.megaMenu?.columns
    ? currentCategory.megaMenu.columns.flatMap(
        (col: any) =>
          col.subItems?.map((item: string) => ({
            label: item,
            value: item
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/ğ/g, "g")
              .replace(/ü/g, "u")
              .replace(/ş/g, "s")
              .replace(/ı/g, "i")
              .replace(/ö/g, "o")
              .replace(/ç/g, "c"),
          })) || [],
      )
    : [];

  return (
    <div className="bg-slate-50">
      {/* KATEGORİLER / ALT KATEGORİLER */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Hash size={14} className="text-orange-600" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
            {sectionTitle}
          </h3>
        </div>

        {/* Tüm Ürünler Sayfası - Ana Kategoriler */}
        {!currentCategory && (
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => router.push("/products")}
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
                  "transition-transform duration-300",
                  !currentCategory && subCategoryFilter === "all"
                    ? "opacity-100 rotate-90"
                    : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
                )}
              />
            </button>

            {mainCategories.map((cat) => {
              const isExpanded = expandedCategories.includes(cat.id);
              const hasSubItems =
                cat.megaMenu?.columns?.some(
                  (col: any) => col.subItems && col.subItems.length > 0,
                ) ?? false;

              return (
                <div key={cat.id}>
                  <div className="group relative flex items-center transition-all duration-300 text-slate-500 hover:bg-slate-100 hover:text-slate-950">
                    {/* Ana Kategori Butonu */}
                    <button
                      onClick={() => router.push(`/products/category/${cat.id}`)}
                      className="flex-1 flex items-center justify-between py-2.5 px-3 rounded-sm"
                    >
                      <span className="text-[11px] font-bold tracking-tight uppercase">
                        {cat.label}
                      </span>
                      <ChevronRight
                        size={14}
                        className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                      />
                    </button>

                    {/* Expand/Collapse Butonu */}
                    {hasSubItems && (
                      <button
                        onClick={(e) => toggleCategory(cat.id, e)}
                        className="px-3 py-2.5 hover:bg-orange-50 transition-colors rounded-sm"
                      >
                        {isExpanded ? (
                          <ChevronUp size={14} className="text-orange-600" />
                        ) : (
                          <ChevronDown size={14} className="text-slate-400" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Alt Kategoriler */}
                  {isExpanded && hasSubItems && cat.megaMenu?.columns && (
                    <div className="ml-4 border-l-2 border-slate-200 pl-2 mt-1 mb-1 space-y-1">
                      {cat.megaMenu.columns.map(
                        (col: any, colIndex: number) => (
                          <div key={colIndex}>
                            {col.subItems && col.subItems.length > 0 && (
                              <>
                                {/* Başlık */}
                                <div className="py-1.5 px-2">
                                  <span className="text-[9px] font-black uppercase tracking-wider text-orange-600">
                                    {col.title}
                                  </span>
                                </div>
                                {/* Alt Kategori Items */}
                                {col.subItems.map(
                                  (item: string, itemIndex: number) => {
                                    const itemValue = item
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")
                                      .replace(/ğ/g, "g")
                                      .replace(/ü/g, "u")
                                      .replace(/ş/g, "s")
                                      .replace(/ı/g, "i")
                                      .replace(/ö/g, "o")
                                      .replace(/ç/g, "c");

                                    return (
                                      <button
                                        key={itemIndex}
                                        onClick={() => {
                                          router.push(`/products/category/${cat.id}`);
                                          setSubCategoryFilter(itemValue);
                                        }}
                                        className="rounded-sm w-full text-left py-1.5 px-2 text-[10px] font-semibold text-slate-600 hover:text-orange-600 hover:bg-orange-50/50 transition-colors rounded"
                                      >
                                        {item}
                                      </button>
                                    );
                                  },
                                )}
                              </>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Kategori Sayfası - Alt Kategoriler */}
        {currentCategory && subCategories.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => setSubCategoryFilter("all")}
              className={cn(
                "group relative flex rounded-sm items-center justify-between py-2.5 px-3 transition-all duration-300",
                subCategoryFilter === "all"
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
                  "transition-transform duration-300",
                  subCategoryFilter === "all"
                    ? "opacity-100 rotate-90"
                    : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
                )}
              />
            </button>

            {subCategories.map((subCat: any) => (
              <button
                key={subCat.value}
                onClick={() => setSubCategoryFilter(subCat.value)}
                className={cn(
                  "group relative rounded-sm flex items-center justify-between py-2.5 px-3 transition-all duration-300",
                  subCategoryFilter === subCat.value
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-200"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-950",
                )}
              >
                <span className="text-[11px] font-bold tracking-tight uppercase">
                  {subCat.label}
                </span>
                <ChevronRight
                  size={14}
                  className={cn(
                    "transition-transform duration-300",
                    subCategoryFilter === subCat.value
                      ? "opacity-100 rotate-90"
                      : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* MARKALAR */}
      <section className="pt-8 border-t border-slate-100 mt-8">
        <div className="flex items-center gap-2 mb-6">
          <Factory size={14} className="text-orange-600" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
            ÇÖZÜM ORTAKLARI
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setBrandFilter("all")}
            className={cn(
              "py-2 px-3 border rounded-sm text-[10px] font-bold transition-all uppercase text-left",
              brandFilter === "all"
                ? "border-orange-500 bg-orange-50 text-orange-600"
                : "border-slate-100 text-slate-600 hover:border-orange-500 hover:text-orange-600",
            )}
          >
            TÜMÜ
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setBrandFilter(brand)}
              className={cn(
                "py-2 px-3 rounded-sm border text-[10px] font-bold transition-all uppercase text-left",
                brandFilter === brand
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-slate-100 text-slate-600 hover:border-orange-500 hover:text-orange-600",
              )}
            >
              {brand}
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
        <div className="px-1">
          <Slider
            value={[minPrice, maxPrice]}
            onValueChange={([min, max]) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
            max={300000}
            step={5000}
            className="mb-8"
          />

          <div className="flex items-center gap-3">
            <div className="flex-1 p-3 bg-white border border-slate-100">
              <span className="block text-[8px] font-black text-slate-400 uppercase mb-1">
                Min
              </span>
              <span className="text-[12px] font-bold text-slate-900 font-mono">
                {minPrice.toLocaleString()}₺
              </span>
            </div>
            <div className="w-2 h-[1px] bg-slate-300" />
            <div className="flex-1 p-3 bg-white border border-slate-100">
              <span className="block text-[8px] font-black text-slate-400 uppercase mb-1">
                Max
              </span>
              <span className="text-[12px] font-bold text-slate-900 font-mono">
                {maxPrice.toLocaleString()}₺
              </span>
            </div>
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
        className="group rounded-sm w-full mt-8 py-4 flex items-center justify-center gap-3 bg-white border-2 border-slate-950 overflow-hidden relative transition-all duration-500 hover:bg-slate-950"
      >
        <RotateCcw
          size={14}
          className="relative z-10 text-slate-950 group-hover:text-white transition-colors group-hover:rotate-[-180deg] duration-700"
        />
        <span className="relative z-10 text-[10px] font-black tracking-[0.2em] uppercase text-slate-950 group-hover:text-white transition-colors">
          Parametreleri Sıfırla
        </span>
      </button>
    </div>
  );
};

export default Filter;
