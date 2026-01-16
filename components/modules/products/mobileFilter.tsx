"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface MobileFilterProps {
  onClose?: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  minPrice: number;
  maxPrice: number;
  setMinPrice: (val: number) => void;
  setMaxPrice: (val: number) => void;
  gridCols: number;
  setGridCols: (cols: any) => void;
  sort: string;
  setSort: (sort: any) => void;
}

const productCategories = [
  { label: "Tüm Koleksiyon", value: "all" },
  { label: "Oturma Takımları", value: "seating_sets" },
  { label: "Masa Takımları", value: "table_sets" },
  { label: "Salıncaklar", value: "swing" },
  { label: "Şezlonglar", value: "sunbed" },
  { label: "Barbekü Serisi", value: "barbecue" },
];

const sortOptions = [
  { id: "az", label: "A'dan Z'ye" },
  { id: "za", label: "Z'den A'ya" },
  { id: "priceLow", label: "Düşük Fiyat" },
  { id: "priceHigh", label: "Yüksek Fiyat" },
];

const MobileFilter: React.FC<MobileFilterProps> = ({
  onClose,
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  gridCols,
  setGridCols,
  sort,
  setSort,
}) => {
  const router = useRouter();

  const handleCategoryChange = (value: string) => {
    onSelectCategory(value);
    router.push(`/products/${value === "all" ? "" : value}`);
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-light mb-6">
      {children}
    </h3>
  );

  return (
    <div className="flex flex-col gap-y-12 pb-10">
      {/* BAŞLIK VE KAPATMA */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-slate-900">
          Filtreleme
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X strokeWidth={1.2} size={20} />
          </button>
        )}
      </div>

      {/* 1. KATEGORİ */}
      <section>
        <SectionTitle>Koleksiyon</SectionTitle>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full border-none bg-slate-50/50 h-12 rounded-none px-4 focus:ring-0 border-b border-slate-200">
            <div className="text-[14px] text-slate-800 font-light italic">
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

      {/* 2. FİYAT */}
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
          <div className="flex justify-between text-[11px] tracking-widest text-slate-500 font-light">
            <span>{minPrice.toLocaleString()} ₺</span>
            <span>{maxPrice.toLocaleString()} ₺</span>
          </div>
        </div>
      </section>

      {/* 4. SIRALAMA */}
      <section>
        <SectionTitle>Sıralama</SectionTitle>
        <div className="space-y-1">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSort(option.id)}
              className={cn(
                "w-full flex justify-between items-center py-3 text-[13px] transition-colors",
                sort === option.id
                  ? "text-slate-900"
                  : "text-slate-400 font-light"
              )}
            >
              <span>{option.label}</span>
              {sort === option.id && (
                <div className="w-1 h-1 bg-slate-900 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* 5. SIFIRLA */}
      <button
        onClick={() => {
          setMinPrice(0);
          setMaxPrice(300000);
          setSort("az");
        }}
        className="text-[10px] tracking-[0.2em] uppercase text-slate-300 hover:text-slate-800 transition-colors underline underline-offset-8 text-left"
      >
        Ayarları Temizle
      </button>
    </div>
  );
};

export default MobileFilter;
