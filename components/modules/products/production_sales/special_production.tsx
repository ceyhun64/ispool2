"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, X, Send } from "lucide-react";

const OzelUretimPremium = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    details: "",
  });

  // Modal açıkken kaydırmayı engelle
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
          subject: `ÖZEL PROJE TALEBİ: ${formData.company}`,
          message: `
            PROJE DETAYLARI
            --------------------------
            Müşteri: ${formData.name}
            Şirket: ${formData.company}
            E-posta: ${formData.email}
            Telefon: ${formData.phone}
            
            Talep ve Adet Bilgisi:
            ${formData.details}
            --------------------------
            Bu talep Özel Üretim (Bespoke) sayfasından gönderilmiştir.
          `,
        }),
      });

      if (response.ok) {
        toast.success("Proje dosyanız başarıyla danışmanımıza iletildi.");
        setFormData({
          name: "",
          company: "",
          email: "",
          phone: "",
          details: "",
        });
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Gönderim sırasında bir hata oluştu.",
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Bağlantı hatası, lütfen tekrar deneyin.");
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
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-md"
            onClick={() => !isLoading && setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-2xl border-t-[8px] sm:border-t-[12px] border-amber-600 p-6 sm:p-10 md:p-16 shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[95vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute rounded-sm top-4 right-4 text-slate-400 hover:text-slate-950 p-2 border border-slate-100"
            >
              <X size={20} />
            </button>

            <div className="mb-8">
              <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter leading-none mb-3">
                ÖZEL PROJE <br /> BAŞLATIN
              </h3>
              <div className="h-1 w-16 bg-amber-600"></div>
            </div>

            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="AD SOYAD"
                  className="w-full border-b-2 rounded-sm border-slate-200 p-3 focus:border-amber-600 outline-none transition-colors font-bold text-sm uppercase bg-slate-50"
                />
                <input
                  required
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="ŞİRKET ÜNVANI"
                  className="w-full rounded-sm border-b-2 border-slate-200 p-3 focus:border-amber-600 outline-none transition-colors font-bold text-sm uppercase bg-slate-50"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email"
                  placeholder="E-POSTA"
                  className="w-full rounded-sm border-b-2 border-slate-200 p-3 focus:border-amber-600 outline-none transition-colors font-bold text-sm uppercase bg-slate-50"
                />
                <input
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  type="tel"
                  placeholder="İRTİBAT NO"
                  className="w-full rounded-sm border-b-2 border-slate-200 p-3 focus:border-amber-600 outline-none transition-colors font-bold text-sm uppercase bg-slate-50"
                />
              </div>
              <textarea
                required
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                placeholder="PROJE DETAYLARI VE ADET BİLGİSİ"
                rows={4}
                className="w-full rounded-sm border-b-2 border-slate-200 p-3 focus:border-amber-600 outline-none transition-colors font-bold text-sm uppercase bg-slate-50 resize-none"
              />
              <button
                disabled={isLoading}
                className="w-full rounded-sm bg-slate-950 text-white py-5 font-black uppercase text-xs tracking-[0.4em] hover:bg-amber-600 transition-all flex items-center justify-center gap-3 disabled:bg-slate-400"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    DANIŞMANA İLET <Send size={14} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[85vh] md:h-[90vh] flex items-center bg-slate-950 overflow-hidden py-20 md:py-0">
        <div className="absolute inset-0 z-0">
          <img
            src="/special_production/banner.jpg"
            className="w-full h-full object-cover opacity-20 contrast-150 scale-110"
            alt="Zanaat"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl">
            <div className="inline-flex items-center gap-4 mb-6 sm:mb-10">
              <span className="w-8 sm:w-12 h-[2px] bg-amber-600"></span>
              <span className="text-amber-600 font-black tracking-[0.4em] uppercase text-[10px] sm:text-[12px]">
                Bespoke Industrial Craft
              </span>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-[130px] font-black text-white leading-[0.9] mb-8 sm:mb-12 tracking-tighter uppercase italic">
              ÖZEL <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "2px #f59e0b" } as any}
              >
                ÜRETİM
              </span>
            </h1>
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
              <p className="text-slate-400 text-lg sm:text-xl font-light leading-relaxed max-w-2xl border-l-4 border-amber-600 pl-6 sm:pl-8">
                Standartların bittiği yerde vizyonunuz başlar. Markanızın
                DNA'sını kumaşa işliyor, tamamen size özel teknik çözümler
                üretiyoruz.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full rounded-sm sm:w-auto bg-white text-slate-950 px-10 py-5 sm:px-12 sm:py-6 font-black uppercase text-xs tracking-widest hover:bg-amber-600 hover:text-white transition-all shadow-xl"
              >
                PROJE BAŞLAT
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- SÜREÇ --- */}
      <section className="py-16 md:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-slate-950">
            {[
              {
                title: "KREATİF ANALİZ",
                desc: "Markanızın sahadaki fiziksel ihtiyaçlarını ve estetik kodlarını analiz ediyoruz.",
                img: "/special_production/creative.jpg",
              },
              {
                title: "MASTER NUMUNE",
                desc: "Seri üretim öncesi, mükemmel prototipi atölyemizde hazırlıyoruz.",
                img: "/special_production/master.jpg",
              },
              {
                title: "TEKNİK ENTEGRASYON",
                desc: "Logonuzu yüksek dayanımlı tekniklerle ürüne mühürlüyoruz.",
                img: "/special_production/tech.jpg",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="group border-b-2 md:border-b-0 md:border-r-2 last:border-0 border-slate-950 overflow-hidden"
              >
                <div className="h-[300px] sm:h-[400px] overflow-hidden">
                  <img
                    src={step.img}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                </div>
                <div className="p-8 sm:p-10 bg-white group-hover:bg-slate-950 group-hover:text-white transition-all">
                  <span className="text-amber-600 font-black text-3xl sm:text-4xl mb-4 block italic">
                    0{idx + 1}.
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black mb-4 uppercase tracking-tighter">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 group-hover:text-slate-400 text-sm font-light uppercase">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TEKNİK ÖZELLİKLER --- */}
      <section className="py-20 md:py-32 bg-slate-950 text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter italic mb-12 sm:mb-20">
            FONKSİYONEL <span className="text-amber-600">ÜSTÜNLÜK</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-white/10">
            {[
              { label: "ANTİSTATİK", sub: "ESD Koruma" },
              { label: "ALEV ALMAZ", sub: "FR Sertifikalı" },
              { label: "ASİT DİRENCİ", sub: "Kimyasal Bariyer" },
              { label: "YÜKSEK GÖRÜNÜM", sub: "EN ISO 20471" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-10 sm:p-16 border border-white/5 hover:bg-amber-600 hover:text-slate-950 transition-all cursor-default group"
              >
                <div className="h-1 w-12 bg-amber-600 group-hover:bg-slate-950 mb-8" />
                <h4 className="text-xl sm:text-2xl font-black uppercase mb-2">
                  {item.label}
                </h4>
                <p className="text-[10px] font-bold tracking-widest opacity-60 uppercase">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- İLETİŞİM --- */}
      <section className="py-20 md:py-32 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl sm:text-6xl md:text-8xl font-black text-slate-950 tracking-tighter uppercase leading-[0.8] mb-12 sm:mb-16">
              V.I.P <br /> ÇÖZÜM ORTAĞI
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 border-2 border-slate-950 shadow-2xl ">
              <a
                href="tel:+902164727300"
                className="bg-white p-10 sm:p-12 hover:bg-slate-950 hover:text-white transition-all group border-b-2 sm:border-b-0 sm:border-r-2 border-slate-950"
              >
                <span className="block text-[10px] font-black uppercase text-slate-400 group-hover:text-amber-600 mb-4">
                  DİREKT TELEFON
                </span>
                <span className="text-xl sm:text-2xl font-black">
                  +90 216 472 73 00
                </span>
              </a>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-amber-600  p-10 sm:p-12 text-slate-950 hover:bg-slate-950 hover:text-white transition-all group"
              >
                <span className="block text-[10px] font-black uppercase text-slate-900/60 group-hover:text-amber-600 mb-4">
                  TEKLİF FORMU
                </span>
                <span className="text-xl sm:text-2xl font-black uppercase tracking-tighter">
                  PROJE BAŞLATIN
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-12 text-center">
        <p className="text-slate-600 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.5em] px-6">
          İŞPOOL ÖZEL TASARIM ATÖLYESİ // BESPOKE PRODUCTION 2026
        </p>
      </footer>
    </div>
  );
};

export default OzelUretimPremium;
