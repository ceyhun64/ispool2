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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";
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
  UserCog,
} from "lucide-react";

// ==== Tip Tanımları (Aynen Korundu) ====
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
}

interface Product {
  id: number;
  title: string;
  mainImage: string;
  price?: number;
}

interface OrderItem {
  id: string | number;
  product: Product;
  quantity: number;
  totalPrice: number;
  unitPrice?: number;
}

interface Order {
  id: string | number;
  createdAt: string;
  status: string;
  paidPrice: number;
  totalPrice: number;
  currency: string;
  addresses: Address[];
  items: OrderItem[];
}

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

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
    } catch (err) {
      toast.error("Bir hata oluştu.");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-100";
      case "delivered":
        return "text-emerald-700 bg-emerald-50 border-emerald-100";
      case "shipped":
        return "text-blue-600 bg-blue-50 border-blue-100";
      case "paid":
        return "text-orange-600 bg-orange-50 border-orange-100";
      default:
        return "text-slate-500 bg-slate-50 border-slate-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "cancelled":
        return <XCircle size={14} />;
      case "delivered":
        return <CheckCircle2 size={14} />;
      case "shipped":
        return <Truck size={14} />;
      case "paid":
        return <Box size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const getStatusInTurkish = (status: string) => {
    const statuses: Record<string, string> = {
      pending: "Onay Bekliyor",
      paid: "Hazırlanıyor",
      shipped: "Kargoya Verildi",
      delivered: "Teslim Edildi",
      cancelled: "İptal Edildi",
    };
    return statuses[status] || "İşleniyor";
  };

  const calculateOrderSummary = (order: Order) => {
    const subtotal = order.items.reduce(
      (sum, item) => sum + (item.unitPrice || 0) * item.quantity,
      0,
    );
    const tax = order.totalPrice - subtotal;
    return { subtotal, tax };
  };

  if (loading)
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 px-6 py-12 md:px-16 lg:px-24">
          <div className="max-w-5xl mx-auto space-y-10">
            <Skeleton className="h-12 w-64 bg-slate-200" />
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-72 w-full bg-white  border" />
            ))}
          </div>
        </main>
      </div>
    );

  if (!isAuthorized) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-100 text-slate-900">
      <Sidebar />

      <main className="flex-1 px-6 py-12 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          {/* Header Section - Industrial Professional */}
          <header className="mb-14 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-500 p-2">
                <Package className="text-white w-6 h-6" />
              </div>
              <div className="h-[2px] flex-1 bg-slate-200/60" />
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">
              Sipariş <span className="text-orange-600">Bilgileri</span>
            </h1>
            <p className="text-slate-500 text-[11px] uppercase tracking-[0.3em] font-bold mt-2 flex items-center gap-2">
              <ShieldCheck size={14} className="text-green-600" />
              Sipariş geçmişi
            </p>
            {orders.length > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200  shadow-sm">
                <div className="w-2 h-2  bg-orange-500 animate-pulse" />
                <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
                  {orders.length} TOPLAM KAYIT
                </span>
              </div>
            )}
          </header>

          {orders.length === 0 ? (
            <div className="py-32 flex flex-col items-center text-center bg-white border-2 border-dashed border-slate-200 ">
              <div className="w-20 h-20 bg-slate-50 flex items-center justify-center mb-8  border border-slate-100">
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
                className="bg-slate-950 hover:bg-orange-600 text-white  px-10 py-7 text-xs font-black tracking-widest uppercase transition-all shadow-xl shadow-slate-200"
              >
                <Link href="/products">EKİPMANLARI İNCELE</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-10">
              {orders.map((order) => {
                const shippingAddress = order.addresses.find(
                  (a) => a.type === "shipping",
                );
                const billingAddress = order.addresses.find(
                  (a) => a.type === "billing",
                );
                const { subtotal, tax } = calculateOrderSummary(order);

                return (
                  <div key={order.id} className="group relative">
                    {/* Status Badge & Date */}
                    <div className="flex flex-wrap items-center justify-between mb-4 px-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded">
                          REF: #{order.id}
                        </span>
                        <div
                          className={`flex items-center gap-2 px-4 py-1  text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyle(
                            order.status,
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {getStatusInTurkish(order.status)}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2 bg-white border border-slate-100 px-3 py-1 ">
                        <Calendar size={13} className="text-orange-500" />
                        {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Order Container */}
                    <div className="bg-white border border-slate-200  shadow-sm group-hover:shadow-xl group-hover:border-orange-200 transition-all duration-500 overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-12">
                        {/* Items Section */}
                        <div className="lg:col-span-7 p-8 border-b lg:border-b-0 lg:border-r border-slate-100">
                          <div className="space-y-6">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex gap-6 items-center"
                              >
                                <div className="h-24 w-20 overflow-hidden bg-slate-50  flex-shrink-0 border border-slate-100 relative group/img">
                                  <img
                                    src={item.product.mainImage}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover/img:scale-110"
                                    alt={item.product.title}
                                  />
                                  <div className="absolute top-1 left-1 bg-slate-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded">
                                    x{item.quantity}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-2 truncate">
                                    {item.product.title}
                                  </h4>
                                  <div className="flex items-center gap-4">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">
                                      Birim:{" "}
                                      {item.unitPrice?.toLocaleString("tr-TR")}{" "}
                                      ₺
                                    </span>
                                    <span className="text-xs font-black text-orange-600">
                                      {(
                                        item.unitPrice! * item.quantity
                                      ).toLocaleString("tr-TR")}{" "}
                                      ₺
                                    </span>
                                  </div>
                                </div>
                                <ChevronRight
                                  className="text-slate-200 group-hover:text-orange-400 transition-colors"
                                  size={20}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary & Logistics */}
                        <div className="lg:col-span-5 bg-slate-50/50 p-8 flex flex-col justify-between border-t lg:border-t-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                            {shippingAddress && (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <MapPin
                                    size={14}
                                    className="text-orange-600"
                                  />
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    TESLİMAT BÖLGESİ
                                  </p>
                                </div>
                                <p className="text-[12px] text-slate-700 font-bold leading-relaxed">
                                  {shippingAddress.firstName}{" "}
                                  {shippingAddress.lastName}
                                  <br />
                                  <span className="text-slate-500 font-medium">
                                    {shippingAddress.city} /{" "}
                                    {shippingAddress.district}
                                  </span>
                                </p>
                              </div>
                            )}

                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <CreditCard
                                  size={14}
                                  className="text-orange-600"
                                />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  ÖDEME TOPLAMI
                                </p>
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-slate-950 tracking-tighter">
                                  {order.paidPrice.toLocaleString("tr-TR")}
                                </span>
                                <span className="text-sm font-black text-orange-600">
                                  ₺
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-10 flex flex-col gap-3">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  onClick={() => setSelectedOrder(order)}
                                  className="w-full border-slate-200 text-[10px] font-black tracking-widest uppercase h-14 bg-white hover:bg-slate-900 hover:text-white transition-all  shadow-sm"
                                >
                                  SİPARİŞ DETAYLARINI GÖR
                                </Button>
                              </DialogTrigger>
                              {/* Dialog İçeriği de Modernize Edildi */}
                              <DialogContent className="max-w-2xl border-none p-0  overflow-hidden shadow-2xl">
                                <div className="p-10">
                                  <DialogHeader className="mb-10 flex flex-row items-center justify-between border-b pb-6">
                                    <div className="space-y-1">
                                      <DialogTitle className="text-2xl font-black uppercase tracking-tight">
                                        Sipariş{" "}
                                        <span className="text-orange-600">
                                          Analizi
                                        </span>
                                      </DialogTitle>
                                      <DialogDescription className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">
                                        Referans: #{selectedOrder?.id}
                                      </DialogDescription>
                                    </div>
                                    <div className="bg-orange-500 p-3  rotate-3">
                                      <Box className="text-white" size={24} />
                                    </div>
                                  </DialogHeader>

                                  {selectedOrder && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                      <div className="bg-slate-50 p-6  border border-slate-100 space-y-4">
                                        <div className="flex items-center gap-2 text-slate-900 border-b border-slate-200 pb-3">
                                          <User
                                            size={16}
                                            className="text-orange-600"
                                          />
                                          <span className="text-[10px] font-black uppercase tracking-widest">
                                            Fatura Bilgileri
                                          </span>
                                        </div>
                                        {billingAddress && (
                                          <div className="text-[12px] space-y-2 text-slate-600 font-medium">
                                            <p className="font-black text-slate-900 text-sm uppercase">
                                              {billingAddress.firstName}{" "}
                                              {billingAddress.lastName}
                                            </p>
                                            <p className="leading-relaxed">
                                              {billingAddress.address}
                                            </p>
                                            <p className="text-orange-600 font-bold">
                                              {billingAddress.district} /{" "}
                                              {billingAddress.city}
                                            </p>
                                            <p className="flex items-center gap-2 pt-2 text-slate-900 font-black">
                                              <Phone size={14} />{" "}
                                              {billingAddress.phone}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                      <div className="p-2 space-y-6">
                                        <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
                                          <AlertCircle
                                            size={16}
                                            className="text-orange-600"
                                          />
                                          <span className="text-[10px] font-black uppercase tracking-widest">
                                            Ödeme Özeti
                                          </span>
                                        </div>
                                        <div className="space-y-4">
                                          <div className="flex justify-between text-xs font-bold">
                                            <span className="text-slate-400 uppercase tracking-widest">
                                              Ara Toplam
                                            </span>
                                            <span className="text-slate-900">
                                              {subtotal.toLocaleString("tr-TR")}{" "}
                                              ₺
                                            </span>
                                          </div>
                                          <div className="flex justify-between text-xs font-bold">
                                            <span className="text-slate-400 uppercase tracking-widest">
                                              Vergi/KDV
                                            </span>
                                            <span className="text-slate-900">
                                              {tax.toLocaleString("tr-TR")} ₺
                                            </span>
                                          </div>
                                          <div className="flex justify-between font-black text-slate-950 pt-4 border-t-2 border-slate-100 text-lg">
                                            <span className="uppercase tracking-tighter">
                                              Genel Toplam
                                            </span>
                                            <span className="text-orange-600 underline decoration-2 underline-offset-4">
                                              {order.paidPrice.toLocaleString(
                                                "tr-TR",
                                              )}{" "}
                                              ₺
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>

                            {["pending", "paid"].includes(order.status) && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="w-full text-slate-400 hover:text-red-500 hover:bg-red-50 text-[10px] font-black uppercase tracking-[0.2em] h-12 transition-all "
                                  >
                                    Siparişi İptal Et
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className=" border-none p-10">
                                  <DialogHeader className="items-center text-center space-y-4">
                                    <div className="bg-red-50 p-4 ">
                                      <AlertCircle
                                        className="text-red-500"
                                        size={32}
                                      />
                                    </div>
                                    <DialogTitle className="text-xl font-black uppercase tracking-tight">
                                      İptal İşlemi Onayı
                                    </DialogTitle>
                                    <DialogDescription className="text-sm font-medium text-slate-500">
                                      #{order.id} nolu tedarik kaydını iptal
                                      etmek üzeresiniz. Bu işlem üretim
                                      planlamasından çıkarılacaktır.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter className="mt-10 grid grid-cols-2 gap-4">
                                    <DialogClose asChild>
                                      <Button
                                        variant="outline"
                                        className=" h-14 font-black tracking-widest uppercase text-[10px]"
                                      >
                                        VAZGEÇ
                                      </Button>
                                    </DialogClose>
                                    <Button
                                      onClick={() =>
                                        handleCancelOrder(order.id)
                                      }
                                      className="bg-red-600 hover:bg-red-700 text-white  h-14 font-black tracking-widest uppercase text-[10px]"
                                    >
                                      EVET, İPTAL ET
                                    </Button>
                                  </DialogFooter>
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
