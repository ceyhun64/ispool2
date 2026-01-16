"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";
import {
  Edit3,
  Save,
  Layout,
  Type,
  Tag,
  ImageIcon,
  Sparkles,
} from "lucide-react";

interface Blog {
  id: number;
  title: string;
  content: string;
  image: string;
  category: string;
}

interface UpdateBlogDialogProps {
  blog: Blog;
  onUpdate: (updated: Blog) => void;
}

export default function UpdateBlogDialog({
  blog,
  onUpdate,
}: UpdateBlogDialogProps) {
  const [editedBlog, setEditedBlog] = useState<Blog>(blog);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) setEditedBlog(blog);
  }, [open, blog]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blog/${blog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedBlog),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Güncelleme başarısız");

      onUpdate(data.blog);
      toast.success("İçerik başarıyla güncellendi");
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-9 sm:w-9 text-slate-400 hover:text-indigo-600 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-indigo-100 rounded-xl transition-all border border-transparent hover:border-indigo-200"
        >
          <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] lg:max-w-[1000px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white max-w-[95vw] max-h-[90vh] flex flex-col">
        <DialogHeader className="p-4 sm:p-6 bg-gradient-to-r from-white to-slate-50 border-b border-slate-100 flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <Layout className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                İçeriği Düzenle
                <Sparkles className="w-4 h-4 text-indigo-500 hidden sm:inline" />
              </div>
              <p className="text-xs sm:text-sm font-normal text-slate-500 mt-0.5">
                Blog yazısını güncelleyin
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Form Area */}
            <div className="lg:col-span-3 p-4 sm:p-6 space-y-4 sm:space-y-5 bg-white border-r border-slate-50">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
                  Başlık
                </Label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    value={editedBlog.title}
                    onChange={(e) =>
                      setEditedBlog({ ...editedBlog, title: e.target.value })
                    }
                    className="pl-10 h-11 sm:h-12 rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <div className="w-1 h-3 bg-amber-500 rounded-full"></div>
                    Kategori
                  </Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      value={editedBlog.category}
                      onChange={(e) =>
                        setEditedBlog({
                          ...editedBlog,
                          category: e.target.value,
                        })
                      }
                      className="pl-10 h-11 sm:h-12 rounded-xl border-slate-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-50 shadow-sm text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <div className="w-1 h-3 bg-emerald-500 rounded-full"></div>
                    Görsel URL
                  </Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      value={editedBlog.image}
                      onChange={(e) =>
                        setEditedBlog({ ...editedBlog, image: e.target.value })
                      }
                      className="pl-10 h-11 sm:h-12 rounded-xl border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 shadow-sm font-mono text-xs"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
                  İçerik Metni
                </Label>
                <textarea
                  value={editedBlog.content}
                  onChange={(e) =>
                    setEditedBlog({ ...editedBlog, content: e.target.value })
                  }
                  className="w-full min-h-[200px] p-3 sm:p-4 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm text-sm sm:text-base outline-none resize-none leading-relaxed text-slate-700"
                />
                <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                  <span>{editedBlog.content.length} karakter</span>
                  <span className="hidden sm:inline">
                    Değişiklikler otomatik kaydedilmez
                  </span>
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-2 p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-white flex flex-col items-center">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-4 self-start flex items-center gap-2">
                <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
                Önizleme
              </Label>

              <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col group hover:shadow-2xl transition-all sticky top-0">
                <div className="relative w-full aspect-video bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
                  {editedBlog.image ? (
                    <Image
                      src={editedBlog.image}
                      alt="Preview"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <ImageIcon className="w-8 h-8 opacity-50 mb-2" />
                      <span className="text-[10px] font-medium">
                        Görsel URL girilmedi
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg uppercase tracking-wide border border-indigo-200">
                    {editedBlog.category || "Kategori"}
                  </span>
                  <h4 className="font-bold text-slate-900 leading-tight line-clamp-2">
                    {editedBlog.title || "Başlık Yazılmadı"}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-4 leading-relaxed">
                    {editedBlog.content || "İçerik henüz eklenmedi..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-white border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 flex-shrink-0">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="rounded-xl px-4 sm:px-6 font-semibold text-slate-600 hover:bg-slate-100 h-10 sm:h-11 order-2 sm:order-1 w-full sm:w-auto"
          >
            Vazgeç
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl px-6 sm:px-8 font-semibold shadow-lg shadow-indigo-200 flex items-center gap-2 h-10 sm:h-11 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 w-full sm:w-auto"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Kaydediliyor...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Değişiklikleri Kaydet</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
