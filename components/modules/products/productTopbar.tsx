"use client";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  SlidersHorizontal,
  Grid2X2,
  Grid3X3,
  LayoutGrid,
  ArrowDownAZ,
  ArrowUpAZ,
  TrendingUp,
  TrendingDown,
  X,
  Info,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductTopBarProps {
  gridCols: 1 | 2 | 3 | 4;
  setGridCols: (cols: 1 | 2 | 3 | 4) => void;
  sort: "az" | "za" | "priceLow" | "priceHigh";
  setSort: (sort: "az" | "za" | "priceLow" | "priceHigh") => void;
}

const ProductTopBar: React.FC<ProductTopBarProps> = ({
  gridCols,
  setGridCols,
  sort,
  setSort,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);



  const desktopGridOptions = [
    { value: 2, icon: Grid2X2, label: "2'li" },
    { value: 3, icon: Grid3X3, label: "3'lü" },
    { value: 4, icon: LayoutGrid, label: "4'lü" },
  ] as const;

  const sortOptions = [
    { id: "az", label: "İsim (A-Z)", icon: ArrowDownAZ },
    { id: "za", label: "İsim (Z-A)", icon: ArrowUpAZ },
    { id: "priceLow", label: "Fiyat (Önce En Düşük)", icon: TrendingDown },
    { id: "priceHigh", label: "Fiyat (Önce En Yüksek)", icon: TrendingUp },
  ] as const;

  return (
    <nav className="sticky top-0 z-[80] w-full transition-all duration-500 py-4  backdrop-blur-xl shadow-sm">
      <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
        {/* ORTA & SAĞ: Desktop Kontroller */}
        <div className="hidden md:flex items-center gap-8">
          {/* Görünüm Değiştirici */}
          <div className="flex items-center gap-4 border-r border-slate-200 pr-8">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Görünüm
            </span>
            <div className="flex bg-slate-100 p-1 ">
              {desktopGridOptions.map((option) => {
                const Icon = option.icon;
                const isActive = gridCols === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setGridCols(option.value)}
                    className={cn(
                      "relative px-4 py-1.5 transition-all duration-300 flex items-center gap-2",
                      isActive
                        ? "text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeGrid"
                        className="absolute inset-0 bg-white"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <Icon className="w-3.5 h-3.5 relative z-10" />
                    {isActive && (
                      <span className="text-[10px] font-bold relative z-10">
                        {option.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sıralama Select */}
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Sıralama
            </span>
            <Select value={sort} onValueChange={(value: any) => setSort(value)}>
              <SelectTrigger className="w-[200px] h-9 border-none bg-slate-50 hover:bg-slate-100  text-[11px] font-bold tracking-tight transition-all focus:ring-0">
                <SelectValue placeholder="Sıralama" />
              </SelectTrigger>
              <SelectContent
                align="end"
                className=" border-slate-100 shadow-2xl p-2 bg-white/95 backdrop-blur-md"
              >
                {sortOptions.map((opt) => (
                  <SelectItem
                    key={opt.id}
                    value={opt.id}
                    className=" py-3 px-4 focus:bg-slate-950 focus:text-white cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <opt.icon
                        size={14}
                        className="text-slate-400 group-focus:text-orange-500"
                      />
                      <span className="text-[11px] font-semibold">
                        {opt.label}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobil Tetikleyici */}
        <div className="flex md:hidden items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-3 px-5 py-2.5 bg-slate-950 text-white text-[10px] font-black tracking-widest uppercase shadow-lg shadow-slate-200"
          >
            <SlidersHorizontal size={14} className="text-orange-500" />
            Filtrele & Sırala
          </motion.button>
        </div>
      </div>

      {/* Modern Mobile Side Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100]"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[101] shadow-2xl flex flex-col  overflow-hidden"
            >
              <div className="p-8 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-lg font-black tracking-tighter uppercase">
                    Filtreleme
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    Görünümü Özelleştir
                  </p>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-3 bg-white hover:bg-slate-100 shadow-sm transition-colors"
                >
                  <X size={20} className="text-slate-900" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {/* Görünüm Seçimi */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Görünüm Düzeni
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2].map((num) => (
                      <button
                        key={num}
                        onClick={() => setGridCols(num as 1 | 2)}
                        className={cn(
                          "py-5 border-2 transition-all flex flex-col items-center gap-2",
                          gridCols === num
                            ? "border-slate-950 bg-slate-950 text-white"
                            : "border-slate-100 bg-slate-50 text-slate-400"
                        )}
                      >
                        {num === 1 ? (
                          <LayoutGrid size={20} />
                        ) : (
                          <Grid2X2 size={20} />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-tighter">
                          {num === 1 ? "Geniş" : "Standart"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sıralama Seçenekleri */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Sıralama Kriteri
                  </span>
                  <div className="space-y-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSort(option.id)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 border transition-all text-left group",
                          sort === option.id
                            ? "border-orange-500 bg-orange-50/30"
                            : "border-slate-100 hover:border-slate-200"
                        )}
                      >
                        <div
                          className={cn(
                            "p-2 transition-colors",
                            sort === option.id
                              ? "bg-orange-500 text-white"
                              : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                          )}
                        >
                          <option.icon size={16} />
                        </div>
                        <span
                          className={cn(
                            "text-[12px] font-bold uppercase tracking-tight",
                            sort === option.id
                              ? "text-slate-900"
                              : "text-slate-500"
                          )}
                        >
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-white">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-5 bg-slate-950 text-white text-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 active:scale-[0.98] transition-all"
                >
                  Sonuçları Uygula
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default ProductTopBar;
