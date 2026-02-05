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
import { Plus, Image as ImageIcon, Send, Loader2 } from "lucide-react";

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
        toast.success("Blog eklendi.");
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
        <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-2 rounded-full">
          <Plus className="w-4 h-4" />
          Yeni Blog Ekle
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Yeni Blog Yazısı
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Form Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                Başlık
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Blog başlığı..."
                className="bg-slate-50 border-slate-200"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                Kategori
              </Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Örn: Teknoloji"
                className="bg-slate-50 border-slate-200"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                İçerik
              </Label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Blog içeriği..."
                className="w-full min-h-[200px] p-3 bg-slate-50 border border-slate-200 rounded text-sm outline-none resize-none focus:border-slate-400 transition-colors"
              />
              <p className="text-xs text-slate-500 mt-1">
                {content.length} karakter
              </p>
            </div>

            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                Kapak Görseli
              </Label>
              <label className="flex items-center justify-center h-12 px-4 border-2 border-dashed border-slate-300 rounded hover:border-slate-400 cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <ImageIcon className="w-4 h-4 text-slate-400 mr-2" />
                <span className="text-sm text-slate-600">
                  {imageFile ? imageFile.name : "Görsel Seç"}
                </span>
              </label>
            </div>
          </div>

          {/* Preview Section */}
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-2 block">
              Önizleme
            </Label>
            <div className="bg-white border border-slate-200 rounded overflow-hidden">
              <div className="relative w-full aspect-video bg-slate-100">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-12 h-12 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  {category || "Kategori"}
                </span>
                <h4 className="font-bold text-slate-900 mt-2">
                  {title || "Blog Başlığı"}
                </h4>
                <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                  {content || "İçerik önizlemesi..."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button
            onClick={handleAddBlog}
            disabled={loading || !title || !content || !category || !imageFile}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Yükleniyor...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Yayınla
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
