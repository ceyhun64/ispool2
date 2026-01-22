"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Sidebar from "@/components/modules/admin/sideBar";
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
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search, Trash2, BookOpen, Filter, Hash, Layers } from "lucide-react";

interface Blog {
  id: number;
  title: string;
  content: string;
  image: string;
  category: string;
}

const DeleteDialog = ({ onConfirm, trigger, title, description }: any) => (
  <Dialog>
    <DialogTrigger asChild>{trigger}</DialogTrigger>
    <DialogContent className="sm:max-w-[440px]  s border-none shadow-2xl p-6 sm:p-8 max-w-[92vw] mx-auto">
      <DialogHeader className="items-center text-center space-y-3 sm:space-y-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-50 to-red-100 text-red-500   flex items-center justify-center animate-bounce shadow-lg shadow-red-100">
          <Trash2 size={32} className="sm:w-10 sm:h-10" />
        </div>
        <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
          {title}
        </DialogTitle>
        <DialogDescription className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed">
          {description}
          <br />
          <span className="text-red-600 font-semibold">
            Bu işlem geri alınamaz.
          </span>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-3 sm:justify-center pt-2">
        <Button
          variant="ghost"
          className="flex-1 sm:flex-none  font-semibold text-slate-600 hover:bg-slate-100 h-11 sm:h-12 order-2 sm:order-1 min-w-[120px]"
        >
          Vazgeç
        </Button>
        <Button
          variant="destructive"
          className="flex-1 sm:flex-none  font-semibold h-11 sm:h-12 shadow-lg shadow-red-200 hover:shadow-xl order-1 sm:order-2 min-w-[120px] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          onClick={onConfirm}
        >
          Evet, Sil
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      toast.success("İçerik kaldırıldı.");
    }
  };

  const handleBulkDelete = async () => {
    toast.promise(
      Promise.all(
        selectedIds.map((id) => fetch(`/api/blog/${id}`, { method: "DELETE" }))
      ),
      {
        loading: "Siliniyor...",
        success: () => {
          setBlogs((prev) => prev.filter((b) => !selectedIds.includes(b.id)));
          setSelectedIds([]);
          return "Seçili içerikler silindi.";
        },
        error: "Bazı içerikler silinemedi.",
      }
    );
  };

  const filteredBlogs = blogs
    .filter((b) =>
      filter === "all"
        ? true
        : b.category.toLowerCase() === filter.toLowerCase()
    )
    .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * 15,
    currentPage * 15
  );

  const categories = Array.from(new Set(blogs.map((b) => b.category)));
  const totalBlogs = blogs.length;

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
                <div className="h-1 w-8 sm:w-10 bg-gradient-to-r from-indigo-600 to-indigo-400 "></div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">
                  Yönetim Paneli
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-2">
                Blog Yönetimi
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-2xl">
                Blog içeriklerinizi yönetin, düzenleyin ve performansı takip
                edin
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
              <DeleteDialog
                title="Toplu Silme"
                description={`${selectedIds.length} içerik kalıcı olarak silinecektir.`}
                onConfirm={handleBulkDelete}
                trigger={
                  <Button
                    disabled={selectedIds.length === 0}
                    className={`h-11 sm:h-12  px-4 sm:px-5 transition-all shadow-lg text-sm w-full sm:w-auto font-semibold ${
                      selectedIds.length > 0
                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-200"
                        : "bg-slate-100 text-slate-400 border border-slate-200 shadow-none cursor-not-allowed"
                    }`}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Seçilenleri Kaldır</span>
                    <span className="sm:hidden">Sil</span>
                    <span className="ml-1">({selectedIds.length})</span>
                  </Button>
                }
              />
              <AddBlogDialog onAdd={(newB) => setBlogs([...blogs, newB])} />
            </div>
          </div>
        </header>

        {/* Search & Filter Toolbar */}
        <div className="bg-white  shadow-sm border border-slate-100 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <Input
                placeholder="Yazı başlığı ile ara..."
                className="pl-10 sm:pl-12 h-11 sm:h-12 bg-slate-50 border-slate-200  focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm text-sm font-medium"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Category Filter */}
            <Select
              onValueChange={(val) => {
                setFilter(val);
                setCurrentPage(1);
              }}
              value={filter}
            >
              <SelectTrigger className="w-full sm:w-64 h-11 sm:h-12 bg-slate-50 border-slate-200  shadow-sm text-slate-700 font-semibold focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 text-sm transition-all">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <SelectValue placeholder="Kategori" />
                </div>
              </SelectTrigger>
              <SelectContent className=" border-slate-100 shadow-xl">
                <SelectItem value="all" className="font-medium ">
                  Tüm Kategoriler
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className="font-medium "
                  >
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Table - Desktop */}
        <div className="hidden lg:block bg-white  s border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-50/50 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-[0.12em] font-bold">
                  <th className="px-6 py-5 w-12">
                    <input
                      type="checkbox"
                      className="w-4 h-4  border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                      checked={
                        paginatedBlogs.length > 0 &&
                        selectedIds.length === paginatedBlogs.length
                      }
                      onChange={(e) =>
                        setSelectedIds(
                          e.target.checked
                            ? paginatedBlogs.map((b) => b.id)
                            : []
                        )
                      }
                    />
                  </th>
                  <th className="px-6 py-5">
                    <span className="flex items-center gap-2">
                      <Hash className="w-3 h-3" /> ID
                    </span>
                  </th>
                  <th className="px-6 py-5">BAŞLIK & İÇERİK</th>
                  <th className="px-6 py-5">
                    <span className="flex items-center gap-2">
                      <Layers className="w-3 h-3" /> KATEGORİ
                    </span>
                  </th>
                  <th className="px-6 py-5 text-right">EYLEMLER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {paginatedBlogs.map((blog, index) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      key={blog.id}
                      className={`group hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-transparent transition-all ${
                        selectedIds.includes(blog.id)
                          ? "bg-gradient-to-r from-indigo-50/50 to-transparent"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(blog.id)}
                          onChange={() =>
                            setSelectedIds((prev) =>
                              prev.includes(blog.id)
                                ? prev.filter((id) => id !== blog.id)
                                : [...prev, blog.id]
                            )
                          }
                          className="w-4 h-4  border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                        #{blog.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-[400px]">
                          <p className="font-semibold text-slate-900 truncate text-sm group-hover:text-indigo-600 transition-colors">
                            {blog.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {blog.content}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 hover:from-indigo-50 hover:to-indigo-100 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 shadow-none hover:shadow-sm  px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all">
                          {blog.category || "Genel"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <UpdateBlogDialog
                            blog={blog}
                            onUpdate={(updated) =>
                              setBlogs((prev) =>
                                prev.map((b) =>
                                  b.id === updated.id ? updated : b
                                )
                              )
                            }
                          />
                          <DeleteDialog
                            onConfirm={() => handleDelete(blog.id)}
                            trigger={
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100  transition-all border border-transparent hover:border-red-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            }
                            title="Yazıyı Sil"
                            description={`"${blog.title}" kalıcı olarak kaldırılacaktır.`}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {filteredBlogs.length === 0 && (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100  flex items-center justify-center mb-5">
                  <BookOpen
                    className="w-10 h-10 text-slate-300"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-slate-900 font-bold text-base mb-2">
                  Sonuç bulunamadı
                </h3>
                <p className="text-slate-400 text-sm max-w-sm">
                  Arama kriterlerinize uygun blog yazısı mevcut değil.
                  Filtreleri değiştirmeyi deneyin.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-3">
          <AnimatePresence mode="popLayout">
            {paginatedBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-white  p-4 shadow-md border transition-all ${
                  selectedIds.includes(blog.id)
                    ? "border-indigo-300 shadow-indigo-100 bg-gradient-to-br from-indigo-50/30 to-white"
                    : "border-slate-200 hover:shadow-lg hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(blog.id)}
                      onChange={() =>
                        setSelectedIds((prev) =>
                          prev.includes(blog.id)
                            ? prev.filter((id) => id !== blog.id)
                            : [...prev, blog.id]
                        )
                      }
                      className="w-5 h-5  border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 text-sm truncate">
                        {blog.title}
                      </p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        #{blog.id}
                      </p>
                    </div>
                  </div>
                </div>
                <Badge className="mb-2 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 text-[9px] font-bold uppercase px-2 py-0.5  flex-shrink-0 border border-slate-200">
                  {blog.category || "Genel"}
                </Badge>

                <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                  {blog.content}
                </p>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <UpdateBlogDialog
                    blog={blog}
                    onUpdate={(updated) =>
                      setBlogs((prev) =>
                        prev.map((b) => (b.id === updated.id ? updated : b))
                      )
                    }
                  />
                  <DeleteDialog
                    onConfirm={() => handleDelete(blog.id)}
                    trigger={
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-3 text-slate-400 hover:text-red-500 hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100  text-xs border border-transparent hover:border-red-200"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Sil
                      </Button>
                    }
                    title="Yazıyı Sil"
                    description={`"${blog.title}" kalıcı olarak kaldırılacaktır.`}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredBlogs.length === 0 && (
            <div className="py-16 flex flex-col items-center justify-center text-center bg-white  border border-slate-200">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-50 to-slate-100  flex items-center justify-center mb-3">
                <BookOpen className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-bold text-sm mb-2">
                Sonuç bulunamadı
              </h3>
              <p className="text-slate-400 text-xs max-w-xs px-4">
                Arama kriterlerinize uygun blog yazısı mevcut değil.
              </p>
            </div>
          )}
        </div>

        {/* Footer / Pagination */}
        {filteredBlogs.length > 15 && (
          <div className="mt-6 sm:mt-8 flex justify-center">
            <DefaultPagination
              totalItems={filteredBlogs.length}
              itemsPerPage={15}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {filteredBlogs.length > 0 && (
          <div className="mt-4 flex justify-center">
            <p className="text-xs text-slate-400 font-medium text-center">
              Toplam{" "}
              <strong className="text-slate-600">{filteredBlogs.length}</strong>{" "}
              içerikten{" "}
              <strong className="text-slate-600">
                {Math.min(filteredBlogs.length, 15)}
              </strong>{" "}
              tanesi gösteriliyor
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
