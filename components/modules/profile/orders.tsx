"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sideBar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import { formatPrice } from "@/lib/pricing";
import {
  Package,
  MapPin,
  CreditCard,
  User,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Truck,
  Clock,
  Box,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Hash,
  Tag,
  Layers,
  Ruler,
  ReceiptText,
  Home,
  Building2,
  Globe,
  Mail,
  Barcode,
  ArrowRight,
  PackageCheck,
  RotateCcw,
  ClipboardList,
  Percent,
  ChevronDown,
  ChevronUp,
  Eye,
  ExternalLink,
} from "lucide-react";

// ==== Tip Tanımları ====
interface Address {
  id: string | number;
  type: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  neighborhood?: string;
  district: string;
  city: string;
  zip?: string;
  country: string;
  tcno?: string;
  billingType?: "bireysel" | "kurumsal" | null;
}

interface Size {
  id: number;
  value: string;
}

interface Product {
  id: number;
  title: string;
  mainImage: string;
  price?: number;
  brand?: { name: string };
  category?: { name: string };
}

interface OrderItem {
  id: string | number;
  product: Product;
  quantity: number;
  totalPrice: number;
  unitPrice?: number;
  size?: Size | null;
  customImage?: string | null;
}

interface Order {
  id: string | number;
  createdAt: string;
  status: string;
  paidPrice: number;
  totalPrice: number;
  currency: string;
  installment?: number;
  paymentMethod?: string;
  couponCode?: string;
  discountAmount?: number;
  addresses: Address[];
  items: OrderItem[];
}

// ==== Yardımcı Sabitler ====
const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: React.ReactNode;
    step: number;
  }
> = {
  pending: {
    label: "Onay Bekliyor",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: <Clock size={13} />,
    step: 0,
  },
  paid: {
    label: "Hazırlanıyor",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: <Box size={13} />,
    step: 1,
  },
  shipped: {
    label: "Kargoya Verildi",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    icon: <Truck size={13} />,
    step: 2,
  },
  delivered: {
    label: "Teslim Edildi",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: <CheckCircle2 size={13} />,
    step: 3,
  },
  cancelled: {
    label: "İptal Edildi",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: <XCircle size={13} />,
    step: -1,
  },
};

const TRACKING_STEPS = [
  {
    key: "pending",
    label: "Sipariş Alındı",
    icon: <ClipboardList size={16} />,
  },
  { key: "paid", label: "Hazırlanıyor", icon: <PackageCheck size={16} /> },
  { key: "shipped", label: "Kargoda", icon: <Truck size={16} /> },
  {
    key: "delivered",
    label: "Teslim Edildi",
    icon: <CheckCircle2 size={16} />,
  },
];

// Para birimi formatlaması — admin panelindeki currency->sembol eşlemesiyle
// tutarlı olması için burada da aynı yaklaşım kullanılır (TRY dışı bir
// sipariş için sabit "₺" yazmak yanlış olurdu).
const CURRENCY_SYMBOLS: Record<string, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
};
function getCurrencySymbol(currency?: string): string {
  return CURRENCY_SYMBOLS[currency || "TRY"] || "₺";
}
function formatMoney(amount: number, currency?: string): string {
  return `${formatPrice(amount)} ${getCurrencySymbol(currency)}`;
}

// ==== Alt Bileşenler ====

function TrackingTimeline({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-none">
        <XCircle size={16} className="text-red-500 flex-shrink-0" />
        <span className="text-[11px] font-black uppercase tracking-widest text-red-600">
          Bu sipariş iptal edildi
        </span>
      </div>
    );
  }

  const currentStep = STATUS_CONFIG[status]?.step ?? 0;

  return (
    <div className="relative py-4 px-2">
      <div className="flex items-center justify-between relative">
        {/* Progress bar */}
        <div className="absolute top-5 left-5 right-5 h-[2px] bg-slate-100 z-0" />
        <div
          className="absolute top-5 left-5 h-[2px] bg-orange-400 z-0 transition-all duration-700"
          style={{
            width: `${Math.max(0, (currentStep / (TRACKING_STEPS.length - 1)) * 100)}%`,
          }}
        />

        {TRACKING_STEPS.map((step, idx) => {
          const isCompleted = idx <= currentStep;
          const isActive = idx === currentStep;
          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-col items-center gap-2 flex-1"
            >
              <div
                className={`
                  w-10 h-10 flex items-center justify-center border-2 transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200"
                      : "bg-white border-slate-200 text-slate-300"
                  }
                  ${isActive ? "ring-4 ring-orange-100 scale-110" : ""}
                `}
              >
                {step.icon}
              </div>
              <span
                className={`text-[7px] md:text-[9px] font-black uppercase tracking-wider text-center leading-tight max-w-[60px] ${
                  isCompleted ? "text-slate-700" : "text-slate-300"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderItemRow({
  item,
  currency,
}: {
  item: OrderItem;
  currency?: string;
}) {
  return (
    <div className="flex gap-4 items-start py-4 border-b border-slate-50 last:border-0 group/row">
      {/* Ürün görseli */}
      <div className="relative flex-shrink-0 w-20 h-24 bg-slate-50 border border-slate-100 overflow-hidden">
        <img
          src={item.customImage || item.product.mainImage}
          alt={item.product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover/row:scale-105"
        />
        <div className="absolute top-1 left-1 bg-slate-900/90 text-white text-[9px] font-black px-1.5 py-0.5 leading-none">
          ×{item.quantity}
        </div>
        {item.customImage && (
          <div
            className="absolute bottom-1 right-1 bg-orange-500 text-white text-[8px] font-black px-1 py-0.5 leading-none"
            title="Özel Görsel"
          >
            ÖZEL
          </div>
        )}
      </div>

      {/* Ürün bilgileri */}
      <div className="flex-1 min-w-0 space-y-2">
        <div>
          {item.product.brand && (
            <p className="text-[9px] font-black uppercase tracking-widest text-orange-500 mb-0.5">
              {item.product.brand.name}
            </p>
          )}
          <h4 className="text-[12px] font-black uppercase tracking-tight text-slate-900 leading-snug line-clamp-2">
            {item.product.title}
          </h4>
          {item.product.category && (
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              {item.product.category.name}
            </p>
          )}
        </div>

        {/* Beden & Detaylar */}
        <div className="flex flex-wrap gap-2">
          {item.size && (
            <span className="flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-700">
              <Ruler size={10} className="text-orange-500" />
              Beden: {item.size.value}
            </span>
          )}
          <span className="flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-700">
            <Layers size={10} className="text-orange-500" />
            Adet: {item.quantity}
          </span>
        </div>

        {/* Fiyat satırı */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5">
            Birim: {formatMoney(item.unitPrice ?? 0, currency)}
          </span>
          <span className="text-[13px] font-black text-orange-600 tracking-tight">
            {formatMoney((item.unitPrice ?? 0) * item.quantity, currency)}
          </span>
        </div>
      </div>

      {/* Link */}
      <Link
        href={`/products/${item.product.id}`}
        className="flex-shrink-0 mt-1 w-8 h-8 flex items-center justify-center border border-slate-100 hover:border-orange-400 hover:bg-orange-50 transition-all text-slate-300 hover:text-orange-500"
        title="Ürüne git"
      >
        <ExternalLink size={13} />
      </Link>
    </div>
  );
}

function AddressCard({
  address,
  label,
  icon,
}: {
  address: Address;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-100 p-5 space-y-3">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <span className="text-orange-500">{icon}</span>
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </p>
      </div>
      <div className="space-y-1.5 text-[12px]">
        <p className="font-black text-slate-900 uppercase text-[13px]">
          {address.firstName} {address.lastName}
        </p>
        {address.billingType && (
          <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">
            {address.billingType === "kurumsal" ? "Kurumsal Fatura" : "Bireysel Fatura"}
          </p>
        )}
        <p className="text-slate-500 font-medium leading-relaxed">
          {address.address}
          {address.neighborhood && `, ${address.neighborhood}`}
        </p>
        <p className="text-slate-600 font-bold">
          {address.district} / {address.city}
          {address.zip && (
            <span className="text-slate-400 font-medium"> {address.zip}</span>
          )}
        </p>
        <p className="text-slate-500 font-medium flex items-center gap-1">
          <Globe size={11} className="text-slate-300" />
          {address.country}
        </p>
        <p className="text-slate-900 font-black flex items-center gap-1.5 pt-1">
          <Phone size={11} className="text-orange-400" />
          {address.phone}
        </p>
        {address.tcno && (
          <p className="text-slate-400 font-medium flex items-center gap-1.5">
            <Barcode size={11} className="text-slate-300" />
            {address.billingType === "kurumsal" ? "Vergi No" : "TC"}: {address.tcno}
          </p>
        )}
      </div>
    </div>
  );
}

function PaymentSummaryTable({
  order,
  subtotal,
  tax,
}: {
  order: Order;
  subtotal: number;
  tax: number;
}) {
  return (
    <div className="bg-white border border-slate-100 p-5 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <ReceiptText size={14} className="text-orange-500" />
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
          Ödeme Detayı
        </p>
      </div>

      <div className="space-y-3 text-[12px]">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-semibold uppercase tracking-wider">
            Ara Toplam
          </span>
          <span className="font-bold text-slate-700">
            {formatMoney(subtotal, order.currency)}
          </span>
        </div>

        {order.discountAmount && order.discountAmount > 0 ? (
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Percent size={11} className="text-green-500" />
              İndirim
              {order.couponCode && (
                <span className="bg-green-50 border border-green-100 text-green-700 text-[9px] font-black px-1.5 py-0.5 ml-1">
                  {order.couponCode}
                </span>
              )}
            </span>
            <span className="font-bold text-green-600">
              -{formatMoney(order.discountAmount, order.currency)}
            </span>
          </div>
        ) : null}

        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-semibold uppercase tracking-wider">
            KDV / Vergi
          </span>
          <span className="font-bold text-slate-700">
            {formatMoney(tax, order.currency)}
          </span>
        </div>

        {order.paymentMethod && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-semibold uppercase tracking-wider">
              Ödeme Yöntemi
            </span>
            <span className="font-bold text-slate-700 capitalize">
              {order.paymentMethod}
            </span>
          </div>
        )}

        {order.installment && order.installment > 1 && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-semibold uppercase tracking-wider">
              Taksit
            </span>
            <span className="font-bold text-slate-700">
              {order.installment}x
            </span>
          </div>
        )}

        <Separator className="my-2" />

        <div className="flex justify-between items-baseline pt-1">
          <span className="text-slate-900 font-black uppercase tracking-tight text-[13px]">
            GENEL TOPLAM
          </span>
          <div className="text-right">
            <span className="text-2xl font-black text-orange-600 tracking-tighter">
              {formatPrice(order.paidPrice)}
            </span>
            <span className="text-sm font-black text-orange-500 ml-1">
              {getCurrencySymbol(order.currency)}
            </span>
          </div>
        </div>

        {order.installment && order.installment > 1 && (
          <p className="text-[10px] text-slate-400 text-right font-medium">
            {order.installment} ×{" "}
            {formatPrice(order.paidPrice / order.installment)}{" "}
            {getCurrencySymbol(order.currency)}
          </p>
        )}
      </div>
    </div>
  );
}

// ==== Ana Bileşen ====
export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string | number>>(
    new Set(),
  );

  const toggleExpand = (orderId: string | number) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      next.has(orderId) ? next.delete(orderId) : next.add(orderId);
      return next;
    });
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/order/user", { method: "GET" });
      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }
      const data = await res.json();
      if (data.status === "success") {
        setOrders(data.orders);
        setIsAuthorized(true);
      } else {
        toast.error("Siparişler alınamadı.");
      }
    } catch (err) {
      console.error("Orders Fetch Error:", err);
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [router]);

  const handleCancelOrder = async (orderId: string | number) => {
    try {
      const res = await fetch("/api/order/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success("Sipariş başarıyla iptal edildi.");
        fetchOrders();
      } else toast.error(data.error || "Sipariş iptal edilemedi.");
    } catch {
      toast.error("Bir hata oluştu.");
    }
  };

  const calculateOrderSummary = (order: Order) => {
    const subtotal = order.items.reduce(
      (sum, item) => sum + (item.unitPrice || 0) * item.quantity,
      0,
    );
    const tax = order.totalPrice - subtotal;
    return { subtotal, tax };
  };

  // ==== Loading ====
  if (loading)
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 px-6 py-12 md:px-16 lg:px-24">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="space-y-3">
              <Skeleton className="h-10 w-56 bg-slate-200" />
              <Skeleton className="h-4 w-32 bg-slate-200" />
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="space-y-3">
                <div className="flex gap-3">
                  <Skeleton className="h-6 w-28 bg-slate-200" />
                  <Skeleton className="h-6 w-24 bg-slate-200" />
                </div>
                <Skeleton className="h-80 w-full bg-white border" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );

  if (!isAuthorized) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-100 text-slate-900">
      <Sidebar />

      <main className="flex-1 px-4 py-10 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          {/* ===== Header ===== */}
          <header className="mb-12 relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-orange-500 p-2 flex-shrink-0">
                <Package className="text-white w-5 h-5" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase leading-none">
              Sipariş <span className="text-orange-600">Geçmişi</span>
            </h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-[0.35em] font-black mt-2 flex items-center gap-2">
              <ShieldCheck size={13} className="text-emerald-500" />
              Korumalı Hesap · Tüm işlemleriniz güvende
            </p>

            {orders.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-sm">
                  <div className="w-2 h-2 bg-orange-500 animate-pulse" />
                  <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
                    {orders.length} KAYIT
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-sm">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
                    {orders.filter((o) => o.status === "delivered").length}{" "}
                    TESLİM EDİLDİ
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-sm">
                  <Truck size={12} className="text-indigo-500" />
                  <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
                    {orders.filter((o) => o.status === "shipped").length}{" "}
                    KARGODA
                  </span>
                </div>
              </div>
            )}
          </header>

          {/* ===== Boş Durum ===== */}
          {orders.length === 0 ? (
            <div className="py-32 flex flex-col items-center text-center bg-white border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 flex items-center justify-center mb-8 border border-slate-100">
                <Box className="text-slate-300" size={32} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight mb-3">
                Henüz Bir Siparişiniz Yok
              </h3>
              <p className="text-slate-400 font-medium mb-10 max-w-sm text-sm">
                İş güvenliği ve endüstriyel ekipman ihtiyaçlarınız için
                koleksiyonlarımızı inceleyin.
              </p>
              <Button
                asChild
                className="bg-slate-950 hover:bg-orange-600 text-white px-10 py-7 text-xs font-black tracking-widest uppercase transition-all shadow-xl"
              >
                <Link href="/products">EKİPMANLARI İNCELE</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => {
                const shippingAddress = order.addresses.find(
                  (a) => a.type === "shipping",
                );
                const billingAddress = order.addresses.find(
                  (a) => a.type === "billing",
                );
                const { subtotal, tax } = calculateOrderSummary(order);
                const statusCfg =
                  STATUS_CONFIG[order.status] ?? STATUS_CONFIG["pending"];
                const isExpanded = expandedOrders.has(order.id);
                const canCancel = ["pending", "paid"].includes(order.status);

                return (
                  <div key={order.id} className="group">
                    {/* ---- Üst meta satırı ---- */}
                    <div className="flex flex-wrap items-center justify-between mb-3 px-1 gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Sipariş No */}
                        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 border border-slate-200">
                          <Hash size={11} className="text-slate-400" />
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {order.id}
                          </span>
                        </div>
                        {/* Durum badge */}
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border ${statusCfg.color} ${statusCfg.bg} ${statusCfg.border}`}
                        >
                          {statusCfg.icon}
                          {statusCfg.label}
                        </div>
                        {/* Ürün sayısı */}
                        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 border border-slate-100">
                          <Tag size={11} className="text-slate-300" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {order.items.length} ÜRÜN
                          </span>
                        </div>
                      </div>
                      {/* Tarih */}
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-1.5">
                        <Calendar size={12} className="text-orange-400" />
                        {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    {/* ---- Ana kart ---- */}
                    <div className="bg-white border border-slate-200 shadow-sm group-hover:shadow-lg group-hover:border-slate-300 transition-all duration-300 overflow-hidden">
                      {/* Kargo takip çubuğu */}
                      <div className="px-6 pt-6 pb-2 border-b border-slate-50">
                        <TrackingTimeline status={order.status} />
                      </div>

                      {/* Kart içi grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-12">
                        {/* ---- Ürünler sütunu ---- */}
                        <div className="lg:col-span-7 p-6 lg:border-r border-slate-100">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                              <Package size={12} className="text-orange-500" />
                              Sipariş İçeriği
                            </p>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                              {order.items.reduce((s, i) => s + i.quantity, 0)}{" "}
                              ADET
                            </span>
                          </div>

                          {/* İlk 2 ürün her zaman görünür */}
                          <div>
                            {order.items
                              .slice(0, isExpanded ? order.items.length : 2)
                              .map((item) => (
                                <OrderItemRow
                                  key={item.id}
                                  item={item}
                                  currency={order.currency}
                                />
                              ))}
                          </div>

                          {/* Daha fazla / daha az */}
                          {order.items.length > 2 && (
                            <button
                              onClick={() => toggleExpand(order.id)}
                              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-all"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp size={13} />
                                  Gizle
                                </>
                              ) : (
                                <>
                                  <ChevronDown size={13} />
                                  {order.items.length - 2} Ürün Daha Göster
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {/* ---- Özet sütunu ---- */}
                        <div className="lg:col-span-5 bg-slate-50/40 p-6 flex flex-col gap-6">
                          {/* Teslimat adresi özeti */}
                          {shippingAddress && (
                            <div className="space-y-2">
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                <MapPin size={11} className="text-orange-500" />
                                Teslimat Adresi
                              </p>
                              <div className="bg-white border border-slate-100 px-4 py-3 text-[11px] space-y-0.5">
                                <p className="font-black text-slate-900 uppercase text-[12px]">
                                  {shippingAddress.firstName}{" "}
                                  {shippingAddress.lastName}
                                </p>
                                <p className="text-slate-500 font-medium leading-relaxed line-clamp-2">
                                  {shippingAddress.address}
                                </p>
                                <p className="text-orange-600 font-black text-[11px]">
                                  {shippingAddress.district} /{" "}
                                  {shippingAddress.city}
                                </p>
                                <p className="text-slate-400 flex items-center gap-1 pt-1">
                                  <Phone size={10} />
                                  {shippingAddress.phone}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Ödeme özeti */}
                          <div className="space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                              <CreditCard
                                size={11}
                                className="text-orange-500"
                              />
                              Ödeme Bilgisi
                            </p>
                            <div className="bg-white border border-slate-100 px-4 py-3">
                              {order.couponCode && (
                                <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-green-600 bg-green-50 border border-green-100 px-2 py-1">
                                  <Percent size={10} />
                                  Kupon: {order.couponCode}
                                  {order.discountAmount &&
                                    order.discountAmount > 0 && (
                                      <span className="ml-auto text-green-700">
                                        -
                                        {order.discountAmount.toLocaleString(
                                          "tr-TR",
                                        )}{" "}
                                        {getCurrencySymbol(order.currency)}
                                      </span>
                                    )}
                                </div>
                              )}
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-black text-slate-950 tracking-tighter">
                                  {formatPrice(order.paidPrice)}
                                </span>
                                <span className="text-base font-black text-orange-500">
                                  {getCurrencySymbol(order.currency)}
                                </span>
                              </div>
                              {order.installment && order.installment > 1 && (
                                <p className="text-[10px] text-slate-400 font-bold mt-1">
                                  {order.installment}× taksit
                                </p>
                              )}
                              {order.paymentMethod && (
                                <p className="text-[10px] text-slate-400 font-medium mt-0.5 capitalize">
                                  {order.paymentMethod}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Aksiyon butonları */}
                          <div className="flex flex-col gap-2 mt-auto pt-2">
                            {/* Detay Modal Butonu */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  onClick={() => setSelectedOrder(order)}
                                  className="w-full border-slate-200 text-[10px] font-black tracking-widest uppercase h-11 bg-white hover:bg-slate-900 hover:text-white transition-all shadow-sm gap-2"
                                >
                                  <Eye size={13} />
                                  Tam Detayı Gör
                                </Button>
                              </DialogTrigger>

                              {/* ===== Detay Dialog ===== */}
                              <DialogContent className="max-w-3xl border-none p-0 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
                                <VisuallyHidden.Root>
                                  <DialogTitle>Sipariş Detayı</DialogTitle>
                                  <DialogDescription>
                                    Sipariş ürünleri, adres ve ödeme bilgileri
                                  </DialogDescription>
                                </VisuallyHidden.Root>
                                {selectedOrder && (
                                  <>
                                    {/* Modal header */}
                                    <div className="bg-slate-950 px-8 py-6 flex items-center justify-between gap-4">
                                      <div>
                                        <h2 className="text-xl font-black uppercase tracking-tight text-white">
                                          Sipariş{" "}
                                          <span className="text-orange-500">
                                            #{selectedOrder.id}
                                          </span>
                                        </h2>
                                        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-1">
                                          {new Date(
                                            selectedOrder.createdAt,
                                          ).toLocaleDateString("tr-TR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                          })}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-3 ml-auto">
                                        <div
                                          className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest border ${
                                            STATUS_CONFIG[selectedOrder.status]
                                              ?.color
                                          } ${STATUS_CONFIG[selectedOrder.status]?.bg} ${
                                            STATUS_CONFIG[selectedOrder.status]
                                              ?.border
                                          }`}
                                        >
                                          {
                                            STATUS_CONFIG[selectedOrder.status]
                                              ?.icon
                                          }
                                          {
                                            STATUS_CONFIG[selectedOrder.status]
                                              ?.label
                                          }
                                        </div>
                                        <DialogClose className="flex items-center justify-center w-9 h-9 bg-white/10 hover:bg-white/20 text-white transition-colors flex-shrink-0">
                                          <XCircle size={18} />
                                        </DialogClose>
                                      </div>
                                    </div>

                                    {/* Kargo takip */}
                                    <div className="px-8 py-4 border-b border-slate-100 bg-slate-50">
                                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                                        <Truck
                                          size={11}
                                          className="text-orange-500"
                                        />
                                        Kargo Durumu
                                      </p>
                                      <TrackingTimeline
                                        status={selectedOrder.status}
                                      />
                                    </div>

                                    <div className="p-8 space-y-8">
                                      {/* Ürün listesi */}
                                      <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1.5">
                                          <Package
                                            size={12}
                                            className="text-orange-500"
                                          />
                                          Sipariş Edilen Ürünler (
                                          {selectedOrder.items.length})
                                        </p>
                                        <div className="border border-slate-100 divide-y divide-slate-50">
                                          {selectedOrder.items.map((item) => (
                                            <div
                                              key={item.id}
                                              className="flex gap-4 p-4 items-start hover:bg-slate-50/50 transition-colors"
                                            >
                                              <div className="w-16 h-20 bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 relative">
                                                <img
                                                  src={
                                                    item.customImage ||
                                                    item.product.mainImage
                                                  }
                                                  alt={item.product.title}
                                                  className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-0.5 left-0.5 bg-slate-900/80 text-white text-[8px] font-black px-1 py-0.5">
                                                  ×{item.quantity}
                                                </div>
                                              </div>
                                              <div className="flex-1 space-y-1.5">
                                                <p className="text-[11px] font-black uppercase tracking-tight text-slate-900 leading-snug">
                                                  {item.product.title}
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                  {item.size && (
                                                    <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 text-[9px] font-black uppercase text-slate-600 flex items-center gap-1">
                                                      <Ruler size={9} />
                                                      {item.size.value}
                                                    </span>
                                                  )}
                                                  <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 text-[9px] font-black uppercase text-slate-600">
                                                    {item.quantity} adet
                                                  </span>
                                                  {item.customImage && (
                                                    <span className="bg-orange-50 border border-orange-200 px-2 py-0.5 text-[9px] font-black uppercase text-orange-600">
                                                      Özel Görsel
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                              <div className="text-right flex-shrink-0 space-y-1">
                                                <p className="text-[10px] text-slate-400 font-medium">
                                                  {item.unitPrice?.toLocaleString(
                                                    "tr-TR",
                                                  )}{" "}
                                                  {getCurrencySymbol(order.currency)} × {item.quantity}
                                                </p>
                                                <p className="text-[13px] font-black text-orange-600">
                                                  {(
                                                    item.unitPrice! *
                                                    item.quantity
                                                  ).toLocaleString(
                                                    "tr-TR",
                                                  )}{" "}
                                                  {getCurrencySymbol(order.currency)}
                                                </p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Adres + Ödeme grid */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {shippingAddress && (
                                          <AddressCard
                                            address={shippingAddress}
                                            label="Teslimat Adresi"
                                            icon={<Truck size={14} />}
                                          />
                                        )}
                                        {billingAddress && (
                                          <AddressCard
                                            address={billingAddress}
                                            label="Fatura Adresi"
                                            icon={<Building2 size={14} />}
                                          />
                                        )}
                                      </div>

                                      {/* Ödeme özeti */}
                                      <PaymentSummaryTable
                                        order={selectedOrder}
                                        subtotal={
                                          calculateOrderSummary(selectedOrder)
                                            .subtotal
                                        }
                                        tax={
                                          calculateOrderSummary(selectedOrder)
                                            .tax
                                        }
                                      />
                                    </div>
                                  </>
                                )}
                              </DialogContent>
                            </Dialog>

                            {/* İptal Butonu */}
                            {canCancel && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="w-full text-slate-400 hover:text-red-500 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest h-10 transition-all gap-2"
                                  >
                                    <RotateCcw size={12} />
                                    Siparişi İptal Et
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="border-none p-0 overflow-hidden shadow-2xl max-w-md [&>button]:hidden">
                                  <VisuallyHidden.Root>
                                    <DialogTitle>
                                      Sipariş İptal Onayı
                                    </DialogTitle>
                                    <DialogDescription>
                                      Sipariş iptal etme onayı
                                    </DialogDescription>
                                  </VisuallyHidden.Root>
                                  <div className="bg-red-600 px-8 py-6 flex items-center gap-4">
                                    <div className="bg-white/20 p-3">
                                      <AlertCircle
                                        className="text-white"
                                        size={24}
                                      />
                                    </div>
                                    <div>
                                      <h2 className="text-white font-black uppercase tracking-tight text-xl">
                                        İptal Onayı
                                      </h2>
                                      <p className="text-red-100 text-[10px] uppercase tracking-widest font-bold mt-0.5">
                                        Geri alınamaz işlem
                                      </p>
                                    </div>
                                  </div>
                                  <div className="p-8 space-y-6">
                                    <div className="bg-red-50 border border-red-100 p-4 space-y-1">
                                      <p className="text-[11px] font-black uppercase tracking-widest text-red-600 flex items-center gap-1.5">
                                        <Hash size={11} />
                                        Sipariş #{order.id}
                                      </p>
                                      <p className="text-sm text-red-700 font-medium">
                                        Bu siparişi iptal etmek istediğinizden
                                        emin misiniz? İşlem geri alınamaz ve
                                        üretim planlamasından çıkarılacaktır.
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <DialogClose asChild>
                                        <Button
                                          variant="outline"
                                          className="h-12 font-black tracking-widest uppercase text-[10px] border-slate-200"
                                        >
                                          VAZGEÇ
                                        </Button>
                                      </DialogClose>
                                      <Button
                                        onClick={() =>
                                          handleCancelOrder(order.id)
                                        }
                                        className="bg-red-600 hover:bg-red-700 text-white h-12 font-black tracking-widest uppercase text-[10px] gap-2"
                                      >
                                        <XCircle size={13} />
                                        İPTAL ET
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
