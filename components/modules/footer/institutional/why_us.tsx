"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Instagram,
  Phone,
  ShieldCheck,
  Zap,
  Cog,
  Activity,
  ChevronRight,
  HardHat,
  Truck,
  Factory,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

export default function WhyChooseUsPage() {
  const advantages = [
    {
      id: "01",
      title: "Atölyeden Doğrudan",
      icon: <Factory className="w-5 h-5" />, // İş elbiseleri üretimine uygun ikon
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
    <div className="bg-slate-50 text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      {/* 1. Hero Bölümü: Industrial Safety Focus */}
      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 md:pt-44 md:pb-28">
        {/* Teknik Çizim Arka Plan Deseni (Grid) */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy-light.png')] opacity-40 -z-10" />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 bg-slate-900 text-white rounded-none tracking-tighter">
            <span className="text-[10px] uppercase font-bold tracking-widest">
              ISO 9001:2025 Certified Production
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1] mb-8 text-slate-900 uppercase">
            Güvenliği <br />
            <span className="text-orange-600">Tasarımla</span> Birleştirin.
          </h1>

          <div className="flex flex-col md:flex-row md:items-start gap-12">
            <p className="text-base md:text-lg text-slate-600 max-w-xl leading-relaxed font-medium">
              İşPool, bahçe ve balkonları sadece birer alan değil; sessizliğin,
              kahkahaların ve anıların merkezine dönüştüren bir tasarım
              stüdyosudur.
            </p>
            <div className="flex items-center gap-4 py-2">
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900">12k+</p>
                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">
                  Teslimat
                </p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900">%100</p>
                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">
                  Güvenlik
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. Görsel: Teknik Standartlar */}
      <section className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative h-[45vh] md:h-[60vh] overflow-hidden rounded-sm shadow-2xl border-4 border-white"
        >
          <Image
            src="/why_us/3.webp"
            alt="Endüstriyel İş Güvenliği"
            fill
            className="object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute top-6 right-6 p-4 bg-orange-600 text-white font-black text-xs uppercase tracking-widest vertical-text">
            Premium Quality
          </div>
        </motion.div>
      </section>

      {/* 3. Avantajlar: Industrial Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
          {advantages.map((adv) => (
            <div
              key={adv.id}
              className="p-12 bg-white hover:bg-slate-50 transition-colors group"
            >
              <div className="text-orange-600 mb-8 transform group-hover:scale-110 transition-transform duration-300">
                {adv.icon}
              </div>
              <h3 className="text-sm font-black tracking-widest uppercase mb-4 text-slate-900">
                {adv.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium italic">
                "{adv.description}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. İkinci Görsel: Detay ve Dayanıklılık */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 relative h-[400px] md:h-[500px] overflow-hidden bg-slate-200">
            <Image
              src="/why_us/4.webp"
              alt="İş Güvenliği Ekipman Detayı"
              fill
              className="object-cover"
            />
            {/* Teknik ölçü çizgileri efekti */}
            <div className="absolute top-10 left-10 w-20 h-px bg-orange-600/50" />
            <div className="absolute top-10 left-10 w-px h-20 bg-orange-600/50" />
          </div>

          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black leading-[1.1] uppercase tracking-tighter text-slate-900">
              Her dikişte <br />
              <span className="bg-orange-600 text-white px-2">
                maksimum
              </span>{" "}
              koruma.
            </h2>

            <p className="text-slate-600 text-lg leading-relaxed font-medium border-l-4 border-slate-900 pl-6">
              Bizim için tasarım; en küçük dikişten, en büyük iskelete kadar
              uzanan bütünsel bir disiplindir. Ham maddeyi estetikle, estetiği
              konforla birleştiriyoruz.
            </p>

            <div className="pt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-orange-600" /> CE
                Standartları
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-orange-600" /> Yüksek
                Dayanım
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Kurumsal Footer / CTA */}
      <footer className="bg-slate-900 text-white py-24 px-6 border-t-8 border-orange-600">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HardHat className="text-orange-600 w-8 h-8" />
              <span className="text-xl font-black tracking-tighter uppercase">
                İşPool PPE
              </span>
            </div>
            <p className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Güvenli Yarınları <br /> İnşa Edelim.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto">
            <a
              href="tel:905462255659"
              className="flex items-center justify-between gap-8 bg-slate-800 p-6 hover:bg-slate-700 transition-all border border-slate-700"
            >
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-orange-600" />
                <span className="text-base font-bold uppercase tracking-widest">
                  +90 546 225 56 59
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </a>

            <a
              href="https://ispool.com"
              className="flex items-center justify-center gap-4 bg-orange-600 text-white p-6 hover:bg-orange-700 transition-all shadow-xl shadow-orange-900/20"
            >
              <span className="text-sm font-black uppercase tracking-[0.2em]">
                Endüstriyel Katalog
              </span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">
            © 2026 İşPool PPE & Workwear Solutions
          </p>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
              <Instagram className="w-4 h-4" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
