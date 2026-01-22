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
  ShieldCheck,
  LayoutGrid,
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

  // Premium İş Elbiseleri Kategorileri (Örnek içerik, kod değişmedi)
  const categories = [
    "İş Elbiseleri",
    "İş Ayakkabıları",
    "Baş Koruyucular",
    "El Koruyucular",
    "Yüksekte Çalışma",
    "Vücut Koruma",
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
    productId?: number,
  ) => {
    const dataForm = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      dataForm.append(key, String(value)),
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
        loading: productId
          ? "Envanter güncelleniyor..."
          : "Yeni ekipman tanımlanıyor...",
        success: "Envanter başarıyla güncellendi.",
        error: (err) => err.message,
      },
    );
  };

  const handleDelete = async () => {
    const idsToDelete = productToDelete ? [productToDelete.id] : selectedIds;

    toast.promise(
      Promise.all(
        idsToDelete.map((id) =>
          fetch(`/api/products/${id}`, { method: "DELETE" }),
        ),
      ),
      {
        loading: "Veri tabanından temizleniyor...",
        success: () => {
          setProducts((prev) =>
            prev.filter((p) => !idsToDelete.includes(p.id)),
          );
          setSelectedIds([]);
          setDeleteDialogOpen(false);
          setProductToDelete(null);
          return "Silme işlemi başarıyla tamamlandı.";
        },
        error: "İşlem sırasında hata oluştu.",
      },
    );
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-sans selection:bg-orange-100">
      <Sidebar />
      <main
        className={`flex-1 transition-all duration-300 ${
          isMobile
            ? "pt-16 px-4 pb-10"
            : "md:ml-[240px] lg:ml-[280px] p-6 lg:p-12"
        }`}
      >
        {/* Header Section */}
        <header className="mb-10">
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="h-[2px] w-12 bg-orange-600"></span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-600">
                  Envanter Yönetimi
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-950 uppercase">
                    Ürün{" "}
                    <span className="text-slate-400 font-light">Kataloğu</span>
                  </h1>
                  <p className="text-slate-500 text-sm mt-2 font-medium max-w-2xl">
                    Endüstriyel standartlara uygun ekipman listesi ve stok
                    takibi.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {selectedIds.length > 0 && (
                    <Button
                      variant="destructive"
                      className="gap-2 font-bold uppercase text-[11px] tracking-widest h-12 px-6 rounded-none transition-all shadow-lg shadow-red-100"
                      onClick={() => {
                        setProductToDelete(null);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 size={14} />
                      Seçilenleri Sil ({selectedIds.length})
                    </Button>
                  )}
                  <ProductDialog
                    onSubmit={handleSubmitProduct}
                    product={selectedProduct ?? undefined}
                    className="h-12 rounded-none bg-slate-950 hover:bg-slate-800 text-white font-bold uppercase text-[11px] tracking-widest px-8 shadow-xl transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Search & Filter Toolbar */}
        <div className="bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors"
                size={18}
              />
              <Input
                placeholder="Model, Ürün Adı veya SKU ile ara..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-12 bg-slate-50 border-slate-100 rounded-none focus:bg-white focus:border-orange-600 focus:ring-0 text-sm h-12 font-medium transition-all"
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
              <SelectTrigger className="w-full lg:w-72 border-slate-100 bg-slate-50 text-slate-900 font-bold h-12 rounded-none focus:ring-0 focus:border-orange-600 text-[12px] uppercase tracking-wider transition-all">
                <div className="flex items-center gap-2">
                  <LayoutGrid size={16} className="text-slate-400" />
                  <SelectValue placeholder="Kategori Seçiniz" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-none border-slate-100 shadow-2xl">
                <SelectItem
                  value="all"
                  className="font-bold text-[11px] uppercase tracking-wide"
                >
                  Tüm Ekipmanlar
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className="font-semibold text-[11px] uppercase tracking-wide"
                  >
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Table/Grid Container */}
        <div className="bg-white border border-slate-100 shadow-sm min-h-[500px] relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10">
              <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-900">
                Veriler Getiriliyor...
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
                <div className="py-32 flex flex-col items-center justify-center text-slate-400 px-4">
                  <div className="p-8 bg-slate-50 mb-6 group transition-all">
                    <PackageOpen
                      size={54}
                      strokeWidth={1}
                      className="text-slate-300 group-hover:text-orange-600 transition-colors"
                    />
                  </div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">
                    Kayıt Bulunamadı
                  </p>
                  <p className="text-xs text-slate-400 font-medium text-center max-w-sm">
                    Arama kriterlerinizi teknik şartnamelere göre güncelleyerek
                    tekrar deneyiniz.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredProducts.length > ITEMS_PER_PAGE && (
          <div className="mt-10 flex justify-center">
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
          <DialogContent className="sm:max-w-[420px] rounded-none border-none p-8 gap-6 shadow-2xl">
            <DialogHeader className="items-center text-center space-y-4">
              <div className="w-20 h-20 bg-red-50 text-red-600 flex items-center justify-center shadow-inner">
                <ShieldCheck size={40} className="opacity-20 absolute" />
                <Trash2 size={36} className="relative z-10" />
              </div>
              <DialogTitle className="text-xl font-black text-slate-950 uppercase tracking-tight">
                İşlem Onayı
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-medium text-sm leading-relaxed">
                {productToDelete ? (
                  <>
                    <span className="text-slate-900 font-bold block mb-1 uppercase">
                      "{productToDelete.title}"
                    </span>
                    adlı ekipman kalıcı olarak silinecektir.
                  </>
                ) : (
                  <>
                    <span className="text-slate-900 font-bold">
                      {selectedIds.length} adet ekipman
                    </span>{" "}
                    toplu olarak envanterden çıkarılacaktır.
                  </>
                )}
                <br />
                <span className="text-red-600 font-bold uppercase text-[10px] tracking-widest mt-4 block">
                  Bu işlem geri alınamaz.
                </span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 rounded-none font-bold uppercase text-[11px] tracking-widest h-12 border-slate-200"
                onClick={() => setDeleteDialogOpen(false)}
              >
                İptal Et
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-none font-bold uppercase text-[11px] tracking-widest h-12 bg-red-600 hover:bg-red-700 shadow-lg shadow-red-100"
                onClick={handleDelete}
              >
                Onaylıyorum ve Sil
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
