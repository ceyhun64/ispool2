"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import CartItem from "./cartItem";
import CartSummary from "./cartSummary";
import { Button } from "../../ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";
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
  price: number; // Prisma: Int
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

  // Veri çekme fonksiyonları (Logic aynı kalıyor)
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

  // Handle fonksiyonları aynı mantıkla kalabilir...
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
    0
  );

  if (isLoading) return <CartLoadingSkeleton />;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-24">
        <AnimatePresence mode="wait">
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[500px] text-center"
            >
              <div className="mb-8 relative">
                <ShoppingBag
                  strokeWidth={1}
                  className="h-20 w-20 text-slate-200"
                />
                <div className="absolute -top-2 -right-2 h-4 w-4 bg-slate-100 rounded-full animate-pulse" />
              </div>
              <h1 className="text-2xl font-light tracking-tight text-slate-900 mb-3">
                Sepetiniz Boş
              </h1>
              <p className="text-slate-400 text-sm max-w-[280px] mb-10 leading-relaxed font-light">
                Koleksiyonlarımıza göz atarak size en uygun parçaları keşfedin.
              </p>
              <Link href="/products">
                <Button className="bg-slate-950 hover:bg-slate-800 text-white rounded-none px-10 py-6 text-xs tracking-widest transition-all duration-500">
                  KEŞFETMEYE BAŞLA
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <header className="flex flex-col items-start mb-12 border-b border-slate-100 pb-8">
                <Link
                  href="/products"
                  className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-6 text-xs tracking-widest"
                >
                  <ArrowLeft
                    size={14}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                  ALIŞVERİŞE DEVAM ET
                </Link>
                <div className="flex items-baseline gap-4">
                  <h1 className="text-4xl font-light tracking-tight text-slate-900">
                    Sepet
                  </h1>
                  <span className="text-slate-400 font-light text-lg">
                    ({cartItems.length} Ürün)
                  </span>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Ürün Listesi */}
                <div className="lg:col-span-8">
                  <div className="flex flex-col">
                    {cartItems.map((item, index) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={item.id}
                        className="border-b border-slate-50 last:border-0"
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

                {/* Özet Paneli */}
                <div className="lg:col-span-4 relative">
                  <div className="sticky top-32">
                    <CartSummary subtotal={subtotal} />
                    <p className="mt-6 text-[11px] text-slate-400 leading-relaxed text-center font-light px-4">
                      Tüm ödemeleriniz SSL şifreleme ile güvence altındadır. KDV
                      dahil fiyatlandırma uygulanmıştır.
                    </p>
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
    <div className="container mx-auto px-6 py-24">
      <Skeleton className="h-12 w-48 mb-12 bg-slate-50" />
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1 space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-6 pb-8 border-b border-slate-50">
              <Skeleton className="w-32 h-40 bg-slate-50" />
              <div className="flex-1 space-y-4 py-2">
                <Skeleton className="h-4 w-1/3 bg-slate-50" />
                <Skeleton className="h-3 w-1/4 bg-slate-50" />
                <Skeleton className="h-8 w-24 mt-4 bg-slate-50" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="w-full lg:w-[380px] h-[400px] bg-slate-50 rounded-none" />
      </div>
    </div>
  );
}
