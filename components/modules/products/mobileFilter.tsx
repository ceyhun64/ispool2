// /components/modules/products/mobileFilter.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Grid2X2,
  LayoutGrid,
  ArrowDownAZ,
  ArrowUpAZ,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { CATEGORIES } from "@/data/categories";

interface MobileFilterProps {
  currentCategory: any;
  subCategoryFilter: string;
  setSubCategoryFilter: (val: string) => void;
  brandFilter: string;
  setBrandFilter: (val: string) => void;
  minPrice: number;
  maxPrice: number;
  setMinPrice: (val: number) => void;
  setMaxPrice: (val: number) => void;
  mobileGridCols: 1 | 2;
  setMobileGridCols: (cols: 1 | 2) => void;
  sort: string;
  setSort: (sort: any) => void;
}

const sortOptions = [
  { id: "az", label: "A'dan Z'ye", icon: ArrowDownAZ },
  { id: "za", label: "Z'den A'ya", icon: ArrowUpAZ },
  { id: "priceLow", label: "Düşük Fiyat", icon: TrendingDown },
  { id: "priceHigh", label: "Yüksek Fiyat", icon: TrendingUp },
];

const brands = [
  "U-Power",
  "Base",
  "3M",
  "Delta Plus",
  "Ansell",
  "Portwest",
  "Polyboot",
];

const MobileFilter: React.FC<MobileFilterProps> = ({
  currentCategory,
  subCategoryFilter,
  setSubCategoryFilter,
  brandFilter,
  setBrandFilter,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  mobileGridCols,
  setMobileGridCols,
  sort,
  setSort,
}) => {
  const router = useRouter();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-6">
      {children}
    </h3>
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const sectionTitle = currentCategory ? "Alt Kategori" : "Kategori";
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
    <div className="flex flex-col gap-y-10 pb-10">
      {/* 1. GÖRÜNÜM SEÇİMİ */}
      <section>
        <SectionTitle>Görünüm Düzeni</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 1, label: "Tek Kolon", icon: LayoutGrid },
            { value: 2, label: "İki Kolon", icon: Grid2X2 },
          ].map((option) => {
            const Icon = option.icon;
            const isActive = mobileGridCols === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setMobileGridCols(option.value as 1 | 2)}
                className={cn(
                  "py-5 border-2 rounded-sm transition-all flex flex-col items-center gap-3",
                  isActive
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-400 hover:border-slate-300",
                )}
              >
                <Icon size={20} />
                <span className="text-[10px] font-black uppercase tracking-tight">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. SIRALAMA */}
      <section>
        <SectionTitle>Sıralama Kriteri</SectionTitle>
        <div className="space-y-2">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            const isActive = sort === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setSort(option.id)}
                className={cn(
                  "w-full flex rounded-sm items-center gap-4 p-4 border transition-all text-left group",
                  isActive
                    ? "border-orange-500 bg-orange-50/30"
                    : "border-slate-100 hover:border-slate-200 bg-white",
                )}
              >
                <div
                  className={cn(
                    "p-2 transition-colors",
                    isActive
                      ? "bg-orange-500 text-white"
                      : "bg-slate-100 text-slate-400 group-hover:bg-slate-200",
                  )}
                >
                  <Icon size={16} />
                </div>
                <span
                  className={cn(
                    "text-[12px] font-bold uppercase tracking-tight",
                    isActive ? "text-slate-900" : "text-slate-500",
                  )}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. KATEGORİ / ALT KATEGORİ */}
      <section>
        <SectionTitle>{sectionTitle}</SectionTitle>

        {/* Tüm Ürünler Sayfası - Kategoriler */}
        {!currentCategory && (
          <div className="space-y-2">
            <button
              onClick={() => router.push("/products")}
              className="rounded-sm w-full text-left py-3 px-4 bg-white border border-slate-200 text-[12px] font-bold text-slate-900 hover:border-orange-500 transition-colors"
            >
              TÜMÜ
            </button>

            {mainCategories.map((cat) => {
              const isExpanded = expandedCategories.includes(cat.id);
              const hasSubItems =
                cat.megaMenu?.columns?.some(
                  (col: any) => col.subItems && col.subItems.length > 0,
                ) ?? false;

              return (
                <div key={cat.id} className="bg-white border border-slate-200">
                  <div className="flex items-center">
                    <button
                      onClick={() => router.push(`/products/category/${cat.id}`)}
                      className="flex-1 rounded-sm text-left py-3 px-4 text-[12px] font-bold text-slate-700 hover:text-orange-600 transition-colors"
                    >
                      {cat.label}
                    </button>

                    {hasSubItems && (
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        className="px-4 py-3 hover:bg-orange-50 transition-colors rounded-sm"
                      >
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition-transform duration-200",
                            isExpanded
                              ? "rotate-180 text-orange-600"
                              : "text-slate-400",
                          )}
                        />
                      </button>
                    )}
                  </div>

                  {/* Alt Kategoriler */}
                  {isExpanded && hasSubItems && cat.megaMenu?.columns && (
                    <div className="border-t border-slate-100 bg-slate-50 p-3 space-y-3">
                      {cat.megaMenu.columns.map(
                        (col: any, colIndex: number) => (
                          <div key={colIndex}>
                            {col.subItems && col.subItems.length > 0 && (
                              <>
                                <div className="text-[9px] font-black uppercase tracking-wider text-orange-600 mb-2">
                                  {col.title}
                                </div>
                                <div className="space-y-1">
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
                                          className="w-full rounded-sm text-left py-2 px-3 text-[11px] font-semibold text-slate-600 hover:text-orange-600 hover:bg-white transition-colors rounded flex items-center gap-2"
                                        >
                                          <ChevronRight
                                            size={12}
                                            className="opacity-50"
                                          />
                                          {item}
                                        </button>
                                      );
                                    },
                                  )}
                                </div>
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
          <div className="space-y-2">
            <button
              onClick={() => setSubCategoryFilter("all")}
              className={cn(
                "w-full text-left rounded-sm py-3 px-4 border text-[12px] font-bold transition-colors",
                subCategoryFilter === "all"
                  ? "bg-orange-50 border-orange-500 text-orange-600"
                  : "bg-white border-slate-200 text-slate-700 hover:border-orange-500",
              )}
            >
              TÜMÜ
            </button>

            {subCategories.map((subCat: any) => (
              <button
                key={subCat.value}
                onClick={() => setSubCategoryFilter(subCat.value)}
                className={cn(
                  "w-full text-left py-3 rounded-sm px-4 border text-[12px] font-bold transition-colors",
                  subCategoryFilter === subCat.value
                    ? "bg-orange-50 border-orange-500 text-orange-600"
                    : "bg-white border-slate-200 text-slate-700 hover:border-orange-500",
                )}
              >
                {subCat.label}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 4. MARKALAR */}
      <section>
        <SectionTitle>Çözüm Ortakları</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setBrandFilter("all")}
            className={cn(
              "py-3 px-3 border rounded-sm bg-white text-[10px] font-bold transition-all uppercase text-left",
              brandFilter === "all"
                ? "border-orange-500 text-orange-600"
                : "border-slate-200 text-slate-600 hover:border-orange-500 hover:text-orange-600",
            )}
          >
            TÜMÜ
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setBrandFilter(brand)}
              className={cn(
                "py-3 px-3 border rounded-sm bg-white text-[10px] font-bold transition-all uppercase text-left",
                brandFilter === brand
                  ? "border-orange-500 text-orange-600"
                  : "border-slate-200 text-slate-600 hover:border-orange-500 hover:text-orange-600",
              )}
            >
              {brand}
            </button>
          ))}
        </div>
      </section>

      {/* 5. FİYAT */}
      <section>
        <SectionTitle>Fiyat Aralığı</SectionTitle>
        <div className="px-1">
          <Slider
            value={[minPrice, maxPrice]}
            onValueChange={([min, max]) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
            max={300000}
            step={5000}
            className="mb-6"
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

      {/* 6. SIFIRLA */}
      <button
        onClick={() => {
          setMinPrice(0);
          setMaxPrice(300000);
          setSort("az");
          setMobileGridCols(2);
          setSubCategoryFilter("all");
          setBrandFilter("all");
          setExpandedCategories([]);
        }}
        className="text-[10px] rounded-sm tracking-[0.2em] uppercase text-slate-400 hover:text-slate-900 transition-colors underline underline-offset-8 text-left font-bold"
      >
        Ayarları Temizle
      </button>
    </div>
  );
};

export default MobileFilter;
