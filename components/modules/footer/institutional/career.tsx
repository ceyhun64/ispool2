"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Send,
  FileText,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  HardHat,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function KariyerPage() {
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // Mail içeriğini oluşturuyoruz
    const emailContent = `
      YENİ KARİYER BAŞVURUSU
      ----------------------
      Aday Adı: ${formData.name}
      E-Posta: ${formData.email}
      Telefon: ${formData.phone}
      Hedef Pozisyon: ${formData.position}
      
      Aday Notu:
      ${formData.message}
    `;

    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients: ["ispoolofficial@gmail.com"], // Buraya başvuruların düşeceği maili yazın
          subject: `Yeni İş Başvurusu: ${formData.position} - ${formData.name}`,
          message: emailContent,
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        throw new Error("Mail gönderilemedi");
      }
    } catch (error) {
      console.error("Başvuru hatası:", error);
      setStatus("error");
      // 3 saniye sonra formu tekrar aktif et
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-orange-600 selection:text-white font-sans overflow-x-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative h-[50vh] md:h-[65vh] flex items-center justify-center overflow-hidden bg-slate-950 px-6">
        <div className="absolute inset-0 z-0">
          <img
            src="/about/3.jpg"
            alt="Endüstriyel Üretim"
            className="w-full h-full object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-slate-950/90" />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="h-[2px] w-12 bg-orange-600" />
              <span className="text-orange-500 font-black tracking-[0.4em] uppercase text-[10px] md:text-xs">
                Kariyer / Bizimle Çalışın
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase italic">
              EKİBİN <br />
              <span
                className="text-white/30"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)" } as any}
              >
                PARÇASI OL
              </span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* --- FORM & INFO SECTION --- */}
      <section className="py-20 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* SOL: DETAYLAR */}
          <div className="lg:col-span-5 space-y-10">
            <div className="sticky top-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest mb-6 italic">
                <span className="w-2 h-2 bg-white animate-pulse rounded-full" />
                Genel Başvuruya Açık
              </div>

              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-6">
                GELECEĞİN <br />{" "}
                <span className="text-orange-600">ENDÜSTRİSİNİ</span> KURUN
              </h2>

              <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8">
                Yeteneklerinizi sergilemek için spesifik bir ilan beklemenize
                gerek yok. Uzmanlık alanınızı yazın, vizyonumuzu birlikte
                büyütelim.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: <ShieldCheck size={20} />,
                    text: "İSG Odaklı Vizyon",
                  },
                  { icon: <Zap size={20} />, text: "Hızlı Kariyer Yolu" },
                  {
                    icon: <HardHat size={20} />,
                    text: "Teknik Eğitim Desteği",
                  },
                  {
                    icon: <Briefcase size={20} />,
                    text: "Kurumsal Yan Haklar",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 font-bold text-xs uppercase tracking-tight"
                  >
                    <span className="text-orange-600">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SAĞ: BAŞVURU FORMU */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 bg-slate-50 border-2 border-dashed border-orange-600"
                >
                  <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center text-white mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
                    Başvurunuz Alındı
                  </h3>
                  <p className="text-slate-500 max-w-sm mb-8">
                    İnsan kaynakları departmanımız profilinizi inceleyip sizinle
                    iletişime geçecektir.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-orange-600 hover:text-orange-700"
                  >
                    Yeni Başvuru Yap <ArrowRight size={16} />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white p-6 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.05)] border border-slate-100"
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          Ad Soyad
                        </label>
                        <input
                          required
                          type="text"
                          className="w-full bg-slate-50 border-0 p-4 text-sm font-bold focus:ring-2 focus:ring-orange-600 outline-none italic"
                          placeholder="AHMET YILMAZ"
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          E-Posta
                        </label>
                        <input
                          required
                          type="email"
                          className="w-full bg-slate-50 border-0 p-4 text-sm font-bold focus:ring-2 focus:ring-orange-600 outline-none italic"
                          placeholder="ornek@mail.com"
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          Telefon
                        </label>
                        <input
                          required
                          type="tel"
                          className="w-full bg-slate-50 border-0 p-4 text-sm font-bold focus:ring-2 focus:ring-orange-600 outline-none italic"
                          placeholder="05XX XXX XX XX"
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          Hedef Pozisyon
                        </label>
                        <input
                          required
                          type="text"
                          className="w-full bg-slate-50 border-0 p-4 text-sm font-bold focus:ring-2 focus:ring-orange-600 outline-none italic"
                          placeholder="Örn: Satış Uzmanı"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              position: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Notlar
                      </label>
                      <textarea
                        rows={4}
                        className="w-full bg-slate-50 border-0 p-4 text-sm font-bold focus:ring-2 focus:ring-orange-600 outline-none italic resize-none"
                        placeholder="Tecrübelerinizden bahsedin..."
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                      />
                    </div>

                    <button
                      disabled={status === "loading"}
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-orange-600 text-white font-black py-5 transition-all duration-500 uppercase tracking-[0.3em] flex items-center justify-center gap-4 group disabled:opacity-50"
                    >
                      {status === "loading" ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : status === "error" ? (
                        "Hata Oluştu!"
                      ) : (
                        <>
                          Başvuruyu Gönder{" "}
                          <Send
                            size={18}
                            className="group-hover:translate-x-2 transition-transform"
                          />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
