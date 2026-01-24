"use client";

import React from "react";
import {
  ShieldCheck,
  HardHat,
  Factory,
  Truck,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: "ÜSTÜN KORUMA",
    desc: "Uluslararası EN standartlarına tam uyumlu, yüksek mukavemetli ekipmanlar.",
  },
  {
    icon: Factory,
    title: "TEKNİK TEKSTİL",
    desc: "Nefes alabilen, yanmaz ve su itici özellikli akıllı kumaş teknolojileri.",
  },
  {
    icon: HardHat,
    title: "ERGONOMİK DİZAYN",
    desc: "Hareket özgürlüğünü kısıtlamayan, konfor odaklı profesyonel kesimler.",
  },
  {
    icon: Truck,
    title: "LOJİSTİK GÜÇ",
    desc: "Yüksek hacimli taleplerde hızlı termin ve kesintisiz tedarik zinciri.",
  },
];

const CardItem = ({ icon: Icon, title, desc, index }: any) => (
  <div className="group relative p-10 transition-all duration-700 bg-white hover:bg-[#0a0a0b] flex flex-col items-start text-left border-r border-slate-100 last:border-r-0 max-sm:border-b overflow-hidden">
    {/* Arka Plan Efekti */}
    <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

    {/* İkon Kutusu - Modern & Premium */}
    <div className="relative z-10 mb-10 p-4 rounded-none bg-slate-50 text-slate-900 transition-all duration-500 group-hover:bg-orange-600 group-hover:text-white ">
      <Icon className="w-6 h-6 stroke-[1.2]" />
    </div>

    {/* Metin İçeriği */}
    <div className="relative z-10 space-y-4 flex-1">
      <div className="flex items-center gap-3">
        <span className="w-8 h-[1px] bg-orange-600 transform origin-left group-hover:scale-x-150 transition-transform duration-500" />
        <h3 className="text-[10px] font-black text-slate-900 group-hover:text-white tracking-[0.25em] uppercase">
          {title}
        </h3>
      </div>
      <p className="text-[13px] text-slate-500 group-hover:text-slate-400 leading-relaxed font-medium max-w-[240px] transition-colors duration-500">
        {desc}
      </p>
    </div>

    {/* Alt Link - Daha Sofistike */}
   

    {/* Dekoratif Büyük Numara */}
    <span className="absolute -bottom-4 -right-2 text-7xl font-black text-slate-100 group-hover:text-white/[0.03] transition-colors duration-700 select-none pointer-events-none">
      0{index + 1}
    </span>

    {/* Köşe Detayı */}
    <div className="absolute top-0 right-0 w-0 h-0 border-t-[2px] border-r-[2px] border-orange-600 opacity-0 group-hover:opacity-100 group-hover:w-4 group-hover:h-4 transition-all duration-500" />
  </div>
);

export default function ShopServices() {
  return (
    <section className="py-24 bg-slate-100 relative overflow-hidden">
      {/* Premium Arka Plan Dokusu */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        {/* Header Alanı */}
        <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="max-w-2xl space-y-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              <span className="text-[9px] font-black tracking-[0.4em] text-orange-600 uppercase bg-orange-50 px-3 py-1">
                Kalıcı Güvenlik
              </span>
              <div className="h-[1px] flex-1 bg-slate-200 hidden md:block" />
            </motion.div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-900 leading-[1.1] uppercase">
              SAHA ŞARTLARINDA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">
                SIFIR TAVİZ.
              </span>
            </h2>
          </div>

          <div className="lg:max-w-[320px] border-l border-orange-600 pl-8 py-2">
            <p className="text-slate-500 font-semibold text-xs md:text-[13px] leading-relaxed italic">
              "İş sağlığı ve güvenliğini modern teknolojiyle birleştirerek,
              personelinize hak ettiği konforu sunuyoruz."
            </p>
          </div>
        </div>

        {/* Grid Yapısı - Havada Asılı Panel Etkisi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-none overflow-hidden border border-slate-100">
          {whyChooseUs.map((item, idx) => (
            <CardItem key={idx} index={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
