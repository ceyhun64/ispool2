"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react"; // ShieldCheck eklendi
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const logoutExistingSession = async () => {
      await signOut({ redirect: false });
    };
    logoutExistingSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast.error("Kimlik bilgileri doğrulanamadı.");
        return;
      }

      if (res?.ok) {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();

        if (sessionData?.user?.role !== "ADMIN") {
          toast.error("Yetkisiz erişim denemesi.");
          return;
        }

        toast.success("Yönetim paneline yönlendiriliyorsunuz.");
        setTimeout(() => router.push("/admin/dashboard"), 800);
      }
    } catch (err) {
      toast.error("Sistem hatası oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 relative overflow-hidden font-sans">
      {/* Arka Plan Dekorasyonu - Endüstriyel Tema */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5  blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-900/5  blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px] z-10 px-6"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 relative overflow-hidden">
          {/* Üst Dekorasyon Çizgisi */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-slate-900" />

          {/* Logo Bölümü */}
          <div className="flex flex-col items-center mb-10">
            <Link
              href="/"
              className="mb-6 transition-transform hover:scale-105 active:scale-95"
            >
              <div className="relative w-32 h-16">
                <Image
                  src="/logo/logois2.png"
                  alt="İşPool Logo"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </Link>
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center justify-center gap-2">
                <ShieldCheck className="w-6 h-6 text-orange-500" />
                Yönetim Paneli
              </h1>
              <p className="text-sm text-slate-500 font-medium italic">
                Güvenli bölgeye erişim sağlayın
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1"
              >
                E-posta
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Mail size={18} />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ispool.com"
                  required
                  className="bg-slate-50 border-slate-200  pl-12 h-13 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1"
              >
                Şifre
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Lock size={18} />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-slate-50 border-slate-200  pl-12 h-13 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 transition-all placeholder:text-slate-300"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-slate-900 hover:bg-orange-600 text-white font-semibold tracking-wide h-13  shadow-lg shadow-slate-900/10 transition-all duration-300 group"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white  animate-spin" />
                  <span>Doğrulanıyor...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Sisteme Giriş Yap
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-slate-100 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
              © {new Date().getFullYear()} İşPool Safety Tools
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
