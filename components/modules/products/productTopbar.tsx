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
  Calendar,
  CalendarClock,
  ChevronDown,
  Sparkles,
  Flame,
  Tag,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface ProductTopBarProps {
  gridCols: 2 | 3 | 4;
  setGridCols: (cols: 2 | 3 | 4) => void;
  sort: "az" | "za" | "priceLow" | "priceHigh" | "dateNew" | "dateOld";
  setSort: (
    sort: "az" | "za" | "priceLow" | "priceHigh" | "dateNew" | "dateOld",
  ) => void;
  onBestSellers?: () => void;
  isDiscountMode?: boolean; // İndirim modu kontrolü
}

const ProductTopBar: React.FC<ProductTopBarProps> = ({
  gridCols,
  setGridCols,
  sort,
  setSort,
  onBestSellers,
  isDiscountMode = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    { id: "dateNew", label: "Tarih (En Yeni)", icon: Calendar },
    { id: "dateOld", label: "Tarih (En Eski)", icon: CalendarClock },
  ] as const;

  // Aktif seçeneği bul
  const currentSort = sortOptions.find((opt) => opt.id === sort);

  // Dışarı tıklayınca kapatma
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // En Yeniler butonu handler
  const handleNewArrivals = () => {
    setSort("dateNew");
    setIsOpen(false);
  };

  // Çok Satanlar butonu handler
  const handleBestSellers = () => {
    if (onBestSellers) {
      onBestSellers();
    }
    setIsOpen(false);
  };

  // İndirimdekiler butonu handler - Sayfayı yeniden yükle
  const handleDiscounts = () => {
    window.location.href = "/products?discount=true";
  };

  // Tüm Ürünler butonu handler - Sayfayı yeniden yükle
  const handleAllProducts = () => {
    window.location.href = "/products";
  };

  return (
    <nav className="w-full py-4 px-6 bg-slate-50 border-b border-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Görünüm Değiştirici */}
          <div className="flex items-center gap-4 border-r border-slate-200 pr-8">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
              Görünüm
            </span>
            <div className="flex p-1 rounded-sm">
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
                        ? "text-slate-950"
                        : "text-slate-400 hover:text-slate-600",
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeGrid"
                        className="absolute inset-0 rounded-sm bg-white shadow-xs hover:bg-white/50"
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

          {/* Özel Sıralama Dropdown */}
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
              Sıralama
            </span>

            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "flex items-center justify-between w-[220px] h-9 px-4 rounded-sm bg-white shadow-xs hover:bg-white/50 transition-all text-[11px] font-bold",
                  isOpen && " bg-white",
                )}
              >
                <div className="flex items-center gap-2">
                  {currentSort && (
                    <currentSort.icon size={14} className="text-orange-600" />
                  )}
                  <span>{currentSort?.label}</span>
                </div>
                <ChevronDown
                  size={14}
                  className={cn(
                    "transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 4 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-full bg-white border border-slate-100 shadow-2xl rounded-sm z-50 overflow-hidden p-1"
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSort(opt.id);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 w-full px-3 py-2.5 text-[11px] font-semibold rounded-sm transition-colors",
                          sort === opt.id
                            ? "bg-slate-950 text-white"
                            : "text-slate-600 hover:bg-slate-50 hover:text-orange-600",
                        )}
                      >
                        <opt.icon
                          size={14}
                          className={cn(
                            sort === opt.id
                              ? "text-orange-500"
                              : "text-slate-400",
                          )}
                        />
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Hızlı Erişim Butonları - İndirim modunda farklı butonlar */}
        <div className="flex items-center gap-3">
          {!isDiscountMode && (
            <>
              {/* En Yeniler */}
              <button
                onClick={handleNewArrivals}
                className={cn(
                  "group flex items-center gap-2 px-4 py-2 rounded-sm transition-all text-[10px] font-bold uppercase tracking-tight border",
                  sort === "dateNew"
                    ? "border-orange-600 bg-orange-50 text-orange-600 shadow-sm shadow-orange-100"
                    : "border-slate-200 bg-white text-slate-600 hover:border-orange-600 hover:text-orange-600 hover:bg-orange-50/50",
                )}
              >
                <Sparkles
                  size={14}
                  className={cn(
                    "transition-all",
                    sort === "dateNew"
                      ? "text-orange-600 scale-110"
                      : "text-orange-500 group-hover:rotate-12",
                  )}
                />
                En Yeniler
              </button>

              {/* Çok Satanlar */}
              <button
                onClick={handleBestSellers}
                className="group flex items-center gap-2 px-4 py-2 rounded-sm bg-white text-slate-600 border border-slate-200 hover:border-red-600 hover:text-red-600 hover:bg-red-50/50 transition-all text-[10px] font-bold uppercase tracking-tight"
              >
                <Flame
                  size={14}
                  className="text-red-500 group-hover:scale-110 group-hover:animate-pulse transition-transform"
                />
                Çok Satanlar
              </button>

              {/* İndirimdekiler - window.location.href ile tam sayfa yenileme */}
              <button
                onClick={handleDiscounts}
                className="group flex items-center gap-2 px-4 py-2 rounded-sm bg-white text-slate-600 border border-slate-200 hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all text-[10px] font-bold uppercase tracking-tight"
              >
                <Tag
                  size={14}
                  className="text-emerald-500 group-hover:-rotate-12 transition-transform"
                />
                İndirimdekiler
              </button>
            </>
          )}

          {isDiscountMode && (
            <>
              {/* En Çok İndirimli */}
              <button
                onClick={() => {
                  setSort("priceHigh");
                  setIsOpen(false);
                }}
                className={cn(
                  "group flex items-center gap-2 px-4 py-2 rounded-sm transition-all text-[10px] font-bold uppercase tracking-tight border",
                  sort === "priceHigh"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-600 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50/50",
                )}
              >
                <Tag
                  size={14}
                  className={cn(
                    "transition-all",
                    sort === "priceHigh"
                      ? "text-emerald-600 scale-110"
                      : "text-emerald-500 group-hover:-rotate-12",
                  )}
                />
                En Çok İndirimli
              </button>

              {/* Tüm Ürünler - window.location.href ile tam sayfa yenileme */}
              <button
                onClick={handleAllProducts}
                className="group flex items-center gap-2 px-4 py-2 rounded-sm bg-slate-900 text-white border border-slate-900 hover:bg-slate-800 transition-all text-[10px] font-bold uppercase tracking-tight"
              >
                <LayoutGrid
                  size={14}
                  className="group-hover:rotate-12 transition-transform"
                />
                Tüm Ürünler
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ProductTopBar;