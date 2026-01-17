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
import { ShoppingCart, ArrowRight, ShieldCheck, Package } from "lucide-react";
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
          <button className="relative p-2.5 bg-slate-900 text-white hover:bg-orange-600 transition-all group shadow-lg">
            <ShoppingCart className="h-5 w-5 stroke-[2px]" />
            {showCount && cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold border border-white">
                {cartItems.length}
              </span>
            )}
          </button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="z-[200] p-0 w-full sm:max-w-[420px] h-full fixed top-0 right-0 bg-white flex flex-col border-l-4 border-l-orange-500 shadow-2xl"
        >
          {/* Header */}
          <div className="bg-slate-900 p-5 sm:p-6 text-white relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
              <ShieldCheck size={140} />
            </div>
            <div className="relative z-10">
              <SheetTitle className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] tracking-[0.3em] text-orange-400 uppercase font-black">
                  Ekipman Çantanız
                </span>
              </SheetTitle>
              <div className="flex items-center gap-2 mt-1">
                <Package className="h-3 w-3 text-slate-400" />
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-300 font-medium">
                  {cartItems.length} Kalem Ürün Hazırlanıyor
                </span>
              </div>
            </div>
          </div>

          {/* Items Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            {isLoading ? (
              <div className="space-y-6 pt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100" />
                    <div className="flex-1 space-y-3 py-2">
                      <Skeleton className="h-4 w-3/4 bg-slate-100" />
                      <Skeleton className="h-3 w-1/4 bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-slate-200" />
                </div>
                <p className="text-sm font-bold text-slate-800 uppercase tracking-tighter">
                  Listeniz Henüz Boş
                </p>
                <SheetClose asChild>
                  <Link href="/products">
                    <Button
                      variant="outline"
                      className="border-2 border-slate-900 font-black text-[10px] uppercase tracking-widest px-6 h-11"
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

          {/* Summary Footer */}
          {cartItems.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-6 space-y-4 shrink-0 shadow-inner">
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>Ara Toplam</span>
                  <span className="font-mono">
                    ₺{subtotal.toLocaleString("tr-TR")}
                  </span>
                </div>
                <div className="pt-3 border-t-2 border-slate-200 border-dotted flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">
                      Genel Toplam
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tighter">
                      ₺
                      {total.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <SheetClose asChild>
                  <Link href="/checkout" className="w-full">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 sm:h-14 font-black text-xs uppercase tracking-[0.2em]">
                      Siparişi Tamamla
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="text-slate-400 font-bold text-[10px] uppercase h-10"
                  >
                    Kapat
                  </Button>
                </SheetClose>
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
