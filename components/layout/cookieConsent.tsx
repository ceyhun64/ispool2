"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield } from "lucide-react";
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
          exit={{ y: 20, opacity: 0 }}
          className="fixed bottom-8 left-8 z-[200] w-[calc(100%-4rem)] max-w-[420px]"
        >
          {/* Minimalist ve Güçlü Gövde */}
          <div className="bg-white border border-slate-200 shadow-[0_15px_40px_rgba(0,0,0,0.08)] rounded-none relative">
            {/* Üst İnce Güvenlik Çizgisi */}
            <div className="h-1 w-full bg-orange-600" />

            <div className="p-6">
              {/* Kapatma Butonu */}
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
                aria-label="Kapat"
              >
                <X size={16} />
              </button>

              <div className="flex items-start gap-5">
                {/* Sol Taraf: Minimal İkon */}
                <div className="hidden sm:flex mt-1 shrink-0 w-10 h-10 items-center justify-center bg-slate-50 border border-slate-100 text-slate-600">
                  <Shield size={20} strokeWidth={1.5} />
                </div>

                <div className="space-y-4">
                  {/* Başlık ve Metin */}
                  <div className="space-y-2">
                    <h4 className="text-[12px] font-bold tracking-widest text-slate-900 uppercase">
                      Veri Güvenliği ve Çerezler
                    </h4>
                    <p className="text-[13px] text-slate-600 leading-relaxed font-normal">
                      Size daha güvenli ve özelleştirilmiş bir alışveriş
                      deneyimi sunmak için yasal düzenlemelere uygun çerezler
                      kullanıyoruz.
                    </p>
                  </div>

                  {/* Alt Link ve Aksiyonlar */}
                  <div className="flex flex-col gap-4">
                    <Link
                      href="/institutional/cookie_policy"
                      className="text-[11px] text-slate-500 hover:text-slate-900 underline underline-offset-4 transition-colors w-fit"
                    >
                      Çerez Politikası ve Aydınlatma Metni
                    </Link>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleAction("accepted")}
                        className="px-6 py-2.5 bg-slate-900 text-white text-[11px] font-semibold tracking-wider uppercase transition-all hover:bg-slate-700 active:bg-black"
                      >
                        Kabul Et
                      </button>
                      <button
                        onClick={() => setIsVisible(false)}
                        className="px-6 py-2.5 border border-slate-200 text-slate-600 text-[11px] font-semibold tracking-wider uppercase transition-all hover:border-slate-900 hover:text-slate-900"
                      >
                        Reddet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
