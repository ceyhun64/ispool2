"use client";

import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, User, Calendar, ArrowRight } from "lucide-react";
import { FormattedOrder } from "@/types/order";

interface Props {
  order: FormattedOrder | null;
  setSelectedOrder: React.Dispatch<React.SetStateAction<FormattedOrder | null>>;
  onUpdateStatus: (
    orderId: number,
    currentStatus: FormattedOrder["status"],
  ) => void;
  getStatusInTurkish: (status: string) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  getNextStatus: (
    currentStatus: FormattedOrder["status"],
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

  return (
    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-sm">
      <DialogHeader className="border-b border-slate-200 pb-4">
        <div className="flex items-start justify-between mt-2">
          <div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Sipariş #{order.id}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 mt-1">
              <User className="w-3 h-3" />
              {order.user.name} {order.user.surname}
            </DialogDescription>
          </div>
          <div className="flex flex-col items-end gap-2 mt-2">
            {getStatusBadge(order.status)}
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(order.createdAt)}
            </span>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-6 py-4">
        {/* Payment Info */}
        <div className="bg-slate-50 p-4 rounded border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Ödeme Bilgileri
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Toplam:</span>
              <span className="font-semibold">
                {order.totalPrice.toLocaleString("tr-TR")} ₺
              </span>
            </div>
            {order.couponCode && order.discountAmount && (
              <div className="flex justify-between text-sm text-green-600">
                <span>İndirim ({order.couponCode}):</span>
                <span className="font-semibold">
                  -{order.discountAmount.toFixed(2)} ₺
                </span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold border-t border-slate-200 pt-2">
              <span>Ödenen:</span>
              <span>{order.paidPrice.toLocaleString("tr-TR")} ₺</span>
            </div>
          </div>
          {nextStatus && order.status !== "cancelled" && (
            <Button
              className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full"
              onClick={() => onUpdateStatus(order.id, order.status)}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              {getStatusInTurkish(nextStatus)} Yap
            </Button>
          )}
        </div>

        {/* Order Items */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Sipariş Ürünleri
          </h3>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-200"
              >
                <img
                  src={item.product.mainImage}
                  alt={item.product.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 truncate">
                    {item.product.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-600">
                      Adet: {item.quantity}
                    </span>
                    {item.size && (
                      <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                        {item.size.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">
                    {item.totalPrice.toLocaleString("tr-TR")} ₺
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Teslimat Adresi
            </h3>
            {shippingAddress ? (
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-slate-900">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </p>
                <div className="flex items-start gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {shippingAddress.address} <br />
                    {shippingAddress.district} / {shippingAddress.city}
                  </span>
                </div>
                <p className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3 h-3" />
                  {shippingAddress.phone}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Adres bilgisi yok</p>
            )}
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Fatura Adresi
            </h3>
            {billingAddress ? (
              <div className="space-y-2 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">
                  {billingAddress.firstName} {billingAddress.lastName}
                </p>
                <p>TC: {billingAddress.tcno || "Belirtilmemiş"}</p>
                <p className="text-xs">{billingAddress.address}</p>
                <p className="text-xs font-semibold">
                  {billingAddress.district} / {billingAddress.city}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Gönderim adresi ile aynı</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200">
        <Button
          onClick={() => setSelectedOrder(null)}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-full"
        >
          Kapat
        </Button>
      </div>
    </DialogContent>
  );
}
