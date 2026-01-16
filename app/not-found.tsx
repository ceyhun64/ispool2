"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-white text-[#0a0a0a] px-6 overflow-hidden">
      {/* Arka Plan Büyük Rakam Vurgusu */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <h2 className="text-[30vw] font-black tracking-tighter leading-none select-none">
          404
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* İkon */}
        <div className="w-16 h-16 mb-8  bg-slate-50 flex items-center justify-center text-orange-600">
          <Search size={32} strokeWidth={1.5} />
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-4 uppercase">
          Sayfa <span className="text-orange-600">Kayıp</span>
        </h1>

        <p className="text-slate-500 max-w-sm md:max-w-md font-medium text-sm md:text-base leading-relaxed mb-12">
          Aradığınız ürün veya içerik şantiyeden ayrılmış görünüyor. Profesyonel
          ekipmanlarımıza göz atmaya ne dersiniz?
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link
            href="/"
            className="group flex items-center gap-3 px-8 py-4 bg-[#0a0a0a] text-white  text-[11px] font-black tracking-[0.2em] uppercase transition-all hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-600/20 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Ana Sayfaya Dön
          </Link>

          <Link
            href="/products"
            className="text-[11px] font-black tracking-[0.2em] uppercase border-b-2 border-slate-200 pb-1 hover:border-orange-600 transition-colors"
          >
            Ürünleri İncele
          </Link>
        </div>
      </motion.div>

      {/* Alt Dekoratif Çizgi */}
      <div className="absolute bottom-10 w-full flex flex-col items-center opacity-20">
        <div className="h-[1px] w-24 bg-slate-300" />
      </div>
    </div>
  );
}
