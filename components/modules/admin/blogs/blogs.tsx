"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import AddBlogDialog from "./addBlog";
import UpdateBlogDialog from "./updateBlog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import DefaultPagination from "@/components/layout/pagination";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search, Trash2, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface Blog {
  id: number;
  title: string;
  content: string;
  image: string;
  category: string;
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const isMobile = useIsMobile();

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (res.ok && data.blogs) setBlogs(data.blogs);
    } catch (err) {
      toast.error("Bloglar yüklenemedi.");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async () => {
    if (!blogToDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/blog/${blogToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete.id));
        toast.success("Blog silindi.");
        setDeleteDialogOpen(false);
        setBlogToDelete(null);
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.message || "Blog silinemedi.");
      }
    } catch {
      toast.error("Bağlantı hatası oluştu.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      const results = await Promise.allSettled(
        selectedIds.map(async (id) => {
          const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error(`${id}`);
          return id;
        }),
      );
      const deletedIds = results
        .filter((r): r is PromiseFulfilledResult<number> => r.status === "fulfilled")
        .map((r) => r.value);
      const failedCount = results.filter((r) => r.status === "rejected").length;
      setBlogs((prev) => prev.filter((b) => !deletedIds.includes(b.id)));
      setSelectedIds((prev) => prev.filter((id) => !deletedIds.includes(id)));
      if (deletedIds.length > 0) toast.success(`${deletedIds.length} blog silindi.`);
      if (failedCount > 0) toast.error(`${failedCount} blog silinemedi.`);
    } catch {
      toast.error("Toplu silme sırasında bir hata oluştu.");
    } finally {
      setIsBulkDeleting(false);
      setBulkDeleteDialogOpen(false);
    }
  };

  const filteredBlogs = blogs
    .filter((b) =>
      filter === "all"
        ? true
        : b.category.toLowerCase() === filter.toLowerCase(),
    )
    .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * 15,
    currentPage * 15,
  );

  const categories = Array.from(new Set(blogs.map((b) => b.category)));

  return (
    <div
      className={`flex-1 bg-slate-50 min-h-screen p-6 sm:p-8 ${isMobile ? "mt-14" : ""}`}
    >
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Blog Yönetimi
            </h1>
            <p className="text-sm text-slate-600">
              Blog içeriklerinizi düzenleyin ve yönetin
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => setBulkDeleteDialogOpen(true)}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Sil ({selectedIds.length})
              </Button>
            )}
            <AddBlogDialog onAdd={(newB) => setBlogs([...blogs, newB])} />
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Blog başlığı ara..."
              className="pl-10 bg-white border-slate-200 rounded-xl"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Select
            onValueChange={(val) => {
              setFilter(val);
              setCurrentPage(1);
            }}
            value={filter}
          >
            <SelectTrigger className="w-full sm:w-64 bg-white border-slate-200 rounded-xl">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent className="rounded-sm">
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

      {/* Desktop Table - rounded-sm ve overflow-hidden eklendi */}
      <div className="hidden lg:block bg-white rounded-sm border border-slate-200 overflow-hidden">
        <table className="w-full border-separate border-spacing-0">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 w-12 border-b border-slate-200">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300"
                  checked={
                    paginatedBlogs.length > 0 &&
                    selectedIds.length === paginatedBlogs.length
                  }
                  onChange={(e) =>
                    setSelectedIds(
                      e.target.checked ? paginatedBlogs.map((b) => b.id) : [],
                    )
                  }
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 border-b border-slate-200">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 border-b border-slate-200">
                Başlık
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 border-b border-slate-200">
                Kategori
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 border-b border-slate-200">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedBlogs.map((blog) => (
              <tr
                key={blog.id}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(blog.id)}
                    onChange={() =>
                      setSelectedIds((prev) =>
                        prev.includes(blog.id)
                          ? prev.filter((id) => id !== blog.id)
                          : [...prev, blog.id],
                      )
                    }
                    className="w-4 h-4 rounded border-slate-300"
                  />
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">#{blog.id}</td>
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <p className="font-semibold text-sm text-slate-900 truncate">
                      {blog.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-1">
                      {blog.content}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className="bg-slate-50 text-slate-700 border-slate-200"
                  >
                    {blog.category}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <UpdateBlogDialog
                      blog={blog}
                      onUpdate={(updated) =>
                        setBlogs((prev) =>
                          prev.map((b) => (b.id === updated.id ? updated : b)),
                        )
                      }
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-slate-400 hover:text-red-500"
                      onClick={() => {
                        setBlogToDelete(blog);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBlogs.length === 0 && (
          <div className="py-16 flex flex-col items-center justify-center border-t border-slate-100">
            <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">Blog bulunamadı</p>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {paginatedBlogs.map((blog) => (
          <Card key={blog.id} className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(blog.id)}
                  onChange={() =>
                    setSelectedIds((prev) =>
                      prev.includes(blog.id)
                        ? prev.filter((id) => id !== blog.id)
                        : [...prev, blog.id],
                    )
                  }
                  className="w-5 h-5 rounded border-slate-300 mt-1"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-900 mb-1">
                    {blog.title}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                    {blog.content}
                  </p>
                  <Badge
                    variant="outline"
                    className="bg-slate-50 text-slate-700 border-slate-200 text-xs"
                  >
                    {blog.category}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <UpdateBlogDialog
                  blog={blog}
                  onUpdate={(updated) =>
                    setBlogs((prev) =>
                      prev.map((b) => (b.id === updated.id ? updated : b)),
                    )
                  }
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-slate-400 hover:text-red-500"
                  onClick={() => {
                    setBlogToDelete(blog);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Sil
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredBlogs.length === 0 && (
          <Card className="bg-white border-slate-200">
            <CardContent className="py-16 flex flex-col items-center justify-center">
              <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">Blog bulunamadı</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {filteredBlogs.length > 15 && (
        <div className="mt-6 flex justify-center">
          <DefaultPagination
            totalItems={filteredBlogs.length}
            itemsPerPage={15}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Blog Sil</DialogTitle>
            <DialogDescription>
              {blogToDelete && (
                <>
                  <strong>"{blogToDelete.title}"</strong> başlıklı blog kalıcı
                  olarak silinecektir.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">İptal</Button>
            </DialogClose>
            <Button variant="destructive" disabled={isDeleting} onClick={handleDelete}>
              {isDeleting ? <Spinner className="w-4 h-4" /> : "Evet, Sil"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Blogları Sil</DialogTitle>
            <DialogDescription>
              <strong>{selectedIds.length} blog</strong> kalıcı olarak
              silinecektir. Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">İptal</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={isBulkDeleting}
              onClick={handleBulkDelete}
            >
              {isBulkDeleting ? <Spinner className="w-4 h-4" /> : "Evet, Sil"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
