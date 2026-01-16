"use client";
import React, { useState, useEffect } from "react";
import {
  XCircle,
  AlertCircle,
  CreditCard,
  Home,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentFailedPage() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      router.push("/");
    }
  }, [countdown, router]);

  const commonReasons = [
    {
      icon: CreditCard,
      title: "Kart Bilgileri",
      description: "Numara, tarih veya CVV hatalı olabilir",
    },
    {
      icon: AlertCircle,
      title: "Yetersiz Bakiye",
      description: "Limitiniz bu işlem için yetersiz olabilir",
    },
    {
      icon: XCircle,
      title: "Banka Reddi",
      description: "Güvenlik nedeniyle işlem onaylanmadı",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 font-sans text-slate-950">
      <div className="max-w-xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Error Header */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse opacity-5"></div>
            <div className="relative bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-sm border border-red-50">
              <XCircle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">
            Ödeme Başarısız
          </h1>
          <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
            İşleminiz banka veya sistem kaynaklı bir hata nedeniyle
            tamamlanamadı.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-10 space-y-10">
          {/* Olası Nedenler */}
          <div className="space-y-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Olası Nedenler
            </h2>
            <div className="grid gap-3">
              {commonReasons.map((reason, index) => {
                const Icon = reason.icon;
                return (
                  <div
                    key={index}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-50 bg-slate-50/30 transition-all hover:bg-white hover:border-slate-200"
                  >
                    <div className="p-2.5 rounded-xl bg-white text-slate-900 shadow-sm">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-900">
                        {reason.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Solutions Steps */}
          <div className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Çözüm Önerileri
            </h2>
            <div className="space-y-3">
              {[
                "Bilgilerinizin doğruluğunu teyit edin.",
                "3D Secure onayını beklediğinizden emin olun.",
                "Farklı bir kart ile işlem yapmayı deneyin.",
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-slate-600"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-[10px] flex items-center justify-center text-white font-bold shrink-0">
                    {i + 1}
                  </div>
                  <p className="font-medium tracking-tight">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => (window.location.href = "/checkout")}
              className="group flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold text-sm transition-all hover:bg-slate-800 active:scale-95"
            >
              <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
              Tekrar Dene
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 px-6 py-4 rounded-2xl font-bold text-sm transition-all hover:bg-slate-50 active:scale-95"
            >
              <Home className="w-4 h-4" />
              Ana Sayfa
            </button>
          </div>
        </div>

        {/* Countdown Footer */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
            </span>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Otomatik Yönlendirme:{" "}
              <span className="text-slate-900 ml-1">{countdown}s</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
