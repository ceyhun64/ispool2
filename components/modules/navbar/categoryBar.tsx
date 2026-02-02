"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
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

// ─── Ana Kategori İkon (name-based fallback) ────────────────────────────────
const CategoryIcon = ({ name, size = 18 }: { name: string; size?: number }) => {
  const n = name.toLowerCase();
  if (n.includes("elbise") || n.includes("giyim")) return <Shirt size={size} />;
  if (n.includes("ayak") || n.includes("ayakkabı"))
    return <Footprints size={size} />;
  if (n.includes("el koruma") || n.includes("eldiven"))
    return <Hand size={size} />;
  if (n.includes("teknik") || n.includes("yanmaz"))
    return <Flame size={size} />;
  if (n.includes("donanım") || n.includes("ekipman") || n.includes("güvenlik"))
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
  const [scrollProgress, setScrollProgress] = useState(0); // 0 = top, 1 = scrolled
  const [showBrands, setShowBrands] = useState(false);

  const isScrolled = scrollProgress > 0.5; // metin rengi için threshold

  // JSON verilerini type-cast ediyoruz
  const categoriesData = categoriesDataRaw as CategoryInput[];
  const middleCategoriesData = middleCategoriesDataRaw as MiddleCategoryInput[];
  const subCategoriesData = subCategoriesDataRaw as SubCategoryInput[];

  const brands = Array.from({ length: 11 }, (_, i) => ({
    id: i + 1,
    image: `/brands/${i + 1}.png`,
    name: `Brand ${i + 1}`,
  }));

  // JSON dosyalarından hiyerarşik yapı oluştur
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
        const middleCategory: DbMiddleCategory = {
          id: index + 1,
          name: mid.name,
          icon: mid.icon,
          subCategories: [],
        };
        parentCategory.middleCategories.push(middleCategory);
      }
    });

    subCategoriesData.forEach((sub, index) => {
      categoryMap.forEach((category) => {
        const middleCategory = category.middleCategories.find(
          (m) => m.name === sub.middleCategoryName,
        );
        if (middleCategory) {
          middleCategory.subCategories.push({
            id: index + 1,
            name: sub.name,
          });
        }
      });
    });

    return Array.from(categoryMap.values()).sort((a, b) => a.id - b.id);
  }, [categoriesData, middleCategoriesData, subCategoriesData]);

  // Scroll takibi — smooth progress hesaplama
  useEffect(() => {
    const SCROLL_RANGE = 80; // 0–80px arasında geçiş tamamlanır

    const handleScroll = () => {
      const progress = Math.min(window.scrollY / SCROLL_RANGE, 1);
      setScrollProgress(progress);
    };

    // İlk render'da mevcut scroll pozisyonu okuyalım
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

  // height interpolation: 80px → 64px
  const navHeight = 80 - scrollProgress * 16;

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
                              <div className="flex items-center gap-2 mb-3">
                                {mid.icon && (
                                  <img
                                    src={mid.icon}
                                    alt={mid.name}
                                    width={18}
                                    height={18}
                                    className="object-contain"
                                  />
                                )}
                                <p className="text-[10px] font-black uppercase text-orange-600">
                                  {mid.name}
                                </p>
                              </div>
                              <div className="space-y-3">
                                {mid.subCategories.map((sub) => (
                                  <Link
                                    key={sub.id}
                                    href={`/products/category/${cat.id}/${mid.id}/${sub.id}`}
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
        className="hidden lg:block sticky top-0 z-[100] relative"
        onMouseLeave={() => setActiveCategory(null)}
      >
        {/* Katmanlı arkaplan: gradient + beyaz overlay */}
        {/* Gradient her zaman var, üstüne beyaz overlay opacity ile geçiş yapar */}
        <div
          className="absolute inset-0 bg-linear-to-r from-amber-600 via-amber-500 to-amber-600"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-white"
          style={{ opacity: scrollProgress }}
          aria-hidden="true"
        />
        {/* Shadow: scroll ettikçe belir */}
        <div
          className="absolute inset-0 shadow-md pointer-events-none"
          style={{ opacity: scrollProgress }}
          aria-hidden="true"
        />

        {/* Içerik */}
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
                  onMouseEnter={() => setActiveCategory(cat.id)}
                  className="relative text-[14px] px-2 font-bold flex items-center justify-center text-center uppercase
                    after:content-[''] after:absolute after:right-0 after:h-1/2 after:w-[1px] after:top-1/4
                    last:after:hidden"
                  style={{
                    // Metin: beyaz → slate-700
                    color: `rgb(${Math.round(255 - scrollProgress * 166)}, ${Math.round(255 - scrollProgress * 220)}, ${Math.round(255 - scrollProgress * 224)})`,
                    // Çizgi: white/30 → slate-200
                  }}
                >
                  {/* Çizgi ayrı element → kendi opacity kontrolü */}
                  <span
                    className="absolute right-0 top-1/4 h-1/2 w-[1px]"
                    style={{
                      backgroundColor: `rgba(255,255,255,${1 - scrollProgress * 0.7})`,
                      opacity: scrollProgress > 0.9 ? 0.4 : 1,
                    }}
                  />
                  {cat.name}
                </Link>
              ))}

              {/* REFERANSLAR */}
              <div
                onMouseEnter={() => {
                  setActiveCategory(null);
                  setShowBrands(true);
                }}
                onMouseLeave={() => setShowBrands(false)}
                className="relative"
              >
                <Link
                  href="/brands"
                  className="relative py-2 text-[14px] font-bold uppercase flex items-center justify-center text-center h-full"
                  style={{
                    color: `rgb(${Math.round(255 - scrollProgress * 166)}, ${Math.round(255 - scrollProgress * 220)}, ${Math.round(255 - scrollProgress * 224)})`,
                  }}
                >
                  <span
                    className="absolute right-0 top-1/4 h-1/2 w-[1px]"
                    style={{
                      backgroundColor: `rgba(255,255,255,${1 - scrollProgress * 0.7})`,
                      opacity: scrollProgress > 0.9 ? 0.4 : 1,
                    }}
                  />
                  REFERANSLAR
                </Link>
              </div>

              {/* EN YENİLER */}
              <Link
                href="/products"
                className="relative py-2 text-[14px] font-bold uppercase flex items-center justify-center text-center"
                style={{
                  color: `rgb(${Math.round(255 - scrollProgress * 166)}, ${Math.round(255 - scrollProgress * 220)}, ${Math.round(255 - scrollProgress * 224)})`,
                }}
              >
                <span
                  className="absolute right-0 top-1/4 h-1/2 w-[1px]"
                  style={{
                    backgroundColor: `rgba(255,255,255,${1 - scrollProgress * 0.7})`,
                    opacity: scrollProgress > 0.9 ? 0.4 : 1,
                  }}
                />
                EN YENİLER
              </Link>

              {/* İNDİRİM */}
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

        {/* MEGA MENU */}
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
                        onClick={() => {
                          setActiveCategory(null);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 mb-4 group/midlink"
                      >
                        {mid.icon && (
                          <div className="relative flex-shrink-0 transition-transform duration-200 group-hover/midlink:scale-110">
                            <img
                              src={mid.icon}
                              alt={mid.name}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                        )}
                        <h4 className="text-[13px] font-black uppercase text-slate-800 transition-colors duration-200 group-hover/midlink:text-orange-600 leading-tight">
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
                          className="object-contain transition-all"
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
