"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/modules/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Layout,
  Type,
  AlertCircle,
  Sparkles,
  Eye,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface Banner {
  id: number;
  title: string;
  subtitle: string;
}

// --- Preview Component (Sitenin orijinal banner stiliyle uyumlu) ---
const BannerPreviewCard = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div className="relative w-full h-[240px] rounded-2xl overflow-hidden bg-[#0f0f0f] border border-slate-800 group-hover:border-slate-600 transition-all duration-500">
    {/* Arka Plan Efekti */}
    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
    <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[120%] bg-slate-400/10 rounded-full blur-[80px]" />

    <div className="relative h-full flex flex-col items-center justify-center text-center p-6">
      <span className="text-[7px] tracking-[0.4em] text-slate-500 uppercase mb-3 block font-medium">
        Önizleme Modu
      </span>
      <h2 className="text-xl md:text-2xl text-white font-serif leading-tight mb-3">
        {title.split("<br />").map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        )) || "Başlık Giriniz"}
      </h2>
      <p className="text-slate-400 text-[10px] font-light max-w-[240px] leading-relaxed line-clamp-2">
        {subtitle || "Açıklama metni burada görünecek."}
      </p>

      <div className="mt-5 px-4 py-2 border border-slate-800 text-[8px] tracking-[0.2em] text-slate-400 uppercase">
        Detayları İncele
      </div>
    </div>
  </div>
);

export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
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
        toast.success("Yayına alındı.");
      }
    } catch (err) {
      toast.error("Ekleme başarısız.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/banner/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
        toast.success("Kaldırıldı.");
      }
    } catch (err) {
      toast.error("Silme hatası.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] font-sans selection:bg-indigo-100">
      <Sidebar />
      <main
        className={`flex-1 p-6 lg:p-12 transition-all duration-300 ${
          isMobile ? "mt-14" : "md:ml-72"
        }`}
      >
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1 w-8 bg-indigo-600 rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Yönetim Paneli
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Ayarlar
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              İşletmenizin performansını gerçek zamanlı izleyin.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Sol Panel: Editör */}
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="font-bold text-slate-800">Canlı Düzenleyici</h2>
              </div>

              {/* Anlık Canlı Önizleme */}
              <div className="mb-6">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">
                  Anlık Görünüm
                </label>
                <BannerPreviewCard
                  title={newTitle || "Başlık Örneği"}
                  subtitle={newSubtitle || "Açıklama metni örneği."}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
                    Ana Başlık (HTML Destekler)
                  </label>
                  <Input
                    placeholder="Örn: Hayalinizdeki Salonu <br /> Beraber Tasarlayalım."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="h-12 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
                    Alt Metin
                  </label>
                  <textarea
                    placeholder="Rafine çözümler sunuyoruz..."
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl min-h-[100px] text-sm focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                  />
                </div>

                <Button
                  onClick={handleAddBanner}
                  disabled={isAdding || !newTitle.trim()}
                  className="w-full bg-black hover:bg-[#001e59] text-white h-12 rounded-2xl font-bold transition-all shadow-lg shadow-black/5"
                >
                  {isAdding ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Yayına Gönder"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Sağ Panel: Aktif Bannerlar */}
          <div className="xl:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Eye className="w-4 h-4" /> Yayındaki İçerikler
              </h3>
            </div>

            {isLoading ? (
              <div className="h-64 flex items-center justify-center bg-white rounded-3xl border border-slate-100">
                <Loader2 className="w-10 h-10 animate-spin text-slate-200" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map((banner) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={banner.id}
                    className="group relative"
                  >
                    <BannerPreviewCard
                      title={banner.title}
                      subtitle={banner.subtitle}
                    />

                    {/* Üstüne Binmiş Aksiyon Butonları */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="w-10 h-10 rounded-xl shadow-xl"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-3xl border-none shadow-2xl">
                          <DialogHeader className="items-center text-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                            <DialogTitle>Bu içeriği kaldıralım mı?</DialogTitle>
                            <DialogDescription>
                              Web sitesi anında güncellenecektir.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="sm:justify-center gap-3">
                            <Button variant="ghost" className="rounded-xl">
                              İptal
                            </Button>
                            <Button
                              variant="destructive"
                              className="rounded-xl px-8"
                              onClick={() => handleDelete(banner.id)}
                            >
                              Evet, Sil
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
