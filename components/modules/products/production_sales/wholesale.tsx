"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

const ToptanSatisPremium = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    details: "",
  });

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
    setIsLoading(true);
    try {
      const response = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: ["ispoolofficial@gmail.com"],
          subject: `Toplu Satış Talep: ${formData.company}`,
          message: `Ad: ${formData.name}\nŞirket: ${formData.company}\nE-posta: ${formData.email}\nTel: ${formData.phone}\n\nDetay:\n${formData.details}`,
        }),
      });

      if (response.ok) {
        toast.success("Talebiniz iletildi!");
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
      toast.error("Gönderilemedi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans text-slate-950 selection:bg-slate-900 selection:text-white overflow-x-hidden">
      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4">
          <div
            className="absolute inset-0 bg-slate-950/98 backdrop-blur-md"
            onClick={() => !isLoading && setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-2xl border-t-[8px] sm:border-t-[12px] border-amber-600 p-6 sm:p-10 md:p-16 shadow-2xl animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[95vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute rounded-sm top-4 right-4 text-slate-400 hover:text-slate-950 p-2 border border-slate-100"
            >
              <X size={18} />
            </button>

            <div className="mb-8">
              <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter leading-none mb-3">
                KURUMSAL <br className="hidden sm:block" /> TEKLİF TALEBİ
              </h3>
              <div className="h-1 w-16 bg-amber-600"></div>
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
                    className="w-full border-b rounded-sm border-slate-200 p-2 sm:p-3 focus:border-amber-600 outline-none font-bold text-sm bg-slate-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Şirket
                  </label>
                  <input
                    required
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full border-b rounded-sm border-slate-200 p-2 sm:p-3 focus:border-amber-600 outline-none font-bold text-sm bg-slate-50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    E-Posta
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border-b rounded-sm border-slate-200 p-2 sm:p-3 focus:border-amber-600 outline-none font-bold text-sm bg-slate-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    İrtibat No
                  </label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border-b rounded-sm border-slate-200 p-2 sm:p-3 focus:border-amber-600 outline-none font-bold text-sm bg-slate-50"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Detaylar
                </label>
                <textarea
                  required
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border-b rounded-sm border-slate-200 p-2 sm:p-3 focus:border-amber-600 outline-none font-bold text-sm bg-slate-50 resize-none"
                />
              </div>
              <button
                disabled={isLoading}
                className="w-full bg-slate-950 rounded-sm text-white py-4 sm:py-6 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "İSTEĞİ GÖNDER"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- HERO --- */}
      <section className="relative min-h-[80vh] md:h-[90vh] flex items-center bg-slate-950 py-20 md:py-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/wholesale/banner.avif"
            className="w-full h-full object-cover opacity-20 contrast-125 scale-110"
            alt="B2B"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6 sm:mb-10">
              <span className="w-8 sm:w-12 h-[2px] bg-amber-600"></span>
              <span className="text-amber-600 font-black tracking-[0.3em] text-[10px] sm:text-[12px] uppercase">
                B2B Industrial Solutions
              </span>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-[120px] font-black text-white leading-[0.9] mb-8 sm:mb-12 tracking-tighter uppercase italic">
              TOPLU <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)" } as any}
              >
                SATIŞ
              </span>
            </h1>
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
              <p className="text-slate-400 text-lg sm:text-xl font-light leading-relaxed max-w-xl border-l-4 border-amber-600 pl-6 sm:pl-8">
                Dünya standartlarında üretim parkurumuzla kurumsal kıyafet
                ihtiyaçlarınıza teknik çözümler üretiyoruz.
              </p>
              <div className="flex flex-col gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white rounded-sm text-slate-950 px-8 py-4 sm:px-12 sm:py-5 font-black uppercase text-xs tracking-widest hover:bg-amber-600 hover:text-white transition-all w-full sm:w-auto"
                >
                  Hızlı Teklif Al
                </button>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center sm:text-left">
                  Kapasite: 500.000+ Adet/Ay
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- OPERASYON --- */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 uppercase tracking-tighter mb-12 sm:mb-16">
            OPERASYONEL DİSİPLİN
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-slate-950">
            {[
              {
                id: "01",
                title: "SAHA ANALİZİ",
                desc: "Teknik riskler uzman kadromuzca yerinde tespit edilir.",
              },
              {
                id: "02",
                title: "TEKNİK ÇİZİM",
                desc: "Kurumsal kimliğinizi koruyan fonksiyonel tasarımlar.",
              },
              {
                id: "03",
                title: "SERİ ÜRETİM",
                desc: "Yüksek teknolojili tesislerde hatasız üretim.",
              },
              {
                id: "04",
                title: "GLOBAL SEVK",
                desc: "Kapıdan kapıya lojistik ağımızla güvenli teslimat.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 sm:p-12 border-b sm:border-b-0 sm:border-r border-slate-950 last:border-0 hover:bg-slate-950 hover:text-white transition-all duration-500 group"
              >
                <span className="text-amber-600 font-black text-xl block mb-6 italic">
                  {item.id} //
                </span>
                <h3 className="text-lg font-black mb-3 tracking-widest uppercase">
                  {item.title}
                </h3>
                <p className="text-slate-500 group-hover:text-slate-400 text-sm leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MARKA ENTEGRASYONU --- */}
      <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <div className="w-full lg:w-1/2 relative group">
              <div className="absolute -inset-2 sm:-inset-4 border-2 border-amber-600/20 translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700"></div>
              <img
                src="/wholesale/brands.jpg"
                className="relative z-10 w-full border border-slate-950 shadow-2xl"
                alt="Teknik"
              />
            </div>
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <span className="text-amber-600 font-black text-[10px] tracking-[0.4em] uppercase mb-4 block underline underline-offset-8">
                Özelleştirme Servisleri
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-950 mb-6 sm:mb-8 tracking-tighter uppercase leading-none">
                MARKA <br className="hidden sm:block" /> ENTEGRASYONU
              </h2>
              <p className="text-slate-600 text-base sm:text-lg mb-8 font-light leading-relaxed">
                Ürünlerinize kurumsal kimliğinizi en iyi yansıtacak baskı ve
                nakış teknolojilerini uyguluyoruz.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-10 text-left">
                <div className="border-l-2 border-slate-200 pl-4">
                  <h4 className="font-black text-slate-900 text-xs uppercase mb-1 tracking-widest">
                    Endüstriyel Nakış
                  </h4>
                  <p className="text-slate-500 text-[10px] uppercase">
                    Yüksek ısılı yıkamaya dayanıklı
                  </p>
                </div>
                <div className="border-l-2 border-slate-200 pl-4">
                  <h4 className="font-black text-slate-900 text-xs uppercase mb-1 tracking-widest">
                    DTF & Serigrafi
                  </h4>
                  <p className="text-slate-500 text-[10px] uppercase">
                    Esnek ve nefes alabilir doku
                  </p>
                </div>
              </div>
              <Link
                href="/help/printing"
                className="inline-block w-full sm:w-auto"
              >
                <button className="w-full rounded-sm sm:w-auto border-2 border-slate-950 px-10 py-4 font-black text-[10px] tracking-[0.3em] uppercase hover:bg-slate-950 hover:text-white transition-all">
                  Teknikleri İncele
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- ÇÖZÜM MERKEZİ --- */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-950 tracking-tighter uppercase leading-[0.8] text-center mb-12 md:mb-20">
              KURUMSAL <br /> ÇÖZÜM MERKEZİ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-slate-950">
              <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-950 text-center md:text-left">
                <span className="text-amber-600 font-black text-[10px] tracking-widest uppercase mb-2 block">
                  Direkt Hat
                </span>
                <p className="text-xl sm:text-2xl font-black text-slate-950">
                  +90 534 352 94 20
                </p>
              </div>
              <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-950 text-center md:text-left">
                <span className="text-amber-600 font-black text-[10px] tracking-widest uppercase mb-2 block">
                  E-Posta
                </span>
                <p className="text-lg sm:text-xl font-black text-slate-950 break-words uppercase">
                  ispoolofficial@gmail.com
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-amber-600 text-white p-8 md:p-12 hover:bg-slate-950 transition-all flex items-center justify-center gap-4 group"
              >
                <span className="text-sm font-black uppercase tracking-[0.3em]">
                  Teklif Formu
                </span>
                <span className="text-2xl group-hover:translate-x-2 transition-transform">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-10 text-center border-t border-white/10 px-6">
        <p className="text-slate-600 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.4em] leading-relaxed">
          İŞPOOL PROFESYONEL İŞ KIYAFETLERİ // TOPTAN SATIŞ DEPARTMANI 2026
        </p>
      </footer>
    </div>
  );
};

export default ToptanSatisPremium;
