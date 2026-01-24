"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  ArrowUpRight,
  Shield,
  Factory,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

// --- ANIMASYON DEĞERLERİ ---
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" },
};

// --- YARDIMCI BİLEŞEN: İSTATİSTİK KARTI ---
const StatItem = ({ val, label }: { val: string; label: string }) => (
  <div className="relative p-6 md:p-8 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 last:border-0 group overflow-hidden">
    <div className="absolute inset-0 bg-orange-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
    <div className="relative z-10">
      <p className="text-3xl md:text-5xl font-black text-slate-900 group-hover:text-white transition-colors duration-300 tracking-tighter">
        {val}
      </p>
      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 group-hover:text-orange-100 uppercase tracking-[0.2em] mt-2">
        {label}
      </p>
    </div>
  </div>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 selection:bg-orange-600 selection:text-white font-sans overflow-x-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950 px-6 py-20 md:py-0">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about/banner.jpg"
            alt="Endüstriyel Arka Plan"
            fill
            priority
            className="object-cover opacity-30 grayscale scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-white" />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-5xl"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <span className="h-[2px] w-8 md:w-12 bg-orange-600" />
              <span className="text-orange-500 font-black tracking-[0.3em] md:tracking-[0.5em] uppercase text-[10px] md:text-xs">
                Since 2026 / Endüstriyel Çözümler
              </span>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-[110px] lg:text-[130px] font-black text-white leading-[0.85] tracking-tighter uppercase italic">
              GÜVENİN <br />
              <span
                className="text-white/40"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" } as any}
              >
                MİMARI
              </span>
            </h1>
            <p className="mt-8 md:mt-12 text-slate-200 text-lg md:text-2xl font-light max-w-2xl leading-relaxed border-l-4 border-orange-600 pl-6 md:pl-8">
              İşPool Industrial, sadece korumak için değil, performansı en zorlu
              şartlarda{" "}
              <span className="text-white font-bold italic">"standart"</span>{" "}
              hale getirmek için üretir.
            </p>
          </motion.div>
        </div>

        {/* Dekoratif Yazı - Mobilde gizlendi */}
        <div className="absolute right-[-50px] bottom-20 hidden xl:block opacity-10">
          <p className="rotate-90 origin-right text-[150px] font-black text-white tracking-tighter uppercase select-none">
            INDUSTRIAL
          </p>
        </div>
      </section>

      {/* --- VİZYON SEKSİYONU --- */}
      <section className="py-20 md:py-32 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div className="lg:col-span-5 space-y-6 md:space-y-8">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              UŞAK'TAN <br />{" "}
              <span className="text-orange-600">DÜNYA STANDARTLARINA</span>
            </h2>
            <div className="h-2 w-20 md:w-24 bg-slate-900" />
            <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">
              İşPool Industrial, kuruluşundan bu yana iş sağlığı ve güvenliği
              alanında "geleneksel tedarikçi" kalıplarını yıkarak{" "}
              <span className="text-slate-900 underline decoration-orange-500 underline-offset-4 decoration-2">
                "çözüm ortağı"
              </span>{" "}
              kimliğiyle öne çıkmıştır.
            </p>
          </motion.div>

          <motion.div
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8"
          >
            <div className="p-8 md:p-10 bg-slate-900 text-white space-y-4 shadow-xl">
              <Shield className="w-10 h-10 md:w-12 md:h-12 text-orange-600" />
              <h4 className="text-xl font-black uppercase italic">
                Sıfır Hata Vizyonu
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Her bir dikiş, her bir lif personelin akşam ailesine sağ salim
                dönmesi sorumluluğunu taşır.
              </p>
            </div>
            <div className="p-8 md:p-10 bg-orange-600 text-white space-y-4 shadow-xl sm:mt-8 md:mt-12">
              <Factory className="w-10 h-10 md:w-12 md:h-12 text-slate-950" />
              <h4 className="text-xl font-black uppercase italic">
                Ar-Ge Merkezi
              </h4>
              <p className="text-orange-500 text-sm leading-relaxed bg-white/10 p-2 rounded">
                Güvenliği artıran akıllı tekstiller ve ergonomik kalıplar
                üzerine uzmanlaşıyoruz.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- İSTATİSTİK ŞERİDİ --- */}
      <section className="border-y border-slate-200 bg-white">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          <StatItem val="500K+" label="Yıllık Üretim" />
          <StatItem val="1200+" label="Kurumsal Partner" />
          <StatItem val="850+" label="Sertifikalı Ürün" />
          <StatItem val="81 İl" label="Lojistik Ağ" />
        </div>
      </section>

      {/* --- İÇERİK BÖLÜMLERİ --- */}
      <section className="py-20 md:py-32 space-y-24 md:space-y-40">
        {/* Bölüm 1 */}
        <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          <motion.div className="w-full lg:w-1/2 relative group">
            <div className="absolute -inset-2 md:-inset-4 border-2 border-orange-600 translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />
            <div className="relative aspect-video lg:aspect-square overflow-hidden bg-slate-200">
              <Image
                src="/about/3.jpg"
                alt="Teknik Üretim"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </motion.div>
          <motion.div className="w-full lg:w-1/2 space-y-6 md:space-y-8">
            <span className="text-orange-600 font-bold tracking-widest uppercase text-xs md:text-sm italic">
              01 // Defense
            </span>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9]">
              Güvenliğin Yeni <br className="hidden md:block" /> Standartı
            </h3>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed">
              Bizim için bir iş elbisesi sadece bir üniforma değildir;
              personelin fiziksel bütünlüğünü koruyan birinci hat savunma
              mekanizmasıdır.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Aşınmaya Dayanıklı",
                "Isı Optimizasyonu",
                "Yüksek Görünürlük",
                "Ergonomik Kesim",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 font-bold uppercase text-[11px] md:text-sm tracking-tight text-slate-800"
                >
                  <ChevronRight
                    size={16}
                    className="text-orange-600 shrink-0"
                  />{" "}
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bölüm 2 */}
        <div className="container mx-auto px-6 flex flex-col lg:flex-row-reverse gap-12 lg:gap-20 items-center">
          <motion.div className="w-full lg:w-1/2 relative group">
            <div className="absolute -inset-2 md:-inset-4 border-2 border-slate-900 -translate-x-4 translate-y-4 md:-translate-x-8 md:translate-y-8 group-hover:-translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />
            <div className="relative aspect-video lg:aspect-square overflow-hidden bg-slate-200">
              <Image
                src="/about/4.jpg"
                alt="Teknik Ekipman"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </motion.div>
          <motion.div className="w-full lg:w-1/2 space-y-6 md:space-y-8">
            <span className="text-orange-600 font-bold tracking-widest uppercase text-xs md:text-sm italic">
              02 // Supply
            </span>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9]">
              Uçtan Uca <br className="hidden md:block" /> Teknik Tedarik
            </h3>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed">
              Endüstriyel sahaların ihtiyacı olan teknik donanımı sağlamak,
              sadece ürün satışı değil bir mühendislik disiplinidir.
            </p>
            <ul className="space-y-3">
              {[
                "Risk Analizine Uygun KKD",
                "Kurumsal Markalama",
                "Hızlı Sevkiyat Güvencesi",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 font-bold uppercase text-[11px] md:text-sm tracking-tight text-slate-800"
                >
                  <ChevronRight
                    size={16}
                    className="text-orange-600 shrink-0"
                  />{" "}
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* --- İLETİŞİM PANELİ --- */}
      <section className="bg-slate-50 py-20 md:py-32 px-6">
        <div className="container mx-auto">
          <div className="mb-12 md:mb-20 text-center">
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 italic">
              BİZE <span className="text-orange-600">ULAŞIN</span>
            </h2>
            <p className="text-slate-400 font-bold tracking-[0.2em] md:tracking-[0.4em] uppercase text-[9px] md:text-xs">
              Toplu Tedarik ve Kurumsal İş Ortaklığı İçin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <a
              href="tel:+905462255659"
              className="group p-8 md:p-12 bg-white border border-slate-200 hover:bg-slate-900 transition-all duration-500"
            >
              <Phone className="text-orange-600 mb-6 group-hover:scale-110 transition-transform" />
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Telefon Hattı
              </h5>
              <p className="text-lg md:text-xl font-black group-hover:text-white transition-colors">
                +90 546 225 56 59
              </p>
            </a>
            <a
              href="mailto:ispoolofficial@gmail.com"
              className="group p-8 md:p-12 bg-white border border-slate-200 hover:bg-slate-900 transition-all duration-500"
            >
              <Mail className="text-orange-600 mb-6 group-hover:scale-110 transition-transform" />
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                E-Posta
              </h5>
              <p className="text-lg md:text-xl font-black group-hover:text-white transition-colors break-all">
                ispoolofficial@gmail.com
              </p>
            </a>
            <div className="group p-8 md:p-12 bg-white border border-slate-200 hover:bg-slate-900 transition-all duration-500">
              <MapPin className="text-orange-600 mb-6 group-hover:scale-110 transition-transform" />
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Merkez
              </h5>
              <p className="text-lg md:text-xl font-black group-hover:text-white transition-colors uppercase">
                Uşak / Türkiye
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 py-10 md:py-16 px-6 border-t border-white/5">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] md:text-[10px] text-slate-500 tracking-[0.2em] md:tracking-[0.4em] font-bold uppercase text-center md:text-left leading-relaxed">
            © 2026 İşpool Industrial & Safety / Koruyucu Ekipman Çözümleri
          </p>
          <div className="flex gap-6 md:gap-8">
            <Instagram className="w-5 h-5 text-slate-500 hover:text-orange-600 cursor-pointer transition-colors" />
            <ArrowUpRight className="w-5 h-5 text-slate-500 hover:text-orange-600 cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
