"use client";
import React, { useState, useEffect } from "react";
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
  Factory,
  Calendar,
  CalendarClock,
} from "lucide-react";
import categoriesDataRaw from "@/data/categories.json";
import middleCategoriesDataRaw from "@/data/middleCategories.json";
import subCategoriesDataRaw from "@/data/subCategories.json";

// Veritabanı tipi tanımlamaları
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

interface MobileFilterProps {
  currentCategory: DbCategory | null;
  subCategoryFilter: string;
  setSubCategoryFilter: (val: string) => void;
  brandFilter: string;
  setBrandFilter: (brandId: string) => void;
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
  { id: "dateNew", label: "En Yeni", icon: Calendar },
  { id: "dateOld", label: "En Eski", icon: CalendarClock },
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
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [expandedMiddleCategories, setExpandedMiddleCategories] = useState<
    number[]
  >([]);

  // JSON dosyalarını type-cast et
  const categoriesData = categoriesDataRaw as { name: string }[];
  const middleCategoriesData = middleCategoriesDataRaw as {
    name: string;
    categoryName: string;
  }[];
  const subCategoriesData = subCategoriesDataRaw as {
    name: string;
    middleCategoryName: string;
  }[];

  // JSON dosyalarından hiyerarşik yapı oluştur
  const allCategories = React.useMemo(() => {
    const categoryMap = new Map<string, DbCategory>();

    categoriesData.forEach((cat, index) => {
      categoryMap.set(cat.name, {
        id: index + 1,
        name: cat.name,
        middleCategories: [],
      });
    });

    middleCategoriesData.forEach((mid, index) => {
      const parentCategory = categoryMap.get(mid.categoryName);
      if (parentCategory) {
        const middleCategory: DbMiddleCategory = {
          id: index + 1,
          name: mid.name,
          subCategories: [],
        };
        parentCategory.middleCategories.push(middleCategory);
      }
    });

    subCategoriesData.forEach((sub, index) => {
      categoryMap.forEach((category) => {
        const middleCategory = category.middleCategories.find(
          (m) => m.name === sub.middleCategoryName,
        );
        if (middleCategory) {
          middleCategory.subCategories.push({
            id: index + 1,
            name: sub.name,
          });
        }
      });
    });

    return Array.from(categoryMap.values()).sort((a, b) => a.id - b.id);
  }, [categoriesData, middleCategoriesData, subCategoriesData]);

  // Markalar için statik veri
  const dbBrands: DbBrand[] = React.useMemo(
    () => [
      { id: 1, name: "Marka 1", image: "/brands/1.png" },
      { id: 2, name: "Marka 2", image: "/brands/2.png" },
      { id: 3, name: "Marka 3", image: "/brands/3.png" },
      { id: 4, name: "Marka 4", image: "/brands/4.png" },
      { id: 5, name: "Marka 5", image: "/brands/5.png" },
      { id: 6, name: "Marka 6", image: "/brands/6.png" },
      { id: 7, name: "Marka 7", image: "/brands/7.png" },
      { id: 8, name: "Marka 8", image: "/brands/8.png" },
      { id: 9, name: "Marka 9", image: "/brands/9.png" },
      { id: 10, name: "Marka 10", image: "/brands/10.png" },
      { id: 11, name: "Marka 11", image: "/brands/11.png" },
    ],
    [],
  );

  const SectionTitle = ({
    children,
    icon: Icon,
  }: {
    children: React.ReactNode;
    icon?: any;
  }) => (
    <div className="flex items-center gap-2 mb-6 text-slate-400">
      {Icon && <Icon size={12} className="text-orange-600" />}
      <h3 className="text-[10px] uppercase tracking-[0.2em] font-black">
        {children}
      </h3>
    </div>
  );

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const toggleMiddleCategory = (midId: number) => {
    setExpandedMiddleCategories((prev) =>
      prev.includes(midId)
        ? prev.filter((id) => id !== midId)
        : [...prev, midId],
    );
  };

  const sectionTitle = "Kategori";

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
                    ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-200"
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

      {/* 3. KATEGORİ / ORTA KATEGORİ / ALT KATEGORİ */}
      <section>
        <SectionTitle>{sectionTitle}</SectionTitle>
        <div className="space-y-2">
          <button
            onClick={() => {
              router.push("/products");
              setSubCategoryFilter("all");
            }}
            className={cn(
              "rounded-sm w-full text-left py-3 px-4 border text-[12px] font-bold transition-colors uppercase",
              !currentCategory && subCategoryFilter === "all"
                ? "bg-orange-50 border-orange-500 text-orange-600"
                : "bg-white border-slate-200 text-slate-900 shadow-sm",
            )}
          >
            TÜMÜ
          </button>

          {allCategories.map((cat) => {
            const isExpanded = expandedCategories.includes(cat.id);
            const hasMiddle = cat.middleCategories?.length > 0;
            const isActive = currentCategory?.id === cat.id;

            return (
              <div
                key={cat.id}
                className={cn(
                  "bg-white border rounded-sm overflow-hidden",
                  isActive ? "border-orange-500" : "border-slate-200",
                )}
              >
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      router.push(`/products/category/${cat.id}`);
                      setSubCategoryFilter("all");
                    }}
                    className={cn(
                      "flex-1 text-left py-3 px-4 text-[12px] font-bold uppercase transition-colors",
                      isActive
                        ? "text-orange-600 bg-orange-50/30"
                        : "text-slate-700 hover:text-orange-600",
                    )}
                  >
                    {cat.name}
                  </button>
                  {hasMiddle && (
                    <button
                      onClick={() => toggleCategory(cat.id)}
                      className="px-4 py-3 hover:bg-orange-50 transition-colors"
                    >
                      <ChevronDown
                        size={16}
                        className={cn(
                          "transition-transform duration-200",
                          isExpanded && "rotate-180 text-orange-600",
                        )}
                      />
                    </button>
                  )}
                </div>

                {isExpanded && hasMiddle && (
                  <div className="bg-slate-50 border-t border-slate-100 p-3 space-y-2">
                    {cat.middleCategories.map((mid) => {
                      const isMidExpanded = expandedMiddleCategories.includes(
                        mid.id,
                      );
                      const hasSubCategories = mid.subCategories?.length > 0;

                      return (
                        <div
                          key={mid.id}
                          className="bg-white rounded-sm border border-slate-100"
                        >
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                router.push(
                                  `/products/category/${cat.id}/${mid.id}`,
                                )
                              }
                              className="flex-1 text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider text-orange-600 hover:bg-orange-50 transition-colors"
                            >
                              {mid.name}
                            </button>
                            {hasSubCategories && (
                              <button
                                onClick={() => toggleMiddleCategory(mid.id)}
                                className="px-3 py-2 hover:bg-orange-50 transition-colors"
                              >
                                <ChevronRight
                                  size={14}
                                  className={cn(
                                    "transition-transform duration-200",
                                    isMidExpanded &&
                                      "rotate-90 text-orange-600",
                                  )}
                                />
                              </button>
                            )}
                          </div>

                          {isMidExpanded && hasSubCategories && (
                            <div className="bg-slate-50 border-t border-slate-100 p-2 space-y-1">
                              {mid.subCategories.map((sub) => (
                                <button
                                  key={sub.id}
                                  onClick={() =>
                                    router.push(
                                      `/products/category/${cat.id}/${mid.id}/${sub.id}`,
                                    )
                                  }
                                  className="w-full text-left py-2 px-3 text-[11px] font-semibold transition-colors flex items-center gap-2 rounded-sm text-slate-600 hover:bg-white hover:text-orange-600"
                                >
                                  <ChevronRight
                                    size={12}
                                    className="opacity-30"
                                  />
                                  {sub.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MARKALAR */}
      <section>
        <SectionTitle icon={Factory}>Çözüm Ortakları</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setBrandFilter("all")}
            className={cn(
              "flex items-center gap-2 py-3 px-3 border rounded-sm bg-white text-[10px] font-bold uppercase transition-all",
              brandFilter === "all"
                ? "border-orange-500 text-orange-600 bg-orange-50/50"
                : "border-slate-200 text-slate-600",
            )}
          >
            <div className="w-6 h-6 flex items-center justify-center border border-dashed border-slate-300 rounded-full text-[10px]">
              ∞
            </div>
            TÜMÜ
          </button>
          {dbBrands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setBrandFilter(String(brand.id))}
              className={cn(
                "flex items-center gap-2 py-3 px-3 border rounded-sm bg-white text-[10px] font-bold uppercase transition-all",
                brandFilter === String(brand.id)
                  ? "border-orange-500 text-orange-600 bg-orange-50/50 shadow-sm"
                  : "border-slate-200 text-slate-600 hover:border-slate-300",
              )}
            >
              <div className="relative w-6 h-6 shrink-0">
                {brand.image ? (
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-contain transition-all"
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

      {/* 5. FİYAT */}
      <section>
        <SectionTitle>Fiyat Aralığı</SectionTitle>
        <div className="px-1 pt-4">
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
            <div className="flex-1 p-4 bg-slate-100/50 border border-slate-200 rounded-sm">
              <span className="block text-[8px] font-black text-slate-400 uppercase mb-1">
                Min
              </span>
              <span className="text-[13px] font-bold text-slate-900">
                {minPrice.toLocaleString()}₺
              </span>
            </div>
            <div className="w-4 h-[1px] bg-slate-300" />
            <div className="flex-1 p-4 bg-slate-100/50 border border-slate-200 rounded-sm">
              <span className="block text-[8px] font-black text-slate-400 uppercase mb-1">
                Max
              </span>
              <span className="text-[13px] font-bold text-slate-900">
                {maxPrice.toLocaleString()}₺
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SIFIRLA */}
      <div className="pt-4">
        <button
          onClick={() => {
            setMinPrice(0);
            setMaxPrice(300000);
            setSort("az");
            setMobileGridCols(2);
            setSubCategoryFilter("all");
            setBrandFilter("all");
            setExpandedCategories([]);
            setExpandedMiddleCategories([]);
          }}
          className="w-full flex items-center justify-center gap-3 py-5 bg-slate-50 border-2 border-dashed border-slate-200 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-orange-600 hover:border-orange-200 transition-all"
        >
          AYARLARI SIFIRLA
        </button>
      </div>
    </div>
  );
};

export default MobileFilter;
