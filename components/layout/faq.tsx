"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Minimal & Estetik SSS (FAQ) Bölümü
 * Odak: Tipografi, Negatif Alan ve Akışkan Geçişler
 */
export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Dış hava koşullarına dayanıklılık standartlarınız nelerdir?",
      answer:
        "Tüm ürünlerimiz dört mevsim koşullarına uyum sağlayacak şekilde; elektrostatik fırın boyalı metaller, UV korumalı sentetik rattanlar ve su itici outdoor tekstil ürünleri ile donatılmıştır.",
    },
    {
      question: "Kurulum ve montaj süreci nasıl işliyor?",
      answer:
        "Güvenli sevkiyat adına yarı-demonte gönderilen ürünlerimiz, özel bir teknik bilgi gerektirmeden ortalama 15 dakika içinde kurulabilir. İstanbul ve çevre illerde profesyonel montaj ekibimiz opsiyonel olarak destek vermektedir.",
    },
    {
      question: "Lojistik ve katınıza teslimat imkanı var mı?",
      answer:
        "Mobilya taşımacılığında uzmanlaşmış özel lojistik partnerlerimiz ile ürünlerinizi sadece kapınıza değil, balkon veya bahçenizdeki kullanım alanına kadar titizlikle taşıyoruz.",
    },
    {
      question: "Kış aylarında bakım ve koruma önerileriniz nelerdir?",
      answer:
        "Ürünlerimiz dayanıklı olsa da, ekstrem hava koşullarında özel koruma kılıflarımızı kullanmanızı ve minderleri kuru bir alanda muhafaza etmenizi, mobilya ömrünü maksimize etmek adına tavsiye ederiz.",
    },
    {
      question: "Kişiselleştirilmiş ölçü veya renk çalışabiliyor musunuz?",
      answer:
        "Butik üretim anlayışımız sayesinde belirli koleksiyonlarda mimari projenize uygun kumaş kartelası değişimi ve ölçü modifikasyonları yapabiliyoruz.",
    },
  ];

  return (
    <div className="bg-slate-50 text-slate-900 font-light">
      <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        {/* HEADER: Minimalist Tipografi */}
        <header className="mb-20 space-y-4">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] tracking-[0.5em] uppercase text-slate-600 block mb-4"
          >
            Bilgi Merkezi
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-extralight tracking-tighter italic leading-tight">
            Merak Edilen <br /> Detaylar.
          </h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* FAQ LİSTESİ: Çizgisel ve Sade */}
          <div className="lg:col-span-8 border-t border-slate-200">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-slate-100">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full py-8 flex items-center justify-between text-left group"
                >
                  <span
                    className={`text-lg transition-all duration-500 ${
                      openIndex === index
                        ? "pl-4 text-slate-900 italic"
                        : "text-slate-500 group-hover:text-slate-800"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-500 text-slate-300 ${
                      openIndex === index ? "rotate-90 text-slate-900" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pl-4 pr-12 text-slate-500 leading-relaxed font-light text-sm md:text-base border-l border-slate-900 ml-1">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* SAĞ TARAF: Minimalist İletişim Kartı */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="p-8 border border-slate-200 rounded-sm bg-white/50 backdrop-blur-sm">
                <h3 className="text-xs tracking-[0.3em] uppercase font-medium mb-4 text-slate-400">
                  Özel Projeler
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-8">
                  Mekanınıza özel yerleşim planı ve mobilya seçimi için iç
                  mimarlarımızdan profesyonel destek alabilirsiniz.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-bold text-slate-900 group"
                >
                  İletişime Geçin
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </div>

              <div className="px-2 space-y-4">
                <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                    Çalışma Saatleri
                  </span>
                  <span className="text-xs text-slate-800">09:00 — 19:00</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                  * Hafta sonları ve resmi tatillerde yanıt süreleri değişiklik
                  gösterebilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
