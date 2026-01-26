"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shirt,
  Footprints,
  Hand,
  HardHat,
  Shield,
  Briefcase,
  Flame,
  TrendingDown,
  Zap,
  Mountain,
  X,
  Plus,
  Minus,
  Instagram,
  Facebook,
  Phone,
  MessageCircleMore,
  Mail,
  Users,
  Settings,
  Info,
  Truck,
  ChevronRight,
} from "lucide-react";
import { CATEGORIES } from "@/data/categories";

const CategoryIcon = ({ id, size = 18 }: { id: string; size?: number }) => {
  const icons: Record<string, React.ReactNode> = {
    is_elbiseleri: <Shirt size={size} />,
    ayak_koruma: <Footprints size={size} />,
    el_koruma: <Hand size={size} />,
    teknik: <Flame size={size} />,
    ekipman: <HardHat size={size} />,
    outdoor: <Mountain size={size} />,
    markalar: <Briefcase size={size} />,
    en_yeniler: <Zap size={size} strokeWidth={2} />,
    indirim: <TrendingDown size={size} strokeWidth={2} />,
  };
  return icons[id] || <Shield size={size} />;
};

export default function CategoryBar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: any) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const currentCategory = CATEGORIES.find((c) => c.id === activeCategory);

  // TopBar ile eşleşen linkler
  const secondaryLinks = [
    { label: "İletişim", icon: <Mail size={16} />, href: "/help/contact" },
    {
      label: "Toptan Satış",
      icon: <Users size={16} />,
      href: "/products/wholesale",
    },
    {
      label: "Özel Üretim",
      icon: <Settings size={16} />,
      href: "/products/special_production",
    },
    {
      label: "Hakkımızda",
      icon: <Info size={16} />,
      href: "/institutional/about",
    },
    {
      label: "Kargo Takibi",
      icon: <Truck size={16} />,
      href: "/profile/cargo_tracking",
    },
    {
      label: "Kariyer",
      icon: <Briefcase size={16} />,
      href: "/institutional/career",
      highlight: true,
    },
  ];

  // TopBar ile eşleşen sosyal medya ve iletişim
  const socialMedia = [
    {
      icon: <Instagram size={22} />,
      href: "https://www.instagram.com/ispool_is_kyafetleri",
      color: "hover:text-pink-600",
    },
    {
      icon: <Facebook size={22} />,
      href: "https://www.facebook.com/is.pool.is.k.yafetleri",
      color: "hover:text-blue-600",
    },
    {
      icon: <Phone size={22} />,
      href: "tel:+905343529420",
      color: "hover:text-orange-600",
    },
    {
      icon: <MessageCircleMore size={22} />,
      href: "https://wa.me/900534359420",
      color: "hover:text-green-500",
    },
  ];

  return (
    <>
      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[200] bg-slate-950/70 backdrop-blur-md lg:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              className="fixed inset-y-0 left-0 z-[210] w-[85%] max-w-[340px] bg-slate-50 lg:hidden flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 bg-white border-b">
                <div>
                  <p className="text-lg font-black uppercase text-slate-900 leading-none">
                    İŞPOOL
                  </p>
                  <p className="text-[9px] tracking-widest text-orange-600 font-bold uppercase mt-1">
                    Endüstriyel Güvenlik
                  </p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-slate-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Categories */}
                <div className="bg-white">
                  <p className="px-5 py-3 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase border-b bg-slate-50/50">
                    Kategoriler
                  </p>
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      className="border-b border-slate-100 last:border-none"
                    >
                      <div className="flex items-center justify-between px-5 py-4">
                        <Link
                          href={`/category/${cat.id}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-4 text-[13px] font-bold uppercase text-slate-700 active:text-orange-600"
                        >
                          <span
                            className={
                              cat.id === "indirim"
                                ? "text-red-600"
                                : "text-orange-600 opacity-80"
                            }
                          >
                            <CategoryIcon id={cat.id} size={20} />
                          </span>
                          {cat.label}
                        </Link>
                        {cat.megaMenu && (
                          <button
                            onClick={() =>
                              setExpandedCategory(
                                expandedCategory === cat.id ? null : cat.id,
                              )
                            }
                            className={`p-1.5 rounded transition-all ${expandedCategory === cat.id ? "bg-orange-600 text-white rotate-180 shadow-lg shadow-orange-200" : "bg-slate-100 text-slate-400"}`}
                          >
                            {expandedCategory === cat.id ? (
                              <Minus size={16} />
                            ) : (
                              <Plus size={16} />
                            )}
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {expandedCategory === cat.id && cat.megaMenu && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="bg-slate-50 overflow-hidden"
                          >
                            {cat.megaMenu.isBrands ? (
                              <div className="grid grid-cols-3 gap-2 p-4">
                                {cat.megaMenu.images?.map((src, i) => (
                                  <div
                                    key={i}
                                    className="bg-white p-3 border border-slate-200 rounded-sm flex items-center justify-center aspect-square"
                                  >
                                    <img
                                      src={src}
                                      alt="brand"
                                      className="max-h-full w-auto object-contain"
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              cat.megaMenu.columns?.map((col, i) => (
                                <div
                                  key={i}
                                  className="px-14 py-4 border-t border-slate-200/50 first:border-t-0"
                                >
                                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-3">
                                    {col.title}
                                  </p>
                                  <div className="space-y-3">
                                    {col.subItems?.map((sub, j) => (
                                      <Link
                                        key={j}
                                        href="#"
                                        onClick={() =>
                                          setIsMobileMenuOpen(false)
                                        }
                                        className="flex items-center justify-between text-[12px] font-semibold text-slate-500 hover:text-orange-600 transition-colors"
                                      >
                                        {sub}
                                        <ChevronRight
                                          size={14}
                                          className="opacity-30"
                                        />
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Quick Menu */}
                <div className="bg-white mt-4 border-t">
                  <p className="px-5 py-3 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase border-b bg-slate-50/50">
                    Hızlı Menü
                  </p>
                  <div className="grid grid-cols-2 gap-px bg-slate-200">
                    {secondaryLinks.map((link, i) => (
                      <Link
                        key={i}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`p-6 bg-white flex flex-col items-center gap-2 text-[10px] font-black uppercase transition-colors active:bg-slate-50 ${link.highlight ? "text-orange-600" : "text-slate-600"}`}
                      >
                        <span
                          className={
                            link.highlight
                              ? "text-orange-600"
                              : "text-slate-400"
                          }
                        >
                          {link.icon}
                        </span>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social & Contact Footer */}
              <div className="p-6 bg-white border-t space-y-6">
                <div className="flex justify-center items-center gap-8">
                  {socialMedia.map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-slate-400 transition-all transform active:scale-90 ${item.color}`}
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
               
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ================= DESKTOP NAV ================= */}
      <nav
        className="hidden lg:block sticky top-0 z-40 bg-white/90 backdrop-blur-3xl border-b border-slate-200"
        onMouseLeave={() => setActiveCategory(null)}
      >
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                onMouseEnter={() => setActiveCategory(cat.id)}
                className={`relative flex items-center gap-2 px-3 h-full text-[10px] font-black uppercase tracking-widest transition ${activeCategory === cat.id ? "text-orange-600" : "text-slate-600 hover:text-slate-900"}`}
              >
                <CategoryIcon id={cat.id} size={16} />
                {cat.label}
                {activeCategory === cat.id && (
                  <motion.span
                    layoutId="activeCategory"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-600"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {activeCategory && currentCategory?.megaMenu && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 w-full bg-white shadow-2xl border-t py-10"
            >
              <div className="max-w-[1600px] mx-auto px-12">
                {currentCategory.megaMenu.isBrands ? (
                  <div className="grid grid-cols-6 gap-6">
                    {currentCategory.megaMenu.images?.map((src, i) => (
                      <Link
                        key={i}
                        href="#"
                        className="group border border-slate-100 p-6 flex items-center justify-center hover:border-orange-500 transition-all rounded-sm"
                      >
                        <img
                          src={src}
                          alt="brand"
                          className="max-h-12 w-auto grayscale group-hover:grayscale-0 transition-all object-contain"
                        />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-x-20 gap-y-10 flex-wrap">
                    {currentCategory.megaMenu.columns?.map((col, i) => (
                      <div key={i} className="min-w-[200px]">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-orange-600 mb-5">
                          {col.title}
                        </h4>
                        <ul className="space-y-2">
                          {col.subItems?.map((sub, j) => (
                            <li key={j}>
                              <Link
                                href="#"
                                className="text-[13px] font-medium text-slate-600 hover:text-orange-600"
                              >
                                {sub}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
