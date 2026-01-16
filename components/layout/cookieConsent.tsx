"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAction = (type: "accepted" | "declined") => {
    localStorage.setItem("cookie-consent", type);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="fixed bottom-6 right-6 z-[200] w-[calc(100%-3rem)] max-w-[380px]"
        >
          <div className="bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8">
            {/* Kapatma Butonu */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
              aria-label="çerez modalı kapat"
            >
              <X size={14} strokeWidth={1.5} />
            </button>

            <div className="space-y-6">
              {/* Başlık Bölümü */}
              <div className="space-y-1">
                <h4 className="text-[10px] tracking-[0.3em] text-slate-600 uppercase font-medium">
                  Gizlilik ve Çerezler
                </h4>
                <div className="h-[1px] w-6 bg-slate-900" />
              </div>

              {/* Metin */}
              <p className="text-[12px] text-slate-600 leading-relaxed font-light">
                Size en iyi dijital deneyimi sunmak için çerezleri kullanıyoruz.
                Web sitemizi kullanarak bunu kabul etmiş olursunuz.
                <Link
                  href="/institutional/cookie_policy"
                  className="text-slate-900 underline underline-offset-4 ml-1 hover:text-slate-500 transition-colors"
                >
                  Politikayı İncele
                </Link>
              </p>

              {/* Butonlar */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => handleAction("accepted")}
                  className="w-full h-11 bg-slate-900 text-white text-[10px] tracking-[0.2em] uppercase transition-all hover:bg-slate-800 active:scale-[0.98]"
                >
                  Kabul Ediyorum
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="w-full h-11 border border-slate-100 text-slate-600 text-[10px] tracking-[0.2em] uppercase transition-all hover:text-slate-900 hover:border-slate-900"
                >
                  Daha Sonra
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
