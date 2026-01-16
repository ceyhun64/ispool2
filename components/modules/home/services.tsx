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
    desc: "Yüksek hacimli taleplerde hızlı termin ve kesintisiz tedarik slateiri.",
  },
];

const CardItem = ({ icon: Icon, title, desc, index }: any) => (
  <div className="group relative p-8 transition-all duration-500 bg-white flex flex-col items-start text-left border-r border-slate-100 last:border-r-0 max-sm:border-b">
    {/* Küçük İkon Kutusu */}
    <div className="mb-8 p-2.5 rounded-lg bg-slate-50 text-slate-900 transition-all duration-500 group-hover:bg-orange-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-100">
      <Icon className="w-6 h-6 stroke-[1.5]" />
    </div>

    {/* Metin İçeriği */}
    <div className="space-y-3 flex-1">
      <h3 className="text-[11px] font-bold text-slate-900 tracking-[0.15em] uppercase flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
        {title}
      </h3>
      <p className="text-[13px] text-slate-500 leading-relaxed font-normal max-w-[220px]">
        {desc}
      </p>
    </div>

    {/* Alt Detay - Daha Kibar */}
    <div className="mt-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center text-[10px] font-bold text-orange-600 tracking-widest uppercase">
      Detaylar <ChevronRight className="w-3 h-3 ml-1" />
    </div>

    {/* Numara Arka Plan - Küçültüldü */}
    <span className="absolute top-6 right-8 text-2xl font-bold text-slate-50 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity italic">
      0{index + 1}
    </span>

    {/* Vurgu Çizgisi */}
    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-orange-600 group-hover:w-full transition-all duration-500" />
  </div>
);

export default function ShopServices() {
  return (
    <section className="py-20 bg-slate-100 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Başlık Alanı - Boyutlar Küçültüldü */}
        <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="h-[1.5px] w-8 bg-orange-600" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-orange-600 uppercase">
                Endüstriyel Çözümler
              </span>
            </motion.div>
            <h2 className="text-2xl md:text-2xl font-bold text-slate-900 tracking-tight leading-tight uppercase">
              SAHA ŞARTLARINDA <br />
              <span className="text-slate-400">Sıfır Taviz.</span>
            </h2>
          </div>

          <div className="lg:max-w-[280px] border-l-2 border-slate-900 pl-5 py-1">
            <p className="text-slate-600 font-medium text-xs leading-relaxed">
              İş sağlığı ve güvenliğini modern teknolojiyle birleştirerek,
              personelinize hak ettiği konforu sunuyoruz.
            </p>
          </div>
        </div>

        {/* Grid Yapısı */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 shadow-xl shadow-slate-200/40 rounded-lg overflow-hidden border border-slate-100">
          {whyChooseUs.map((item, idx) => (
            <CardItem key={idx} index={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
