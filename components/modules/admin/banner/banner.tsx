"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Eye } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

interface Banner {
  id: number;
  title: string;
  subtitle: string;
}

const BannerPreviewCard = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div className="relative w-full h-[240px] overflow-hidden bg-slate-900 border border-slate-200 rounded-sm">
    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
    <div className="relative h-full flex flex-col items-center justify-center text-center p-6">
      <span className="text-[8px] tracking-widest text-slate-400 uppercase mb-3 block">
        Önizleme
      </span>
      <h2 className="text-xl text-white font-serif leading-tight mb-3">
        {title.split("<br />").map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        )) || "Başlık Giriniz"}
      </h2>
      <p className="text-slate-400 text-xs max-w-[240px] leading-relaxed line-clamp-2">
        {subtitle || "Açıklama metni burada görünecek."}
      </p>
    </div>
  </div>
);

export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banner");
      const data = await res.json();
      if (res.ok) setBanners(data.banners);
    } catch (err) {
      toast.error("Veriler alınamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleAddBanner = async () => {
    if (!newTitle) return toast.error("Başlık boş olamaz.");
    setIsAdding(true);
    try {
      const res = await fetch("/api/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, subtitle: newSubtitle }),
      });
      const data = await res.json();
      if (res.ok) {
        setBanners((prev) => [...prev, data.banner]);
        setNewTitle("");
        setNewSubtitle("");
        toast.success("Banner eklendi.");
      }
    } catch (err) {
      toast.error("Ekleme başarısız.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;
    try {
      const res = await fetch(`/api/banner/${bannerToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== bannerToDelete));
        toast.success("Banner silindi.");
        setDeleteDialogOpen(false);
        setBannerToDelete(null);
      }
    } catch (err) {
      toast.error("Silme hatası.");
    }
  };

  return (
    <div
      className={`flex-1 bg-slate-50 min-h-screen p-6 sm:p-8 ${isMobile ? "mt-14" : ""}`}
    >
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Banner Yönetimi
        </h1>
        <p className="text-sm text-slate-600">
          Ana sayfa banner içeriklerini yönetin
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Editor */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-slate-200 sticky top-6 rounded-sm">
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Yeni Banner Ekle
                </h3>
              </div>

              {/* Live Preview */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-600 mb-2 block">
                  Canlı Önizleme
                </label>
                <BannerPreviewCard
                  title={newTitle || "Başlık Örneği"}
                  subtitle={newSubtitle || "Açıklama metni örneği."}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-2 block">
                    Başlık
                  </label>
                  <Input
                    placeholder="Örn: Yeni Koleksiyon"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="bg-slate-50 border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-2 block">
                    Alt Metin
                  </label>
                  <textarea
                    placeholder="Açıklama yazınız..."
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[100px] text-sm outline-none resize-none focus:border-slate-400 transition-colors"
                  />
                </div>

                <Button
                  onClick={handleAddBanner}
                  disabled={isAdding || !newTitle.trim()}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-full"
                >
                  {isAdding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Banner Ekle
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Banner List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Eye className="w-4 h-4" /> Aktif Bannerlar
            </h3>
          </div>

          {isLoading ? (
            <div className="h-64 flex items-center justify-center bg-white rounded border border-slate-200">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-sm">
              {banners.map((banner) => (
                <div key={banner.id} className="group relative rounded-sm">
                  <BannerPreviewCard
                    title={banner.title}
                    subtitle={banner.subtitle}
                  />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        setBannerToDelete(banner.id);
                        setDeleteDialogOpen(true);
                      }}
                      className="shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && banners.length === 0 && (
            <div className="h-64 flex items-center justify-center bg-white rounded border border-slate-200">
              <p className="text-sm text-slate-500">Henüz banner eklenmemiş</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Banner Sil</DialogTitle>
            <DialogDescription>
              Bu banner kalıcı olarak silinecektir. Devam etmek istiyor musunuz?
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
