"use client";

import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Package,
  Truck,
  ArrowRight,
  Calendar,
  CreditCard,
  Hash,
  MapPin,
  Phone,
  User,
  Tag,
  Receipt,
} from "lucide-react";
import { FormattedOrder } from "@/types/order";

interface Props {
  order: FormattedOrder | null;
  setSelectedOrder: React.Dispatch<React.SetStateAction<FormattedOrder | null>>;
  onUpdateStatus: (
    orderId: number,
    currentStatus: FormattedOrder["status"]
  ) => void;
  getStatusInTurkish: (status: string) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  getNextStatus: (
    currentStatus: FormattedOrder["status"]
  ) => FormattedOrder["status"] | null;
}

export default function OrderDetailDialog({
  order,
  setSelectedOrder,
  onUpdateStatus,
  getStatusInTurkish,
  getStatusBadge,
  getNextStatus,
}: Props) {
  if (!order) return null;

  const nextStatus = getNextStatus(order.status);
  const shippingAddress = order.addresses.find((a) => a.type === "shipping");
  const billingAddress = order.addresses.find((a) => a.type === "billing");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTotalQuantity = () => {
    return order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  return (
    <DialogContent className="bg-white text-gray-900 max-w-[95vw] sm:max-w-[600px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
      {/* Header */}
      <DialogHeader className="p-6 pb-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-start justify-between">
          <div>
            <DialogTitle className="text-2xl font-semibold text-gray-800 mb-1">
              Sipariş #{order.id}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm flex items-center gap-2">
              <User className="w-4 h-4" />
              {order.user.name} {order.user.surname} · {order.user.email}
            </DialogDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(order.status)}
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(order.createdAt)}
            </span>
          </div>
        </div>
      </DialogHeader>

      <div className="p-6 space-y-6">
        {/* Ödeme ve Kupon Bilgileri */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50  p-5 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <Wallet className="w-5 h-5 text-indigo-600" /> Ödeme Özeti
            </h3>
            {order.paymentMethod && (
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                {order.paymentMethod}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sol Kolon: Fiyatlandırma Detayı */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Brüt Toplam:</span>
                <span className="font-medium">
                  {order.totalPrice.toLocaleString("tr-TR")} ₺
                </span>
              </div>

              {/* Kupon Satırı */}
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <Tag className="w-4 h-4" />
                  <span>
                    İndirim{" "}
                    {order.couponCode ? `(${order.couponCode})` : "Uygulanmadı"}
                    :
                  </span>
                </div>
                <span className="text-green-600 font-bold">
                  -{order.discountAmount?.toLocaleString("tr-TR") || "0,00"} ₺
                </span>
              </div>

              <div className="pt-2 border-t border-blue-200 flex justify-between items-center">
                <span className="text-base font-semibold text-gray-800">
                  Net Ödenen Tutar:
                </span>
                <span className="text-2xl font-black text-indigo-700">
                  {order.paidPrice.toLocaleString("tr-TR")} ₺
                </span>
              </div>
            </div>

            {/* Sağ Kolon: Teknik Detaylar */}
            <div className="bg-white/50  p-3 space-y-3 text-xs border border-blue-100/50">
              <div>
                <span className="text-gray-500 block mb-0.5">
                  İşlem (Transaction) ID:
                </span>
                <span className="font-mono font-medium text-gray-700 break-all">
                  {order.transactionId || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Taksit:</span>
                <span className="font-bold text-gray-700">
                  {order.installment && order.installment > 1
                    ? `${order.installment} Taksit`
                    : "Tek Çekim"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Para Birimi:</span>
                <span className="font-bold text-gray-700">
                  {order.currency}
                </span>
              </div>
            </div>
          </div>

          {nextStatus && order.status !== "cancelled" && (
            <div className="flex justify-end mt-6">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-lg transition-all active:scale-95"
                onClick={() => onUpdateStatus(order.id, order.status)}
              >
                <ArrowRight className="w-4 h-4" />
                Siparişi {getStatusInTurkish(nextStatus)} Aşamasına Taşı
              </Button>
            </div>
          )}
        </div>

        {/* Sipariş Ürünleri */}
        <div className="bg-gray-50  p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <Package className="w-5 h-5 text-gray-600" /> Sipariş İçeriği
            </h3>
            <div className="text-xs font-medium text-gray-500 bg-white px-3 py-1  border border-gray-200 shadow-sm">
              {getTotalQuantity()} Parça Ürün
            </div>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 bg-white border border-gray-100  hover:border-indigo-200 transition-colors"
              >
                <img
                  src={item.product.mainImage}
                  alt={item.product.title}
                  className="w-16 h-16 object-cover border border-gray-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm truncate">
                    {item.product.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">
                      Adet: <b className="text-gray-700">{item.quantity}</b>
                    </span>
                    <span className="text-xs text-gray-500">
                      Birim:{" "}
                      <b className="text-gray-700">
                        {item.unitPrice.toLocaleString("tr-TR")} ₺
                      </b>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-indigo-600">
                    {item.totalPrice.toLocaleString("tr-TR")} ₺
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Adres Bilgileri */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Kargo Adresi */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50  p-5 border border-emerald-100">
            <h3 className="text-md font-bold flex items-center gap-2 text-emerald-800 mb-3">
              <Truck className="w-5 h-5" /> Teslimat Bilgileri
            </h3>
            {shippingAddress ? (
              <div className="space-y-2 text-sm">
                <p className="font-bold text-gray-800">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </p>
                <div className="flex items-start gap-2 text-gray-600 italic">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {shippingAddress.address} <br /> {shippingAddress.district}{" "}
                    / {shippingAddress.city}
                  </span>
                </div>
                <p className="flex items-center gap-2 text-gray-700 font-medium">
                  <Phone className="w-3 h-3" /> {shippingAddress.phone}
                </p>
              </div>
            ) : (
              <p className="text-xs text-red-500">Adres bilgisi bulunamadı.</p>
            )}
          </div>

          {/* Fatura Adresi */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-100  p-5 border border-gray-200">
            <h3 className="text-md font-bold flex items-center gap-2 text-gray-700 mb-3">
              <Receipt className="w-5 h-5" /> Fatura Bilgileri
            </h3>
            {billingAddress ? (
              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-bold text-gray-800">
                  {billingAddress.firstName} {billingAddress.lastName}
                </p>
                <p>TC: {billingAddress.tcno || "Belirtilmemiş"}</p>
                <p className="text-xs">{billingAddress.address}</p>
                <p className="text-xs font-bold">
                  {billingAddress.district} / {billingAddress.city}
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-400">Gönderim adresi ile aynı.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end p-6 bg-gray-50 border-t border-gray-100">
        <Button
          onClick={() => setSelectedOrder(null)}
          className="bg-gray-800 hover:bg-black text-white px-8  transition-colors"
        >
          Kapat
        </Button>
      </div>
    </DialogContent>
  );
}
