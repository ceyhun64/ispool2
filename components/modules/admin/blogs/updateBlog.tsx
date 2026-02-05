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
import { Edit3, Save, Loader2, ImageIcon } from "lucide-react";

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
      toast.success("Blog güncellendi");
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
          className="h-8 w-8 text-slate-400 hover:text-slate-900"
        >
          <Edit3 className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Blog Düzenle
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
                value={editedBlog.title}
                onChange={(e) =>
                  setEditedBlog({ ...editedBlog, title: e.target.value })
                }
                className="bg-slate-50 border-slate-200"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                Kategori
              </Label>
              <Input
                value={editedBlog.category}
                onChange={(e) =>
                  setEditedBlog({ ...editedBlog, category: e.target.value })
                }
                className="bg-slate-50 border-slate-200"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                Görsel URL
              </Label>
              <Input
                value={editedBlog.image}
                onChange={(e) =>
                  setEditedBlog({ ...editedBlog, image: e.target.value })
                }
                className="bg-slate-50 border-slate-200"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                İçerik
              </Label>
              <textarea
                value={editedBlog.content}
                onChange={(e) =>
                  setEditedBlog({ ...editedBlog, content: e.target.value })
                }
                className="w-full min-h-[200px] p-3 bg-slate-50 border border-slate-200 rounded text-sm outline-none resize-none focus:border-slate-400 transition-colors"
              />
              <p className="text-xs text-slate-500 mt-1">
                {editedBlog.content.length} karakter
              </p>
            </div>
          </div>

          {/* Preview Section */}
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-2 block">
              Önizleme
            </Label>
            <div className="bg-white border border-slate-200 rounded overflow-hidden">
              <div className="relative w-full aspect-video bg-slate-100">
                {editedBlog.image ? (
                  <Image
                    src={editedBlog.image}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-12 h-12 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  {editedBlog.category || "Kategori"}
                </span>
                <h4 className="font-bold text-slate-900 mt-2">
                  {editedBlog.title || "Başlık"}
                </h4>
                <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                  {editedBlog.content || "İçerik"}
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
            onClick={handleSave}
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Kaydet
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
