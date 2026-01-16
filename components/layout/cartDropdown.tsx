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
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  ArrowRight,
  Minus,
  ShieldCheck,
  Package,
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
            c.id === id ? { ...c, quantity: updatedItem.quantity } : c
          )
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

    const subtotal = cartItems.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    const taxAmount = subtotal * 0.1;
    const total = subtotal + taxAmount;

    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button
            className="relative p-2.5 bg-slate-800 text-white hover:bg-orange-600 transition-all duration-300 group shadow-lg shadow-black/10"
            aria-label="sepet"
          >
            <ShoppingCart className="h-5 w-5 stroke-[2px]" />
            <AnimatePresence>
              {showCount && cartItems.length > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold border-2 border-slate-900 shadow-sm"
                >
                  {cartItems.length}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="z-[2000] p-0 w-full max-w-[420px] h-full fixed top-0 right-0 bg-white flex flex-col shadow-2xl border-l-4 border-l-orange-500"
        >
          {/* Header - Industrial Style */}
          <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
              <ShieldCheck size={140} />
            </div>
            <div className="relative z-10">
              <SheetTitle className="flex items-center gap-2">
                <span className="text-[11px] tracking-[0.3em] text-orange-400 uppercase font-black">
                  Ekipman Çantanız
                </span>
              </SheetTitle>
              <div className="flex items-center gap-2 mt-1">
                <Package className="h-3 w-3 text-slate-400" />
                <span className="text-[10px] uppercase tracking-widest text-slate-300 font-medium">
                  {cartItems.length} Kalem Ürün Hazırlanıyor
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-slate-200">
            {isLoading ? (
              <div className="space-y-6 pt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-20 h-20 bg-slate-100" />
                    <div className="flex-1 space-y-3 py-2">
                      <Skeleton className="h-4 w-3/4 bg-slate-100" />
                      <Skeleton className="h-3 w-1/4 bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                <div className="w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-slate-200 stroke-[1.5px]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800 uppercase tracking-tighter">
                    Listeniz Henüz Boş
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-[200px] leading-relaxed">
                    İş güvenliğiniz için ihtiyacınız olan ekipmanları hemen
                    ekleyin.
                  </p>
                </div>
                <SheetClose asChild>
                  <Link href="/products">
                    <Button
                      variant="outline"
                      className="mt-4 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest px-6"
                    >
                      Katalogu İncele
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
                      transition={{ duration: 0.2, delay: index * 0.03 }}
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

          {/* Footer - Professional Checkout Area */}
          {cartItems.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-200 p-6 space-y-5 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>Ara Toplam</span>
                  <span className="font-mono text-slate-700">
                    ₺
                    {subtotal.toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>KDV (%10)</span>
                  <span className="font-mono text-slate-700">
                    ₺
                    {taxAmount.toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="pt-3 border-t-2 border-slate-200 border-dotted flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">
                      Genel Toplam
                    </span>
                    <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter">
                      ₺
                      {total.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-400 font-medium italic mb-1">
                    Kargo hariç tutulmuştur
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                <SheetClose asChild>
                  <Link href="/checkout" className="w-full">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white h-14 font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-orange-600/20 group transition-all active:scale-[0.98]">
                      Siparişi Tamamla
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </SheetClose>

                <div className="grid grid-cols-2 gap-2">
                  <SheetClose asChild>
                    <Link href="/cart">
                      <Button
                        variant="outline"
                        className="w-full h-11 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-400 text-[10px] uppercase font-bold tracking-widest transition-all"
                      >
                        Sepeti Düzenle
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full text-slate-400 hover:text-slate-900 text-[10px] uppercase font-bold tracking-widest h-11"
                    >
                      Kapat
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    );
  }
);

CartDropdown.displayName = "CartDropdown";

export default CartDropdown;
