import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, ShieldCheck, Cog, SlidersHorizontal } from "lucide-react";

export default function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 selection:bg-orange-500 selection:text-white relative font-sans overflow-x-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] -z-10" />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-12 relative z-10">
        {/* Header Section Skeleton */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 lg:gap-10 mb-8 sm:mb-16">
          <div className="relative w-full lg:w-auto">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-orange-600 animate-pulse" />
                <span className="w-2 h-2 bg-slate-300" />
                <span className="w-2 h-2 bg-slate-300" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase text-slate-400 border-l border-slate-300 pl-2 sm:pl-3">
                Industrial Safety Inventory v4.0
              </span>
            </div>

            <Skeleton className="h-12 sm:h-14 md:h-16 w-full max-w-md mb-4 sm:mb-6" />

            <div className="mt-4 sm:mt-6 flex items-center gap-3 sm:gap-4">
              <div className="h-[2px] w-8 sm:w-12 bg-orange-600" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full lg:w-auto">
            {[
              {
                icon: ShieldCheck,
                color: "text-emerald-600",
              },
              {
                icon: Activity,
                color: "text-orange-600",
              },
              {
                icon: Cog,
                color: "text-blue-600",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-slate-50 p-3 sm:p-5 min-w-[100px] sm:min-w-[140px]"
              >
                <stat.icon
                  size={16}
                  className={`${stat.color} mb-2 sm:mb-3 opacity-30`}
                />
                <Skeleton className="h-6 sm:h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </header>

        {/* Mobile Filter Button Skeleton */}
        <div className="lg:hidden sticky top-0 z-40 mb-6 bg-slate-100/95 backdrop-blur-sm py-3 -mx-4 px-4 sm:-mx-6 sm:px-6">
          <div className="flex gap-2">
            <Skeleton className="flex-1 h-12 sm:h-14 rounded-sm" />
          </div>
        </div>

        {/* Desktop Filter Toggle & TopBar Skeleton */}
        <div className="hidden lg:flex sticky top-24 z-40 mb-12 items-center justify-between gap-4 p-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4 px-8 py-4 rounded-sm bg-slate-900 text-white">
              <SlidersHorizontal size={16} className="text-orange-500" />
              <span className="font-black text-[11px] tracking-[0.2em] uppercase">
                Filtreyi Kapat
              </span>
            </div>
          </div>

          <div className="flex-1 bg-slate-50 h-16">
            <div className="flex items-center justify-between h-full px-6">
              <Skeleton className="h-8 w-32" />
              <div className="flex gap-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-row items-start gap-8">
          {/* Filter Sidebar Skeleton */}
          <aside className="hidden lg:block w-[320px] sticky top-48 self-start flex-shrink-0">
            <div className="bg-slate-50 border border-slate-200 p-8 relative overflow-hidden">
              <div className="space-y-8">
                {/* Alt Kategori Filtresi */}
                <div>
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>

                {/* Marka Filtresi */}
                <div>
                  <Skeleton className="h-6 w-24 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>

                {/* Fiyat Aralığı */}
                <div>
                  <Skeleton className="h-6 w-28 mb-4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid Skeleton */}
          <div className="flex-1">
            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 overflow-hidden group hover:shadow-lg transition-all duration-300"
                >
                  {/* Product Image Skeleton */}
                  <div className="relative w-full aspect-square bg-slate-50 overflow-hidden">
                    <Skeleton className="w-full h-full" />
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    {/* Brand/Category */}
                    <Skeleton className="h-3 w-20" />

                    {/* Title */}
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />

                    {/* Rating */}
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="w-3 h-3 rounded-full" />
                      ))}
                      <Skeleton className="h-3 w-8 ml-2" />
                    </div>

                    {/* Price */}
                    <div className="flex items-end gap-2 pt-2">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>

                    {/* Add to Cart Button */}
                    <Skeleton className="h-10 w-full rounded-sm mt-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
