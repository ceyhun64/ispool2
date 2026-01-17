"use client";

import { useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Heart, User, Search, X, Bell, Command, Menu } from "lucide-react";
import Image from "next/image";
import CategoryBar from "./categoryBar";
import CartDropdown from "./cartDropdown";
import { useFavorite } from "@/contexts/favoriteContext";
import UserMegaMenu from "./userMegaMenu";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { favorites } = useFavorite();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    // Scroll yönüne göre gizleme/gösterme
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 left-0 right-0 z-[100] w-full flex flex-col bg-white"
      >
        {/* ANA NAVBAR ALANI */}
        <div className="relative z-10 bg-white border-b border-slate-100 transition-colors duration-300">
          <div className="max-w-[1700px] mx-auto px-5 md:px-12 h-20 md:h-[100px] flex items-center justify-between gap-10">
            {/* LOGO - Endüstriyel Otorite */}
            <Link href="/" className="shrink-0 group flex items-center gap-5">
              <div className="relative overflow-hidden transition-all duration-500">
                <Image
                  src="/logo/logois2.png"
                  alt="ProSafe Logo"
                  width={140}
                  height={35}
                  className="object-contain w-[115px] md:w-[140px]"
                  priority
                />
              </div>
              <div className="hidden xl:flex flex-col border-l-[1px] border-slate-200 pl-5 py-0.5">
                <span className="text-[10px] font-black text-slate-900 tracking-[0.3em] uppercase leading-none">
                  PREMIUM
                </span>
                <span className="text-[10px] font-bold text-orange-600 tracking-[0.3em] uppercase leading-none mt-1">
                  KORUMA
                </span>
              </div>
            </Link>

            {/* ARAMA ÇUBUĞU - Minimalist ve Akıllı */}
            <div className="hidden lg:flex flex-1 max-w-2xl px-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full h-12 flex items-center justify-between px-6 bg-slate-50 border border-slate-100 hover:border-orange-600/30 transition-all duration-500 group"
              >
                <div className="flex items-center gap-4">
                  <Search
                    size={18}
                    className="text-slate-400 group-hover:text-orange-600 transition-colors"
                  />
                  <span className="text-[12px] text-slate-400 font-bold uppercase tracking-wider group-hover:text-slate-600 transition-colors">
                    Teknik Ekipman veya Standart Ara... (örn: EN 388)
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-200 text-slate-800 px-2 py-1 transform scale-90 group-hover:scale-100 transition-all">
                  <Command size={10} className="opacity-50" />
                  <span className="text-[9px] font-black tracking-tighter">
                    K
                  </span>
                </div>
              </button>
            </div>

            {/* AKSİYONLAR */}
            <div className="flex items-center gap-1 md:gap-3">
              {/* Bildirimler */}
              <button className="hidden md:flex p-3 text-slate-800 hover:text-orange-600 transition-colors relative">
                <Bell size={22} strokeWidth={1.5} />
                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-orange-600 ring-2 ring-white" />
              </button>

              {/* Favoriler */}
              <Link
                href="/favorites"
                className="hidden md:flex p-3 text-slate-800 hover:text-orange-600 transition-all relative"
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

              {/* Kullanıcı / Pro-Panel */}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="group flex items-center gap-4 pl-2 pr-1 md:pr-4 py-2 hover:bg-slate-50 transition-all"
              >
                <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center group-hover:bg-orange-600 transition-all duration-500">
                  <User size={18} strokeWidth={2.5} />
                </div>
                <div className="hidden xl:flex flex-col items-start leading-none">
                  <span className="text-[9px] font-black text-orange-600 tracking-[0.2em] mb-1">
                    Kişisel Panel
                  </span>
                  <span className="text-[13px] font-black text-slate-900 tracking-tight">
                    HESABIM
                  </span>
                </div>
              </button>

              <CartDropdown />

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-3 text-slate-900"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>

        {/* KATEGORİ ÇUBUĞU - Header'ın ayrılmaz parçası */}
        <div className="w-full bg-white">
          <CategoryBar
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </div>
      </motion.header>

      {/* SEARCH MODAL */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-slate-950/60 backdrop-blur-xl flex justify-center pt-[10vh] px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full max-w-5xl bg-white shadow-2xl h-fit border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 md:p-12 flex items-center gap-6 border-b border-slate-50">
                <Search size={32} className="text-orange-600 shrink-0" />
                <input
                  autoFocus
                  className="flex-1 bg-transparent outline-none text-2xl md:text-4xl font-black text-slate-900 placeholder:text-slate-100 uppercase tracking-tighter"
                  placeholder="Ürün, Standart veya Koleksiyon..."
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-3 hover:bg-slate-50 text-slate-400 hover:text-slate-950 transition-all"
                >
                  <X size={32} />
                </button>
              </div>

              <div className="px-12 py-6 bg-slate-50/50 flex flex-wrap gap-4 items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-4">
                  Popüler:
                </span>
                {[
                  "S3 Botlar",
                  "EN 471 Yelek",
                  "Nitrile Eldiven",
                  "Düşüş Durdurucu",
                ].map((tag) => (
                  <button
                    key={tag}
                    className="px-4 py-2 bg-white border border-slate-200 text-[11px] font-bold text-slate-600 hover:border-orange-600 hover:text-orange-600 transition-all"
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
