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
import { Search, Trash2, Plus, Loader2 } from "lucide-react";
import type { Product } from "@/types/product";

const ITEMS_PER_PAGE = 15;

export default function Products(): React.ReactElement {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleDelete = async () => {
    const idsToDelete = productToDelete ? [productToDelete.id] : selectedIds;

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
          return "Ürün(ler) silindi.";
        },
        error: "Silme işlemi başarısız.",
      },
    );
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
              Ürün kataloğunuzu yönetin ve güncelleyin
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
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Ürün adı veya kodu ara..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 bg-white border-slate-200 rounded-xl"
            />
          </div>

          <Select
            onValueChange={(val) => {
              setFilter(val);
              setCurrentPage(1);
            }}
            defaultValue="all"
          >
            <SelectTrigger className="w-full sm:w-64 bg-white border-slate-200 rounded-xl">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Products Table */}
      <div className="bg-white  relative min-h-[500px] ">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : (
          <div className=" border border-slate-200 rounded-sm">
            <ProductTable
              products={paginatedProducts}
              onDeleteClick={(p) => {
                setProductToDelete(p);
                setDeleteDialogOpen(true);
              }}
              onUpdateClick={(p) => router.push(`/admin/products/edit/${p.id}`)}
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
                <p className="text-sm text-slate-500">Ürün bulunamadı</p>
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
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Evet, Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
