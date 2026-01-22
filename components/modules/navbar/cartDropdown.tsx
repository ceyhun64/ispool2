"use client";

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Package,
  X,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import CartItemDropdown from "./cartItem";
import {
  getCart,
  updateGuestCartQuantity,
  removeFromGuestCart,
  GuestCartItem,
} from "@/utils/cart";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: number;
  title: string;
  price: number;
  mainImage: string;
}

export interface CartItemType {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}

interface CartDropdownProps {
  showCount?: boolean;
  guest?: boolean;
}

const CartDropdown = forwardRef(
  ({ showCount = true, guest = false }: CartDropdownProps, ref) => {
    const [cartItems, setCartItems] = useState<CartItemType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Cart Sheet durumunu Navbar'a bildir
    useEffect(() => {
      const event = new CustomEvent('cartSheetStateChange', {
        detail: { isOpen }
      });
      window.dispatchEvent(event);
    }, [isOpen]);

    const checkLogin = useCallback(async (): Promise<boolean> => {
      try {
        const res = await fetch("/api/account/check", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          setIsLoggedIn(false);
          return false;
        }
        const data = await res.json();
        const logged = !!data?.user?.id;
        setIsLoggedIn(logged);
        return logged;
      } catch {
        setIsLoggedIn(false);
        return false;
      }
    }, []);

    const fetchCart = useCallback(async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/cart", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("API hatası");
        const data = await res.json();
        setCartItems(data);
      } catch (err) {
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    }, []);

    const loadGuestCart = useCallback(() => {
      try {
        const cart = getCart();
        const guestCart = cart.map((item: GuestCartItem) => ({
          id: item.productId,
          productId: item.productId,
          quantity: item.quantity,
          product: {
            id: item.productId,
            title: item.title,
            price: item.price,
            mainImage: item.image,
          },
        }));
        setCartItems(guestCart);
      } catch (err) {
        console.error("Guest cart error", err);
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      (async () => {
        const logged = await checkLogin();
        if (logged && !guest) await fetchCart();
        else loadGuestCart();
      })();
    }, [checkLogin, fetchCart, loadGuestCart, guest]);

    useEffect(() => {
      if (isOpen) {
        if (isLoggedIn && !guest) fetchCart();
        else loadGuestCart();
      }
    }, [isOpen, isLoggedIn, fetchCart, loadGuestCart, guest]);

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      refreshCart: () => {
        if (isLoggedIn && !guest) fetchCart();
        else loadGuestCart();
      },
    }));

    useEffect(() => {
      const handleCartUpdate = () => {
        if (isLoggedIn && !guest) fetchCart();
        else loadGuestCart();
      };
      window.addEventListener("cartUpdated", handleCartUpdate);
      return () => window.removeEventListener("cartUpdated", handleCartUpdate);
    }, [isLoggedIn, fetchCart, loadGuestCart, guest]);

    const handleQuantityChange = async (id: number, delta: number) => {
      if (!isLoggedIn) {
        updateGuestCartQuantity(id, delta);
        loadGuestCart();
        return;
      }

      const item = cartItems.find((c) => c.id === id);
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + delta);

      try {
        const res = await fetch(`/api/cart/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQuantity }),
          credentials: "include",
        });

        if (!res.ok) {
          toast.error("Miktar güncellenemedi");
          return;
        }

        const updatedItem = await res.json();
        setCartItems((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, quantity: updatedItem.quantity } : c,
          ),
        );
      } catch (err) {
        toast.error("Miktar güncellenemedi");
      }
    };

    const handleRemove = async (id: number) => {
      if (!isLoggedIn) {
        removeFromGuestCart(id);
        loadGuestCart();
        return;
      }
      try {
        const res = await fetch(`/api/cart/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          setCartItems((prev) => prev.filter((c) => c.id !== id));
          toast.success("Ürün kaldırıldı");
        }
      } catch {
        toast.error("Ürün kaldırılamadı");
      }
    };

    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
    const taxAmount = subtotal * 0.1;
    const total = subtotal + taxAmount;

    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="relative p-2.5 text-slate-900 hover:text-slate-500 transition-colors duration-300">
            <ShoppingCart className="h-5.5 w-5.5 stroke-[1.2px]" />
            {showCount && cartItems.length > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-slate-900 text-white text-[9px] flex items-center justify-center font-bold font-mono shadow-sm">
                {cartItems.length}
              </span>
            )}
          </button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="z-[200] p-0 w-full sm:max-w-[450px] h-full fixed top-0 right-0 bg-white flex flex-col border-l border-slate-100 shadow-2xl"
        >
          {/* Modern Industrial Header */}
          <div className="px-8 pt-12 pb-8 shrink-0 border-b border-slate-50 bg-slate-50/30">
            <div className="flex justify-between items-end">
              <SheetTitle className="flex flex-col gap-1.5">
                <span className="text-[10px] tracking-[0.4em] text-slate-400 uppercase font-black leading-none">
                  EKİPMAN SEÇİMİ
                </span>
                <span className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                  SEPETİM
                </span>
              </SheetTitle>
              <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 text-white">
                <Package className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-widest font-mono">
                  {cartItems.length} ÜRÜN
                </span>
              </div>
            </div>
          </div>

          {/* Items Area */}
          <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
            {isLoading ? (
              <div className="space-y-10 pt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-6">
                    <Skeleton className="w-24 h-24 bg-slate-50 rounded-none border border-slate-100" />
                    <div className="flex-1 space-y-4 py-1">
                      <Skeleton className="h-4 w-3/4 bg-slate-50 rounded-none" />
                      <Skeleton className="h-3 w-1/4 bg-slate-50 rounded-none" />
                      <Skeleton className="h-8 w-20 bg-slate-50 rounded-none" />
                    </div>
                  </div>
                ))}
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-8 text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-slate-50 scale-[2.5] rounded-full -z-10 blur-2xl" />
                  <ShoppingCart
                    className="h-16 w-16 text-slate-200"
                    strokeWidth={0.5}
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                    SEPETİNİZ ŞU ANDA BOŞ
                  </p>
                  <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed font-medium uppercase tracking-wide">
                    Profesyonel iş elbiseleri ve güvenlik ekipmanlarını
                    keşfedin.
                  </p>
                </div>
                <SheetClose asChild>
                  <Link href="/products">
                    <Button
                      variant="outline"
                      className="border-slate-900 text-slate-900 rounded-none font-black text-[10px] uppercase tracking-[0.2em] px-10 h-14 hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-lg"
                    >
                      KATALOĞU İNCELE
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.19, 1, 0.22, 1],
                        delay: index * 0.05,
                      }}
                    >
                      <CartItemDropdown
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemove}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Premium Footer Summary */}
          {cartItems.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-200 p-8 space-y-6 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>ARA TOPLAM</span>
                  <span className="text-slate-900 font-mono">
                    ₺
                    {subtotal.toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>KDV (%10)</span>
                  <span className="text-slate-900 font-mono">
                    ₺
                    {taxAmount.toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-start pt-4 border-t border-slate-200">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">
                      GENEL TOPLAM
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                      Vergiler Dahil Net Tutar
                    </span>
                  </div>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter font-mono leading-none">
                    ₺
                    {total.toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <SheetClose asChild>
                  <Link href="/checkout" className="w-full">
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white h-16 rounded-none font-bold text-[11px] uppercase tracking-[0.25em] transition-all duration-500 group relative overflow-hidden">
                      <span className="relative z-10 flex items-center">
                        GÜVENLİ ÖDEMEYE GEÇ
                        <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/cart" className="w-full">
                    <Button
                      variant="ghost"
                      className="w-full bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-900 h-12 rounded-none font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-300"
                    >
                      SEPETE DETAYLI GÖZ AT
                    </Button>
                  </Link>
                </SheetClose>

                <div className="flex items-center justify-center gap-3 py-2 opacity-60">
                  <Lock size={12} className="text-slate-900" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Endüstriyel Güvenlikli Ödeme
                  </span>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    );
  },
);

CartDropdown.displayName = "CartDropdown";
export default CartDropdown;