"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import CartItem from "./cartItem";
import CartSummary from "./cartSummary";
import { Button } from "../../ui/button";
import { ArrowLeft, ShoppingBag, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";

import {
  getCart,
  updateGuestCartQuantity,
  removeFromGuestCart,
  GuestCartItem,
} from "@/utils/cart";

interface Product {
  id: number;
  title: string;
  price: number;
  mainImage: string;
  category: string;
}

export interface CartItemType {
  id: number;
  product: Product;
  quantity: number;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLogin = useCallback(async () => {
    try {
      const res = await fetch("/api/account/check", { credentials: "include" });
      const data = await res.json();
      const logged = !!data?.user?.id;
      setIsLoggedIn(logged);
      return logged;
    } catch {
      return false;
    }
  }, []);

  const loadGuestCart = useCallback(() => {
    const cart = getCart();
    const guestCart = cart.map((item: any) => ({
      id: item.productId,
      quantity: item.quantity,
      product: {
        id: item.productId,
        title: item.title,
        price: item.price,
        mainImage: item.image,
        category: item.category || "Genel",
      },
    }));
    setCartItems(guestCart);
    setIsLoading(false);
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/cart", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const logged = await checkLogin();
      if (logged) await fetchCart();
      else loadGuestCart();
    })();
  }, [checkLogin, fetchCart, loadGuestCart]);

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
      if (res.ok) fetchCart();
    } catch {
      toast.error("Hata oluştu");
    }
  };

  const handleRemove = async (id: number) => {
    if (!isLoggedIn) {
      removeFromGuestCart(id);
      loadGuestCart();
      return;
    }
    const res = await fetch(`/api/cart/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) setCartItems((prev) => prev.filter((c) => c.id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  if (isLoading) return <CartLoadingSkeleton />;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-28">
        <AnimatePresence mode="wait">
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="mb-10 relative">
                <div className="absolute inset-0 bg-slate-50 scale-[2] rounded-full -z-10 blur-3xl" />
                <ShoppingBag
                  strokeWidth={0.5}
                  className="h-24 w-24 text-slate-200"
                />
              </div>
              <h1 className="text-3xl font-bold tracking-tighter text-slate-900 mb-4 uppercase">
                SEPETİNİZ ŞU ANDA BOŞ
              </h1>
              <p className="text-slate-500 text-sm max-w-[320px] mb-12 leading-relaxed font-medium">
                Profesyonel iş güvenliği standartlarına uygun ekipmanlarımızı
                inceleyerek projenize hazırlanın.
              </p>
              <Link href="/products">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-none px-12 py-7 text-[11px] font-bold tracking-[0.2em] transition-all duration-500 shadow-xl">
                  KOLEKSİYONU GÖR
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {/* Sayfa Başlığı ve Navigasyon */}
              <header className="flex flex-col items-start mb-16">
                <Link
                  href="/products"
                  className="group flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-colors mb-8 text-[10px] font-bold tracking-[0.2em]"
                >
                  <ArrowLeft
                    size={14}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                  ÜRÜNLERE DÖN
                </Link>
                <div className="flex flex-col md:flex-row md:items-end gap-4 w-full justify-between border-b border-slate-100 pb-10">
                  <div>
                    <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                      SEPET{" "}
                     
                    </h1>
                    <p className="text-slate-400 text-xs mt-2 font-medium tracking-widest uppercase">
                      Seçili Profesyonel Ekipmanlar / {cartItems.length} Kalem
                    </p>
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                {/* Ürün Listesi Konteynırı */}
                <div className="lg:col-span-7 xl:col-span-8">
                  <div className="flex flex-col">
                    {cartItems.map((item, index) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: index * 0.08,
                          ease: [0.19, 1, 0.22, 1],
                          duration: 1,
                        }}
                        key={item.id}
                        className="border-b border-slate-100"
                      >
                        <CartItem
                          item={item}
                          onIncrease={() => handleQuantityChange(item.id, 1)}
                          onDecrease={() => handleQuantityChange(item.id, -1)}
                          onRemove={() => handleRemove(item.id)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Sağ Panel / Özet */}
                <div className="lg:col-span-5 xl:col-span-4 relative">
                  <div className="sticky top-32">
                    <CartSummary subtotal={subtotal} />

                    {/* Güvenlik Notu Bölümü */}
                    <div className="mt-8 p-6 bg-slate-50/50 border border-slate-100 flex items-start gap-4">
                      <ShieldCheck className="h-5 w-5 text-slate-900 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase tracking-wider">
                        Tedarik sürecimiz endüstriyel standartlarda takip
                        edilmektedir. Tüm siparişler sigortalı sevkiyat
                        kapsamındadır.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CartLoadingSkeleton() {
  return (
    <div className="max-w-[1600px] mx-auto px-6 py-24">
      <Skeleton className="h-16 w-64 mb-16 bg-slate-100 rounded-none" />
      <div className="flex flex-col lg:flex-row gap-20">
        <div className="flex-1 space-y-10">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-8 pb-10 border-b border-slate-50">
              <Skeleton className="w-40 h-40 bg-slate-50 rounded-none" />
              <div className="flex-1 space-y-5 py-2">
                <Skeleton className="h-6 w-1/2 bg-slate-50" />
                <Skeleton className="h-4 w-1/4 bg-slate-50" />
                <Skeleton className="h-10 w-32 mt-6 bg-slate-50 rounded-none" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="w-full lg:w-[420px] h-[500px] bg-slate-50 rounded-none" />
      </div>
    </div>
  );
}
