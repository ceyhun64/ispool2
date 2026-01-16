"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  ArrowRight,
  Instagram,
  Phone,
  ShieldCheck,
  Zap,
  Cog,
  Activity,
} from "lucide-react";
import Image from "next/image";

export default function WhyChooseUsPage() {
  const advantages = [
    {
      id: "01",
      title: "Atölyeden Doğrudan",
      icon: <Cog className="w-5 h-5" />,
      description:
        "Aracıları ortadan kaldıran şeffaf üretim süreciyle, zanaatkarlığı fabrikadan balkonunuza taşıyoruz.",
    },
    {
      id: "02",
      title: "Dört Mevsim Formu",
      icon: <ShieldCheck className="w-5 h-5" />,
      description:
        "UV korumalı dokular ve paslanmaz iskeletler ile estetiği doğa şartlarına karşı koruyoruz.",
    },
    {
      id: "03",
      title: "Antropometrik Konfor",
      icon: <Activity className="w-5 h-5" />,
      description:
        "Vücut ergonomisine uyumlu eğimler ve yüksek yoğunluklu minderler ile konforu standartlaştırıyoruz.",
    },
    {
      id: "04",
      title: "Sürdürülebilir Tercihler",
      icon: <Zap className="w-5 h-5" />,
      description:
        "Sertifikalı iroko ahşabı ve geri dönüştürülebilir bileşenler ile doğaya olan borcumuzu ödüyoruz.",
    },
  ];

  return (
    <div className="bg-[#0f1115] text-white font-sans selection:bg-orange-500/30">
      {/* 1. Hero Bölümü: Industrial Impact */}
      <section className="max-w-7xl mx-auto px-6 pt-40 pb-24 relative overflow-hidden">
        {/* Dekoratif Arka Plan Elementi */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-orange-600/10 blur-[120px]  -z-10" />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-orange-600" />
            <span className="text-[11px] tracking-[0.5em] uppercase text-orange-500 font-black">
              Küratörlük & Zanaat
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-10 uppercase italic">
            Dış mekanı <br />
            <span className="text-transparent stroke-white stroke-1 opacity-40">
              yeniden
            </span>{" "}
            hayal edin.
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed font-medium">
            İşPool, bahçe ve balkonları sadece birer alan değil; sessizliğin,
            kahkahaların ve anıların merkezine dönüştüren bir tasarım
            stüdyosudur.
          </p>
        </motion.div>
      </section>

      {/* 2. Büyük Görsel: Parallax Effect Frame */}
      <section className="px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-7xl mx-auto h-[40vh] md:h-[75vh] relative overflow-hidden  border border-white/10 shadow-2xl"
        >
          <Image
            src="/why_us/1.webp"
            alt="Endüstriyel Güvenlik ve Tasarım"
            fill
            className="object-cover scale-110 hover:scale-100 duration-[2s] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-transparent to-transparent opacity-60" />
        </motion.div>
      </section>

      {/* 3. Avantajlar: Technical Grid */}
      <section className="max-w-7xl mx-auto px-6 py-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((adv) => (
            <motion.div
              key={adv.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-white/5 border border-white/5  hover:bg-white/10 hover:border-orange-500/50 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 text-8xl font-black text-white/[0.02] group-hover:text-orange-500/[0.05] transition-colors">
                {adv.id}
              </div>

              <div className="w-12 h-12 bg-orange-600  flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(234,88,12,0.4)] group-hover:scale-110 transition-transform">
                {adv.icon}
              </div>

              <h3 className="text-xl font-bold tracking-tight uppercase mb-4 text-white">
                {adv.title}
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                {adv.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. İkinci Görsel Blok: Brutalist Layout */}
      <section className="max-w-7xl mx-auto px-6 pb-40 grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
        <div className="md:col-span-7 relative h-[300px] md:h-[600px]  overflow-hidden group">
          <Image
            src="/why_us/2.webp"
            alt="İş Kıyafeti Detay ve Teknoloji"
            fill
            className="object-cover transition-transform duration-700 group-hover:rotate-1 group-hover:scale-105"
          />
          <div className="absolute inset-0 border-[16px] border-[#0f1115] " />
        </div>

        <div className="md:col-span-5 space-y-10">
          <div className="inline-block px-4 py-1 bg-orange-600/10 border border-orange-600/20  text-orange-500 text-[10px] font-black uppercase tracking-widest">
            Mühendislik & Estetik
          </div>
          <h2 className="text-4xl md:text-6xl font-black leading-[0.9] uppercase italic tracking-tighter text-white">
            Her detayın bir <br />{" "}
            <span className="text-orange-600">anlamı</span> var.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            Bizim için tasarım; en küçük dikişten, en büyük iskelete kadar
            uzanan bütünsel bir disiplindir. Ham maddeyi estetikle, estetiği
            konforla birleştiriyoruz.
          </p>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10  border-4 border-[#0f1115] bg-slate-800 flex items-center justify-center text-[10px] font-bold"
                >
                  PRO
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-orange-500 font-black">
                Takipte Kalın
              </span>
              <span className="text-sm font-bold text-white">
                @balkolux_design
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Modern Footer / CTA: High-Vis Design */}
      <footer className="bg-white text-slate-950 py-32 px-6 ">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-[11px] tracking-[0.6em] uppercase text-orange-600 font-black">
              İletişime Geçin
            </h4>
            <p className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
              Yeni bir hikayeye <br /> başlayalım.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
            <a
              href="tel:905462255659"
              className="group flex items-center justify-center gap-4 bg-slate-100 px-10 py-6  hover:bg-slate-200 transition-all border border-slate-200"
            >
              <Phone className="w-5 h-5 text-orange-600" />
              <span className="text-lg font-black tracking-tighter uppercase">
                +90 546 225 56 59
              </span>
            </a>

            <a
              href="https://ispool.com"
              className="group flex items-center justify-center gap-4 bg-orange-600 text-white px-10 py-6  hover:bg-slate-900 transition-all shadow-[0_20px_40px_rgba(234,88,12,0.3)]"
            >
              <span className="text-sm uppercase tracking-[0.2em] font-black italic">
                Koleksiyonu Keşfet
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
