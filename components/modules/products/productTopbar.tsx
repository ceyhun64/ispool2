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
  Percent,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface ProductTopBarProps {
  gridCols: 2 | 3 | 4;
  setGridCols: (cols: 2 | 3 | 4) => void;
  sort:
    | "az"
    | "za"
    | "priceLow"
    | "priceHigh"
    | "dateNew"
    | "dateOld"
    | "discountHigh";
  setSort: (
    sort:
      | "az"
      | "za"
      | "priceLow"
      | "priceHigh"
      | "dateNew"
      | "dateOld"
      | "discountHigh",
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
    { id: "az", label: "A-Z", icon: ArrowDownAZ },
    { id: "za", label: "Z-A", icon: ArrowUpAZ },
    { id: "priceLow", label: "Fiyat ↑", icon: TrendingDown },
    { id: "priceHigh", label: "Fiyat ↓", icon: TrendingUp },
    { id: "dateNew", label: "Yeni → Eski", icon: Calendar },
    { id: "dateOld", label: "Eski → Yeni", icon: CalendarClock },
    { id: "discountHigh", label: "İndirim ↓", icon: Percent },
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

  // İndirimdekiler butonu handler
  const handleDiscounts = () => {
    router.push("/products?discount=true");
  };

  // Tüm Ürünler butonu handler
  const handleAllProducts = () => {
    router.push("/products");
  };

  // En Çok İndirimli butonu handler
  const handleMostDiscounted = () => {
    setSort("discountHigh");
    setIsOpen(false);
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
              Sırala
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

          {/* Hızlı erişim sekmeleri - İndirim modunda farklı sekmeler */}
          <div className="flex items-center gap-6 border-l border-slate-200 pl-8">
            {!isDiscountMode && (
              <>
                <button
                  onClick={handleNewArrivals}
                  aria-pressed={sort === "dateNew"}
                  className={cn(
                    "relative -mb-px px-1 py-2 text-[12px] font-semibold border-b-2 transition-colors",
                    sort === "dateNew"
                      ? "border-sax-700 text-sax-800"
                      : "border-transparent text-slate-600 hover:text-sax-800",
                  )}
                >
                  Yeni Gelenler
                </button>

                <button
                  onClick={handleBestSellers}
                  className="relative -mb-px px-1 py-2 text-[12px] font-semibold border-b-2 transition-colors border-transparent text-slate-600 hover:text-sax-800"
                >
                  Karışık
                </button>

                <button
                  onClick={handleDiscounts}
                  className="relative -mb-px px-1 py-2 text-[12px] font-semibold border-b-2 transition-colors border-transparent text-slate-600 hover:text-sax-800"
                >
                  Fırsatlar
                </button>
              </>
            )}

            {isDiscountMode && (
              <>
                <button
                  onClick={handleMostDiscounted}
                  aria-pressed={sort === "discountHigh"}
                  className={cn(
                    "relative -mb-px px-1 py-2 text-[12px] font-semibold border-b-2 transition-colors",
                    sort === "discountHigh"
                      ? "border-sax-700 text-sax-800"
                      : "border-transparent text-slate-600 hover:text-sax-800",
                  )}
                >
                  En Çok İndirimli
                </button>

                <button
                  onClick={handleAllProducts}
                  className="relative -mb-px px-1 py-2 text-[12px] font-semibold border-b-2 transition-colors border-transparent text-slate-600 hover:text-sax-800"
                >
                  Tüm Ürünler
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ProductTopBar;
