// components/modules/admin/products/products.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DefaultPagination from "@/components/layout/pagination";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductTable from "./productTable";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, Trash2, Plus, Loader2, Filter } from "lucide-react";
import type { Product } from "@/types/product";

// JSON dosyalarını import et
import categoriesDataRaw from "@/data/categories.json";
import middleCategoriesDataRaw from "@/data/middleCategories.json";
import subCategoriesDataRaw from "@/data/subCategories.json";

const ITEMS_PER_PAGE = 15;

// Tip tanımlamaları
interface CategoryData {
  name: string;
}

interface MiddleCategoryData {
  name: string;
  categoryName: string;
}

interface SubCategoryData {
  name: string;
  middleCategoryName: string;
}

export default function Products(): React.ReactElement {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [middleCategoryFilter, setMiddleCategoryFilter] = useState("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  // JSON verilerini type-cast et
  const categoriesData = categoriesDataRaw as CategoryData[];
  const middleCategoriesData = middleCategoriesDataRaw as MiddleCategoryData[];
  const subCategoriesData = subCategoriesDataRaw as SubCategoryData[];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok) setProducts(data.products || []);
      else toast.error(data.error || "Ürünler yüklenemedi");
    } catch (err) {
      toast.error("Sunucu bağlantı hatası!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Tüm kategorileri al
  const allCategories = useMemo(() => {
    return categoriesData.map((cat) => cat.name);
  }, [categoriesData]);

  // Seçili kategoriye göre orta kategorileri filtrele
  const availableMiddleCategories = useMemo(() => {
    if (categoryFilter === "all") {
      return middleCategoriesData.map((mid) => mid.name);
    }
    return middleCategoriesData
      .filter((mid) => mid.categoryName === categoryFilter)
      .map((mid) => mid.name);
  }, [categoryFilter, middleCategoriesData]);

  // Seçili orta kategoriye göre alt kategorileri filtrele
  const availableSubCategories = useMemo(() => {
    if (middleCategoryFilter === "all") {
      return subCategoriesData.map((sub) => sub.name);
    }
    return subCategoriesData
      .filter((sub) => sub.middleCategoryName === middleCategoryFilter)
      .map((sub) => sub.name);
  }, [middleCategoryFilter, subCategoriesData]);

  // Ürünleri filtrele
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Kategori filtresi
      const matchesCategory =
        categoryFilter === "all" || p.category === categoryFilter;

      // Orta kategori filtresi
      const matchesMiddleCategory =
        middleCategoryFilter === "all" ||
        p.middleCategory === middleCategoryFilter;

      // Alt kategori filtresi
      const matchesSubCategory =
        subCategoryFilter === "all" || p.subCategory === subCategoryFilter;

      // Arama filtresi
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toString().includes(search);

      return (
        matchesCategory &&
        matchesMiddleCategory &&
        matchesSubCategory &&
        matchesSearch
      );
    });
  }, [
    products,
    categoryFilter,
    middleCategoryFilter,
    subCategoryFilter,
    search,
  ]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleDelete = async () => {
    if (isDeleting) return;
    const idsToDelete = productToDelete ? [productToDelete.id] : selectedIds;

    setIsDeleting(true);
    toast.promise(
      Promise.all(
        idsToDelete.map((id) =>
          fetch(`/api/products/${id}`, { method: "DELETE" }),
        ),
      ),
      {
        loading: "Siliniyor...",
        success: () => {
          setProducts((prev) =>
            prev.filter((p) => !idsToDelete.includes(p.id)),
          );
          setSelectedIds([]);
          setDeleteDialogOpen(false);
          setProductToDelete(null);
          setIsDeleting(false);
          return "Ürün(ler) silindi.";
        },
        error: () => {
          setIsDeleting(false);
          return "Silme işlemi başarısız.";
        },
      },
    );
  };

  const handleEditClick = (product: Product) => {
    router.push(`/admin/products/edit/${product.id}`);
  };

  // Ana kategori değiştiğinde alt kategorileri sıfırla
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setMiddleCategoryFilter("all");
    setSubCategoryFilter("all");
    setCurrentPage(1);
  };

  // Orta kategori değiştiğinde alt kategoriyi sıfırla
  const handleMiddleCategoryChange = (value: string) => {
    setMiddleCategoryFilter(value);
    setSubCategoryFilter("all");
    setCurrentPage(1);
  };

  // Alt kategori değiştiğinde
  const handleSubCategoryChange = (value: string) => {
    setSubCategoryFilter(value);
    setCurrentPage(1);
  };

  // Tüm filtreleri temizle
  const clearAllFilters = () => {
    setCategoryFilter("all");
    setMiddleCategoryFilter("all");
    setSubCategoryFilter("all");
    setSearch("");
    setCurrentPage(1);
  };

  return (
    <div
      className={`flex-1 bg-slate-50 min-h-screen p-6 sm:p-8 ${isMobile ? "mt-14" : ""}`}
    >
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Ürün Yönetimi
            </h1>
            <p className="text-sm text-slate-600">
              Toplam {products.length} ürün • {filteredProducts.length} sonuç
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => {
                  setProductToDelete(null);
                  setDeleteDialogOpen(true);
                }}
                className="gap-2 rounded-full"
              >
                <Trash2 className="w-4 h-4" />
                Sil ({selectedIds.length})
              </Button>
            )}
            <Button
              onClick={() => router.push("/admin/products/new")}
              className="bg-slate-900 hover:bg-slate-800 text-white gap-2 rounded-full"
            >
              <Plus className="w-4 h-4" />
              Yeni Ürün
            </Button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Ürün adı, açıklama veya ID ara..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 bg-white border-slate-200 rounded-xl"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Ana Kategori */}
            <div className="flex-1 min-w-[150px]">
              <Select
                onValueChange={handleCategoryChange}
                value={categoryFilter}
              >
                <SelectTrigger className="bg-white border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <SelectValue placeholder="Ana Kategori" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Tüm Ana Kategoriler</SelectItem>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Orta Kategori */}
            <div className="flex-1 min-w-[150px]">
              <Select
                onValueChange={handleMiddleCategoryChange}
                value={middleCategoryFilter}
                disabled={availableMiddleCategories.length === 0}
              >
                <SelectTrigger className="bg-white border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <SelectValue placeholder="Orta Kategori" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Tüm Orta Kategoriler</SelectItem>
                  {availableMiddleCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Alt Kategori */}
            <div className="flex-1 min-w-[150px]">
              <Select
                onValueChange={handleSubCategoryChange}
                value={subCategoryFilter}
                disabled={availableSubCategories.length === 0}
              >
                <SelectTrigger className="bg-white border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <SelectValue placeholder="Alt Kategori" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Tüm Alt Kategoriler</SelectItem>
                  {availableSubCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtreleri Temizle Butonu */}
            {(categoryFilter !== "all" ||
              middleCategoryFilter !== "all" ||
              subCategoryFilter !== "all" ||
              search) && (
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="rounded-full px-4 h-10 border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Temizle
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Products Table */}
      <div className="bg-white relative min-h-[500px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : (
          <div className="border border-slate-200 rounded-sm">
            <ProductTable
              products={paginatedProducts}
              onDeleteClick={(p) => {
                setProductToDelete(p);
                setDeleteDialogOpen(true);
              }}
              onUpdateClick={handleEditClick}
              onSelectAll={(e) =>
                setSelectedIds(
                  e.target.checked ? paginatedProducts.map((p) => p.id) : [],
                )
              }
              onSelectOne={(id) =>
                setSelectedIds((prev) =>
                  prev.includes(id)
                    ? prev.filter((i) => i !== id)
                    : [...prev, id],
                )
              }
              selectedIds={selectedIds}
            />

            {filteredProducts.length === 0 && (
              <div className="py-16 flex flex-col items-center justify-center">
                <p className="text-sm text-slate-500">
                  {search ||
                  categoryFilter !== "all" ||
                  middleCategoryFilter !== "all" ||
                  subCategoryFilter !== "all"
                    ? "Filtreye uygun ürün bulunamadı"
                    : "Henüz ürün eklenmemiş"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredProducts.length > ITEMS_PER_PAGE && (
        <div className="mt-6 flex justify-center">
          <DefaultPagination
            totalItems={filteredProducts.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ürün Sil</DialogTitle>
            <DialogDescription>
              {productToDelete ? (
                <>
                  <strong>"{productToDelete.title}"</strong> ürünü kalıcı olarak
                  silinecektir.
                </>
              ) : (
                <>
                  <strong>{selectedIds.length} ürün</strong> toplu olarak
                  silinecektir.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="rounded-full"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              İptal
            </Button>
            <Button
              className="rounded-full"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              Evet, Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
