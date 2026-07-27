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
  Tag,
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
import {
  withKdv,
  getShippingFee,
  FREE_SHIPPING_THRESHOLD,
  formatPrice,
} from "@/lib/pricing";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface StockRow {
  id: number;
  sizeId: number | null;
  stock: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
  mainImage: string;
  bulkDiscountQty?: number | null;
  bulkDiscountRate?: number | null;
  stock?: StockRow[];
}

export interface CartItemType {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
  sizeId?: number | null;
  size?: { id: number; value: string } | null;
  customImage?: string | null;
}

// Stok takibi yoksa sınırsız kabul edilir.
function getMaxQuantity(item: CartItemType): number {
  const stock = item.product.stock;
  if (!stock || stock.length === 0) return Infinity;
  const row =
    stock.find((s) => s.sizeId === (item.sizeId ?? null)) ??
    stock.find((s) => s.sizeId === null);
  return row ? row.stock : Infinity;
}

interface CartDropdownProps {
  showCount?: boolean;
  guest?: boolean;
  mobileBottomBar?: boolean; // Alt bar modu
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const CartDropdown = forwardRef(
  (
    {
      showCount = true,
      guest = false,
      mobileBottomBar = false,
    }: CartDropdownProps,
    ref,
  ) => {
    const [cartItems, setCartItems] = useState<CartItemType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      window.dispatchEvent(
        new CustomEvent("cartSheetStateChange", { detail: { isOpen } }),
      );
    }, [isOpen]);

    // ─── Login check ───────────────────────────────────────────────────────
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

    // ─── API cart ──────────────────────────────────────────────────────────
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
      } catch {
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    }, []);

    // ─── Guest cart ────────────────────────────────────────────────────────
    const loadGuestCart = useCallback(() => {
      try {
        const cart = getCart();
        const guestCart: CartItemType[] = cart.map((item: GuestCartItem) => ({
          id: item.productId,
          productId: item.productId,
          quantity: item.quantity,
          sizeId: item.sizeId ?? null,
          size: item.sizeValue
            ? { id: item.sizeId ?? 0, value: item.sizeValue }
            : null,
          customImage: item.customImage ?? null,
          product: {
            id: item.productId,
            title: item.title,
            price: item.price,
            mainImage: item.image,
            bulkDiscountQty: item.bulkDiscountQty ?? null,
            bulkDiscountRate: item.bulkDiscountRate ?? null,
          },
        }));
        setCartItems(guestCart);
      } catch (err) {
        console.error("Guest cart error", err);
      } finally {
        setIsLoading(false);
      }
    }, []);

    // ─── Initial + re-load ─────────────────────────────────────────────────
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

    // ─── Quantity change ───────────────────────────────────────────────────
    const handleQuantityChange = async (
      id: number,
      delta: number,
      sizeId?: number | null,
      customImage?: string | null,
    ) => {
      if (!isLoggedIn) {
        updateGuestCartQuantity(id, delta, sizeId, customImage);
        loadGuestCart();
        return;
      }

      const item = cartItems.find((c) => c.id === id);
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + delta);

      if (delta > 0 && newQuantity > getMaxQuantity(item)) {
        toast.error(
          `Bu üründen en fazla ${getMaxQuantity(item)} adet ekleyebilirsiniz.`,
        );
        return;
      }

      try {
        const res = await fetch(`/api/cart/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQuantity }),
          credentials: "include",
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          toast.error(data?.error || "Miktar güncellenemedi");
          return;
        }

        const updatedItem = await res.json();
        setCartItems((prev) =>
          prev.map((c) =>
            c.id === item.id ? { ...c, quantity: updatedItem.quantity } : c,
          ),
        );
      } catch {
        toast.error("Miktar güncellenemedi");
      }
    };

    // ─── Remove ────────────────────────────────────────────────────────────
    const handleRemove = async (
      cartItemId: number,
      productId: number,
      sizeId?: number | null,
      customImage?: string | null,
    ) => {
      if (!isLoggedIn) {
        removeFromGuestCart(productId, sizeId, customImage);
        loadGuestCart();
        return;
      }

      try {
        const res = await fetch(`/api/cart/${cartItemId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          setCartItems((prev) => prev.filter((c) => c.id !== cartItemId));
          toast.success("Ürün kaldırıldı");
        }
      } catch {
        toast.error("Ürün kaldırılamadı");
      }
    };

    // ─── Totals with Bulk Discount ─────────────────────────────────────────
    const subtotal = cartItems.reduce((acc, i) => {
      let itemTotal = withKdv(i.product.price) * i.quantity;

      if (
        i.product.bulkDiscountQty &&
        i.product.bulkDiscountRate &&
        i.quantity >= i.product.bulkDiscountQty
      ) {
        const discountAmount = (itemTotal * i.product.bulkDiscountRate) / 100;
        itemTotal = itemTotal - discountAmount;
      }

      return acc + itemTotal;
    }, 0);

    const totalBulkDiscount = cartItems.reduce((acc, i) => {
      if (
        i.product.bulkDiscountQty &&
        i.product.bulkDiscountRate &&
        i.quantity >= i.product.bulkDiscountQty
      ) {
        const itemTotal = withKdv(i.product.price) * i.quantity;
        const discountAmount = (itemTotal * i.product.bulkDiscountRate) / 100;
        return acc + discountAmount;
      }
      return acc;
    }, 0);

    // subtotal KDV dahil olarak hesaplanır — ayrıca KDV eklenmez
    const shippingFee = getShippingFee(subtotal);
    const total = subtotal + shippingFee;

    // ─── Trigger Button ────────────────────────────────────────────────────
    // Mobil alt bar için özel görünüm
    const TriggerButton = mobileBottomBar ? (
      <button
        aria-label="Sepeti Aç"
        className="flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-orange-600 active:text-orange-600 transition-colors relative w-full h-full"
      >
        <div className="relative">
          <ShoppingCart size={20} strokeWidth={2.5} />
          {showCount && cartItems.length > 0 && (
            <span className="absolute -top-1.5 -right-2 h-3.5 w-3.5 rounded-full bg-slate-900 text-white text-[8px] flex items-center justify-center font-bold leading-none">
              {cartItems.length > 9 ? "9+" : cartItems.length}
            </span>
          )}
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider">
          Sepetim
        </span>
      </button>
    ) : (
      <button
        aria-label="Sepeti Aç"
        className="group relative flex items-center gap-4 pl-2 pr-1 md:pr-4 py-2 hover:bg-slate-50 transition-all outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
      >
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-sm text-slate-950 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
          <ShoppingCart size={18} strokeWidth={2.5} />
        </div>
        {showCount && cartItems.length > 0 && (
          <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-slate-900 text-white text-[9px] flex items-center justify-center font-bold font-mono shadow-sm">
            {cartItems.length}
          </span>
        )}
      </button>
    );

    // ─── Render ────────────────────────────────────────────────────────────
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>{TriggerButton}</SheetTrigger>

        <SheetContent
          side="right"
          className="z-[200] p-0 w-full sm:max-w-[450px] h-full fixed top-0 right-0 bg-white flex flex-col border-l border-slate-100 shadow-2xl"
        >
          {/* Header */}
          <div className="px-8 pt-12 pb-8 shrink-0 border-b border-slate-50 bg-slate-50/30">
            <div className="flex justify-between items-end">
              <SheetTitle className="flex flex-col gap-1.5">
                <span className="text-[10px] tracking-[0.4em] text-slate-400 uppercase font-black leading-none">
                  EKİPMAN SEÇİMİ
                </span>
                <span className="text-2xl font-black text-slate-900 uppercase">
                  SEPETİM
                </span>
              </SheetTitle>
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 text-slate-900">
                <Package className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-widest font-mono">
                  {cartItems.length} ÜRÜN
                </span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
            {isLoading ? (
              <div className="space-y-10 pt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-6">
                    <Skeleton className="w-24 h-24 bg-slate-50 border border-slate-100" />
                    <div className="flex-1 space-y-4 py-1">
                      <Skeleton className="h-4 w-3/4 bg-slate-50" />
                      <Skeleton className="h-3 w-1/4 bg-slate-50" />
                      <Skeleton className="h-8 w-20 bg-slate-50" />
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
                      className="border-slate-900 rounded-sm text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] px-10 h-14 hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-lg"
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
                      key={`${item.productId}-${item.sizeId ?? "null"}-${item.customImage || "default"}`}
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
                        maxQuantity={getMaxQuantity(item)}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemove}
                        isLoggedIn={isLoggedIn}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-200 p-8 space-y-6 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>ARA TOPLAM</span>
                  <span className="text-slate-900 font-mono">
                    ₺{formatPrice(subtotal)}
                  </span>
                </div>

                {totalBulkDiscount > 0 && (
                  <div className="flex justify-between text-[11px] font-bold text-emerald-600 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      TOPLU ALIM İNDİRİMİ
                    </span>
                    <span className="font-mono">
                      -₺{formatPrice(totalBulkDiscount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>KARGO</span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-mono">ÜCRETSİZ</span>
                  ) : (
                    <span className="text-slate-900 font-mono">
                      ₺{formatPrice(shippingFee)}
                    </span>
                  )}
                </div>
                {shippingFee > 0 && (
                  <p className="text-[9px] text-slate-400 font-medium normal-case -mt-1">
                    ₺{formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} daha
                    ekleyin, kargo ücretsiz olsun.
                  </p>
                )}

                <div className="flex justify-between items-start pt-4 border-t border-slate-200">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">
                      GENEL TOPLAM
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                      Vergiler Dahil Net Tutar
                    </span>
                  </div>
                  <span className="text-xl font-black text-slate-900 tracking-tighter font-mono leading-none">
                    ₺{formatPrice(total)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <SheetClose asChild>
                  <Link href="/checkout" className="w-full">
                    <Button className="w-full rounded-sm bg-slate-900 hover:bg-slate-800 text-white h-16 font-bold text-[11px] uppercase tracking-[0.25em] transition-all duration-500 group relative overflow-hidden">
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
                      className="w-full rounded-sm bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-900 h-12 font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-300"
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
