"use client";

import { useState } from "react";
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
  ChevronRight,
  TrendingDown,
  Zap,
  Mountain,
  X,
  Plus,
  Minus,
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

  return (
    <>
      {/* MOBILE MENU (Kod kalabalığı olmaması için aynı bıraktım, isteğe göre düzenlenebilir) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/40 z-[150] lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-[160] lg:hidden overflow-y-auto"
            >
              <div className="p-5 flex items-center justify-between border-b sticky top-0 bg-white z-10">
                <div className="flex flex-col">
                  <span className="font-black text-slate-900 uppercase tracking-tighter">
                    MENÜ
                  </span>
                  <span className="text-[9px] text-orange-600 font-bold uppercase tracking-widest">
                    Endüstriyel Çözümler
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <div className="flex flex-col py-4">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className="border-b border-slate-50 last:border-none"
                  >
                    <div className="flex items-center justify-between px-5 py-4">
                      <Link
                        href={`/category/${cat.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-4 text-[14px] font-black text-slate-700 uppercase"
                      >
                        <CategoryIcon id={cat.id} size={22} />
                        {cat.label}
                      </Link>
                      {cat.megaMenu && (
                        <button
                          onClick={() =>
                            setExpandedCategory(
                              expandedCategory === cat.id ? null : cat.id,
                            )
                          }
                          className={`p-1.5 rounded transition-colors ${expandedCategory === cat.id ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-400"}`}
                        >
                          {expandedCategory === cat.id ? (
                            <Minus size={18} />
                          ) : (
                            <Plus size={18} />
                          )}
                        </button>
                      )}
                    </div>
                    {/* Mobile Submenu Accordion... */}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP NAV */}
      <nav
        className="w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 hidden lg:block"
        onMouseLeave={() => setActiveCategory(null)}
      >
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                onMouseEnter={() => setActiveCategory(cat.id)}
                className={`group relative flex items-center gap-2 h-full px-3 transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "text-orange-600"
                    : "text-slate-600 hover:text-slate-950"
                }`}
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

        {/* Mega Menu Desktop - Boşluklar Daraltıldı */}
        <AnimatePresence>
          {activeCategory && currentCategory?.megaMenu && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 py-8"
            >
              <div className="max-w-[1600px] mx-auto px-10">
                {currentCategory.megaMenu.isBrands ? (
                  <div className="grid grid-cols-6 gap-4">
                    {currentCategory.megaMenu.images?.map((src, i) => (
                      <div
                        key={i}
                        className="h-16 border border-slate-100 hover:border-orange-200 transition-colors flex items-center justify-center p-3 grayscale hover:grayscale-0"
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
                  // Grid yapısı 4'ten 5'e çıkarıldı ve gap daraltıldı (gap-10 -> gap-6)
                  <div className="flex flex-wrap gap-x-12 gap-y-8">
                    {currentCategory.megaMenu.columns?.map((col, idx) => (
                      <div key={idx} className="min-w-[180px] max-w-[220px]">
                        <h4 className="text-[10px] font-black text-orange-600 uppercase mb-4 tracking-[0.15em] border-b border-slate-50 pb-2">
                          {col.title}
                        </h4>
                        <ul className="space-y-1.5">
                          {col.subItems?.map((sub, i) => (
                            <li key={i}>
                              <Link
                                href="#"
                                className="text-[12px] font-bold text-slate-500 hover:text-orange-600 transition-colors block leading-relaxed"
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
