"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

// Tip Tanımlamaları (Filter bileşeniyle uyumlu)
interface DbSubCategory {
  id: number;
  name: string;
}
interface DbMiddleCategory {
  id: number;
  name: string;
  subCategories: DbSubCategory[];
}
interface DbCategory {
  id: number;
  name: string;
  middleCategories: DbMiddleCategory[];
}

const CategoryIcon = ({ name, size = 18 }: { name: string; size?: number }) => {
  const n = name.toLowerCase();
  if (n.includes("elbise") || n.includes("giyim")) return <Shirt size={size} />;
  if (n.includes("ayak") || n.includes("ayakkabı"))
    return <Footprints size={size} />;
  if (n.includes("el koruma") || n.includes("eldiven"))
    return <Hand size={size} />;
  if (n.includes("teknik") || n.includes("yanmaz"))
    return <Flame size={size} />;
  if (n.includes("donanım") || n.includes("ekipman"))
    return <HardHat size={size} />;
  if (n.includes("dış") || n.includes("outdoor"))
    return <Mountain size={size} />;
  return <Shield size={size} />;
};

export default function CategoryBar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: any) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<DbCategory[]>([]);

  // Verileri API'den çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Kategoriler yüklenirken hata:", error);
      }
    };
    fetchCategories();
  }, []);

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
  ];

  const socialMedia = [
    { icon: <Instagram size={22} />, href: "#", color: "hover:text-pink-600" },
    { icon: <Facebook size={22} />, href: "#", color: "hover:text-blue-600" },
    {
      icon: <Phone size={22} />,
      href: "tel:+905343529420",
      color: "hover:text-orange-600",
    },
    {
      icon: <MessageCircleMore size={22} />,
      href: "#",
      color: "hover:text-green-500",
    },
  ];

  const currentCategory = categories.find((c) => c.id === activeCategory);

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
              className="fixed inset-y-0 left-0 z-[210] w-[85%] max-w-[340px] bg-white lg:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b">
                <div>
                  <p className="text-lg font-black uppercase text-slate-900">
                    İŞPOOL
                  </p>
                  <p className="text-[9px] tracking-widest text-orange-600 font-bold uppercase">
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

              <div className="flex-1 overflow-y-auto">
                <p className="px-5 py-3 text-[10px] font-black tracking-widest text-slate-400 uppercase bg-slate-50">
                  Kategoriler
                </p>
                {categories.map((cat) => (
                  <div key={cat.id} className="border-b border-slate-50">
                    <div className="flex items-center justify-between px-5 py-4">
                      <Link
                        href={`/products/category/${cat.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-4 text-[13px] font-bold uppercase text-slate-700"
                      >
                        <span className="text-orange-600">
                          <CategoryIcon name={cat.name} />
                        </span>
                        {cat.name}
                      </Link>
                      {cat.middleCategories?.length > 0 && (
                        <button
                          onClick={() =>
                            setExpandedCategory(
                              expandedCategory === cat.id ? null : cat.id,
                            )
                          }
                          className={`p-1.5 rounded transition-all ${expandedCategory === cat.id ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-400"}`}
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
                      {expandedCategory === cat.id && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="bg-slate-50 overflow-hidden"
                        >
                          {cat.middleCategories.map((mid) => (
                            <div
                              key={mid.id}
                              className="px-14 py-4 border-t border-slate-200/50"
                            >
                              <p className="text-[10px] font-black uppercase text-orange-600 mb-3">
                                {mid.name}
                              </p>
                              <div className="space-y-3">
                                {mid.subCategories.map((sub) => (
                                  <Link
                                    key={sub.id}
                                    href={`/products/category/${cat.id}?sub=${sub.name}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between text-[12px] font-semibold text-slate-500 hover:text-orange-600"
                                  >
                                    {sub.name}{" "}
                                    <ChevronRight
                                      size={14}
                                      className="opacity-30"
                                    />
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

                <div className="bg-white mt-4 border-t">
                  <p className="px-5 py-3 text-[10px] font-black tracking-widest text-slate-400 uppercase bg-slate-50">
                    Hızlı Menü
                  </p>
                  <div className="grid grid-cols-2 gap-px bg-slate-200">
                    {secondaryLinks.map((link, i) => (
                      <Link
                        key={i}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-6 bg-white flex flex-col items-center gap-2 text-[10px] font-black uppercase text-slate-600"
                      >
                        <span className="text-slate-400">{link.icon}</span>{" "}
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t flex justify-center gap-8">
                {socialMedia.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    className={`text-slate-400 transition-all ${item.color}`}
                  >
                    {item.icon}
                  </a>
                ))}
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
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center h-14">
            {/* Kategoriler Sol Taraf */}
            <div className="flex items-center flex-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products/category/${cat.id}`}
                  onMouseEnter={() => setActiveCategory(cat.id)}
                  className={`relative flex items-center gap-2 px-4 h-14 text-[10px] font-black uppercase tracking-widest transition ${
                    activeCategory === cat.id
                      ? "text-orange-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <CategoryIcon name={cat.name} size={16} />
                  {cat.name}
                  {activeCategory === cat.id && (
                    <motion.span
                      layoutId="activeCategory"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-600"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Sağ Taraf: En Yeniler ve İndirim (Sabit Linkler) */}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-100">
              <Link
                href="/products"
                className="flex items-center gap-2 px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all group"
              >
                <Zap
                  size={16}
                  className="text-blue-500 group-hover:scale-110 transition-transform"
                />
                En Yeniler
              </Link>

              <Link
                href="/products"
                className="flex items-center gap-2 px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest text-white bg-orange-600 hover:bg-orange-700 shadow-lg  transition-all group"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/products?discount=true");
                }}
              >
                <TrendingDown
                  size={16}
                  className="group-hover:translate-y-0.5 transition-transform"
                />
                İndirim
              </Link>
            </div>
          </div>
        </div>

        {/* Dropdown Menü (Aynen Kalıyor) */}
        <AnimatePresence>
          {activeCategory && currentCategory?.middleCategories && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 w-full bg-white shadow-2xl border-t overflow-hidden"
            >
              <div className="max-w-[1600px] mx-auto flex">
                {/* SOL: Kategori Linkleri */}
                <div className="flex-1 px-12 py-10 flex gap-x-16 gap-y-10 flex-wrap border-r border-slate-50">
                  {currentCategory.middleCategories.map((mid) => (
                    <div key={mid.id} className="min-w-[180px]">
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-orange-600 mb-5">
                        {mid.name}
                      </h4>
                      <ul className="space-y-2.5">
                        {mid.subCategories.map((sub) => (
                          <li key={sub.id}>
                            <Link
                              href={`/products/category/${currentCategory.id}?sub=${sub.name}`}
                              className="text-[13px] font-semibold text-slate-500 hover:text-orange-600 transition-colors flex items-center group"
                            >
                              <span className="w-0 group-hover:w-2 h-px bg-orange-600 mr-0 group-hover:mr-2 transition-all"></span>
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

             
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}