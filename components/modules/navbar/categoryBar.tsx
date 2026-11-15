"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  X,
  ArrowRight,
  Instagram,
  Facebook,
  Phone,
  MessageCircleMore,
  Mail,
  Truck,
  ChevronRight,
  Briefcase,
  Ruler,
  Package,
  Info,
  Images,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
// Orta kategori ikonları DB'de saklanmıyor; yalnızca ikon görselini isim
// eşleşmesiyle zenginleştirmek için statik veri kullanılıyor. Kategori/alt
// kategori id'leri ve hiyerarşisi artık gerçek DB verisinden (/api/category)
// geliyor.
import middleCategoriesDataRaw from "@/data/middleCategories.json";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { sortCategoriesByDisplayOrder } from "@/lib/categoryOrder";

// ─── Tip Tanımlamaları ───────────────────────────────────────────────────────
interface MiddleCategoryInput {
  name: string;
  categoryName: string;
  icon?: string;
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
interface ShowcaseImageItem {
  id: number;
  image: string;
  title: string | null;
}

export default function CategoryBar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: any) {
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [showShowcase, setShowShowcase] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<ShowcaseImageItem | null>(
    null,
  );
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  const [expandedMiddleCategory, setExpandedMiddleCategory] = useState<
    number | null
  >(null);

  // ─── Otomatik Kapanma (Efekt) ─────────────────────────────────────────────
  useEffect(() => {
    setActiveCategory(null);
    setIsMobileMenuOpen(false);
    setShowShowcase(false);
    setExpandedCategory(null);
  }, [pathname, setIsMobileMenuOpen]);

  // ─── Veri İşleme ──────────────────────────────────────────────────────────
  // İkonlar sadece statik JSON'da var; isimle eşleştirilip DB verisine iliştirilir.
  const middleCategoryIcons = useMemo(() => {
    const map = new Map<string, string | undefined>();
    (middleCategoriesDataRaw as MiddleCategoryInput[]).forEach((mid) => {
      map.set(mid.name, mid.icon);
    });
    return map;
  }, []);

  const [categories, setCategories] = useState<DbCategory[]>([]);

  useEffect(() => {
    fetch("/api/category")
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;
        if (Array.isArray(data.categories)) {
          // Yalnızca ekrandaki gösterim sırası değişir (lib/categoryOrder.ts).
          setCategories(
            sortCategoriesByDisplayOrder(
              data.categories.map((cat: DbCategory) => ({
                ...cat,
                middleCategories: cat.middleCategories.map((mid) => ({
                  ...mid,
                  icon: middleCategoryIcons.get(mid.name),
                })),
              })),
              (cat: DbCategory) => cat.name,
            ),
          );
        }
      })
      .catch((err) => console.error("Kategori verileri alınamadı:", err));
  }, [middleCategoryIcons]);

  const [showcaseImages, setShowcaseImages] = useState<ShowcaseImageItem[]>(
    [],
  );

  useEffect(() => {
    fetch("/api/showcase")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.images)) {
          setShowcaseImages(data.images);
        }
      })
      .catch((err) =>
        console.error("Örnek çalışma verileri alınamadı:", err),
      );
  }, []);

  const secondaryLinks = [
    {
      label: "Kargo Takibi",
      icon: <Truck size={16} />,
      href: "/profile/cargo_tracking",
    },
    {
      label: "Özel Tasarım",
      icon: <Ruler size={16} />,
      href: "/products/special_production",
    },
    {
      label: "Örnek Çalışmalar",
      icon: <Images size={16} />,
      href: "/products/special_production/gallery",
    },
    {
      label: "Toplu Alım",
      icon: <Package size={16} />,
      href: "/products/wholesale",
    },
    { label: "İletişim", icon: <Mail size={16} />, href: "/help/contact" },
    {
      label: "Hakkımızda",
      icon: <Info size={16} />,
      href: "/institutional/about",
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
  const isGalleryActive = pathname.startsWith(
    "/products/special_production/gallery",
  );

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

      {/* ================= DESKTOP NAV - data-category-bar attribute eklendi ================= */}
      <nav
        data-category-bar="true"
        className="hidden lg:block sticky top-0 z-49"
        onMouseLeave={() => {
          setActiveCategory(null);
          setShowShowcase(false);
        }}
      >
        <div className="box-border h-14 bg-sax-800 ">
          <div className="relative z-10 max-w-8xl mx-auto h-full px-8 flex items-stretch">
            {/* Sol: kategoriler ve sabit bağlantılar, eşit aralıklı */}
            <div className="flex flex-1 items-stretch">
              {categories.map((cat) => {
                const href = `/products/category/${cat.id}`;
                const isActive =
                  pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={cat.id}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    onMouseEnter={() => {
                      setActiveCategory(cat.id);
                      setShowShowcase(false);
                    }}
                    className={`group relative flex flex-1 min-w-0 items-center justify-center px-3 text-center text-[14px] font-semibold leading-tight transition-colors duration-200 hover:text-sax-100 focus-visible:text-sax-100 focus-visible:outline-none ${isActive ? "text-sax-100" : "text-white"}`}
                  >
                    {cat.name}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 bottom-0 h-[2px] bg-orange-500 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 ${isActive ? "opacity-100" : "opacity-0"}`}
                    />
                  </Link>
                );
              })}

              {/* ÖZEL TASARIMLAR - hover'da önizleme gösterir, tıklanınca galeri sayfasına yönlendirir */}
              <Link
                href="/products/special_production/gallery"
                aria-current={isGalleryActive ? "page" : undefined}
                onMouseEnter={() => {
                  setActiveCategory(null);
                  setShowShowcase(true);
                }}
                className={`group relative flex flex-1 min-w-0 items-center justify-center px-3 text-center text-[14px] font-semibold leading-tight transition-colors duration-200 hover:text-sax-100 focus-visible:text-sax-100 focus-visible:outline-none ${isGalleryActive ? "text-sax-100" : "text-white"}`}
              >
                Özel tasarımlar
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 bottom-0 h-[2px] bg-orange-500 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 ${isGalleryActive ? "opacity-100" : "opacity-0"}`}
                />
              </Link>

              {/* EN YENİLER - Query parameter ile sort bilgisi eklendi */}
              <Link
                href="/products?sort=dateNew"
                className="group relative flex flex-1 min-w-0 items-center justify-center px-3 text-center text-[14px] font-semibold leading-tight text-white transition-colors duration-200 hover:text-sax-100 focus-visible:text-sax-100 focus-visible:outline-none"
              >
                En yeniler
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 bottom-0 h-[2px] bg-orange-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
              </Link>
            </div>

            {/* Sağ uç: Fırsatlar (eski İNDİRİM bağlantısıyla aynı adres) */}
            <Link
              href="/products?discount=true"
              className="group relative ml-6 flex shrink-0 items-center gap-2 px-3 text-[14px] font-semibold text-white transition-colors duration-200 hover:text-sax-100 focus-visible:text-sax-100 focus-visible:outline-none"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-orange-500"
              />
              Fırsatlar
              <span
                aria-hidden="true"
                className="absolute inset-x-3 bottom-0 h-[2px] bg-orange-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
              />
            </Link>
          </div>
        </div>
        {/* MEGA MENU & BRANDS */}
        <AnimatePresence>
          {activeCategory && currentCategory?.middleCategories && (
            <motion.div
              initial={{ opacity: 0, y: 5, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 5, x: "-50%" }}
              className="absolute left-1/2 top-full w-[95vw] max-w-[1500px] max-h-[calc(100vh-200px)] overflow-y-auto overscroll-contain bg-white border-t-[3px] border-sax-800 rounded-xl shadow-lg z-50"
            >
              <div className="mx-auto px-8 py-6 grid grid-cols-[200px_1fr] items-start gap-10">
                {/* Sol: öne çıkan alan (mevcut kategori adı) */}
                <div className="border-r border-sax-100 pr-8">
                  <Link
                    href={`/products/category/${currentCategory.id}`}
                    className="group/feat block"
                  >
                    <h3 className="text-xl font-semibold text-sax-800 group-hover/feat:text-sax-600 transition-colors">
                      {currentCategory.name}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-sax-800 group-hover/feat:text-sax-600 transition-colors">
                      Tümünü Gör
                      <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>

                {/* Sağ: lg'de 4, xl'de 5 sütun liste */}
                <div className="grid grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-5">
                  {currentCategory.middleCategories.map((mid) => (
                    <div key={mid.id}>
                      <Link
                        href={`/products/category/${currentCategory.id}/${mid.id}`}
                        className="block"
                      >
                        <h4 className="pb-2 mb-3 border-b border-sax-100 text-[12px] font-semibold uppercase tracking-widest text-sax-800">
                          {mid.name}
                        </h4>
                      </Link>

                      <ul className="space-y-1.5">
                        {mid.subCategories.map((sub) => (
                          <li key={sub.id}>
                            <Link
                              href={`/products/category/${currentCategory.id}/${mid.id}/${sub.id}`}
                              className="text-[14px] text-slate-700 hover:text-sax-600 transition-colors block"
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

          {showShowcase && (
            <motion.div
              initial={{ opacity: 0, y: 5, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 5, x: "-50%" }}
              className="absolute left-1/2 top-full w-[95vw] max-w-[1400px] bg-white border border-slate-200 shadow-2xl z-50 rounded-b-2xl"
            >
              <div className="mx-auto px-8 py-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                    Özel Tasarım Örnek Çalışmalar
                  </h3>
                  <Link
                    href="/products/special_production/gallery"
                    className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-orange-700 hover:text-orange-600 transition-colors"
                  >
                    Tümünü Gör
                    <ArrowRight size={14} />
                  </Link>
                </div>
                {showcaseImages.length > 0 ? (
                  <div className="grid grid-cols-6 gap-6">
                    {showcaseImages.slice(0, 6).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setLightboxImage(item)}
                        className="relative w-full aspect-square rounded-lg overflow-hidden bg-white border border-slate-200 hover:shadow-md transition-all cursor-zoom-in group"
                      >
                        <Image
                          src={item.image}
                          alt={item.title || "Özel üretim örnek çalışma"}
                          fill
                          className="object-contain p-1.5 transition-transform group-hover:scale-105"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    Henüz örnek çalışma eklenmedi.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Örnek Çalışma Büyütme (Lightbox) — sticky/z-index'li atalardan (navbar,
          topbar) kaçmak için document.body'e portallanıyor; aksi halde bu
          bileşenin sticky/z-49 sarmalayıcısının stacking context'inde
          sıkışıp onların altında kalıyordu. */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {lightboxImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-9999 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
                onClick={() => setLightboxImage(null)}
              >
                <button
                  type="button"
                  className="absolute top-6 right-6 text-white/80 hover:text-white"
                  onClick={() => setLightboxImage(null)}
                  aria-label="Kapat"
                >
                  <X className="w-8 h-8" />
                </button>
                <div
                  className="relative w-full max-w-2xl aspect-square bg-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={lightboxImage.image}
                    alt={
                      lightboxImage.title ||
                      "Özel üretim örnek çalışma büyük görünüm"
                    }
                    fill
                    className="object-contain p-4"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
