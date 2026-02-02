"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shirt,
  Footprints,
  Hand,
  HardHat,
  Shield,
  Flame,
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
  Briefcase,
  Ruler,
  Package,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import categoriesDataRaw from "@/data/categories.json";
import middleCategoriesDataRaw from "@/data/middleCategories.json";
import subCategoriesDataRaw from "@/data/subCategories.json";
import Image from "next/image";

// ─── Tip Tanımlamaları ───────────────────────────────────────────────────────
interface CategoryInput {
  name: string;
}
interface MiddleCategoryInput {
  name: string;
  categoryName: string;
  icon?: string;
}
interface SubCategoryInput {
  name: string;
  middleCategoryName: string;
}

interface DbSubCategory {
  id: number;
  name: string;
}
interface DbMiddleCategory {
  id: number;
  name: string;
  icon?: string;
  subCategories: DbSubCategory[];
}
interface DbCategory {
  id: number;
  name: string;
  middleCategories: DbMiddleCategory[];
}

export default function CategoryBar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: any) {
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBrands, setShowBrands] = useState(false);
  const [expandedMiddleCategory, setExpandedMiddleCategory] = useState<
    number | null
  >(null);

  // ─── Otomatik Kapanma (Efekt) ─────────────────────────────────────────────
  useEffect(() => {
    setActiveCategory(null);
    setIsMobileMenuOpen(false);
    setShowBrands(false);
    setExpandedCategory(null);
  }, [pathname, setIsMobileMenuOpen]);

  // ─── Veri İşleme ──────────────────────────────────────────────────────────
  const categoriesData = categoriesDataRaw as CategoryInput[];
  const middleCategoriesData = middleCategoriesDataRaw as MiddleCategoryInput[];
  const subCategoriesData = subCategoriesDataRaw as SubCategoryInput[];

  const brands = Array.from({ length: 11 }, (_, i) => ({
    id: i + 1,
    image: `/brands/${i + 1}.png`,
    name: `Brand ${i + 1}`,
  }));

  const categories = useMemo(() => {
    const categoryMap = new Map<string, DbCategory>();
    categoriesData.forEach((cat, index) => {
      categoryMap.set(cat.name, {
        id: index + 1,
        name: cat.name,
        middleCategories: [],
      });
    });
    middleCategoriesData.forEach((mid, index) => {
      const parentCategory = categoryMap.get(mid.categoryName);
      if (parentCategory) {
        parentCategory.middleCategories.push({
          id: index + 1,
          name: mid.name,
          icon: mid.icon,
          subCategories: [],
        });
      }
    });
    subCategoriesData.forEach((sub, index) => {
      categoryMap.forEach((category) => {
        const middleCategory = category.middleCategories.find(
          (m) => m.name === sub.middleCategoryName,
        );
        if (middleCategory) {
          middleCategory.subCategories.push({ id: index + 1, name: sub.name });
        }
      });
    });
    return Array.from(categoryMap.values()).sort((a, b) => a.id - b.id);
  }, [categoriesData, middleCategoriesData, subCategoriesData]);

  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / 80, 1);
      setScrollProgress(progress);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const secondaryLinks = [
    { label: "İletişim", icon: <Mail size={16} />, href: "/help/contact" },
    {
      label: "Toptan Satış",
      icon: <Package size={16} />,
      href: "/products/wholesale",
    },
    {
      label: "Özel Üretim",
      icon: <Ruler size={16} />,
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
  const navHeight = 80 - scrollProgress * 16;

  return (
    <>
      {/* ================= MOBILE MENU WITH SHEET ================= */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-full p-0 flex flex-col custom-scrollbar"
        >
          <SheetHeader className="p-5 border-b border-slate-100">
            <SheetTitle className="text-left">
              <p className="text-lg font-black uppercase text-slate-900">
                İŞPOOL
              </p>
              <p className="text-[9px] tracking-widest text-orange-600 font-bold uppercase">
                Endüstriyel Güvenlik
              </p>
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <p className="px-5 py-3 text-[10px] font-black tracking-widest text-slate-400 uppercase bg-slate-50">
              Kategoriler
            </p>

            {categories.map((cat) => (
              <div key={cat.id} className="border-b border-slate-100/50">
                <div className="flex items-center justify-between px-5 py-4">
                  <Link
                    href={`/products/category/${cat.id}`}
                    className="text-[13px] font-bold uppercase text-slate-700"
                  >
                    {cat.name}
                  </Link>
                  {cat.middleCategories.length > 0 && (
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
                          className="border-t border-slate-200/40"
                        >
                          <div className="flex items-center justify-between px-8 py-3.5">
                            <Link
                              href={`/products/category/${cat.id}/${mid.id}`}
                              className="flex items-center gap-2"
                            >
                              {mid.icon && (
                                <img
                                  src={mid.icon}
                                  alt={mid.name}
                                  className="w-4 h-4 object-contain"
                                />
                              )}
                              <span className="text-[11px] font-bold uppercase text-slate-600">
                                {mid.name}
                              </span>
                            </Link>
                            {mid.subCategories.length > 0 && (
                              <button
                                onClick={() =>
                                  setExpandedMiddleCategory(
                                    expandedMiddleCategory === mid.id
                                      ? null
                                      : mid.id,
                                  )
                                }
                                className="text-slate-400 p-1"
                              >
                                {expandedMiddleCategory === mid.id ? (
                                  <Minus size={14} />
                                ) : (
                                  <Plus size={14} />
                                )}
                              </button>
                            )}
                          </div>

                          <AnimatePresence>
                            {expandedMiddleCategory === mid.id && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                className="bg-white overflow-hidden"
                              >
                                <div className="pl-14 pr-5 py-2 space-y-3 pb-4">
                                  {mid.subCategories.map((sub) => (
                                    <Link
                                      key={sub.id}
                                      href={`/products/category/${cat.id}/${mid.id}/${sub.id}`}
                                      className="flex items-center justify-between text-[12px] font-medium text-slate-500 hover:text-orange-600"
                                    >
                                      {sub.name}{" "}
                                      <ChevronRight
                                        size={14}
                                        className="opacity-30"
                                      />
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <div className="bg-white mt-4">
              <p className="px-5 py-3 text-[10px] font-black tracking-widest text-slate-400 uppercase bg-slate-50">
                Hızlı Menü
              </p>
              <div className="grid grid-cols-2 gap-px bg-slate-200">
                {secondaryLinks.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="p-6 bg-white flex flex-col items-center gap-2 text-[10px] font-black uppercase text-slate-600"
                  >
                    <span className="text-slate-400">{link.icon}</span>{" "}
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-200 flex justify-center gap-8 bg-white">
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
        </SheetContent>
      </Sheet>

      {/* ================= DESKTOP NAV ================= */}
      <nav
        className="hidden lg:block sticky top-0 z-[100]"
        onMouseLeave={() => {
          setActiveCategory(null);
          setShowBrands(false);
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-white transition-opacity duration-300"
          style={{ opacity: scrollProgress }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 shadow-md pointer-events-none"
          style={{ opacity: scrollProgress }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-8xl mx-auto">
          <div
            className="flex items-center justify-center px-6"
            style={{ height: `${navHeight}px`, transition: "height 0.3s ease" }}
          >
            <div className="grid grid-cols-9 w-full">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products/category/${cat.id}`}
                  onMouseEnter={() => {
                    setActiveCategory(cat.id);
                    setShowBrands(false);
                  }}
                  className="relative text-[14px] px-2 font-bold flex items-center justify-center text-center uppercase transition-colors duration-300"
                  style={{
                    color: scrollProgress > 0.5 ? "#334155" : "#ffffff",
                  }}
                >
                  <span
                    className="absolute right-0 top-1/4 h-1/2 w-[1px] bg-white/30"
                    style={{ opacity: scrollProgress > 0.8 ? 0.2 : 1 }}
                  />
                  {cat.name}
                </Link>
              ))}

              <div
                onMouseEnter={() => {
                  setActiveCategory(null);
                  setShowBrands(true);
                }}
              >
                <Link
                  href="/brands"
                  className="relative py-2 text-[14px] font-bold uppercase flex items-center justify-center text-center h-full transition-colors duration-300"
                  style={{
                    color: scrollProgress > 0.5 ? "#334155" : "#ffffff",
                  }}
                >
                  <span className="absolute right-0 top-1/4 h-1/2 w-[1px] bg-white/30" />
                  REFERANSLAR
                </Link>
              </div>

              <Link
                href="/products"
                className="relative py-2 text-[14px] font-bold uppercase flex items-center justify-center text-center transition-colors duration-300"
                style={{ color: scrollProgress > 0.5 ? "#334155" : "#ffffff" }}
              >
                <span className="absolute right-0 top-1/4 h-1/2 w-[1px] bg-white/30" />
                EN YENİLER
              </Link>

              <Link
                href="/products?discount=true"
                className="py-2 text-[14px] font-bold uppercase flex items-center justify-center text-center"
              >
                <span className="bg-[#ff2d2d] text-white px-4 py-1.5 rounded-md shadow-sm hover:bg-red-700 transition-colors">
                  İNDİRİM
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* MEGA MENU & BRANDS */}
        <AnimatePresence>
          {activeCategory && currentCategory?.middleCategories && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute left-0 w-full bg-white border-y border-slate-200 shadow-xl z-50"
            >
              <div className="max-w-[1400px] mx-auto px-8 py-10">
                <div className="grid grid-cols-5 gap-8">
                  {currentCategory.middleCategories.map((mid) => (
                    <div key={mid.id}>
                      <Link
                        href={`/products/category/${currentCategory.id}/${mid.id}`}
                        className="flex items-center gap-3 mb-4 group/midlink"
                      >
                        {mid.icon && (
                          <img
                            src={mid.icon}
                            alt={mid.name}
                            width={32}
                            height={32}
                            className="object-contain group-hover/midlink:scale-110 transition-transform"
                          />
                        )}
                        <h4 className="text-[13px] font-black uppercase text-slate-800 group-hover/midlink:text-orange-600 transition-colors">
                          {mid.name}
                        </h4>
                      </Link>
                      <ul className="space-y-2 border-l border-slate-100 ml-4 pl-4">
                        {mid.subCategories.map((sub) => (
                          <li key={sub.id}>
                            <Link
                              href={`/products/category/${currentCategory.id}/${mid.id}/${sub.id}`}
                              className="text-[13px] text-slate-500 hover:text-orange-600 transition-colors block"
                            >
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

          {showBrands && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute left-0 w-full bg-white border-b border-slate-200 shadow-xl z-50"
            >
              <div className="max-w-[1400px] mx-auto px-8 py-10">
                <div className="grid grid-cols-6 gap-6">
                  {brands.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/brands/${brand.id}`}
                      className="flex items-center justify-center p-6 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all hover:shadow-md group"
                    >
                      <div className="relative w-full h-16">
                        <Image
                          src={brand.image}
                          alt={brand.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </Link>
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
