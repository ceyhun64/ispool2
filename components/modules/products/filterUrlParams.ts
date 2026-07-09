// components/modules/products/filterUrlParams.ts
// Kategori/alt kategori navigasyonunda mevcut marka/renk/beden/fiyat
// filtrelerini query param olarak taşımak için paylaşılan yardımcılar.
// Bu sayede kategori değiştirildiğinde diğer filtreler kaybolmuyor.

export interface ActiveFilters {
  brandFilter: string;
  colorFilter: string;
  sizeFilter: string;
  minPrice: number;
  maxPrice: number;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 300000;

export function buildFilterNavUrl(
  basePath: string,
  filters: ActiveFilters,
  extraParams?: Record<string, string>,
): string {
  const params = new URLSearchParams(extraParams);
  if (filters.brandFilter !== "all") params.set("brand", filters.brandFilter);
  if (filters.colorFilter !== "all") params.set("color", filters.colorFilter);
  if (filters.sizeFilter !== "all") params.set("size", filters.sizeFilter);
  if (filters.minPrice > DEFAULT_MIN_PRICE)
    params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice < DEFAULT_MAX_PRICE)
    params.set("maxPrice", String(filters.maxPrice));

  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function readFiltersFromSearchParams(
  searchParams: URLSearchParams,
): ActiveFilters {
  return {
    brandFilter: searchParams.get("brand") || "all",
    colorFilter: searchParams.get("color") || "all",
    sizeFilter: searchParams.get("size") || "all",
    minPrice: Number(searchParams.get("minPrice")) || DEFAULT_MIN_PRICE,
    maxPrice: Number(searchParams.get("maxPrice")) || DEFAULT_MAX_PRICE,
  };
}
