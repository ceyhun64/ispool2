"use client";
import { cn } from "@/lib/utils";
import {
  Grid2X2,
  Grid3X3,
  LayoutGrid,
  ArrowDownAZ,
  ArrowUpAZ,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductTopBarProps {
  gridCols: 2 | 3 | 4;
  setGridCols: (cols: 2 | 3 | 4) => void;
  sort: "az" | "za" | "priceLow" | "priceHigh";
  setSort: (sort: "az" | "za" | "priceLow" | "priceHigh") => void;
}

const ProductTopBar: React.FC<ProductTopBarProps> = ({
  gridCols,
  setGridCols,
  sort,
  setSort,
}) => {
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
    <nav className="w-full py-4 px-6">
      <div className="flex items-center justify-between">
        {/* Görünüm Değiştirici */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 border-r border-slate-200 pr-8">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Görünüm
            </span>
            <div className="flex bg-slate-100 p-1">
              {desktopGridOptions.map((option) => {
                const Icon = option.icon;
                const isActive = gridCols === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setGridCols(option.value)}
                    className={cn(
                      "relative px-4 py-1.5 rounded-sm transition-all duration-300 flex items-center gap-2",
                      isActive
                        ? "text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-slate-600",
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeGrid"
                        className="absolute inset-0 rounded-sm bg-white"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <Icon className="w-3.5 h-3.5 relative z-10" />
                    {isActive && (
                      <span className="text-[10px]  font-bold relative z-10">
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
              <SelectTrigger className="w-[200px] h-9 rounded-sm border-none bg-white hover:bg-slate-50 text-[11px] font-bold tracking-tight transition-all focus:ring-0">
                <SelectValue placeholder="Sıralama" />
              </SelectTrigger>
              <SelectContent
                align="end"
                className="border-slate-100 shadow-2xl p-2 bg-white/95 backdrop-blur-md rounded-sm"
              >
                {sortOptions.map((opt) => (
                  <SelectItem
                    key={opt.id}
                    value={opt.id}
                    className="py-3 px-4 focus:bg-slate-950 rounded-sm focus:text-white cursor-pointer transition-colors group"
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
      </div>
    </nav>
  );
};

export default ProductTopBar;
