"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getCart, GuestCartItem } from "@/utils/cart";
import {
  ShoppingCart,
  Edit3,
  Info,
  Receipt,
  TrendingUp,
  CheckCircle2,
  Truck,
  CreditCard,
  Tag,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";

const KDV_RATE = 0.1;

const installmentRates = [
  { count: 1, rate: 0 },
  { count: 2, rate: 3.5 },
  { count: 3, rate: 5.2 },
  { count: 6, rate: 9.8 },
  { count: 9, rate: 13.5 },
  { count: 12, rate: 17.0 },
];

interface Product {
  id: number;
  title: string;
  price: number;
  mainImage: string;
}

interface BasketItem {
  id: number;
  product: Product;
  quantity: number;
}

interface CouponData {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  discountAmount: number;
  finalPrice: number;
}

interface BasketSummaryCardProps {
  selectedCargoFee: number;
  selectedInstallment?: number;
  appliedCoupon?: CouponData | null;
  onCouponApply?: (coupon: CouponData | null) => void;
  subTotal: number;
}

export default function BasketSummaryCard({
  selectedCargoFee = 0,
  selectedInstallment = 1,
  appliedCoupon,
  onCouponApply,
  subTotal: externalSubTotal,
}: BasketSummaryCardProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [guestItems, setGuestItems] = useState<GuestCartItem[]>([]);
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch("/api/account/check");
        const data = await res.json();
        setIsLoggedIn(!!data.user);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn === null) return;
    const fetchCart = async () => {
      if (isLoggedIn) {
        try {
          const res = await fetch("/api/cart");
          if (res.ok) {
            const data = await res.json();
            setBasketItems(
              data.map((item: any) => ({
                id: item.id,
                product: {
                  id: item.product.id,
                  title: item.product.title,
                  price: item.product.price,
                  mainImage: item.product.mainImage,
                },
                quantity: item.quantity,
              }))
            );
            setGuestItems([]);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setGuestItems(getCart());
        setBasketItems([]);
      }
    };
    fetchCart();
    window.addEventListener("cartUpdated", fetchCart);
    return () => window.removeEventListener("cartUpdated", fetchCart);
  }, [isLoggedIn]);

  const itemsToRender = isLoggedIn
    ? basketItems
    : guestItems.map((item, i) => ({
        id: i,
        product: {
          id: item.productId,
          title: item.title,
          price: item.price,
          mainImage: item.image,
        },
        quantity: item.quantity,
      }));

  const calculatedSubTotal =
    externalSubTotal ||
    itemsToRender.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

  const calculatedKdv = calculatedSubTotal * KDV_RATE;
  const baseTotalBeforeDiscount =
    calculatedSubTotal + calculatedKdv + selectedCargoFee;

  // Apply coupon discount
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const baseTotalAfterDiscount = Math.max(
    0,
    baseTotalBeforeDiscount - discountAmount
  );

  // Calculate installment
  const selectedRate = installmentRates.find(
    (r) => r.count === selectedInstallment
  );
  const interestAmount = selectedRate
    ? baseTotalAfterDiscount * (selectedRate.rate / 100)
    : 0;
  const totalWithInstallment = baseTotalAfterDiscount + interestAmount;
  const monthlyPayment = totalWithInstallment / selectedInstallment;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.toUpperCase(),
          cartTotal: baseTotalBeforeDiscount,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onCouponApply?.({
          code: data.code,
          type: data.type,
          discountAmount: data.discountAmount,
          finalPrice: data.finalPrice,
        });
        setCouponCode("");
        setCouponError(null);
      } else {
        setCouponError(data.error || "Kupon uygulanamadı");
        onCouponApply?.(null);
      }
    } catch (err) {
      setCouponError("Bir hata oluştu");
      onCouponApply?.(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    onCouponApply?.(null);
    setCouponCode("");
    setCouponError(null);
  };

  if (isLoggedIn === null)
    return (
      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardContent className="py-20 flex flex-col items-center gap-3">
          <div className="h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        </CardContent>
      </Card>
    );

  if (itemsToRender.length === 0)
    return (
      <Card className="border-dashed border-2 bg-slate-50/30">
        <CardContent className="py-12 text-center space-y-4">
          <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-medium text-slate-500">
            Sepetiniz şu an boş.
          </p>
          <Link href="/" className="block">
            <Button variant="link" className="text-slate-950">
              Alışverişe Başla
            </Button>
          </Link>
        </CardContent>
      </Card>
    );

  const displayedItems = isExpanded ? itemsToRender : itemsToRender.slice(0, 3);

  return (
    <div className="sticky top-6 space-y-4">
      <Card className="shadow-2xl shadow-slate-200/50 border-none overflow-hidden">
        <CardHeader className="bg-white pt-8 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-2 uppercase">
              Sipariş Özeti
            </CardTitle>
            <div className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
              {itemsToRender.length} ÜRÜN
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-0">
          {/* Items List */}
          <div className="space-y-3">
            {displayedItems.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100 bg-white">
                  <Image
                    src={item.product.mainImage}
                    alt={item.product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-[11px] font-medium text-slate-900 truncate uppercase tracking-tight">
                    {item.product.title}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {item.quantity} Adet
                  </p>
                </div>
                <div className="text-right flex flex-col justify-center">
                  <p className="text-xs font-semibold text-slate-950">
                    ₺{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            {itemsToRender.length > 3 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-[10px] font-bold text-slate-400 hover:text-slate-950 transition-colors uppercase tracking-widest pt-2"
              >
                {isExpanded
                  ? "Daha Az Göster"
                  : `+${itemsToRender.length - 3} Diğer Ürün`}
              </button>
            )}
          </div>

          <Separator className="bg-slate-100" />

          {/* Coupon Input Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-700">
              <Tag className="w-3.5 h-3.5" />
              <span>İndirim Kuponu</span>
            </div>

            {appliedCoupon ? (
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl space-y-3 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-500 rounded-full">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">
                        Kupon Uygulandı
                      </p>
                      <p className="text-xs font-bold text-emerald-900">
                        {appliedCoupon.code}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1 hover:bg-emerald-200 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-emerald-700" />
                  </button>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-emerald-200/50">
                  <span className="text-[11px] text-emerald-700">
                    {appliedCoupon.type === "PERCENTAGE" ? "Yüzde" : "Sabit"}{" "}
                    İndirim
                  </span>
                  <span className="text-sm font-bold text-emerald-900">
                    -₺{appliedCoupon.discountAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="KUPON KODU"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError(null);
                    }}
                    disabled={couponLoading}
                    className="text-xs font-mono uppercase tracking-widest border-slate-200 focus:border-slate-900 rounded-xl h-10"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleApplyCoupon();
                    }}
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    size="sm"
                    className="h-10 px-4 bg-slate-900 hover:bg-slate-800 rounded-xl shrink-0"
                  >
                    {couponLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {couponError && (
                  <p className="text-[10px] text-red-600 animate-in slide-in-from-top-1 duration-200">
                    {couponError}
                  </p>
                )}
              </div>
            )}
          </div>

          <Separator className="bg-slate-100" />

          {/* Pricing Details */}
          <div className="space-y-2.5">
            {[
              { label: "Ara Toplam", val: calculatedSubTotal, icon: Receipt },
              {
                label: "Kargo",
                val: selectedCargoFee,
                icon: Truck,
                isFree: selectedCargoFee === 0,
              },
              { label: "KDV (%10)", val: calculatedKdv, icon: TrendingUp },
            ].map((row, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-[13px]"
              >
                <span className="text-slate-500 font-light flex items-center gap-2">
                  <row.icon size={14} strokeWidth={1.5} /> {row.label}
                </span>
                <span
                  className={`font-medium ${
                    row.isFree ? "text-green-600 font-bold" : "text-slate-900"
                  }`}
                >
                  {row.isFree ? "ÜCRETSİZ" : `₺${Number(row.val).toFixed(2)}`}
                </span>
              </div>
            ))}

            {/* Show discount as a separate line */}
            {appliedCoupon && (
              <div className="flex justify-between items-center text-[13px] pt-2 border-t border-dashed border-emerald-200">
                <span className="text-emerald-600 font-medium flex items-center gap-2">
                  <Tag size={14} strokeWidth={1.5} /> Kupon İndirimi
                </span>
                <span className="font-bold text-emerald-600">
                  -₺{discountAmount.toFixed(2)}
                </span>
              </div>
            )}

            {/* Installment Section */}
            {selectedInstallment > 1 && (
              <div className="mt-4 pt-4 border-t border-dashed border-slate-200 space-y-3">
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-500 font-light flex items-center gap-2">
                    <CreditCard size={14} /> Taksit
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedInstallment}x
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-500 font-light flex items-center gap-2">
                    <TrendingUp size={14} /> Vade Farkı
                  </span>
                  <span className="font-medium text-orange-600">
                    +₺{interestAmount.toFixed(2)}
                  </span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl text-white shadow-lg shadow-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-light uppercase tracking-[0.2em] opacity-60">
                      Aylık Ödeme
                    </span>
                    <span className="text-lg font-bold">
                      ₺{monthlyPayment.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Final Total */}
          <div
            className={`p-5 rounded-2xl transition-all duration-500 ${
              selectedInstallment > 1
                ? "bg-slate-50 border border-slate-100"
                : "bg-slate-950 text-white shadow-xl shadow-slate-300"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <p
                  className={`text-[10px] uppercase tracking-[0.15em] ${
                    selectedInstallment > 1
                      ? "text-slate-400"
                      : "text-slate-400"
                  }`}
                >
                  Toplam Ödeme
                </p>
                <p
                  className={`text-2xl font-bold tracking-tighter ${
                    selectedInstallment > 1 ? "text-slate-900" : "text-white"
                  }`}
                >
                  ₺{totalWithInstallment.toFixed(2)}
                </p>
              </div>
              <CheckCircle2
                size={28}
                className={
                  selectedInstallment > 1 ? "text-slate-200" : "text-slate-700"
                }
              />
            </div>
          </div>

          {/* Info Badge */}
          <div className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
            <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <p className="text-[10px] leading-relaxed text-slate-500 font-light">
              24 saat içinde kargo garantisi.{" "}
              {selectedInstallment > 1 &&
                "Taksitlendirme banka prosedürlerine tabidir."}
            </p>
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-6 px-6">
          <Link href="/cart" className="w-full">
            <Button
              variant="ghost"
              className="w-full text-xs font-bold tracking-widest text-slate-400 hover:text-slate-950 hover:bg-transparent uppercase"
            >
              <Edit3 className="w-3 h-3 mr-2" /> Sepeti Düzenle
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
