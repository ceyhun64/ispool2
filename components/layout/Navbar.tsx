"use client";

import { useState, useEffect, useCallback } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
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

interface SearchProduct {
  id: number;
  title: string;
  price: number;
  mainImage: string;
  category: string;
}

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [navbarHidden, setNavbarHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { favorites } = useFavorite();
  const { scrollY } = useScroll();
  const pathname = usePathname();

  // Mobil kontrolü
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sunucu taraflı arama — tüm ürünleri çekmek yerine /api/search kullanır
  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}`,
        );
        const data = await res.json();
        setSearchResults(data.products ?? []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
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

  // Sayfa değişiminde aramayı kapat (window.location yerine usePathname)
  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isMobileMenuOpen || isMobile) {
      setNavbarHidden(false);
      return;
    }
    setNavbarHidden(latest > 100);
  });

  useEffect(() => {
    document.body.style.overflow =
      isMobileMenuOpen || searchOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, searchOpen]);

  // ESC ile modal kapatma
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (searchOpen) {
          setSearchOpen(false);
          setSearchQuery("");
        }
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
        if (userMenuOpen) setUserMenuOpen(false);
      }
    },
    [searchOpen, isMobileMenuOpen, userMenuOpen],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Cmd+K / Ctrl+K ile arama aç
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-99 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <motion.div
        data-navbar="true"
        initial={{ y: 0 }}
        animate={{ y: navbarHidden ? "-100%" : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 left-0 right-0 z-50 bg-white shadow-md"
      >
        <div className="mx-auto px-5 md:px-12 flex flex-col">
          <div className="h-16 md:h-25 flex items-center justify-between gap-4 md:gap-10">
            {/* LOGO */}
            <NextLink
              href="/"
              className="shrink-0 group flex items-center gap-5"
            >
              <Image
                src="/logo/logoyeni.png"
                alt="İşPool Logo"
                width={140}
                height={35}
                className="object-contain w-25 md:w-35"
                priority
                sizes="(max-width: 768px) 100px, 140px"
              />
              <div className="hidden xl:flex flex-col border-l border-slate-200 pl-5 py-0.5">
                <span className="text-[10px] font-black text-slate-950 tracking-[0.3em] uppercase leading-none">
                  PREMIUM
                </span>
                <span className="text-[10px] font-bold text-orange-700 tracking-[0.3em] uppercase leading-none mt-1">
                  KORUMA
                </span>
              </div>
            </NextLink>

            {/* MASAÜSTÜ ARAMA TETİKLEYİCİ */}
            <div className="hidden lg:flex flex-1 max-w-2xl px-4">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Ürün ara (Ctrl+K)"
                className="w-full h-12 flex rounded-sm items-center justify-between px-6 bg-slate-50 border border-slate-300 hover:border-orange-600 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <Search
                    size={18}
                    className="text-slate-600 group-hover:text-orange-600"
                    aria-hidden="true"
                  />
                  <span className="text-[12px] text-slate-700 font-bold uppercase tracking-wider">
                    Teknik Ekipman Ara...
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-200 px-2 py-1 transform scale-90 ring-1 ring-slate-300" aria-hidden="true">
                  <Command size={10} className="text-slate-900" />
                  <span className="text-[9px] font-black text-slate-900">K</span>
                </div>
              </button>
            </div>

            {/* AKSİYONLAR */}
            <div className="flex items-center gap-0.5 md:gap-3">
              {/* FAVORİLER */}
              <NextLink
                href="/favorites"
                className="flex group items-center gap-4 pl-2 pr-1 md:pr-4 py-2 hover:bg-slate-50 transition-all relative outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                aria-label={`Favorilerim${favorites.length > 0 ? ` (${favorites.length} ürün)` : ""}`}
              >
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-sm text-slate-950 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <Heart
                    size={18}
                    strokeWidth={2.5}
                    aria-hidden="true"
                    className={
                      favorites.length > 0
                        ? "fill-orange-600 text-orange-600 group-hover:fill-white group-hover:text-white"
                        : "group-hover:text-white"
                    }
                  />
                </div>
                {favorites.length > 0 && (
                  <span
                    className="absolute top-2 right-2 text-[9px] rounded-full font-black bg-slate-950 text-white w-4 h-4 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {favorites.length}
                  </span>
                )}
              </NextLink>

              <div className="hidden md:block w-px h-8 bg-slate-200 mx-2" aria-hidden="true" />

              {/* KULLANICI */}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex group items-center gap-4 pl-2 pr-1 md:pr-4 py-2 hover:bg-slate-50 transition-all outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                aria-label="Kullanıcı Menüsü"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-9 h-9 rounded-sm md:w-10 md:h-10 text-slate-950 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <User size={18} strokeWidth={2.5} aria-hidden="true" />
                </div>
                <div className="hidden xl:flex flex-col items-start leading-none">
                  <span className="text-[9px] font-black text-orange-700 tracking-[0.2em] mb-1">
                    KİŞİSEL PANEL
                  </span>
                  <span className="text-[13px] font-black text-slate-950">
                    HESABIM
                  </span>
                </div>
              </button>

              <div>
                <CartDropdown />
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-950"
                aria-label="Menüyü Aç"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu size={26} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* MOBİL ARAMA TETİKLEYİCİ */}
          <div className="lg:hidden w-full pb-4">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Ürün ara"
              className="w-full h-11 rounded-sm flex items-center gap-3 px-4 bg-slate-100 border border-slate-300 text-slate-900"
            >
              <Search size={18} className="text-slate-800" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                Ürün veya kategori ara...
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* CATEGORYBAR */}
      <div className="sticky top-0 z-49">
        <CategoryBar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      </div>

      {/* ARAMA MODAL */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Ürün arama"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-200 bg-slate-950/90 backdrop-blur-md flex justify-center pt-[5vh] md:pt-[10vh] px-4"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full max-w-4xl bg-white shadow-2xl h-fit border border-slate-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 md:p-8 flex items-center gap-4 md:gap-6 border-b border-slate-100">
                {isSearching ? (
                  <Loader2
                    size={24}
                    className="text-orange-700 animate-spin shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <Search size={24} className="text-orange-700 shrink-0" aria-hidden="true" />
                )}
                <label htmlFor="search-input" className="sr-only">
                  Ürün, marka veya kategori ara
                </label>
                <input
                  id="search-input"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-xl md:text-3xl font-black text-slate-950 placeholder:text-slate-400 tracking-tighter"
                  placeholder="Ürün, marka veya kategori..."
                  aria-autocomplete="list"
                  aria-controls="search-results"
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="p-2 bg-slate-100 rounded-sm hover:bg-slate-200 text-slate-900 transition-all"
                  aria-label="Aramayı Kapat (ESC)"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              {/* ARAMA SONUÇLARI */}
              <div
                id="search-results"
                role="listbox"
                aria-label="Arama sonuçları"
                className="max-h-[60vh] overflow-y-auto"
              >
                {searchResults.length > 0 ? (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.map((product) => (
                      <NextLink
                        key={product.id}
                        href={`/products/${product.id}`}
                        role="option"
                        aria-selected="false"
                        className="flex items-center gap-4 p-3 hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-200"
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <div className="w-16 h-16 bg-slate-100 relative shrink-0 overflow-hidden border border-slate-200">
                          <Image
                            src={product.mainImage}
                            alt={product.title}
                            fill
                            sizes="64px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest">
                            {product.category}
                          </span>
                          <h3 className="text-sm font-bold text-slate-950 truncate uppercase">
                            {product.title}
                          </h3>
                          <span className="text-sm font-black text-slate-800">
                            {product.price.toLocaleString("tr-TR")} ₺
                          </span>
                        </div>
                        <ArrowRight
                          size={16}
                          className="ml-auto text-slate-400 group-hover:text-orange-700 group-hover:translate-x-1 transition-all"
                          aria-hidden="true"
                        />
                      </NextLink>
                    ))}
                  </div>
                ) : searchQuery.length > 1 && !isSearching ? (
                  <div className="p-20 text-center" role="status">
                    <p className="text-slate-600 font-bold uppercase tracking-widest">
                      Sonuç bulunamadı.
                    </p>
                  </div>
                ) : (
                  <div className="p-10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 px-2 border-l-2 border-orange-600">
                      HIZLI ERİŞİM
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
                          className="px-4 py-2 bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800 hover:bg-orange-700 hover:text-white hover:border-orange-700 transition-all uppercase"
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

      {/* MOBİL ALT NAVİGASYON BAR */}
      <nav
        aria-label="Mobil alt navigasyon"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-100 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      >
        <div className="grid grid-cols-4 h-16">
          {/* Ana Sayfa */}
          <NextLink
            href="/"
            aria-label="Ana Sayfa"
            aria-current={pathname === "/" ? "page" : undefined}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              pathname === "/"
                ? "text-orange-700"
                : "text-slate-500 hover:text-orange-700 active:text-orange-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-wider">
              Ana Sayfa
            </span>
          </NextLink>

          {/* Favorilerim */}
          <NextLink
            href="/favorites"
            aria-label={`Favorilerim${favorites.length > 0 ? ` (${favorites.length})` : ""}`}
            aria-current={pathname === "/favorites" ? "page" : undefined}
            className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
              pathname === "/favorites"
                ? "text-orange-700"
                : "text-slate-500 hover:text-orange-700 active:text-orange-700"
            }`}
          >
            <div className="relative">
              <Heart
                size={20}
                strokeWidth={2.5}
                aria-hidden="true"
                className={
                  favorites.length > 0 ? "fill-orange-600 text-orange-600" : ""
                }
              />
              {favorites.length > 0 && (
                <span
                  className="absolute -top-1.5 -right-2 text-[8px] rounded-full font-black bg-slate-950 text-white w-3.5 h-3.5 flex items-center justify-center leading-none"
                  aria-hidden="true"
                >
                  {favorites.length > 9 ? "9+" : favorites.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider">
              Favoriler
            </span>
          </NextLink>

          {/* Sepetim */}
          <div className="flex flex-col items-center justify-center">
            <CartDropdown mobileBottomBar />
          </div>

          {/* Hesabım */}
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            aria-label="Hesabım"
            aria-expanded={userMenuOpen}
            className="flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-orange-600 active:text-orange-600 transition-colors"
          >
            <User size={20} strokeWidth={2.5} aria-hidden="true" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Hesabım
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
