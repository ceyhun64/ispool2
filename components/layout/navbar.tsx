"use client";

import { useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import {
  Heart,
  User,
  Search,
  X,
  Bell,
  ShoppingBag,
  Command,
  LayoutGrid,
} from "lucide-react";
import Image from "next/image";

import CartDropdown from "./cartDropdown";
import { useFavorite } from "@/contexts/favoriteContext";
import UserMegaMenu from "./userMegaMenu";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const { favorites } = useFavorite();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 100);
  });

  return (
    <>
      <motion.header
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className=" bg-white/80 backdrop-blur-md border-b border-slate-200"
      >
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
          {/* LOGO - Endüstriyel Odaklı */}
          <Link
            href="/"
            className="shrink-0 group relative overflow-hidden flex items-center gap-3"
          >
            <div className="relative z-10 p-1 group-hover:border-orange-600 transition-colors duration-300">
              <Image
                src="/logo/1.png"
                alt="ProSafe Logo"
                width={120}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden xl:flex flex-col border-l border-slate-200 pl-3">
              <span className="text-[10px] font-black text-slate-900 tracking-widest uppercase">
                İş Elbiseleri
              </span>
              <span className="text-[10px] font-bold text-orange-600 tracking-widest uppercase">
                Ekipmanları
              </span>
            </div>
          </Link>

          {/* SMART SEARCH - Mühendislik Arayüzü */}
          <div className="hidden lg:flex flex-1 max-w-2xl">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full h-12 flex items-center justify-between px-5 bg-slate-50/50 border border-slate-200/60 hover:border-orange-500/50 hover:bg-white group transition-all duration-300 relative"
            >
              <div className="flex items-center gap-4">
                <Search
                  size={18}
                  className="text-slate-400 group-hover:text-orange-600 transition-colors"
                />
                <span className="text-[13px] text-slate-500 font-medium tracking-tight">
                  Ekipman, koruma sınıfı veya teknik özellik ara...
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm opacity-60 group-hover:opacity-100 transition-opacity">
                <Command size={10} className="text-slate-500" />
                <span className="text-[10px] font-black text-slate-500">K</span>
              </div>
            </button>
          </div>

          {/* ACTIONS - Fonksiyonel ve Modern */}
          <div className="flex items-center gap-1.5">
            {/* Bildirimler */}
            <button className="relative p-2.5 text-slate-700 hover:text-orange-600 transition-colors group">
              <div className="absolute inset-0 bg-slate-100 scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
              <Bell size={21} strokeWidth={1.5} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-600 rounded-full border-2 border-white ring-4 ring-orange-600/10" />
            </button>

            {/* Favoriler */}
            <Link
              href="/favorites"
              className="relative p-2.5 text-slate-700 hover:text-orange-600 transition-colors group"
            >
              <div className="absolute inset-0 bg-slate-100 scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
              <Heart
                size={21}
                strokeWidth={1.5}
                className={
                  favorites.length > 0 ? "fill-orange-600 text-orange-600" : ""
                }
              />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 text-[9px] font-black bg-slate-900 text-white w-4 h-4 flex items-center justify-center rounded-sm">
                  {favorites.length}
                </span>
              )}
            </Link>

            <div className="w-[1px] h-8 bg-slate-200 mx-3 hidden sm:block" />

            {/* Kullanıcı Menüsü */}
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="group flex items-center gap-4 px-3 py-1.5 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
            >
              <div className="hidden xl:flex flex-col items-end leading-none">
                <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest mb-1">
                  PRO-PANEL
                </span>
                <span className="text-[13px] font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  Hesabım
                </span>
              </div>
              <div className="relative">
                <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                  <User size={20} strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              </div>
            </button>

            <CartDropdown />
          </div>
        </div>
      </motion.header>

      {/* SEARCH MODAL - Industrial Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-slate-950/60 backdrop-blur-sm flex justify-center pt-[10vh] px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-200 overflow-hidden h-fit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 border-b border-slate-100 flex items-center gap-6 bg-slate-50/50">
                <Search size={28} className="text-orange-600" />
                <input
                  autoFocus
                  className="flex-1 bg-transparent outline-none text-2xl font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-light"
                  placeholder="Ürün kodu, standart veya kategori..."
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 hover:bg-white border border-transparent hover:border-slate-200 transition-all shadow-sm"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="p-10 grid grid-cols-12 gap-12">
                <div className="col-span-4 space-y-8">
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-1.5 h-4 bg-orange-600" />
                      <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Popüler Aramalar
                      </h5>
                    </div>
                    <div className="flex flex-col gap-2">
                      {[
                        "Kaynakçı Maskesi",
                        "Elektrikçi Eldiveni",
                        "Çelik Burunlu Bot",
                        "Yüksekte Çalışma",
                      ].map((item) => (
                        <button
                          key={item}
                          className="text-sm font-bold text-left text-slate-600 hover:text-orange-600 hover:translate-x-1 transition-all flex items-center gap-3 group"
                        >
                          <span className="w-1.5 h-[1px] bg-slate-200 group-hover:w-3 group-hover:bg-orange-600 transition-all" />
                          {item}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="col-span-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1.5 h-4 bg-orange-600" />
                    <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Hızlı Erişim
                    </h5>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Düşüş Durdurucular",
                      "Göz Koruması",
                      "Solunum Sistemleri",
                      "Vücut Koruma",
                      "İş Elbiseleri",
                      "Ayak Koruma",
                    ].map((cat) => (
                      <div
                        key={cat}
                        className="p-5 border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5 group cursor-pointer transition-all flex items-center justify-between"
                      >
                        <span className="text-[14px] font-black text-slate-700 group-hover:text-slate-900 uppercase tracking-tight">
                          {cat}
                        </span>
                        <LayoutGrid
                          size={16}
                          className="text-slate-300 group-hover:text-orange-600 transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-4 flex justify-between items-center px-10">
                <span className="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase">
                  ProSafe Industrial Search Engine v2.0
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-white/60 font-medium">
                    Kapatmak için
                  </span>
                  <kbd className="px-2 py-1 bg-white/10 text-white/80 rounded text-[9px] font-mono border border-white/10">
                    ESC
                  </kbd>
                </div>
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
