"use client";

import Link from "next/link";
import {
  User,
  MapPin,
  Package,
  X,
  LogOut,
  Truck,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
  HeadphonesIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface UserMegaMenuProps {
  userMenuOpen: boolean;
  setUserMenuOpen: (open: boolean) => void;
}

export default function UserMegaMenu({
  userMenuOpen,
  setUserMenuOpen,
}: UserMegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [user, setUser] = useState<{
    name?: string;
    surname?: string;
    email?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const checkUserStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/account/check", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user || null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userMenuOpen) checkUserStatus();
  }, [userMenuOpen, checkUserStatus]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setUser(null);
    setUserMenuOpen(false);
    toast.success("Oturum kapatıldı.");
    router.refresh();
  };

  const menuItems = [
    { label: "Hesap Özeti", href: "/profile", icon: LayoutDashboard },
    { label: "Adres Defteri", href: "/profile/addresses", icon: MapPin },

    { label: "Sipariş Geçmişi", href: "/profile/orders", icon: Package },
    {
      label: "Kargo ve Lojistik",
      href: "/profile/cargo_tracking",
      icon: Truck,
    },
  ];

  return (
    <AnimatePresence>
      {userMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setUserMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150]"
          />

          <motion.div
            ref={menuRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-full w-[95%] max-w-[400px] bg-white z-[151] flex flex-col shadow-2xl"
          >
            {/* ÜST PANEL */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-600 animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.2em] text-slate-900 uppercase">
                  Müşteri Portalı
                </span>
              </div>
              <button
                onClick={() => setUserMenuOpen(false)}
                className="p-2 rounded-sm hover:bg-white transition-colors border border-transparent hover:border-slate-200"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 px-8 py-10 overflow-y-auto">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent animate-spin" />
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    Veriler İşleniyor
                  </span>
                </div>
              ) : user ? (
                /* --- AUTH STATE (GİRİŞ YAPILMIŞ) --- */
                <div className="flex flex-col h-full">
                  <div className="mb-12">
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest block mb-2">
                      Hoş Geldiniz
                    </span>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-none uppercase ">
                      {user.name} <br /> {user.surname}
                    </h2>
                  </div>

                  <nav className="grid gap-2">
                    {menuItems.map((item, i) => (
                      <Link
                        key={i}
                        href={item.href}
                        onClick={() => setUserMenuOpen(false)}
                        className="group rounded-sm flex items-center gap-4 p-4  border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all"
                      >
                        <div className="w-10 h-10 bg-slate-50 rounded-sm flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-orange-600 transition-colors border border-slate-100">
                          <item.icon size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                            {item.label}
                          </p>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-slate-300 group-hover:translate-x-1 transition-transform"
                        />
                      </Link>
                    ))}
                  </nav>
                </div>
              ) : (
                /* --- GUEST STATE (ZİYARETÇİ) --- */
                <div className="h-full flex flex-col justify-center">
                  <div className="mb-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none uppercase mb-4">
                      Profesyonel <br /> Çözümler.
                    </h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      Siparişlerinizi takip etmek ve size özel teknik ekipman
                      tekliflerini görmek için giriş yapın.
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <Link
                      href="/auth/login"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex rounded-sm items-center justify-between p-6 bg-slate-900 text-white hover:bg-orange-600 transition-all group"
                    >
                      <span className=" uppercase tracking-widest text-sm">
                        Oturum Aç
                      </span>
                      <ChevronRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>

                    <Link
                      href="/auth/register"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex rounded-sm items-center justify-between p-6 bg-white border border-slate-200 text-slate-900 hover:border-slate-900 transition-all group"
                    >
                      <span className=" uppercase tracking-widest text-sm">
                        Yeni Kayıt
                      </span>
                      <ChevronRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ALT PANEL */}
            <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex rounded-sm items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-600 transition-colors"
                >
                  <LogOut size={14} />
                  Güvenli Çıkış
                </button>
              ) : (
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <HeadphonesIcon size={14} />
                  7/24 Teknik Destek
                </div>
              )}
              <Link
                href="/help/contact"
                className="text-[10px] rounded-sm font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors"
              >
                Yardım Merkezi
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
