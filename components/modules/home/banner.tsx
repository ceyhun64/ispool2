"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  ShieldCheck,
  Factory,
  Gauge,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface BannerData {
  title: string;
  subtitle: string;
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

  const defaultContent: BannerData = {
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

  const activeContent = {
    title: banner?.title || defaultContent.title,
    subtitle: banner?.subtitle || defaultContent.subtitle,
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
              className="absolute rounded-sm top-4 right-4 text-slate-400 hover:text-slate-950 p-2 border border-slate-100 disabled:opacity-50"
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
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
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
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
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
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
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
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
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
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
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
      <section className="relative w-full min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden bg-[#0a0a0b] py-20 border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0a0a0b_100%)] z-10" />
          <motion.div
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] z-0"
          />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-600/50 to-transparent z-20" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-30">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
              {/* Üst Bilgi Rozeti */}
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

              {/* Ana Başlık */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl lg:text-5xl text-white font-black leading-[1] tracking-[-0.04em] uppercase"
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

              {/* Alt Metin */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative max-w-2xl"
              >
                <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-orange-600 hidden md:block" />
                <p className="text-slate-400 text-sm md:text-lg font-medium leading-relaxed md:text-left text-center px-4 md:px-0">
                  {activeContent.subtitle}
                </p>
              </motion.div>

              {/* Aksiyon Butonları */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
              >
                <Link
                  href="/products"
                  className="group rounded-sm relative flex items-center justify-center gap-4 px-10 py-5 bg-orange-600 hover:bg-white transition-all duration-500 shadow-[0_0_30px_rgba(234,88,12,0.2)]"
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
                  className="group rounded-sm flex items-center justify-center gap-4 px-10 py-5 border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-500"
                >
                  <span className="text-[11px] tracking-[0.2em] uppercase text-slate-300 group-hover:text-white font-black">
                    Kurumsal Teklif Al
                  </span>
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Dekoratif Fabrika İkonu */}
        <div className="absolute left-[-5%] bottom-[-10%] opacity-[0.03] select-none pointer-events-none">
          <Factory size={500} className="text-white -rotate-12" />
        </div>

        {/* Alt Bilgi Barı */}
        <div className="absolute bottom-12 left-0 w-full hidden lg:block">
          <div className="container mx-auto px-12 flex justify-between items-center opacity-40">
            <div className="flex gap-12 text-[10px] tracking-[0.3em] font-bold text-white uppercase">
              <span>ISO 9001:2015 Sertifikalı</span>
              <span>Global Lojistik Desteği</span>
              <span>Doğa Dostu Üretim</span>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-[1px] bg-orange-600 self-center" />
              <span className="text-[10px] text-orange-600 font-bold tracking-widest uppercase">
                Premium Seri
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
