"use client";

import React, { useState, Suspense, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  LockKeyhole,
  HardHat,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Geçersiz veya eksik doğrulama kodu.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/account/reset_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Bir hata oluştu");
        return;
      }

      toast.success("Şifreniz başarıyla güncellendi!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      toast.error("Sunucu hatası, tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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

        {/* Header Bölümü */}
        <header className="text-center space-y-2 mb-10">
          <h2 className="text-sm font-semibold text-orange-600 uppercase tracking-[0.2em]">
            Güvenlik Güncelleme
          </h2>
          <p className="text-2xl font-semibold text-slate-900 tracking-tight">
            Yeni Şifre Belirle
          </p>
          <p className="text-slate-400 text-xs font-medium px-4">
            Lütfen hesabınız için güçlü ve güvenli yeni bir şifre oluşturun.
          </p>
        </header>

        {/* Form Alanı */}
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold ml-1">
              Yeni Şifre
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="h-12 bg-white border-slate-200 px-4 pr-12 text-sm focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none rounded-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#0f172a] text-white hover:bg-orange-600 transition-all duration-300 shadow-lg shadow-slate-200 rounded-none group"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-wide">
                  Şifreyi Güncelle
                </span>
                <LockKeyhole
                  size={16}
                  className="group-hover:rotate-12 transition-transform"
                />
              </div>
            )}
          </Button>
        </form>

        {/* Alt Bilgi ve Linkler */}
        <div className="mt-10 space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
              <span className="bg-white px-4 text-slate-300 italic flex items-center gap-2">
                <ShieldCheck size={12} /> Güvenli İşlem
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              href="/login"
              className="flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-orange-600 transition-all tracking-wider uppercase group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Vazgeç ve Dön
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest">
          © 2026 İşPool Endüstriyel Çözümler A.Ş.
        </p>
      </div>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-6 selection:bg-orange-100">
      {/* Arkaplan Dokusu */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

      <Suspense
        fallback={
          <div className="flex items-center gap-3 text-slate-400 font-bold tracking-widest uppercase text-[10px]">
            <Loader2 className="animate-spin" size={16} />
            Yükleniyor...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
