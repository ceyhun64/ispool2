"use client";
import React, { useState } from "react";

const KurumsalKariyer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "Kocaeli Mağaza - Satış",
    message: "",
  });

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 pb-20 selection:bg-amber-100">
      {/* Hero Section - Premium Modern Görünüm */}
      <section className="relative h-[60vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070"
            alt="Premium Workwear"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <span className="text-amber-500 font-bold tracking-[0.3em] uppercase text-sm mb-4 block">
              Geleceği Birlikte Dikiyoruz
            </span>
            <h1 className="text-5xl md:text-7xl font-light text-white leading-tight mb-6">
              Profesyoneller İçin <br />
              <span className="font-bold text-amber-500">Premium Koruma</span>
            </h1>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              İsmont ailesi olarak sadece iş kıyafeti üretmiyoruz; her dikişte
              güvenlik, konfor ve prestij sağlıyoruz. Sen de bu seçkin ekibin
              bir parçası olmak ister misin?
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Kolon: Pozisyon Detayı ve Örnekler */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 shadow-2xl  border border-slate-100">
              <div className="flex items-center gap-2 text-amber-600 mb-4">
                <span className="w-2 h-2 bg-amber-600  animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-widest">
                  Açık Pozisyon
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800">
                Kocaeli Mağaza - Satış & Pazarlama Temsilcisi
              </h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                İş dünyasının zirvesindeki markalara, yüksek teknolojili
                koruyucu ekipmanlarımızın sunumunu yapacak vizyoner takım
                arkadaşları arıyoruz.
              </p>

              <div className="space-y-4 border-t pt-6">
                <h4 className="font-bold text-sm text-slate-800 uppercase italic underline decoration-amber-500 underline-offset-4">
                  Neler Sunuyoruz?
                </h4>
                <ul className="text-xs text-slate-600 space-y-3">
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-amber-500 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Yüksek teknolojili akıllı kumaşlarla üretilmiş premium
                    koleksiyonların temsil yetkisi.
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-amber-500 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Sürekli gelişen İSG standartları üzerine profesyonel
                    eğitimler.
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-amber-500 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Modern ve prestijli bir çalışma ortamı.
                  </li>
                </ul>
              </div>
            </div>

            {/* Premium Ürün Örnekleri - Modern Kartlar */}
            <div className="bg-slate-900 text-white p-8  shadow-xl">
              <h4 className="text-lg font-bold mb-6 border-b border-slate-700 pb-2">
                Neler Üretiyoruz?
              </h4>
              <div className="space-y-6">
                <div className="group cursor-default">
                  <p className="text-amber-500 font-bold text-xs mb-1 uppercase tracking-tighter">
                    İleri Teknoloji
                  </p>
                  <p className="text-sm font-medium">
                    Nomex® Alev Almaz Üniformalar
                  </p>
                  <p className="text-xs text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity italic">
                    Isı ve ark patlamalarına karşı tam koruma.
                  </p>
                </div>
                <div className="group cursor-default">
                  <p className="text-amber-500 font-bold text-xs mb-1 uppercase tracking-tighter">
                    Endüstriyel Tasarım
                  </p>
                  <p className="text-sm font-medium">
                    Gore-Tex® Su Geçirmez Dış Giyim
                  </p>
                  <p className="text-xs text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity italic">
                    Nefes alabilen, ekstrem koşul dayanımı.
                  </p>
                </div>
                <div className="group cursor-default">
                  <p className="text-amber-500 font-bold text-xs mb-1 uppercase tracking-tighter">
                    Mühendislik
                  </p>
                  <p className="text-sm font-medium">
                    S3 Kompozit Burunlu Güvenlik Ayakkabıları
                  </p>
                  <p className="text-xs text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity italic">
                    Hafiflik ve maksimum darbe emilimi bir arada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Modern Başvuru Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 shadow-2xl  border border-slate-100">
              <div className="mb-10 text-center">
                <h3 className="text-3xl font-bold text-slate-800 mb-2">
                  Hızlı Başvuru Formu
                </h3>
                <p className="text-slate-500">
                  Geleceğin profesyonel dünyasına ilk adımı atın.
                </p>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Adınız Soyadınız
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Ahmet Yılmaz"
                    className="w-full bg-slate-50 border-none  p-4 text-sm focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    E-Posta Adresi
                  </label>
                  <input
                    type="email"
                    placeholder="ahmet@email.com"
                    className="w-full bg-slate-50 border-none  p-4 text-sm focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    placeholder="05xx xxx xx xx"
                    className="w-full bg-slate-50 border-none  p-4 text-sm focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Pozisyon
                  </label>
                  <select className="w-full bg-slate-50 border-none  p-4 text-sm focus:ring-2 focus:ring-amber-500 transition-all outline-none appearance-none">
                    <option>Kocaeli Mağaza - Satış Temsilcisi</option>
                    <option>Özel Üretim Tasarım Ekibi</option>
                    <option>Lojistik & Sevkiyat</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Özgeçmişiniz / Kısa Not
                  </label>
                  <textarea
                    placeholder="Bize kendinizden ve tecrübelerinizden bahsedin..."
                    className="w-full bg-slate-50 border-none  p-4 text-sm focus:ring-2 focus:ring-amber-500 transition-all outline-none resize-none"
                  ></textarea>
                </div>

                <div className="md:col-span-2 flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="kvkk"
                    className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4"
                  />
                  <label
                    htmlFor="kvkk"
                    className="text-[10px] text-slate-400 leading-tight"
                  >
                    KVKK kapsamında verilerimin işlenmesini ve tarafımla
                    iletişime geçilmesini kabul ediyorum.
                  </label>
                </div>

                <div className="md:col-span-2">
                  <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4  shadow-lg shadow-amber-200 transition-all transform hover:-translate-y-1 active:scale-[0.98] uppercase tracking-widest text-sm">
                    Başvuruyu Gönder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

   
    </div>
  );
};

export default KurumsalKariyer;
