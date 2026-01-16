"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import Image from "next/image";

interface CollectionMegaMenuProps {
  collectionOpen: boolean;
  setCollectionOpen: (isOpen: boolean) => void;
  collectionLink: {
    subItems?: { label: string; href: string }[];
  };
}

const QUICK_LINKS = [
  { label: "Hikayemiz", href: "/institutional/about" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/contact" },
  { label: "Sıkça Sorulan Sorular", href: "/faq" },
];

const containerVariants = {
  hidden: { opacity: 0, y: "-100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.19, 1, 0.22, 1],
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: "-100%",
    transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function CollectionMegaMenu({
  collectionOpen,
  setCollectionOpen,
  collectionLink,
}: CollectionMegaMenuProps) {
  useEffect(() => {
    if (collectionOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [collectionOpen]);

  return (
    <AnimatePresence mode="wait">
      {collectionOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-md z-[55]"
            onClick={() => setCollectionOpen(false)}
          />

          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 right-0 bg-white z-[60] border-b border-slate-100 shadow-2xl h-screen md:h-auto max-h-screen overflow-y-auto lg:overflow-hidden"
          >
            <div className="max-w-[1400px] mx-auto pt-24 pb-12 md:pt-32 md:pb-20 px-6 md:px-12">
              {/* Close Button */}
              <button
                onClick={() => setCollectionOpen(false)}
                className="absolute top-8 right-6 md:top-10 md:right-10 group p-2"
              >
                <X
                  className="w-6 h-6 text-slate-400 group-hover:text-slate-900 transition-colors"
                  strokeWidth={1}
                />
              </button>

              <div className="grid grid-cols-12 gap-y-12 md:gap-12 lg:gap-24">
                {/* 1. Kısım: Koleksiyonlar (Mobilde en üstte ve en dikkat çekici) */}
                <div className="col-span-12 md:col-span-6 lg:col-span-5 order-1">
                  <motion.h4
                    variants={itemVariants}
                    className="text-[8px] md:text-[9px] tracking-[0.5em] text-slate-500 uppercase font-medium mb-6 md:mb-8"
                  >
                    KOLEKSİYONLAR
                  </motion.h4>
                  <div className="flex flex-col">
                    {collectionLink.subItems?.map((item, idx) => (
                      <motion.div key={idx} variants={itemVariants}>
                        <Link
                          href={item.href}
                          onClick={() => setCollectionOpen(false)}
                          className="group flex items-center justify-between py-4 md:py-5 border-b border-slate-50 transition-all duration-500 hover:border-slate-900"
                        >
                          <span className="text-2xl md:text-4xl font-extralight text-slate-800 tracking-tighter group-hover:italic transition-all duration-500">
                            {item.label}
                          </span>
                          <span className="text-[10px] tracking-widest text-slate-500 opacity-0 md:group-hover:opacity-100 transition-opacity uppercase hidden md:block">
                            Keşfet
                          </span>
                          <ArrowRight
                            className="w-4 h-4 text-slate-300 md:hidden"
                            strokeWidth={1}
                          />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 2. Kısım: Hızlı Linkler (Mobilde orta) */}
                <div className="col-span-12 md:col-span-3 order-2">
                  <motion.div variants={itemVariants}>
                    <h4 className="text-[8px] md:text-[9px] tracking-[0.5em] text-slate-400 uppercase font-medium mb-6 md:mb-8">
                      MENÜ
                    </h4>
                    <nav className="grid grid-cols-2 md:grid-cols-1 gap-y-4 md:gap-5">
                      {QUICK_LINKS.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={() => setCollectionOpen(false)}
                          className="text-xs md:text-sm text-slate-500 hover:text-slate-900 transition-colors tracking-tight font-light"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                  </motion.div>
                </div>

                {/* 3. Kısım: Görsel (Mobilde alt) */}
                <motion.div
                  variants={itemVariants}
                  className="col-span-12 md:col-span-3 lg:col-span-4 order-3"
                >
                  <Link
                    href="/products"
                    onClick={() => setCollectionOpen(false)}
                    className="group relative block w-full aspect-[16/9] md:aspect-[3/4] overflow-hidden bg-slate-50 rounded-[2px]"
                  >
                    <Image
                      src="/megaMenu/megaMenu.webp"
                      alt="Yeni Koleksiyon"
                      fill
                      className="object-cover  opacity-90 group-hover:scale-105 transition-all duration-[1.5s]"
                    />
                    <div className="absolute inset-0 bg-black/10 md:bg-transparent group-hover:bg-transparent transition-colors" />
                    <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
                      <p className="text-[8px] tracking-[0.4em] text-white uppercase mb-1">
                        Sezon Özeli
                      </p>
                      <h3 className="text-lg md:text-xl font-light text-white italic tracking-tight">
                        Minimalist Yaşam Sanatı
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              </div>

              {/* Alt Bilgi */}
              <div className="mt-12 pt-8 border-t border-slate-50 md:border-none">
                <p className="text-[7px] md:text-[8px] text-slate-600 tracking-[0.6em] text-center uppercase">
                  İşPool Furniture — Est. 2026
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
