"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Heart, User, Search, X, Command, Menu } from "lucide-react";
import Image from "next/image";
import CategoryBar from "@/components/modules/navbar/categoryBar";
import CartDropdown from "@/components/modules/navbar/cartDropdown";
import { useFavorite } from "@/contexts/favoriteContext";
import UserMegaMenu from "@/components/modules/navbar/userMegaMenu";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { favorites } = useFavorite();
  const { scrollY } = useScroll();

  // SCROLL GİZLEME MANTIĞI
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (isMobileMenuOpen) {
      setHidden(false);
      return;
    }
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // BODY SCROLL KİLİDİ
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[150] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={isMobileMenuOpen ? "visible" : hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 left-0 right-0 z-[100] w-full flex flex-col bg-white"
      >
        <div className="relative z-10 bg-white border-b border-slate-100">
          <div className="max-w-[1700px] mx-auto px-5 md:px-12 flex flex-col">
            {/* ÜST SATIR: Logo ve Aksiyonlar */}
            <div className="h-16 md:h-[100px] flex items-center justify-between gap-4 md:gap-10">
              {/* LOGO */}
              <Link href="/" className="shrink-0 group flex items-center gap-5">
                <Image
                  src="/logo/logois2.png"
                  alt="ProSafe Logo"
                  width={140}
                  height={35}
                  className="object-contain w-[100px] md:w-[140px]"
                  priority
                />
                <div className="hidden xl:flex flex-col border-l-[1px] border-slate-200 pl-5 py-0.5">
                  <span className="text-[10px] font-black text-slate-900 tracking-[0.3em] uppercase leading-none">
                    PREMIUM
                  </span>
                  <span className="text-[10px] font-bold text-orange-600 tracking-[0.3em] uppercase leading-none mt-1">
                    KORUMA
                  </span>
                </div>
              </Link>

              {/* MASAÜSTÜ ARAMA (Orta Bölüm) */}
              <div className="hidden lg:flex flex-1 max-w-2xl px-4">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-full h-12 flex items-center justify-between px-6 bg-slate-50 border border-slate-100 hover:border-orange-600/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <Search
                      size={18}
                      className="text-slate-400 group-hover:text-orange-600"
                    />
                    <span className="text-[12px] text-slate-400 font-bold uppercase tracking-wider">
                      Teknik Ekipman Ara...
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-200 px-2 py-1 transform scale-90">
                    <Command size={10} className="opacity-50" />
                    <span className="text-[9px] font-black">K</span>
                  </div>
                </button>
              </div>

              {/* AKSİYONLAR */}
              <div className="flex items-center gap-1 md:gap-3">
                <Link
                  href="/favorites"
                  className="hidden md:flex p-3 text-slate-800 hover:text-orange-600 relative"
                >
                  <Heart
                    size={22}
                    strokeWidth={1.5}
                    className={
                      favorites.length > 0
                        ? "fill-orange-600 text-orange-600"
                        : ""
                    }
                  />
                  {favorites.length > 0 && (
                    <span className="absolute top-2 right-2 text-[9px] font-black bg-slate-900 text-white w-4 h-4 flex items-center justify-center rounded-full">
                      {favorites.length}
                    </span>
                  )}
                </Link>

                <div className="hidden md:block w-[1px] h-8 bg-slate-100 mx-2" />

                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="group flex items-center gap-4 pl-2 pr-1 md:pr-4 py-2 hover:bg-slate-50 transition-all"
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 text-slate-900 flex items-center justify-center group-hover:bg-orange-600  group-hover:text-white transition-all">
                    <User size={18} strokeWidth={2.5} />
                  </div>
                  <div className="hidden xl:flex flex-col items-start leading-none">
                    <span className="text-[9px] font-black text-orange-600 tracking-[0.2em] mb-1">
                      Kişisel Panel
                    </span>
                    <span className="text-[13px] font-black text-slate-900">
                      HESABIM
                    </span>
                  </div>
                </button>

                <CartDropdown />

                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 text-slate-900"
                >
                  <Menu size={26} />
                </button>
              </div>
            </div>

            {/* MOBİL ARAMA SATIRI (Sadece Mobilde Görünür) */}
            <div className="lg:hidden w-full pb-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full h-11 flex items-center gap-3 px-4 bg-slate-100 border border-slate-100  text-slate-500"
              >
                <Search size={18} className="text-slate-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Ürün veya kategori ara...
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full bg-white">
          <CategoryBar
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </div>
      </motion.header>

      {/* ARAMA MODAL */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-950/60 backdrop-blur-xl flex justify-center pt-[5vh] md:pt-[10vh] px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full max-w-5xl bg-white shadow-2xl px-4 h-fit border border-white/20 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 md:p-12 flex items-center gap-4 md:gap-6 border-b border-slate-50">
                <Search
                  size={24}
                  className="text-orange-600 shrink-0 md:w-8 md:h-8"
                />
                <input
                  autoFocus
                  className="flex-1 bg-transparent outline-none text-xl md:text-4xl font-black text-slate-900 placeholder:text-slate-200 uppercase tracking-tighter"
                  placeholder="Ara..."
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-950 transition-all"
                >
                  <X size={24} className="md:w-8 md:h-8" />
                </button>
              </div>

              <div className="px-6 md:px-12 py-4 md:py-6 bg-slate-50/50 flex flex-wrap gap-2 md:gap-4 items-center">
                <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 md:mr-4">
                  Popüler:
                </span>
                {["S3 Botlar", "Yelek", "Eldiven"].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:border-orange-600 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <UserMegaMenu
        userMenuOpen={userMenuOpen}
        setUserMenuOpen={setUserMenuOpen}
      />
    </>
  );
}
