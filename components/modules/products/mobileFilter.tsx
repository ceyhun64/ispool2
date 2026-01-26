"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Grid2X2,
  LayoutGrid,
  ArrowDownAZ,
  ArrowUpAZ,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface MobileFilterProps {
  onClose?: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  minPrice: number;
  maxPrice: number;
  setMinPrice: (val: number) => void;
  setMaxPrice: (val: number) => void;
  mobileGridCols: 1 | 2;
  setMobileGridCols: (cols: 1 | 2) => void;
  sort: string;
  setSort: (sort: any) => void;
}

const productCategories = [
  { label: "Tüm Koleksiyon", value: "all" },
  { label: "İş Elbiseleri", value: "is-elbiseleri" },
  { label: "Ayak Korumaları", value: "ayak-koruma" },
  { label: "El Korumaları", value: "el-koruma" },
  { label: "Teknik Ekipmanlar", value: "teknik" },
];

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
  selectedCategory,
  onSelectCategory,
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

  const handleCategoryChange = (value: string) => {
    onSelectCategory(value);
    router.push(`/products/${value === "all" ? "" : value}`);
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-6">
      {children}
    </h3>
  );

  return (
    <div className="flex flex-col gap-y-10 pb-10">
      {/* 1. GÖRÜNÜM SEÇİMİ (MOBİL İÇİN 1-2 KOLON) */}
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
                  "py-5 border-2 transition-all flex flex-col items-center gap-3",
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
                  "w-full flex items-center gap-4 p-4 border transition-all text-left group",
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

      {/* 3. KATEGORİ */}
      <section>
        <SectionTitle>Koleksiyon</SectionTitle>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full border-none bg-white h-12 rounded-none px-4 focus:ring-0 border border-slate-200 text-left">
            <div className="text-[13px] text-slate-800 font-medium">
              <SelectValue placeholder="Seçiniz" />
            </div>
          </SelectTrigger>
          <SelectContent className="border-slate-100 rounded-none shadow-xl">
            {productCategories.map((cat) => (
              <SelectItem
                key={cat.value}
                value={cat.value}
                className="py-3 text-[13px]"
              >
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      {/* 4. MARKALAR */}
      <section>
        <SectionTitle>Çözüm Ortakları</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          {brands.map((brand) => (
            <button
              key={brand}
              className="py-3 px-3 border border-slate-200 bg-white text-[10px] font-bold text-slate-600 hover:border-orange-500 hover:text-orange-600 transition-all uppercase text-left"
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
          onSelectCategory("all");
        }}
        className="text-[10px] tracking-[0.2em] uppercase text-slate-400 hover:text-slate-900 transition-colors underline underline-offset-8 text-left font-bold"
      >
        Ayarları Temizle
      </button>
    </div>
  );
};

export default MobileFilter;
