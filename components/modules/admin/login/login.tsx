"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
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
    <div className="flex min-h-screen items-center justify-center bg-[#FDFDFD] text-slate-800 font-sans selection:bg-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px] px-8 py-12"
      >
        {/* Logo Bölümü */}
        <div className="flex flex-col items-center mb-12">
          <Link
            href="/"
            className="mb-8 opacity-90 hover:opacity-100 transition-opacity"
          >
            <div className="relative w-24 h-12">
              <Image
                src="/logo/logoblack.webp"
                alt="İşPool Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>
          <h1 className="text-xl font-light tracking-[0.2em]  text-slate-900">
            Admin{" "}
            <span className="font-serif italic text-slate-400 capitalize tracking-normal">
              Girişi
            </span>
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2 text-left">
            <Label
              htmlFor="email"
              className="text-[10px] uppercase tracking-widest text-slate-400 ml-1"
            >
              E-posta Adresi
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-800 transition-colors" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ispool.com"
                required
                className="bg-transparent border-slate-200 border-x-0 border-t-0 border-b rounded-none px-10 h-12 focus-visible:ring-0 focus-visible:border-slate-800 transition-all placeholder:text-slate-200"
              />
            </div>
          </div>

          <div className="space-y-2 text-left relative">
            <Label
              htmlFor="password"
              className="text-[10px] uppercase tracking-widest text-slate-400 ml-1"
            >
              Şifre
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-800 transition-colors" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-transparent border-slate-200 border-x-0 border-t-0 border-b rounded-none px-10 h-12 focus-visible:ring-0 focus-visible:border-slate-800 transition-all placeholder:text-slate-200"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-800 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 bg-slate-900 hover:bg-slate-800 text-white font-light tracking-widest h-12 rounded-none transition-all group"
          >
            {isLoading ? (
              <span className="animate-pulse">Doğrulanıyor...</span>
            ) : (
              <div className="flex items-center gap-2">
                Giriş Yap{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </Button>
        </form>

        <div className="mt-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-300">
            © {new Date().getFullYear()} İşPool Management System
          </p>
        </div>
      </motion.div>
    </div>
  );
}
