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
} from "lucide-react";

import { CATEGORIES } from "@/data/categories";

const CategoryIcon = ({ id, size = 18 }: { id: string; size?: number }) => {
  const icons: Record<string, React.ReactNode> = {
    is_elbiseleri: <Shirt size={size} strokeWidth={1.5} />,
    ayak_koruma: <Footprints size={size} strokeWidth={1.5} />,
    el_koruma: <Hand size={size} strokeWidth={1.5} />,
    teknik: <Flame size={size} strokeWidth={1.5} />,
    ekipman: <HardHat size={size} strokeWidth={1.5} />,
    outdoor: <Mountain size={size} strokeWidth={1.5} />,
    markalar: <Briefcase size={size} strokeWidth={1.5} />,
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

  return (
    <>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 z-[200] lg:hidden backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-[320px] bg-slate-50 z-[210] lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-5 flex items-center justify-between border-b bg-white shrink-0">
                <div className="flex flex-col">
                  <span className="font-black text-slate-900 uppercase text-lg leading-none">
                    İŞPOOL
                  </span>
                  <span className="text-[9px] text-orange-600 font-bold uppercase tracking-widest mt-1">
                    Endüstriyel Güvenlik
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-slate-100  hover:bg-orange-100"
                >
                  <X size={20} className="text-slate-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="bg-white mb-4">
                  <div className="px-5 py-3 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Kategoriler
                    </span>
                  </div>
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      className="border-b border-slate-50 last:border-none"
                    >
                      <div className="flex items-center justify-between px-5 py-4">
                        <Link
                          href={`/category/${cat.id}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-4 text-[13px] font-black text-slate-700 uppercase tracking-tight"
                        >
                          <span
                            className={
                              cat.id === "indirim"
                                ? "text-red-600"
                                : "text-orange-600"
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
                            className={`p-1.5 transition-all ${expandedCategory === cat.id ? "bg-orange-600 text-white rotate-180" : "bg-slate-50 text-slate-400"}`}
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
                        {expandedCategory === cat.id &&
                          cat.megaMenu?.columns && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="bg-slate-50 overflow-hidden border-t border-slate-100"
                            >
                              {cat.megaMenu.columns.map((col, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="px-14 py-3 border-b border-slate-100/50"
                                >
                                  <p className="text-[10px] font-black text-orange-600 uppercase mb-3 tracking-widest">
                                    {col.title}
                                  </p>
                                  <div className="space-y-3">
                                    {col.subItems?.map((sub, sIdx) => (
                                      <Link
                                        key={sIdx}
                                        href="#"
                                        onClick={() =>
                                          setIsMobileMenuOpen(false)
                                        }
                                        className="block text-[12px] font-bold text-slate-500 py-1"
                                      >
                                        {sub}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                <div className="bg-white mb-4">
                  <div className="px-5 py-3 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Hızlı Menü
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-slate-100">
                    {secondaryLinks.map((link, i) => (
                      <Link
                        key={i}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex flex-col items-center justify-center p-6 bg-white transition-colors ${link.highlight ? "text-orange-600" : "text-slate-600"}`}
                      >
                        <span className="mb-2">{link.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-tighter text-center">
                          {link.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <a
                    href="tel:+905343529420"
                    className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white py-4  font-black text-[11px] tracking-widest uppercase"
                  >
                    <Phone size={16} /> 0534 352 94 20
                  </a>
                  <a
                    href="https://wa.me/905343529420"
                    target="_blank"
                    className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4  font-black text-[11px] tracking-widest uppercase"
                  >
                    <MessageCircleMore size={18} /> WHATSAPP HATTI
                  </a>
                </div>
              </div>

              <div className="p-8 border-t bg-white flex justify-center gap-8 items-center shrink-0">
                <a href="#" className="text-slate-400 hover:text-orange-600">
                  <Instagram size={22} />
                </a>
                <a href="#" className="text-slate-400 hover:text-blue-600">
                  <Facebook size={22} />
                </a>
                <a
                  href="mailto:ispoolofficial@gmail.com"
                  className="text-slate-400 hover:text-red-500"
                >
                  <Mail size={22} />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav
        className="w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 hidden lg:block sticky top-0 z-40"
        onMouseLeave={() => setActiveCategory(null)}
      >
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                onMouseEnter={() => setActiveCategory(cat.id)}
                className={`group relative flex items-center gap-2 h-full px-3 transition-all duration-300 ${activeCategory === cat.id ? "text-orange-600" : "text-slate-600 hover:text-slate-950"}`}
              >
                <CategoryIcon id={cat.id} size={17} />
                <span
                  className={`text-[10px] font-black tracking-widest uppercase ${cat.id === "indirim" ? "text-red-600" : ""}`}
                >
                  {cat.label}
                </span>
                {activeCategory === cat.id && (
                  <motion.div
                    layoutId="activeTab"
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
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-slate-100 py-10"
            >
              <div className="max-w-[1600px] mx-auto px-10">
                {currentCategory.megaMenu.isBrands ? (
                  <div className="grid grid-cols-6 gap-4">
                    {currentCategory.megaMenu.images?.map((src, i) => (
                      <div
                        key={i}
                        className="h-16 border border-slate-100 flex items-center justify-center p-3 grayscale hover:grayscale-0 cursor-pointer"
                      >
                        <img
                          src={src}
                          className="max-h-full object-contain"
                          alt="Brand"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-x-16 gap-y-10">
                    {currentCategory.megaMenu.columns?.map((col, idx) => (
                      <div key={idx} className="min-w-[180px]">
                        <h4 className="text-[11px] font-black text-orange-600 uppercase mb-5 tracking-[0.2em] border-b border-slate-50 pb-2">
                          {col.title}
                        </h4>
                        <ul className="space-y-2">
                          {col.subItems?.map((sub, i) => (
                            <li key={i}>
                              <Link
                                href="#"
                                className="text-[13px] font-bold text-slate-500 hover:text-orange-600 block"
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
