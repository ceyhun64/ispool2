"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  ArrowUpRight,
  Shield,
  HardHat,
  Construction,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

// --- YARDIMCI BİLEŞENLER ---

const SectionTitle = ({
  subtitle,
  title,
}: {
  subtitle: string;
  title: string;
}) => (
  <div className="space-y-4 mb-16 relative">
    <div className="flex items-center gap-3">
      <div className="h-[2px] w-8 bg-orange-600" />
      <span className="text-[11px] tracking-[0.4em] uppercase text-orange-600 font-black">
        {subtitle}
      </span>
    </div>
    <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-none tracking-tighter uppercase">
      {title}
    </h2>
  </div>
);

const ContentSection = ({
  title,
  text,
  image,
  alt,
  list,
  reverse,
}: {
  title: string;
  text?: string;
  image: string;
  alt: string;
  list?: string[];
  reverse: boolean;
}) => (
  <div
    className={`flex flex-col ${
      reverse ? "md:flex-row-reverse" : "md:flex-row"
    } gap-8 md:gap-16 items-stretch py-20`}
  >
    <div className="w-full md:w-1/2 overflow-hidden rounded-[2rem] bg-slate-200 relative group">
      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
      <Image
        src={image}
        alt={alt}
        width={1000}
        height={1200}
        className="w-full h-[450px] md:h-[600px] object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
      />
      {/* Endüstriyel Detay */}
      <div className="absolute bottom-6 left-6 z-20 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
        <Shield className="text-orange-600 w-5 h-5" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
          Premium Koruma
        </span>
      </div>
    </div>

    <div className="w-full md:w-1/2 flex flex-col justify-center space-y-8 px-4">
      <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
        {title}
      </h3>
      <div className="w-20 h-1.5 bg-orange-600" />
      <p className="text-slate-600 leading-relaxed font-medium text-base md:text-lg">
        {text}
      </p>
      {list && (
        <div className="grid grid-cols-1 gap-3 pt-4">
          {list.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-orange-500 transition-colors group"
            >
              <span className="text-xs font-black text-orange-600 bg-orange-50 w-8 h-8 flex items-center justify-center rounded-lg">
                0{i + 1}
              </span>
              <span className="font-bold text-slate-800 tracking-tight uppercase text-sm group-hover:translate-x-1 transition-transform">
                {item}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

// --- ANA BİLEŞEN ---

export default function AboutPage() {
  const sections = [
    {
      title: "Konfor ve Estetik",
      text: `İşPool, dış mekan yaşamında sessiz bir lüks anlayışını temsil eder. Modern tasarım anlayışımızla, bahçe mobilyalarını sadece birer eşya değil, açık havada geçen anlarınızı taçlandıran mimari öğeler olarak kurguluyoruz.`,
      image: "/about/1.webp",
      alt: "Endüstriyel iş kıyafeti detay",
      reverse: false,
    },
    {
      title: "Doğrudan Yaşam Alanınıza",
      text: `Üretimden doğrudan terasınıza. Karmaşık tedarik süreçlerini ortadan kaldırarak; iroko ahşabından paslanmaz alüminyuma kadar en yüksek kalite standartlarını dürüst bir modelle sunuyoruz. Her minder dikişinde kalite, her teslimatta güven odak noktamızdır.`,
      image: "/about/2.webp",
      alt: "İş güvenliği ekipmanı lojistik",
      reverse: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-orange-600 selection:text-white">
      {/* HERO SECTION - MODERN & TECH */}
      <header className="relative h-screen flex flex-col justify-center items-center px-6 overflow-hidden bg-slate-950">
        {/* Arka Plan Deseni */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-orange-600/10 via-transparent to-slate-950 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl space-y-8 relative z-10 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
            <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
            <span className="text-[10px] tracking-[0.6em] uppercase text-white font-bold">
              Est. 2026 — Gaziantep / Pro Edition
            </span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black tracking-[ -0.05em] leading-[0.85] text-white uppercase italic">
            Gökyüzü Altında <br />
            <span className="text-orange-600 drop-shadow-[0_0_30px_rgba(234,88,12,0.3)]">
              Konforun Formu
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium leading-relaxed pt-6">
            İşPool, geleneksel zanaati modern materyallerle harmanlayarak bahçe
            ve balkonlarınızı yaşayan birer huzur alanına dönüştürür.
          </p>
        </motion.div>

        <div className="absolute bottom-12 flex flex-col items-center gap-4">
          <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em]">
            Keşfet
          </span>
          <div className="w-px h-20 bg-gradient-to-b from-orange-600 to-transparent" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-32">
        {/* HİKAYE BÖLÜMLERİ */}
        <section className="space-y-12">
          {sections.map((sec, idx) => (
            <ContentSection key={idx} {...sec} />
          ))}
        </section>

        {/* ÖZET DEĞERLER - MODERN KARTLAR */}
        <section className="py-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              t: "Materyal Gücü",
              d: "UV ışınlarına ve suya dayanıklı premium kumaşlar, uzun ömürlü iskeletler.",
              icon: <Shield />,
            },
            {
              t: "Özgünlük",
              d: "Mekanınıza özel ölçü seçenekleri ve geniş renk kartelası.",
              icon: <Construction />,
            },
            {
              t: "Sürdürülebilirlik",
              d: "Doğa dostu ahşap kaynakları ve nesiller boyu kullanılacak dayanıklılık.",
              icon: <HardHat />,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="w-14 h-14 bg-slate-950 text-orange-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-500">
                {item.icon}
              </div>
              <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-4 italic">
                0{i + 1}. {item.t}
              </h4>
              <p className="text-slate-500 font-medium text-base leading-relaxed">
                {item.d}
              </p>
            </div>
          ))}
        </section>

        {/* İLETİŞİM - INDUSTRIAL GRID */}
        <section className="pt-24 border-t-4 border-slate-950">
          <SectionTitle subtitle="Bize Ulaşın" title="Bir Hayaliniz mi Var?" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Phone,
                label: "Telefon",
                val: "+90 546 225 56 59",
                href: "tel:+905462255659",
              },
              {
                icon: Mail,
                label: "E-Posta",
                val: "balkoluxofficial@gmail.com",
                href: "mailto:balkoluxofficial@gmail.com",
              },
              {
                icon: Instagram,
                label: "Sosyal Medya",
                val: "@ispool",
                href: "https://www.instagram.com/ispool",
              },
              {
                icon: MapPin,
                label: "Showroom",
                val: "Çukurova/Adana",
                href: "#",
              },
            ].map((item, i) => (
              <a
                href={item.href}
                key={i}
                className="group flex flex-col justify-between p-8 bg-white border border-slate-100 rounded-3xl hover:bg-slate-950 transition-all duration-500 h-48"
              >
                <div className="flex justify-between items-start">
                  <item.icon className="w-8 h-8 text-orange-600" />
                  <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-orange-600 transition-colors" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">
                    {item.label}
                  </span>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-white transition-colors truncate">
                    {item.val}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER STRIP */}
      <footer className="bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-slate-500 tracking-[0.5em] font-black uppercase">
            © 2026 İşpool Industrial & Safety
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
              Güvenlik
            </span>
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
              Kalite
            </span>
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
              Performans
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
