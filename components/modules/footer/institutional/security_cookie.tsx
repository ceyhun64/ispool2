"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Cookie, Cpu, Lock, Info, Mail } from "lucide-react";

export default function CookiePolicy() {
  const sections = [
    {
      title: "01. Çerez Nedir?",
      icon: <Cookie className="w-5 h-5 text-orange-600" />,
      content:
        "Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza depolanan küçük metin dosyalarıdır. Size daha kişiselleştirilmiş bir deneyim sunmak ve sitemizin performansını analiz etmek için kullanılır.",
    },
    {
      title: "02. Kullanım Amacımız",
      icon: <Cpu className="w-5 h-5 text-orange-600" />,
      content:
        "Sitemizde kullanılan çerezler; oturumunuzun güvenliğini sağlamak, dil tercihlerinizi hatırlamak ve alışveriş deneyiminizi optimize etmek amacıyla işlenmektedir. Üçüncü taraf çerezleri ise yalnızca anonim analizler için kullanılır.",
    },
    {
      title: "03. Çerez Yönetimi",
      icon: <Info className="w-5 h-5 text-orange-600" />,
      content:
        "Tarayıcı ayarlarınız üzerinden çerezleri dilediğiniz zaman engelleyebilir veya silebilirsiniz. Ancak çerezlerin devre dışı bırakılması, sitemizdeki bazı özelliklerin tam performansla çalışmasını engelleyebilir.",
    },
    {
      title: "04. Veri Güvenliği",
      icon: <Lock className="w-5 h-5 text-orange-600" />,
      content:
        "Çerezler aracılığıyla toplanan verileriniz, gizlilik politikamız doğrultusunda en yüksek güvenlik standartları ile korunmaktadır. Verileriniz asla üçüncü şahıslara satılmaz.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-orange-600 selection:text-white">
      {/* Endüstriyel Üst Şerit */}
      <div className="w-full h-2 bg-gradient-to-r from-slate-900 via-orange-600 to-slate-900" />

      <main className="flex-1 px-6 py-20 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          {/* Header Bölümü */}
          <header className="mb-24 relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-8 h-8 text-orange-600" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
                  Güvenlik Protokolü
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-slate-950 leading-none mb-8">
                Çerez <br />
                <span className="text-orange-600 drop-shadow-sm">
                  Politikası
                </span>
              </h1>
              <div className="flex flex-wrap items-center gap-6">
                <div className="h-0.5 w-16 bg-orange-600" />
                <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase leading-relaxed max-w-md">
                  Son Güncelleme: 07 Ocak 2026 — İşpool Endüstriyel <br />
                  Dijital deneyiminizi optimize etme ve gizliliğinizi koruma
                  standartlarımız.
                </p>
              </div>
            </motion.div>

            {/* Arka Plan Dekoratif Yazı */}
            <div className="absolute -top-10 -right-10 opacity-[0.03] select-none pointer-events-none hidden lg:block">
              <span className="text-[250px] font-black italic leading-none">
                COOKIE
              </span>
            </div>
          </header>

          {/* İçerik Bölümü - Endüstriyel Kartlar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {sections.map((section, index) => (
              <section
                key={index}
                className="group relative bg-white border border-slate-200 p-10 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-orange-500/50 transition-all duration-500 overflow-hidden"
              >
                {/* Numara Arka Planı */}
                <div className="absolute top-8 right-10 text-6xl font-black text-slate-50 opacity-[0.05] group-hover:text-orange-100 transition-colors">
                  {section.title.split(".")[0]}
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-500">
                    <div className="group-hover:text-white transition-colors">
                      {section.icon}
                    </div>
                  </div>

                  <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase italic">
                    {section.title}
                  </h2>

                  <p className="text-sm text-slate-500 font-medium leading-[1.8]">
                    {section.content}
                  </p>
                </div>

                {/* Köşe Detayı */}
                <div className="absolute bottom-0 right-0 w-12 h-12 bg-slate-50 group-hover:bg-orange-50 transition-colors clip-path-slant" />
              </section>
            ))}
          </motion.div>

          {/* Footer - Bilgi Şeridi */}
          <footer className="mt-24 pt-16 border-t-2 border-slate-900 flex flex-col items-center gap-8">
            <div className="inline-flex items-center gap-4 bg-slate-950 text-white px-8 py-4 rounded-full shadow-2xl">
              <Mail className="w-4 h-4 text-orange-600" />
              <p className="text-[10px] font-black tracking-[0.2em] uppercase">
                Sorularınız için:{" "}
                <span className="text-orange-500">privacy@markaniz.com</span>
              </p>
            </div>

            <div className="flex gap-12">
              {["Güvenli Veri", "Şeffaf Politika", "Yasal Uyum"].map(
                (tag, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      {tag}
                    </span>
                  </div>
                ),
              )}
            </div>
          </footer>
        </div>
      </main>

      <style jsx>{`
        .clip-path-slant {
          clip-path: polygon(100% 0, 0% 100%, 100% 100%);
        }
      `}</style>
    </div>
  );
}
