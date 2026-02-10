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
  Ticket,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Palette,
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

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function AdminSidebar({
  isCollapsed = false,
  onToggleCollapse,
}: AdminSidebarProps): React.ReactElement {
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
      label: "Ürünler",
      icon: Package,
      href: "/admin/products",
    },
    {
      id: "color_sizes",
      label: "Renk & Beden",
      icon: Palette,
      href: "/admin/color_size",
    },
    {
      id: "orders",
      label: "Siparişler",
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      id: "users",
      label: "Müşteriler",
      icon: Users,
      href: "/admin/users",
    },
    {
      id: "blogs",
      label: "Blog",
      icon: FileText,
      href: "/admin/blogs",
    },
    {
      id: "subscribers",
      label: "Bülten",
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
      label: "Ana Sayfa",
      icon: ImagePlus,
      href: "/admin/home_settings",
    },
  ];

  const activeId = menuItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
  )?.id;

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("Çıkış yapıldı");
      router.push("/admin");
    } catch (error) {
      toast.error("Çıkış işlemi başarısız");
    }
  };

  const NavContent = (isMobile = false, collapsed = false) => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand Logo */}
      <div
        className={`px-6 py-6 border-b border-slate-200 ${collapsed ? "px-4" : ""}`}
      >
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <Image
              src="/logo/logois2.png"
              alt="Logo"
              width={32}
              height={32}
              className="flex-shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-slate-900">
                İŞPOOL
              </span>
              <span className="text-xs text-slate-500">Yönetim Paneli</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Image src="/logo/logois2.png" alt="Logo" width={32} height={32} />
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map(({ id, label, icon: Icon, href }) => {
            const isActive = activeId === id;
            return (
              <Link
                key={id}
                href={href}
                onClick={() => isMobile && setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group title:text-slate-900 ${
                  collapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-slate-800 text-slate-50"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                title={collapsed ? label : undefined}
              >
                <Icon
                  size={20}
                  className={`flex-shrink-0 ${
                    isActive
                      ? "text-slate-50"
                      : "text-slate-00 group-hover:text-slate-700"
                  }`}
                />
                {!collapsed && (
                  <span className="text-sm font-medium">{label}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Çıkış Yap" : undefined}
        >
          <LogOut size={20} />
          {!collapsed && <span>Çıkış Yap</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white hidden md:block z-50 transition-all duration-300 ${
          isCollapsed ? "w-[72px]" : "w-[256px]"
        }`}
      >
        {NavContent(false, isCollapsed)}

        {/* Toggle Button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="absolute -right-3 top-6 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
            aria-label={isCollapsed ? "Genişlet" : "Daralt"}
          >
            {isCollapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronLeft size={14} />
            )}
          </button>
        )}
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white border-b border-slate-200 px-4 py-3 z-40 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src="/logo/logois2.png" alt="Logo" width={28} height={28} />
          <span className="text-base font-semibold text-slate-900">İŞPOOL</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="h-9 w-9"
        >
          <Menu size={20} />
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
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 w-[280px] h-screen bg-white z-[70] md:hidden shadow-xl"
            >
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>
              {NavContent(true, false)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
