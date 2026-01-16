"use client";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ShieldCheck,
  HardHat, // İnşaat yerine baret daha spesifik bir güven verir
  LockKeyhole,
  Globe,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error("Kimlik bilgileri doğrulanamadı.");
        return;
      }

      toast.success("Oturum başarıyla açıldı.");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Sistemsel bir hata oluştu.");
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
        className="w-full max-w-[1200px] min-h-[700px] grid grid-cols-1 lg:grid-cols-12 bg-white overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 "
      >
        {/* SOL PANEL: KURUMSAL VİZYON */}
        <div className="lg:col-span-5 bg-[#0f172a] p-12 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Sofistike Arka Plan Dokusu */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-12 h-12 bg-orange-600  flex items-center justify-center shadow-lg shadow-orange-900/20">
                <HardHat className="text-white" size={24} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight leading-none">
                  İŞPOOL
                </span>
                <span className="text-[10px] tracking-[0.3em] text-orange-500 font-bold uppercase">
                  Endüstriyel
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5  border border-white/10">
                <ShieldCheck size={14} className="text-orange-500" />
                <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-300">
                  Güvenli Tedarik Zinciri
                </span>
              </div>

              <h1 className="text-5xl font-medium leading-[1.1] tracking-tight">
                Profesyonel <br />
                <span className="text-slate-400 font-light">
                  Donanım ve
                </span>{" "}
                <br />
                <span className="text-orange-500 font-semibold italic">
                  Lojistik Çözümleri.
                </span>
              </h1>

              <p className="text-slate-400 text-base font-light leading-relaxed max-w-sm">
                Türkiye'nin lider iş ekipmanları platformuna hoş geldiniz.
                Kurumsal siparişlerinizi yönetin ve teknik şartnamelere anında
                erişin.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-8 text-slate-500">
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg">15k+</span>
                <span className="text-[10px] uppercase tracking-wider">
                  Aktif Ürün
                </span>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg">24h</span>
                <span className="text-[10px] uppercase tracking-wider">
                  Lojistik Desteği
                </span>
              </div>
            </div>

            <Link
              href="/register"
              className="group flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 p-5  transition-all duration-300"
            >
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                  Hesabınız yok mu?
                </span>
                <span className="text-sm font-semibold">
                  Kurumsal Kayıt Başvurusu
                </span>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-orange-500" />
            </Link>
          </div>
        </div>

        {/* SAĞ PANEL: FORM */}
        <div className="lg:col-span-7 p-8 lg:p-24 flex flex-col justify-center relative">
         
          <div className="max-w-md mx-auto w-full">
            <header className="mb-10 text-center lg:text-left">
              <h2 className="text-sm font-semibold text-orange-600 mb-2 uppercase tracking-[0.2em]">
                Müşteri Girişi
              </h2>
              <p className="text-3xl font-semibold text-slate-900 tracking-tight">
                Yönetim Paneline Erişin
              </p>
            </header>

            <form onSubmit={handleLogin} className="space-y-5">
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
                  className="h-12 bg-white border-slate-200  px-4 text-sm focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Şifre
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-semibold text-orange-600 hover:underline transition-all uppercase tracking-wider"
                  >
                    Şifremi Unuttum
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="h-12 bg-white border-slate-200  px-4 pr-12 text-sm focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none"
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
                className="w-full h-12 bg-[#0f172a] text-white hover:bg-orange-600  transition-all duration-300 shadow-lg shadow-slate-200"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold tracking-wide">
                      Oturum Aç
                    </span>
                    <LockKeyhole size={16} />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-12">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-bold">
                  <span className="bg-white px-4 text-slate-400">
                    Güvenli Bölge
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-[11px] text-slate-400 font-medium">
              Bu panel KVKK kapsamında korunmaktadır. <br />
              <span className="text-slate-300">
                © 2026 İşPool Endüstriyel Çözümler A.Ş.
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
