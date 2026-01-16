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
  LayoutGrid,
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

export default function CategoryBar() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const currentCategory = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <nav
      className="sticky top-0 left-0 right-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/60 hidden lg:block shadow-sm"
      onMouseLeave={() => setActiveCategory(null)}
    >
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              onMouseEnter={() => setActiveCategory(cat.id)}
              className={`group relative flex items-center gap-2.5 h-full px-4 transition-all duration-300 ${
                activeCategory === cat.id
                  ? "text-orange-600"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <span
                className={`transition-transform duration-300 ${
                  activeCategory === cat.id
                    ? "scale-110"
                    : "group-hover:scale-110"
                }`}
              >
                <CategoryIcon id={cat.id} size={19} />
              </span>
              <span
                className={`text-[12px] font-black tracking-tight uppercase transition-colors ${
                  cat.id === "indirim" ? "text-red-600" : ""
                }`}
              >
                {cat.label}
              </span>

              {/* Active Underline Animation */}
              {activeCategory === cat.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange-600 shadow-[0_-4px_12px_rgba(234,88,12,0.3)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeCategory && currentCategory?.megaMenu && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 w-full bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border-t border-slate-100 overflow-hidden"
          >
            <div className="max-w-[1600px] mx-auto flex">
              {/* Left Side: Category Teaser (Ağır Sanayi Teması) */}
              <div className="w-64 bg-slate-50 p-8 border-r border-slate-100 hidden xl:flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-orange-600 flex items-center justify-center text-white mb-6">
                    <CategoryIcon id={currentCategory.id} size={24} />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 leading-tight uppercase ">
                    {currentCategory.label}
                  </h4>
                  <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">
                    Profesyonel standartlara uygun, dayanıklı ve yüksek
                    performanslı ürünler.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-orange-600 tracking-widest uppercase">
                  Tümünü Gör <ChevronRight size={14} />
                </div>
              </div>

              {/* MARKALAR İÇİN ÖZEL GÖRÜNÜM */}
              {currentCategory.megaMenu.isBrands ? (
                <div className="flex-1 p-10">
                  <div className="grid grid-cols-6 lg:grid-cols-9 gap-4">
                    {currentCategory.megaMenu.images?.map((src, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -5 }}
                        className="group relative h-20 flex items-center justify-center p-4 bg-white border border-slate-100 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
                      >
                        <img
                          src={src}
                          alt={`Brand ${idx + 1}`}
                          className="max-h-full max-w-full object-contain  transition-all duration-500 group-hover:opacity-100"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                /* STANDART MEGA MENU GÖRÜNÜMÜ */
                <div className="flex-1 flex flex-col">
                  <div className="p-10">
                    <div className="grid grid-cols-5 gap-x-12 gap-y-10">
                      {currentCategory.megaMenu.columns?.map((col, idx) => {
                        const hasSubItems =
                          col.subItems && col.subItems.length > 0;
                        return (
                          <div key={idx} className="flex flex-col">
                            <Link
                              href={`/category/${col.title
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                              className="group/title flex items-center justify-between mb-4"
                            >
                              <h3 className="text-[12px] font-black text-slate-900 tracking-wider uppercase group-hover/title:text-orange-600 transition-colors">
                                {col.title}
                              </h3>
                              <div className="h-[2px] w-4 bg-orange-600 opacity-0 group-hover/title:opacity-100 transition-all" />
                            </Link>

                            {hasSubItems && (
                              <ul className="space-y-2.5">
                                {col.subItems.map((item, i) => (
                                  <li key={i}>
                                    <Link
                                      href="#"
                                      className="text-[13px] text-slate-500 hover:text-orange-600 flex items-center group/item transition-all duration-200 font-medium"
                                    >
                                      <span className="w-0 group-hover:w-2 h-[1px] bg-orange-400 mr-0 group-hover:mr-2 transition-all duration-300" />
                                      {item}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* BOTTOM: FEATURED SECTION */}
                  {currentCategory.megaMenu.featured && (
                    <div className="mt-auto bg-slate-900 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-white/40 tracking-[0.3em] uppercase">
                            {currentCategory.megaMenu.featured.title}
                          </span>
                          <div className="h-[1px] w-20 bg-white/10" />
                        </div>
                        <div className="flex gap-3">
                          {currentCategory.megaMenu.featured.items.map(
                            (feat, i) => (
                              <motion.div
                                key={i}
                                whileHover={{ scale: 1.02 }}
                                className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-orange-600 transition-all cursor-pointer group flex items-center gap-4 min-w-[220px]"
                              >
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-white group-hover:text-white uppercase tracking-wide">
                                    {feat.name}
                                  </span>
                                  <span className="text-[10px] text-white/40 group-hover:text-white/80 font-medium uppercase">
                                    {feat.count} Ürün
                                  </span>
                                </div>
                                <ChevronRight
                                  size={14}
                                  className="ml-auto text-white/30 group-hover:text-white"
                                />
                              </motion.div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
