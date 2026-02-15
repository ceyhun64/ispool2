"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Eye,
  Image as ImageIcon,
  X,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

// Schema'ya göre tipler
interface Banner {
  id: number;
  title: string | null;
  subtitle: string | null;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface HeroSlide {
  id: number;
  tag: string | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  desktopImage: string;
  mobileImage: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerPreviewCard = ({
  title,
  subtitle,
  image,
}: {
  title?: string | null;
  subtitle?: string | null;
  image?: string;
}) => (
  <div className="relative w-full h-[240px] overflow-hidden bg-slate-900 border border-slate-200 rounded-sm">
    {image ? (
      <Image
        src={image}
        alt={title || "Banner"}
        fill
        className="object-cover brightness-50"
      />
    ) : (
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
    )}
    <div className="relative h-full flex flex-col items-center justify-center text-center p-6">
      <span className="text-[8px] tracking-widest text-slate-400 uppercase mb-3 block">
        Önizleme
      </span>
      <h2 className="text-xl text-white font-serif leading-tight mb-3">
        {title || "Başlık Giriniz"}
      </h2>
      <p className="text-slate-400 text-xs max-w-[240px] leading-relaxed line-clamp-2">
        {subtitle || "Açıklama metni burada görünecek."}
      </p>
    </div>
  </div>
);

const HeroSlidePreviewCard = ({ slide }: { slide: Partial<HeroSlide> }) => (
  <div className="relative w-full h-[300px] overflow-hidden rounded-sm border border-slate-200">
    {slide.desktopImage && (
      <Image
        src={slide.desktopImage}
        alt={slide.title || "Hero Preview"}
        fill
        className="object-cover brightness-50"
      />
    )}
    <div className="absolute inset-0 p-6 flex flex-col justify-center">
      <span className="text-orange-500 text-xs font-bold mb-2">
        {slide.tag || "TAG"}
      </span>
      <h2 className="text-white text-2xl font-black mb-1">
        {slide.title || "Başlık"}
      </h2>
      <h3 className="text-orange-400 text-xl font-black mb-3">
        {slide.subtitle || "Alt Başlık"}
      </h3>
      <p className="text-slate-300 text-sm max-w-md line-clamp-2">
        {slide.description || "Açıklama metni..."}
      </p>
    </div>
  </div>
);

export default function HomePageManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "banner" | "hero";
    id: number;
  } | null>(null);
  const isMobile = useIsMobile();

  // Banner states
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string>("");

  // Hero states
  const [heroForm, setHeroForm] = useState({
    tag: "",
    title: "",
    subtitle: "",
    description: "",
    order: 0,
  });
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string>("");

  // Fetch data
  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banner");
      const data = await res.json();
      if (res.ok) setBanners(data.banners);
    } catch (err) {
      toast.error("Banner verileri alınamadı.");
    }
  };

  const fetchHeroSlides = async () => {
    try {
      const res = await fetch("/api/hero-slides");
      const data = await res.json();
      if (res.ok) setHeroSlides(data.slides);
    } catch (err) {
      toast.error("Hero slide verileri alınamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchHeroSlides();
  }, []);

  // Banner image handler
  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBannerImage = () => {
    setBannerImage(null);
    setBannerImagePreview("");
  };

  // Hero handlers
  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeHeroImage = () => {
    setHeroImage(null);
    setHeroImagePreview("");
  };

  // Banner ekleme - yeni banner eklenince eskiler silinir
  const handleAddBanner = async () => {
    if (!bannerImage) {
      return toast.error("Resim yüklemek zorunludur.");
    }

    setIsAdding(true);
    try {
      const formData = new FormData();
      if (newTitle.trim()) formData.append("title", newTitle.trim());
      if (newSubtitle.trim()) formData.append("subtitle", newSubtitle.trim());
      formData.append("image", bannerImage);

      const res = await fetch("/api/banner", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        // Mevcut tüm bannerları sil
        await Promise.all(
          banners.map((b) =>
            fetch(`/api/banner/${b.id}`, { method: "DELETE" }),
          ),
        );

        setBanners([data.banner]);
        setNewTitle("");
        setNewSubtitle("");
        setBannerImage(null);
        setBannerImagePreview("");
        toast.success("Banner eklendi, eski bannerlar silindi.");
      } else {
        toast.error(data.message || "Ekleme başarısız.");
      }
    } catch (err) {
      toast.error("Ekleme başarısız.");
    } finally {
      setIsAdding(false);
    }
  };

  // Hero slide ekleme - sadece resim zorunlu
  const handleAddHeroSlide = async () => {
    if (!heroImage) {
      return toast.error("Resim yüklemek zorunludur.");
    }

    setIsAdding(true);
    try {
      const formData = new FormData();
      if (heroForm.tag.trim()) formData.append("tag", heroForm.tag.trim());
      if (heroForm.title.trim())
        formData.append("title", heroForm.title.trim());
      if (heroForm.subtitle.trim())
        formData.append("subtitle", heroForm.subtitle.trim());
      if (heroForm.description.trim())
        formData.append("description", heroForm.description.trim());
      formData.append("order", heroForm.order.toString());
      formData.append("desktopImage", heroImage);

      const res = await fetch("/api/hero-slides", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setHeroSlides((prev) => [...prev, data.slide]);
        setHeroForm({
          tag: "",
          title: "",
          subtitle: "",
          description: "",
          order: 0,
        });
        setHeroImage(null);
        setHeroImagePreview("");
        toast.success("Hero slide eklendi.");
      } else {
        toast.error(data.message || "Ekleme başarısız.");
      }
    } catch (err) {
      toast.error("Ekleme başarısız.");
    } finally {
      setIsAdding(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const endpoint =
        itemToDelete.type === "banner"
          ? `/api/banner/${itemToDelete.id}`
          : `/api/admin/hero-slides/${itemToDelete.id}`;

      const res = await fetch(endpoint, { method: "DELETE" });

      if (res.ok) {
        if (itemToDelete.type === "banner") {
          setBanners((prev) => prev.filter((b) => b.id !== itemToDelete.id));
        } else {
          setHeroSlides((prev) => prev.filter((s) => s.id !== itemToDelete.id));
        }
        toast.success("Başarıyla silindi.");
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      }
    } catch (err) {
      toast.error("Silme hatası.");
    }
  };

  return (
    <div
      className={`flex-1 bg-slate-50 min-h-screen p-6 sm:p-8 ${isMobile ? "mt-14" : ""}`}
    >
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Ana Sayfa Yönetimi
        </h1>
        <p className="text-sm text-slate-600">
          Banner ve Hero slider içeriklerini yönetin
        </p>
      </header>

      <Tabs defaultValue="banner" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="banner">Banner Yönetimi</TabsTrigger>
          <TabsTrigger value="hero">Hero Slider Yönetimi</TabsTrigger>
        </TabsList>

        {/* BANNER TAB */}
        <TabsContent value="banner">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="bg-white border-slate-200 sticky top-6 rounded-sm">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">
                    Yeni Banner Ekle
                  </h3>

                  <div className="mb-4">
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">
                      Canlı Önizleme
                    </label>
                    <BannerPreviewCard
                      title={newTitle || null}
                      subtitle={newSubtitle || null}
                      image={bannerImagePreview}
                    />
                  </div>

                  <div className="space-y-4">
                    {/* Resim Yükleme Alanı - ZORUNLU */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-2 block">
                        Arka Plan Resmi <span className="text-red-500">*</span>
                      </label>

                      {bannerImagePreview ? (
                        <div className="relative">
                          <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-slate-200">
                            <Image
                              src={bannerImagePreview}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            onClick={removeBannerImage}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerImageChange}
                            className="hidden"
                            id="banner-image-upload"
                          />
                          <label
                            htmlFor="banner-image-upload"
                            className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-slate-400 cursor-pointer transition-colors"
                          >
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              Resim Seçin
                            </span>
                          </label>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-2 block">
                        Başlık (Opsiyonel)
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
                        Alt Metin (Opsiyonel)
                      </label>
                      <textarea
                        placeholder="Açıklama yazınız..."
                        value={newSubtitle}
                        onChange={(e) => setNewSubtitle(e.target.value)}
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[100px] text-sm outline-none resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleAddBanner}
                      disabled={isAdding || !bannerImage}
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

            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Aktif Bannerlar
                </h3>
              </div>

              {isLoading ? (
                <div className="h-64 flex items-center justify-center bg-white rounded border">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {banners.map((banner) => (
                    <div key={banner.id} className="group relative">
                      <BannerPreviewCard
                        title={banner.title}
                        subtitle={banner.subtitle}
                        image={banner.image}
                      />
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => {
                            setItemToDelete({ type: "banner", id: banner.id });
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* HERO TAB */}
        <TabsContent value="hero">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="bg-white border-slate-200 sticky top-6 rounded-sm">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">
                    Yeni Hero Slide Ekle
                  </h3>

                  <div className="mb-4">
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">
                      Canlı Önizleme
                    </label>
                    <HeroSlidePreviewCard
                      slide={{
                        tag: heroForm.tag || null,
                        title: heroForm.title || null,
                        subtitle: heroForm.subtitle || null,
                        description: heroForm.description || null,
                        desktopImage: heroImagePreview,
                      }}
                    />
                  </div>

                  <div className="space-y-4">
                    {/* Resim Yükleme - ZORUNLU */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-2 block">
                        Resim Yükle <span className="text-red-500">*</span>
                      </label>
                      {heroImagePreview ? (
                        <div className="relative">
                          <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-slate-200">
                            <Image
                              src={heroImagePreview}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            onClick={removeHeroImage}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleHeroImageChange}
                            className="hidden"
                            id="hero-image-upload"
                          />
                          <label
                            htmlFor="hero-image-upload"
                            className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-slate-400 cursor-pointer transition-colors"
                          >
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              Resim Seçin
                            </span>
                          </label>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-2 block">
                        Tag (Opsiyonel)
                      </label>
                      <Input
                        placeholder="PRO-TECH SERİSİ 2026"
                        value={heroForm.tag}
                        onChange={(e) =>
                          setHeroForm({ ...heroForm, tag: e.target.value })
                        }
                        className="bg-slate-50 border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-2 block">
                        Başlık (Opsiyonel)
                      </label>
                      <Input
                        placeholder="Üst Düzey Şantiye"
                        value={heroForm.title}
                        onChange={(e) =>
                          setHeroForm({ ...heroForm, title: e.target.value })
                        }
                        className="bg-slate-50 border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-2 block">
                        Alt Başlık (Opsiyonel)
                      </label>
                      <Input
                        placeholder="Performansı"
                        value={heroForm.subtitle}
                        onChange={(e) =>
                          setHeroForm({ ...heroForm, subtitle: e.target.value })
                        }
                        className="bg-slate-50 border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-2 block">
                        Açıklama (Opsiyonel)
                      </label>
                      <textarea
                        placeholder="Detaylı açıklama..."
                        value={heroForm.description}
                        onChange={(e) =>
                          setHeroForm({
                            ...heroForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[100px] text-sm outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-2 block">
                        Sıralama
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={heroForm.order}
                        onChange={(e) =>
                          setHeroForm({
                            ...heroForm,
                            order: parseInt(e.target.value) || 0,
                          })
                        }
                        className="bg-slate-50 border-slate-200 rounded-xl"
                      />
                    </div>

                    <Button
                      onClick={handleAddHeroSlide}
                      disabled={isAdding || !heroImage}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-full"
                    >
                      {isAdding ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Hero Slide Ekle
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Aktif Hero Slides
                </h3>
              </div>

              {isLoading ? (
                <div className="h-64 flex items-center justify-center bg-white rounded border">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {heroSlides.map((slide) => (
                    <div key={slide.id} className="group relative">
                      <HeroSlidePreviewCard slide={slide} />
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => {
                            setItemToDelete({ type: "hero", id: slide.id });
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-white text-xs font-bold">
                          Sıra: {slide.order}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Silme Onayı</DialogTitle>
            <DialogDescription>
              Bu içerik kalıcı olarak silinecektir. Devam etmek istiyor musunuz?
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
