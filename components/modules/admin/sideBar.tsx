"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  LogOut,
  Menu,
  X,
  FileText,
  Settings,
  Bell,
  ChevronRight,
  Ticket,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

export default function AdminSidebar(): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "GENEL BAKIŞ",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      id: "products",
      label: "ÜRÜN YÖNETİMİ",
      icon: Package,
      href: "/admin/products",
    },
    {
      id: "orders",
      label: "SİPARİŞ KAYITLARI",
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      id: "users",
      label: "MÜŞTERİ PORTFÖYÜ",
      icon: Users,
      href: "/admin/users",
    },
    {
      id: "blogs",
      label: "İÇERİK YÖNETİMİ",
      icon: FileText,
      href: "/admin/blogs",
    },
    {
      id: "subscribers",
      label: "BÜLTEN ABONELERİ",
      icon: Bell,
      href: "/admin/subscribers",
    },
    {
      id: "coupon",
      label: "PROMOSYON KODLARI",
      icon: Ticket,
      href: "/admin/coupon",
    },
    {
      id: "settings",
      label: "SİSTEM AYARLARI",
      icon: Settings,
      href: "/admin/banner",
    },
  ];

  const activeId = menuItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
  )?.id;

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("Oturum Kapatıldı", {
        description: "Sistem güvenli bir şekilde kapatıldı.",
      });
      router.push("/admin");
    } catch (error) {
      toast.error("Çıkış işlemi başarısız.");
    }
  };

  const NavContent = (isMobile = false) => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 py-8 px-0 border-r border-slate-800">
      {/* Brand Logo - Keskin Kenarlı Konteynır */}
      <div className="px-6 mb-12 flex items-center gap-3">
        <Image
          src="/logo/logois2.png"
          alt="Logo"
          width={40}
          height={40}
          className="flex-shrink-0"
        />
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tighter text-white leading-none">
            İŞPOOL
          </span>
          <span className="text-[10px] font-bold text-amber-500 tracking-[0.2em]">
            CONTROL
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-0 space-y-0.5">
        <div className="px-6 mb-4 text-[10px] font-black text-slate-500 tracking-[.25em] uppercase">
          Ana Menü
        </div>
        {menuItems.map(({ id, label, icon: Icon, href }) => {
          const isActive = activeId === id;
          return (
            <Link
              key={id}
              href={href}
              onClick={() => isMobile && setIsOpen(false)}
              className={`relative flex items-center justify-between group px-6 py-3.5 transition-all duration-200 border-l-4 ${
                isActive
                  ? "bg-slate-800/50 border-amber-500 text-white"
                  : "border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              <div className="flex items-center gap-4 z-10 min-w-0">
                <Icon
                  size={18}
                  className={`flex-shrink-0 ${isActive ? "text-amber-500" : "text-slate-500 group-hover:text-slate-300"}`}
                />
                <span
                  className={`text-[11px] tracking-widest font-bold uppercase`}
                >
                  {label}
                </span>
              </div>

              {isActive && (
                <div className="flex items-center gap-1">
                  <div className="h-1 w-1 bg-amber-500 rounded-full animate-pulse" />
                  <ChevronRight size={14} className="text-amber-500" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Profile Section */}
      <div className="mt-auto px-4 pt-6 bg-slate-950/50">
        <div className="flex items-center gap-3 px-3 py-5 border-t border-slate-800">
          <div className="w-10 h-10 rounded-none bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-500 font-black text-xs">
            AD
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-white uppercase tracking-tight truncate">
              Yönetici Paneli
            </span>
            <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter truncate">
              V2.0.4.88
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="group flex items-center justify-center gap-3 w-full bg-red-950/20 hover:bg-red-600 px-6 py-4 text-[11px] font-black text-red-500 hover:text-white transition-all duration-300 border-t border-red-900/30"
        >
          <LogOut size={16} />
          <span className="uppercase tracking-widest">Sistemi Kapat</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 w-[240px] sm:w-[280px] h-screen bg-slate-900 hidden md:block z-50 shadow-2xl">
        {NavContent()}
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-slate-900 border-b border-slate-800 px-5 py-4 z-40 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500 p-1">
            <ShieldCheck size={18} className="text-black" />
          </div>
          <span className="text-sm font-black text-white tracking-widest uppercase">
            İŞPOOL
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="rounded-none bg-slate-800 hover:bg-slate-700 h-10 w-10 text-white"
        >
          <Menu size={22} />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay & Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 w-[280px] h-screen bg-slate-900 z-[70] md:hidden border-r border-slate-800"
            >
              <div className="absolute top-6 right-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none hover:bg-slate-800 h-10 w-10 text-slate-400"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>
              {NavContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
