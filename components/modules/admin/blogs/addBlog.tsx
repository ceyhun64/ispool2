"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Plus,
  Image as ImageIcon,
  Send,
  Tag,
  FileText,
  Sparkles,
} from "lucide-react";

interface AddBlogDialogProps {
  onAdd: (blog: any) => void;
}

export default function AddBlogDialog({ onAdd }: AddBlogDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setImageFile(null);
  };

  const handleAddBlog = async () => {
    if (!title || !content || !category || !imageFile) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("image", imageFile);

      const res = await fetch("/api/blog", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok) {
        onAdd(data.blog);
        resetForm();
        setOpen(false);
        toast.success("Blog yazısı yayına alındı.");
      } else {
        toast.error(data.message || "Bir hata oluştu.");
      }
    } catch (err) {
      toast.error("Sunucuya ulaşılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl px-4 sm:px-6 h-11 sm:h-12 shadow-lg shadow-indigo-200 transition-all hover:scale-105 flex items-center gap-2 font-semibold w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Yeni İçerik Ekle</span>
          <span className="sm:hidden">İçerik Ekle</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] lg:max-w-[1000px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white max-w-[95vw] max-h-[90vh] flex flex-col">
        <DialogHeader className="p-4 sm:p-6 bg-gradient-to-r from-white to-slate-50 border-b border-slate-100 flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                İçerik Oluştur
                <Sparkles className="w-4 h-4 text-indigo-500 hidden sm:inline" />
              </div>
              <p className="text-xs sm:text-sm font-normal text-slate-500 mt-0.5">
                Yeni blog yazısı ekleyin
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
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Yaratıcı bir başlık yazın..."
                  className="h-11 sm:h-12 rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm text-sm sm:text-base"
                />
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
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Eğitim, Teknoloji..."
                      className="pl-10 h-11 sm:h-12 rounded-xl border-slate-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-50 shadow-sm text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <div className="w-1 h-3 bg-emerald-500 rounded-full"></div>
                    Kapak Görseli
                  </Label>
                  <label className="flex items-center justify-center h-11 sm:h-12 px-4 border-2 border-dashed border-slate-300 rounded-xl hover:bg-gradient-to-br hover:from-slate-50 hover:to-white hover:border-indigo-400 cursor-pointer transition-all group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImageFile(e.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                    <ImageIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 mr-2 transition-colors flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-500 group-hover:text-indigo-600 truncate transition-colors">
                      {imageFile ? imageFile.name : "Görsel Seç"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
                  İçerik Metni
                </Label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Okuyucularınıza ne anlatmak istersiniz?"
                  className="w-full min-h-[200px] p-3 sm:p-4 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm text-sm sm:text-base outline-none resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                  <span>{content.length} karakter</span>
                  <span className="hidden sm:inline">
                    En az 50 karakter önerilir
                  </span>
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-2 p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-white flex flex-col">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
                Önizleme
              </Label>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col hover:shadow-xl transition-all group sticky top-0">
                <div className="relative w-full aspect-video bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-300">
                      <div className="w-12 h-12 bg-slate-200 rounded-2xl flex items-center justify-center mb-2">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        Görsel Bekleniyor
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg uppercase tracking-wide border border-indigo-200">
                    {category || "Kategori"}
                  </span>
                  <h4 className="font-bold text-slate-900 leading-tight line-clamp-2">
                    {title || "Blog Başlığı"}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-4 leading-relaxed">
                    {content || "İçerik önizlemesi burada görünecek..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-white border-t border-slate-100 flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="rounded-xl px-4 sm:px-6 font-semibold text-slate-600 hover:bg-slate-100 h-10 sm:h-11 order-2 sm:order-1 w-full sm:w-auto"
          >
            Vazgeç
          </Button>
          <Button
            onClick={handleAddBlog}
            disabled={loading || !title || !content || !category || !imageFile}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl px-6 sm:px-8 font-semibold shadow-lg shadow-indigo-200 transition-all h-10 sm:h-11 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 w-full sm:w-auto"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Yükleniyor...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Yayınla</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
