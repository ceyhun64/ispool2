import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
  return (
    <div className="max-w-8xl mx-auto mb-20">
      {/* Banner Skeleton */}
      <div className="relative w-full h-[60vh] md:h-[75vh] mb-6 overflow-hidden rounded-xs">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="bg-gradient-to-b from-white via-amber-950/10 to-white px-1 md:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Skeleton */}
          <aside className="hidden md:block md:w-64 flex-shrink-0">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="flex-1">
            {/* Topbar Skeleton */}
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-32" />
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-2  md:grid-cols-3 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-xs shadow-sm border border-gray-200"
                >
                  {/* Daha yüksek ürün görseli skeletonu */}
                  <Skeleton className="w-full h-56 md:h-82 rounded-xs mb-4" />

                  {/* Başlık skeletonu */}
                  <Skeleton className="h-5 w-4/5 mb-3" />

                  {/* Alt açıklama skeletonu */}
                  <Skeleton className="h-4 w-1/2 mb-4" />

                  {/* Fiyat veya buton skeletonu */}
                  <Skeleton className="h-7 w-24" />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
