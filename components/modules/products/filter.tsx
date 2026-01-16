"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { ChevronRight, RotateCcw, Factory, Hash, Banknote } from "lucide-react";

interface FilterProps {
  colorFilter: string;
  setColorFilter: (color: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minPrice: number;
  setMinPrice: (price: number) => void;
}

const productCategories = [
  { label: "TÜM KOLEKSİYON", href: "/products" },
  { label: "İŞ ELBİSELERİ", href: "/products/is-elbiseleri" },
  { label: "AYAK KORUMALARI", href: "/products/ayak-koruma" },
  { label: "EL KORUMALARI", href: "/products/el-koruma" },
  { label: "TEKNİK EKİPMANLAR", href: "/products/teknik" },
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

const Filter: React.FC<FilterProps> = ({
  colorFilter,
  setColorFilter,
  maxPrice,
  setMaxPrice,
  minPrice,
  setMinPrice,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className=" bg-slate-50">
      {/* 1. KATEGORİLER */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Hash size={14} className="text-orange-600" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
            KATEGORİLER
          </h3>
        </div>
        <div className="flex flex-col gap-1.5">
          {productCategories.map((category) => {
            const isActive = pathname === category.href;
            return (
              <button
                key={category.label}
                onClick={() => router.push(category.href)}
                className={cn(
                  "group relative flex items-center justify-between py-2.5 px-3 transition-all duration-300",
                  isActive
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                )}
              >
                <span className="text-[11px] font-bold tracking-tight uppercase">
                  {category.label}
                </span>
                <ChevronRight
                  size={14}
                  className={cn(
                    "transition-transform duration-300",
                    isActive
                      ? "opacity-100 rotate-90"
                      : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  )}
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. MARKALAR */}
      <section className="pt-8 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <Factory size={14} className="text-orange-600" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
            ÇÖZÜM ORTAKLARI
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {brands.map((brand) => (
            <button
              key={brand}
              className="py-2 px-3 border border-slate-100 text-[10px] font-bold text-slate-600 hover:border-orange-500 hover:text-orange-600 transition-all uppercase text-left"
            >
              {brand}
            </button>
          ))}
        </div>
      </section>

      {/* 3. FİYAT ARALIĞI */}
      <section className="pt-8 border-t border-slate-100">
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
            <div className="flex-1 p-3 bg-slate-50 border border-slate-100">
              <span className="block text-[8px] font-black text-slate-400 uppercase mb-1">
                Min
              </span>
              <span className="text-[12px] font-bold text-slate-900 font-mono">
                {minPrice.toLocaleString()}₺
              </span>
            </div>
            <div className="w-2 h-[1px] bg-slate-300" />
            <div className="flex-1 p-3 bg-slate-50 border border-slate-100">
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
          setColorFilter("all");
          setMinPrice(0);
          setMaxPrice(300000);
        }}
        className="group w-full mt-4 py-4 flex items-center justify-center gap-3 bg-white border-2 border-slate-950 overflow-hidden relative transition-all duration-500"
      >
        <div className="absolute inset-0 bg-slate-950 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
        <RotateCcw
          size={14}
          className="relative z-10 group-hover:text-white transition-colors group-hover:rotate-[-180deg] duration-700"
        />
        <span className="relative z-10 text-[10px] font-black tracking-[0.2em] uppercase group-hover:text-white transition-colors">
          Parametreleri Sıfırla
        </span>
      </button>
    </div>
  );
};

export default Filter;
