"use client";
import React, { useState, useEffect, useMemo } from "react";
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
  Palette,
  Ruler,
} from "lucide-react";

// Veri kaynakları
import categoriesDataRaw from "@/data/categories.json";
import middleCategoriesDataRaw from "@/data/middleCategories.json";
import subCategoriesDataRaw from "@/data/subCategories.json";

// --- TİP TANIMLAMALARI ---
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

interface MobileFilterProps {
  currentCategory: DbCategory | null;
  subCategoryFilter: string;
  setSubCategoryFilter: (val: string) => void;
  brandFilter: string;
  setBrandFilter: (brandId: string) => void;
  colorFilter: string;
  setColorFilter: (colorId: string) => void;
  sizeFilter: string;
  setSizeFilter: (sizeId: string) => void;
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
  colorFilter,
  setColorFilter,
  sizeFilter,
  setSizeFilter,
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
  const [colors, setColors] = useState<DbColor[]>([]);
  const [sizes, setSizes] = useState<DbSize[]>([]);

  // API'den Dinamik Veri Çekme (Renk ve Beden)
  useEffect(() => {
    async function fetchFilters() {
      try {
        const [colorsRes, sizesRes] = await Promise.all([
          fetch("/api/color"),
          fetch("/api/size"),
        ]);

        const colorsData = await colorsRes.json();
        const sizesData = await sizesRes.json();

        console.log("Renkler:", colorsData);
        console.log("Bedenler:", sizesData);

        // API yanıtı: { success: true, data: Array, count: number }
        if (colorsData.success && Array.isArray(colorsData.data)) {
          setColors(colorsData.data);
        }

        // API yanıtı: { success: true, data: Array, stats: {...} }
        if (sizesData.success && Array.isArray(sizesData.data)) {
          setSizes(
            [...sizesData.data].sort(
              (a: DbSize, b: DbSize) => a.sortOrder - b.sortOrder,
            ),
          );
        }
      } catch (error) {
        console.error("Filtre verileri yüklenemedi:", error);
      }
    }
    fetchFilters();
  }, []);

  // Kategori Hiyerarşisi Oluşturma (Memoized)
  const allCategories = useMemo(() => {
    const categoriesData = categoriesDataRaw as { name: string }[];
    const middleCategoriesData = middleCategoriesDataRaw as {
      name: string;
      categoryName: string;
    }[];
    const subCategoriesData = subCategoriesDataRaw as {
      name: string;
      middleCategoryName: string;
    }[];

    const categoryMap = new Map<string, DbCategory>();

    categoriesData.forEach((cat, index) => {
      categoryMap.set(cat.name, {
        id: index + 1,
        name: cat.name,
        middleCategories: [],
      });
    });

    middleCategoriesData.forEach((mid, index) => {
      const parent = categoryMap.get(mid.categoryName);
      if (parent) {
        parent.middleCategories.push({
          id: index + 1,
          name: mid.name,
          subCategories: [],
        });
      }
    });

    subCategoriesData.forEach((sub, index) => {
      categoryMap.forEach((category) => {
        const middle = category.middleCategories.find(
          (m) => m.name === sub.middleCategoryName,
        );
        if (middle)
          middle.subCategories.push({ id: index + 1, name: sub.name });
      });
    });

    return Array.from(categoryMap.values()).sort((a, b) => a.id - b.id);
  }, []);

  const dbBrands: DbBrand[] = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => ({
        id: i + 1,
        name: `Marka ${i + 1}`,
        image: `/brands/${i + 1}.png`,
      })),
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

  return (
    <div className="flex flex-col gap-y-10 pb-10">
      {/* 1. GÖRÜNÜM DÜZENİ */}
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
                    ? "border-slate-950 bg-slate-950 text-white shadow-lg"
                    : "border-slate-200 bg-white text-slate-400",
                )}
              >
                <Icon size={20} />
                <span className="text-[10px] font-black uppercase">
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
                    : "border-slate-100 bg-white",
                )}
              >
                <div
                  className={cn(
                    "p-2 transition-colors",
                    isActive
                      ? "bg-orange-500 text-white"
                      : "bg-slate-100 text-slate-400",
                  )}
                >
                  <Icon size={16} />
                </div>
                <span
                  className={cn(
                    "text-[12px] font-bold uppercase",
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

      {/* 3. KATEGORİLER (AKORDİYON) */}
      <section>
        <SectionTitle>Kategoriler</SectionTitle>
        <div className="space-y-2">
          <button
            onClick={() => {
              router.push("/products");
              setSubCategoryFilter("all");
            }}
            className={cn(
              "rounded-sm w-full text-left py-3 px-4 border text-[12px] font-bold uppercase",
              !currentCategory
                ? "bg-orange-50 border-orange-500 text-orange-600"
                : "bg-white border-slate-200 text-slate-900",
            )}
          >
            TÜM ÜRÜNLER
          </button>

          {allCategories.map((cat) => {
            const isExpanded = expandedCategories.includes(cat.id);
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
                      "flex-1 text-left py-3 px-4 text-[12px] font-bold uppercase",
                      isActive
                        ? "text-orange-600 bg-orange-50/30"
                        : "text-slate-700",
                    )}
                  >
                    {cat.name}
                  </button>
                  {cat.middleCategories.length > 0 && (
                    <button
                      onClick={() =>
                        setExpandedCategories((prev) =>
                          prev.includes(cat.id)
                            ? prev.filter((id) => id !== cat.id)
                            : [...prev, cat.id],
                        )
                      }
                      className="px-4 py-3 border-l border-slate-50"
                    >
                      <ChevronDown
                        size={16}
                        className={cn(
                          "transition-transform",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>
                  )}
                </div>

                {isExpanded && (
                  <div className="bg-slate-50 border-t p-3 space-y-2">
                    {cat.middleCategories.map((mid) => (
                      <div
                        key={mid.id}
                        className="bg-white rounded-sm border border-slate-100 overflow-hidden"
                      >
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              router.push(
                                `/products/category/${cat.id}/${mid.id}`,
                              )
                            }
                            className="flex-1 text-left py-2 px-3 text-[10px] font-black uppercase text-orange-600"
                          >
                            {mid.name}
                          </button>
                          {mid.subCategories.length > 0 && (
                            <button
                              onClick={() =>
                                setExpandedMiddleCategories((prev) =>
                                  prev.includes(mid.id)
                                    ? prev.filter((id) => id !== mid.id)
                                    : [...prev, mid.id],
                                )
                              }
                              className="px-3 py-2"
                            >
                              <ChevronRight
                                size={14}
                                className={cn(
                                  "transition-transform",
                                  expandedMiddleCategories.includes(mid.id) &&
                                    "rotate-90",
                                )}
                              />
                            </button>
                          )}
                        </div>
                        {expandedMiddleCategories.includes(mid.id) && (
                          <div className="bg-slate-50 border-t p-2 space-y-1">
                            {mid.subCategories.map((sub) => (
                              <button
                                key={sub.id}
                                onClick={() =>
                                  router.push(
                                    `/products/category/${cat.id}/${mid.id}/${sub.id}`,
                                  )
                                }
                                className="w-full text-left py-2 px-3 text-[11px] font-semibold text-slate-600 hover:text-orange-600 flex items-center gap-2"
                              >
                                <ChevronRight
                                  size={12}
                                  className="opacity-30"
                                />{" "}
                                {sub.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MARKALAR */}
      <section>
        <SectionTitle icon={Factory}>Markalar</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setBrandFilter("all")}
            className={cn(
              "flex items-center gap-2 py-3 px-3 border rounded-sm text-[10px] font-bold uppercase",
              brandFilter === "all"
                ? "border-orange-500 text-orange-600 bg-orange-50/50"
                : "border-slate-200 bg-white",
            )}
          >
            <div className="w-6 h-6 flex items-center justify-center border border-dashed rounded-full">
              ∞
            </div>{" "}
            TÜMÜ
          </button>
          {dbBrands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setBrandFilter(String(brand.id))}
              className={cn(
                "flex items-center gap-2 py-3 px-3 border rounded-sm text-[10px] font-bold uppercase",
                brandFilter === String(brand.id)
                  ? "border-orange-500 text-orange-600 bg-orange-50/50 shadow-sm"
                  : "border-slate-200 bg-white",
              )}
            >
              <div className="w-6 h-6 relative shrink-0">
                {brand.image ? (
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-[8px]">
                    {brand.name[0]}
                  </div>
                )}
              </div>
              <span className="truncate">{brand.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. RENK */}
      <section>
        <SectionTitle icon={Palette}>Renk Seçenekleri</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setColorFilter("all")}
            className={cn(
              "flex items-center gap-2 py-3 px-3 border rounded-sm text-[10px] font-bold uppercase",
              colorFilter === "all"
                ? "border-orange-500 text-orange-600 bg-orange-50/50"
                : "border-slate-200 bg-white",
            )}
          >
            <div className="w-6 h-6 flex items-center justify-center border border-dashed rounded-full">
              ∞
            </div>{" "}
            TÜMÜ
          </button>
          {colors?.map((color) => (
            <button
              key={color.id}
              onClick={() => setColorFilter(String(color.id))}
              className={cn(
                "flex items-center gap-2 py-3 px-3 border rounded-sm text-[10px] font-bold uppercase",
                colorFilter === String(color.id)
                  ? "border-orange-500 text-orange-600 bg-orange-50/50"
                  : "border-slate-200 bg-white",
              )}
            >
              <div
                className="w-6 h-6 shrink-0 rounded-full border border-slate-200 shadow-inner"
                style={{ backgroundColor: color.hexCode }}
              />
              <span className="truncate">{color.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 6. BEDEN */}
      <section>
        <SectionTitle icon={Ruler}>Beden</SectionTitle>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => setSizeFilter("all")}
            className={cn(
              "flex items-center justify-center py-3 px-2 border rounded-sm text-[10px] font-bold uppercase",
              sizeFilter === "all"
                ? "border-orange-500 text-orange-600 bg-orange-50/50"
                : "border-slate-200 bg-white",
            )}
          >
            TÜMÜ
          </button>
          {sizes?.map((size) => (
            <button
              key={size.id}
              onClick={() => setSizeFilter(String(size.id))}
              className={cn(
                "flex items-center justify-center py-3 px-2 border rounded-sm text-[10px] font-bold uppercase",
                sizeFilter === String(size.id)
                  ? "border-orange-500 text-orange-600 bg-orange-50/50 shadow-sm"
                  : "border-slate-200 bg-white",
              )}
            >
              {size.value}
            </button>
          ))}
        </div>
      </section>

      {/* 7. FİYAT ARALIĞI */}
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

      {/* 8. SIFIRLA BUTONU */}
      <div className="pt-4">
        <button
          onClick={() => {
            setMinPrice(0);
            setMaxPrice(300000);
            setSort("az");
            setMobileGridCols(2);
            setSubCategoryFilter("all");
            setBrandFilter("all");
            setColorFilter("all");
            setSizeFilter("all");
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
