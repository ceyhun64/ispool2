"use client";

import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import {
  HardHat,
  Loader2,
  LockKeyhole,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/account/forgot_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Bir hata oluştu.");
      } else {
        setIsSubmitted(true);
        toast.success("Sıfırlama bağlantısı e-posta adresinize tanımlandı.");
      }
    } catch (err) {
      toast.error("Sistem bağlantı hatası, lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-6 selection:bg-orange-100">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[500px] bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden"
      >
        {/* Üst Vurgu Çizgisi */}
        <div className="h-1.5 w-full bg-orange-600" />

        <div className="p-8 lg:p-12">
          {/* Logo Bölümü */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#0f172a] flex items-center justify-center shadow-lg shadow-slate-200">
              <HardHat className="text-orange-500" size={20} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight leading-none text-[#0f172a]">
                İŞPOOL
              </span>
              <span className="text-[9px] tracking-[0.3em] text-orange-600 font-bold uppercase">
                Endüstriyel
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="forgot-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <header className="text-center space-y-2">
                  <h2 className="text-sm font-semibold text-orange-600 uppercase tracking-[0.2em]">
                    Erişim Yenileme
                  </h2>
                  <p className="text-2xl font-semibold text-slate-900 tracking-tight">
                    Şifrenizi Sıfırlayın
                  </p>
                  <p className="text-slate-400 text-xs font-medium px-4">
                    Kayıtlı kurumsal e-posta adresinizi girerek şifre yenileme
                    sürecini başlatabilirsiniz.
                  </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold ml-1">
                      Kurumsal E-Posta
                    </Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="ad.soyad@sirket.com"
                      className="h-12 rounded-sm bg-white border-slate-200 px-4 text-sm focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none rounded-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-sm bg-[#0f172a] text-white hover:bg-orange-600 transition-all duration-300 shadow-lg shadow-slate-200  group"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tracking-wide">
                          Talimat Gönder
                        </span>
                        <LockKeyhole
                          size={16}
                          className="group-hover:rotate-12 transition-transform"
                        />
                      </div>
                    )}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-3 tracking-tight">
                  E-posta Gönderildi
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  <strong className="text-slate-900">{email}</strong> adresine
                  güvenli sıfırlama bağlantısı iletildi.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsSubmitted(false)}
                  className="border-slate-200 text-slate-600 hover:bg-slate-50 h-11 px-8 rounded-none font-semibold text-xs"
                >
                  Farklı Bir Adres Dene
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Alt Bilgi ve Linkler */}
          <div className="mt-10 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                <span className="bg-white px-4 text-slate-300 italic flex items-center gap-2">
                  <ShieldCheck size={12} /> Güvenli Doğrulama
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <Link
                href="/auth/login"
                className="flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-orange-600 transition-all tracking-wider uppercase group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Giriş Paneline Dön
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest">
            © 2026 İşPool Endüstriyel Çözümler A.Ş.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
