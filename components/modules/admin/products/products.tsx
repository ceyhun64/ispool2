"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "@/components/modules/admin/sideBar";
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
import ProductDialog, { ProductFormData } from "./productDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Search,
  Trash2,
  Filter,
  PackageOpen,
  Loader2,
  TrendingUp,
  Package,
} from "lucide-react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount?: number;
  mainImage: string;
  category: string;
  subCategory?: string;
  createdAt: string;
  updatedAt: string;
}

const ITEMS_PER_PAGE = 15;

export default function Products(): React.ReactElement {
  const isMobile = useIsMobile();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

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

  const categories = [
    "Oturma Takımları",
    "Masa Takımları",
    "Salıncak",
    "Şezlong",
    "Şemsiye",
    "Barbekü",
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = filter === "all" || p.category === filter;
      const matchesSearch = p.title
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, filter, search]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleSubmitProduct = async (
    formData: ProductFormData,
    mainFile: File | null,
    subFile?: File | null,
    subFile2?: File | null,
    subFile3?: File | null,
    subFile4?: File | null,
    productId?: number
  ) => {
    const dataForm = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      dataForm.append(key, String(value))
    );

    if (mainFile) dataForm.append("file", mainFile);
    if (subFile) dataForm.append("subImageFile", subFile);
    if (subFile2) dataForm.append("subImage2File", subFile2);
    if (subFile3) dataForm.append("subImage3File", subFile3);
    if (subFile4) dataForm.append("subImage4File", subFile4);

    const url = productId ? `/api/products/${productId}` : "/api/products";
    const method = productId ? "PUT" : "POST";

    toast.promise(
      fetch(url, { method, body: dataForm }).then(async (res) => {
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error || "Hata oluştu");
        }
        fetchProducts();
        setSelectedProduct(null);
      }),
      {
        loading: productId ? "Ürün güncelleniyor..." : "Yeni ürün ekleniyor...",
        success: "İşlem başarıyla tamamlandı!",
        error: (err) => err.message,
      }
    );
  };

  const handleDelete = async () => {
    const idsToDelete = productToDelete ? [productToDelete.id] : selectedIds;

    toast.promise(
      Promise.all(
        idsToDelete.map((id) =>
          fetch(`/api/products/${id}`, { method: "DELETE" })
        )
      ),
      {
        loading: "Siliniyor...",
        success: () => {
          setProducts((prev) =>
            prev.filter((p) => !idsToDelete.includes(p.id))
          );
          setSelectedIds([]);
          setDeleteDialogOpen(false);
          setProductToDelete(null);
          return "Silme işlemi başarılı.";
        },
        error: "Bazı ürünler silinemedi.",
      }
    );
  };

  // Stats calculations
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 font-sans selection:bg-indigo-100">
      <Sidebar />
      <main
        className={`flex-1 transition-all duration-300 ${
          isMobile
            ? "pt-16 sm:pt-20 px-3 sm:px-4 pb-6"
            : "md:ml-[240px] lg:ml-[280px] p-4 sm:p-6 lg:p-12"
        }`}
      >
        {/* Header Section */}
        <header className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* Title & Breadcrumb */}
            <div>
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="h-1 w-8 sm:w-10 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full"></div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">
                  Yönetim Paneli
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-2">
                Ürün Yönetimi
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-2xl">
                Ürün kataloğunuzu yönetin, düzenleyin ve performansı takip edin
              </p>
            </div>


            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              {selectedIds.length > 0 && (
                <Button
                  variant="destructive"
                  className="rounded-xl gap-2 shadow-lg shadow-red-100 font-semibold h-11 sm:h-12 text-sm w-full sm:w-auto transition-all hover:scale-105"
                  onClick={() => {
                    setProductToDelete(null);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Seçilenleri Sil</span>
                  <span className="sm:hidden">Sil</span>
                  <span className="ml-1">({selectedIds.length})</span>
                </Button>
              )}
              <ProductDialog
                onSubmit={handleSubmitProduct}
                product={selectedProduct ?? undefined}
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </header>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <Search
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                size={18}
              />
              <Input
                placeholder="Ürün adı ile ara..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 sm:pl-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 text-sm h-11 sm:h-12 font-medium transition-all"
              />
            </div>

            {/* Category Filter */}
            <Select
              onValueChange={(val) => {
                setFilter(val);
                setCurrentPage(1);
              }}
              defaultValue="all"
            >
              <SelectTrigger className="w-full sm:w-64 border-slate-200 bg-slate-50 rounded-xl text-slate-700 font-semibold h-11 sm:h-12 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 text-sm transition-all">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-slate-400" />
                  <SelectValue placeholder="Kategori Filtresi" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                <SelectItem value="all" className="font-medium rounded-lg">
                  Tüm Kategoriler
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className="font-medium rounded-lg"
                  >
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Table/Grid */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px] sm:min-h-[500px] relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-500 animate-spin mb-4" />
              <p className="text-sm sm:text-base font-semibold text-slate-600">
                Yükleniyor...
              </p>
            </div>
          ) : (
            <>
              <ProductTable
                products={paginatedProducts}
                onDeleteClick={(p) => {
                  setProductToDelete(p);
                  setDeleteDialogOpen(true);
                }}
                onUpdateClick={setSelectedProduct}
                onSelectAll={(e) =>
                  setSelectedIds(
                    e.target.checked ? paginatedProducts.map((p) => p.id) : []
                  )
                }
                onSelectOne={(id) =>
                  setSelectedIds((prev) =>
                    prev.includes(id)
                      ? prev.filter((i) => i !== id)
                      : [...prev, id]
                  )
                }
                selectedIds={selectedIds}
              />

              {filteredProducts.length === 0 && (
                <div className="py-16 sm:py-24 lg:py-32 flex flex-col items-center justify-center text-slate-400 px-4">
                  <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl sm:rounded-3xl mb-4 sm:mb-5">
                    <PackageOpen
                      size={48}
                      strokeWidth={1.5}
                      className="text-slate-300 w-10 h-10 sm:w-12 sm:h-12"
                    />
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-600 mb-2">
                    Ürün Bulunamadı
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium text-center max-w-sm">
                    Arama kriterlerinizi değiştirmeyi veya filtreleri
                    temizlemeyi deneyin
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredProducts.length > ITEMS_PER_PAGE && (
          <div className="mt-6 sm:mt-8 lg:mt-10 flex justify-center">
            <DefaultPagination
              totalItems={filteredProducts.length}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[440px] rounded-2xl sm:rounded-[28px] border-none p-6 sm:p-8 gap-5 sm:gap-6 shadow-2xl max-w-[92vw] mx-auto">
            <DialogHeader className="items-center text-center space-y-3 sm:space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-50 to-red-100 text-red-500 rounded-2xl sm:rounded-3xl flex items-center justify-center animate-bounce shadow-lg shadow-red-100">
                <Trash2 size={32} className="sm:w-10 sm:h-10" />
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                Emin misiniz?
              </DialogTitle>
              <DialogDescription className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed">
                {productToDelete ? (
                  <>
                    <span className="text-slate-900 font-bold block mb-1">
                      "{productToDelete.title}"
                    </span>
                    ürünü kalıcı olarak silinecektir.
                  </>
                ) : (
                  <>
                    <span className="text-slate-900 font-bold">
                      {selectedIds.length} adet ürün
                    </span>{" "}
                    toplu olarak silinecektir.
                  </>
                )}
                <br />
                <span className="text-red-600 font-semibold">
                  Bu işlem geri alınamaz.
                </span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-3 sm:justify-center pt-2">
              <Button
                variant="ghost"
                className="flex-1 sm:flex-none rounded-xl font-semibold text-slate-600 hover:bg-slate-100 h-11 sm:h-12 order-2 sm:order-1 min-w-[120px]"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Vazgeç
              </Button>
              <Button
                variant="destructive"
                className="flex-1 sm:flex-none rounded-xl font-semibold h-11 sm:h-12 shadow-lg shadow-red-200 hover:shadow-xl order-1 sm:order-2 min-w-[120px] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                onClick={handleDelete}
              >
                Evet, Sil
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
