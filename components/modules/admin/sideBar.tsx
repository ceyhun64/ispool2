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
      label: "Genel Bakış",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      id: "products",
      label: "Ürün Yönetimi",
      icon: Package,
      href: "/admin/products",
    },
    {
      id: "orders",
      label: "Siparişler",
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    { id: "users", label: "Müşteriler", icon: Users, href: "/admin/users" },
    {
      id: "blogs",
      label: "Blog Yazıları",
      icon: FileText,
      href: "/admin/blogs",
    },
    {
      id: "subscribers",
      label: "Aboneler",
      icon: Bell,
      href: "/admin/subscribers",
    },
    {
      id: "coupon",
      label: "Kuponlar",
      icon: Ticket,
      href: "/admin/coupon",
    },
    {
      id: "settings",
      label: "Sistem Ayarları",
      icon: Settings,
      href: "/admin/banner",
    },
  ];

  const activeId = menuItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  )?.id;

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("Güvenli çıkış yapıldı", {
        description: "Yönetici oturumunuz sonlandırıldı.",
      });
      router.push("/admin");
    } catch (error) {
      toast.error("Çıkış yapılırken bir hata oluştu.");
    }
  };

  const NavContent = (isMobile = false) => (
    <div className="flex flex-col h-full bg-white px-4 sm:px-5 py-6 sm:py-8">
      {/* Brand Logo */}
      <div className="px-2 sm:px-3 mb-8 sm:mb-12">
        <Link
          href="/admin/dashboard"
          className="inline-block hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo/logoblack.webp"
            alt="İşPool Logo"
            width={120}
            height={30}
            priority
            className="h-auto w-auto sm:w-[140px]"
          />
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 relative">
        {menuItems.map(({ id, label, icon: Icon, href }) => {
          const isActive = activeId === id;
          return (
            <Link
              key={id}
              href={href}
              onClick={() => isMobile && setIsOpen(false)}
              className={`relative flex items-center justify-between group px-3 sm:px-4 py-3 sm:py-2.5 rounded-xl sm:rounded-2xl transition-all duration-300 ${
                isActive
                  ? "text-slate-950"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {/* Active Background Animation */}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-slate-100/80 rounded-xl sm:rounded-2xl z-0"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <div className="flex items-center gap-3 sm:gap-3.5 z-10 min-w-0">
                <Icon
                  size={18}
                  className={`flex-shrink-0 sm:w-5 sm:h-5 ${
                    isActive
                      ? "text-slate-950"
                      : "text-slate-400 group-hover:text-slate-600 transition-colors"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`text-xs sm:text-[13.5px] tracking-tight truncate ${
                    isActive ? "font-bold" : "font-medium"
                  }`}
                >
                  {label}
                </span>
              </div>

              {isActive && (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="z-10 flex-shrink-0"
                >
                  <ChevronRight size={14} className="text-slate-400" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile & Logout Section */}
      <div className="mt-auto pt-4 sm:pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 mb-4 sm:mb-6">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            AD
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-slate-900 leading-none truncate">
              Yönetici
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1 font-medium truncate">
              İşPool Admin Panel
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl sm:rounded-2xl transition-all duration-200"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-red-50 transition-colors flex-shrink-0">
            <LogOut size={14} className="sm:w-4 sm:h-4" />
          </div>
          <span className="truncate">Oturumu Kapat</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 w-[240px] sm:w-[280px] h-screen bg-white border-r border-slate-100 hidden md:block z-50">
        {NavContent()}
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100 px-4 sm:px-6 py-3 sm:py-4 z-40 flex justify-between items-center">
        <Image
          src="/logo/logoblack.webp"
          alt="logo"
          width={90}
          height={24}
          className="sm:w-[100px] sm:h-[26px]"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="rounded-xl bg-slate-50 hover:bg-slate-100 h-10 w-10"
        >
          <Menu size={20} className="text-slate-900" />
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
              className="fixed inset-0 bg-slate-950/30 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed left-0 top-0 w-[280px] sm:w-[300px] h-screen bg-white z-[70] md:hidden shadow-2xl border-r border-slate-100"
            >
              <div className="absolute top-6 sm:top-8 right-4 sm:right-6">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-slate-100 h-9 w-9"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={18} className="text-slate-500" />
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
