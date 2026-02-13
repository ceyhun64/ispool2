"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, ChevronRight, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

interface BannerData {
  id: number;
  title: string | null;
  subtitle: string | null;
  image: string;
  isActive: boolean;
}

export default function Banner() {
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    details: "",
  });

  const defaultContent = {
    title: "SAHA ŞARTLARINDA ÜSTÜN KORUMA PERFORMANSI",
    subtitle:
      "Uluslararası standartlarda sertifikalandırılmış teknik tekstil ve iş güvenliği ekipmanlarıyla iş gücünüzü en yüksek seviyede güvence altına alıyoruz.",
  };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch("/api/banner");
        const data = await res.json();
        if (data.banners && data.banners.length > 0) {
          setBanner(data.banners[0]);
        }
      } catch (error) {
        console.error("Banner hatası:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanner();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isModalOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormLoading(true);
    try {
      const response = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: ["ispoolofficial@gmail.com"],
          subject: `Kurumsal Teklif Talebi: ${formData.company}`,
          message: `Ad Soyad: ${formData.name}\nŞirket: ${formData.company}\nE-posta: ${formData.email}\nTelefon: ${formData.phone}\n\nDetaylar:\n${formData.details}`,
        }),
      });

      if (response.ok) {
        toast.success(
          "Talebiniz başarıyla iletildi! En kısa sürede size dönüş yapacağız.",
        );
        setIsModalOpen(false);
        setFormData({
          name: "",
          company: "",
          email: "",
          phone: "",
          details: "",
        });
      } else {
        throw new Error("Hata oluştu.");
      }
    } catch (error) {
      toast.error("Talep gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setIsFormLoading(false);
    }
  };

  const hasImage = banner?.image;
  const hasText = banner?.title || banner?.subtitle;
  const shouldShowDefaultText = !hasImage && !hasText;

  const activeContent = {
    title:
      shouldShowDefaultText || hasText
        ? banner?.title || defaultContent.title
        : "",
    subtitle:
      shouldShowDefaultText || hasText
        ? banner?.subtitle || defaultContent.subtitle
        : "",
  };

  if (isLoading) {
    return (
      <Skeleton className="w-full h-[60vh] md:h-[75vh] rounded-none bg-slate-950" />
    );
  }

  return (
    <>
      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4">
          <div
            className="absolute inset-0 bg-slate-950/98 backdrop-blur-md"
            onClick={() => !isFormLoading && setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-2xl border-t-[8px] sm:border-t-[12px] border-orange-600 p-6 sm:p-10 md:p-16 shadow-2xl animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[95vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              disabled={isFormLoading}
              className="absolute rounded-sm top-4 right-4 text-slate-500 hover:text-slate-950 p-2 border border-slate-100 disabled:opacity-50"
            >
              <X size={18} />
            </button>

            <div className="mb-8">
              <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter leading-none mb-3">
                KURUMSAL <br className="hidden sm:block" /> TEKLİF TALEBİ
              </h3>
              <div className="h-1 w-16 bg-orange-600"></div>
            </div>

            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    Ad Soyad
                  </label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isFormLoading}
                    className="w-full border-b border-slate-200 p-2 sm:p-3 focus:border-orange-600 outline-none font-bold text-sm bg-slate-50 disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    Şirket Adı
                  </label>
                  <input
                    required
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    disabled={isFormLoading}
                    className="w-full border-b border-slate-200 p-2 sm:p-3 focus:border-orange-600 outline-none font-bold text-sm bg-slate-50 disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    E-Posta Adresi
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isFormLoading}
                    className="w-full border-b border-slate-200 p-2 sm:p-3 focus:border-orange-600 outline-none font-bold text-sm bg-slate-50 disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    İletişim Numarası
                  </label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isFormLoading}
                    className="w-full border-b border-slate-200 p-2 sm:p-3 focus:border-orange-600 outline-none font-bold text-sm bg-slate-50 disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  Detaylar ve İhtiyaçlarınız
                </label>
                <textarea
                  required
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  disabled={isFormLoading}
                  rows={4}
                  placeholder="Ürün türü, adet, baskı/nakış tercihleri vb..."
                  className="w-full border-b border-slate-200 p-2 sm:p-3 focus:border-orange-600 outline-none font-bold text-sm bg-slate-50 resize-none disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={isFormLoading}
                className="w-full rounded-sm bg-slate-950 text-white py-4 sm:py-6 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFormLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    GÖNDERİLİYOR...
                  </>
                ) : (
                  "TALEBİ GÖNDER"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BANNER SECTION */}
      <section className="relative w-full min-h-[80vh] md:min-h-[85vh] flex items-stretch overflow-hidden bg-[#0a0a0b] border-b border-white/5">
        {/* Background Image */}
        {hasImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={banner.image}
              alt={banner.title || "Banner"}
              fill
              priority
              className="object-cover brightness-100"
            />
          </div>
        )}

        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />

          <motion.div
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] z-0"
          />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-30 flex flex-col py-16 md:py-24">
          <div className="max-w-5xl mx-auto w-full flex flex-col flex-1">
            <div className="flex flex-col items-center text-center h-full flex-1">
              {/* ÜST BÖLÜM: Rozet ve Başlıklar */}
              <div className="flex flex-col items-center space-y-6 md:space-y-8">
                {activeContent.title && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-4 px-4 py-2 border border-white/10 bg-white/5 backdrop-blur-md"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-orange-600" />
                      <span className="text-[9px] md:text-[10px] tracking-[0.4em] text-white uppercase font-black">
                        Üst Düzey Güvenlik Standartları
                      </span>
                    </div>
                    <div className="w-[1px] h-3 bg-white/20" />
                    <span className="text-[9px] md:text-[10px] tracking-[0.4em] text-orange-500 uppercase font-black">
                      v2.0 2026
                    </span>
                  </motion.div>
                )}

                {activeContent.title && (
                  <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-3xl lg:text-6xl text-white font-black leading-[1.1] tracking-[-0.04em] uppercase max-w-4xl"
                  >
                    {activeContent.title.split(" ").map((word, i) => (
                      <span key={i} className="inline-block mr-3 md:mr-5">
                        <span
                          className={
                            i === 2 ? "text-orange-600 italic" : "text-white"
                          }
                        >
                          {word}
                        </span>
                      </span>
                    ))}
                  </motion.h1>
                )}

                {activeContent.subtitle && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative max-w-2xl mt-4"
                  >
                    <p className="text-slate-300 text-sm md:text-lg font-medium leading-relaxed px-4">
                      {activeContent.subtitle}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* ORTA BÖLÜM: Esnek boşluk butonları aşağı iter */}
              <div className="flex-1 min-h-[100px]" />

              {/* ALT BÖLÜM: Aksiyon Butonları */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto mt-auto pt-8"
              >
                <Link
                  href="/products"
                  className="group rounded-sm relative flex items-center justify-center gap-4 px-12 py-5 bg-orange-700 hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(234,88,12,0.3)]"
                >
                  <span className="text-[11px] tracking-[0.2em] uppercase text-white group-hover:text-black font-black">
                    Koleksiyonu Keşfet
                  </span>
                  <ChevronRight
                    className="text-white group-hover:text-black group-hover:translate-x-1 transition-transform"
                    size={16}
                  />
                </Link>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group rounded-sm flex items-center justify-center gap-4 px-12 py-5 border border-white/20 bg-black/40 hover:bg-white/10 backdrop-blur-md transition-all duration-500"
                >
                  <span className="text-[11px] tracking-[0.2em] uppercase text-slate-200 group-hover:text-white font-black">
                    Kurumsal Teklif Al
                  </span>
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
