"use client";

import { useState, useEffect } from "react";
import Link from "next/image";
import NextLink from "next/link";
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
  Command,
  Menu,
  Loader2,
  ArrowRight,
} from "lucide-react";
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

  // --- ARAMA STATE'LERİ ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { favorites } = useFavorite();
  const { scrollY } = useScroll();

  // Arama Fonksiyonu
  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        // Basit bir client-side filtreleme (API query parametresi desteklemiyorsa)
        const filtered = data.products
          .filter(
            (p: any) =>
              p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.category.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 6); // İlk 6 sonucu göster

        setSearchResults(filtered);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(fetchResults, 300); // Debounce
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleCartSheetChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isOpen: boolean }>;
      setIsCartOpen(customEvent.detail.isOpen);
    };

    window.addEventListener("cartSheetStateChange", handleCartSheetChange);

    return () =>
      window.removeEventListener("cartSheetStateChange", handleCartSheetChange);
  }, []);

  // Sayfa değişiminde aramayı kapat
  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, [typeof window !== "undefined" ? window.location.pathname : ""]);

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

  useEffect(() => {
    document.body.style.overflow =
      isMobileMenuOpen || searchOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen, searchOpen]);

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
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={isMobileMenuOpen ? "visible" : hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 left-0 right-0 z-[100] w-full flex flex-col bg-white"
      >
        <div className="relative z-10 bg-white border-b border-slate-100">
          <div className="max-w-[1700px] mx-auto px-5 md:px-12 flex flex-col">
            <div className="h-16 md:h-[100px] flex items-center justify-between gap-4 md:gap-10">
              {/* LOGO */}
              <NextLink
                href="/"
                className="shrink-0 group flex items-center gap-5"
              >
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
              </NextLink>

              {/* MASAÜSTÜ ARAMA TETİKLEYİCİ */}
              <div className="hidden lg:flex flex-1 max-w-2xl px-4">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-full h-12 flex rounded-sm items-center justify-between px-6 bg-slate-50 border border-slate-100 hover:border-orange-600/30 transition-all group "
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
                  <div className="flex items-center gap-2 bg-slate-200 px-2 py-1 transform scale-90 ">
                    <Command size={10} className="opacity-50" />
                    <span className="text-[9px] font-black">K</span>
                  </div>
                </button>
              </div>

              {/* AKSİYONLAR */}
              <div className="flex items-center gap-1 md:gap-3">
                <NextLink
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
                    <span className="absolute top-2 right-2 text-[9px] rounded-full font-black bg-slate-900 text-white w-4 h-4 flex items-center justify-center ">
                      {favorites.length}
                    </span>
                  )}
                </NextLink>

                <div className="hidden md:block w-[1px] h-8 bg-slate-100 mx-2" />

                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="group flex items-center gap-4  pl-2 pr-1 md:pr-4 py-2 hover:bg-slate-50 transition-all"
                >
                  <div className="w-9 h-9 rounded-sm md:w-10 md:h-10 text-slate-900 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
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

            {/* MOBİL ARAMA TETİKLEYİCİ */}
            <div className="lg:hidden w-full pb-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full h-11 rounded-sm flex items-center gap-3 px-4 bg-slate-100 border border-slate-100 text-slate-500 "
              >
                <Search size={18} className="text-slate-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Ürün veya kategori ara...
                </span>
              </button>
            </div>
          </div>
        </div>

        <CategoryBar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      </motion.header>

      {/* ARAMA MODAL - ÇALIŞIR HALİ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200]  bg-slate-950/80 backdrop-blur-md flex justify-center pt-[5vh] md:pt-[10vh] px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full max-w-4xl bg-white shadow-2xl h-fit border border-white/20 overflow-hidden "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 md:p-8 flex items-center gap-4 md:gap-6 border-b border-slate-100">
                {isSearching ? (
                  <Loader2
                    size={24}
                    className="text-orange-600 animate-spin shrink-0"
                  />
                ) : (
                  <Search size={24} className="text-orange-600 shrink-0" />
                )}
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm md:text-3xl font-black text-slate-900 placeholder:text-slate-300 tracking-tighter"
                  placeholder="Ürün, marka veya kategori yazın..."
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="p-2 bg-slate-100 rounded-sm  hover:bg-slate-200 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* ARAMA SONUÇLARI */}
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                {searchResults.length > 0 ? (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.map((product) => (
                      <NextLink
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="flex items-center gap-4 p-3 hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                        onClick={() => setSearchOpen(false)}
                      >
                        <div className="w-16 h-16 bg-slate-100 relative shrink-0 overflow-hidden">
                          <Image
                            src={product.mainImage}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                            {product.category}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 truncate uppercase">
                            {product.title}
                          </h3>
                          <span className="text-sm font-black text-slate-700">
                            {product.price.toLocaleString("tr-TR")} ₺
                          </span>
                        </div>
                        <ArrowRight
                          size={16}
                          className="ml-auto text-slate-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all"
                        />
                      </NextLink>
                    ))}
                  </div>
                ) : searchQuery.length > 1 && !isSearching ? (
                  <div className="p-20 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest">
                      Sonuç bulunamadı.
                    </p>
                  </div>
                ) : (
                  <div className="p-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-2">
                      Hızlı Erişim
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {[
                        "İş Ayakkabısı",
                        "Mont",
                        "Reflektörlü Yelek",
                        "Eldiven",
                        "Kask",
                      ].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="px-4 py-2 bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-600 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all  uppercase"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
