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
  MapPin,
  Phone,
  User,
  Calendar,
  ArrowRight,
  CreditCard,
  Hash,
  Ticket,
  Download,
  ExternalLink,
} from "lucide-react";
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
  getCurrencySymbol: (currency?: string) => string;
}

export default function OrderDetailDialog({
  order,
  setSelectedOrder,
  onUpdateStatus,
  getStatusInTurkish,
  getStatusBadge,
  getNextStatus,
  getCurrencySymbol,
}: Props) {
  if (!order) return null;

  const nextStatus = getNextStatus(order.status);
  const shippingAddress = order.addresses.find((a) => a.type === "shipping");
  const billingAddress = order.addresses.find((a) => a.type === "billing");
  const currencySymbol = getCurrencySymbol(order.currency);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodLabel = (method?: string) => {
    const labels: Record<string, string> = {
      iyzipay: "İyzico Kredi Kartı",
      credit_card: "Kredi Kartı",
      bank_transfer: "Havale/EFT",
    };
    return labels[method || "iyzipay"] || "Kredi Kartı";
  };

  // Görsel indirme fonksiyonu
  const handleDownloadImage = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Görsel indirme hatası:", error);
      // Fallback: Yeni sekmede aç
      window.open(imageUrl, "_blank");
    }
  };

  // Görseli yeni sekmede açma fonksiyonu
  const handleOpenImage = (imageUrl: string) => {
    window.open(imageUrl, "_blank");
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
            {/* Payment Method & Installment */}
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-3 pb-2 border-b border-slate-200">
              <CreditCard className="w-4 h-4" />
              <span>{getPaymentMethodLabel(order.paymentMethod)}</span>
              {order.installment && order.installment > 1 && (
                <span className="ml-auto bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                  {order.installment} Taksit
                </span>
              )}
            </div>

            {/* Transaction ID */}
            {order.transactionId && (
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <Hash className="w-3 h-3" />
                <span>İşlem No: {order.transactionId}</span>
              </div>
            )}

            {/* Prices */}
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Toplam:</span>
              <span className="font-semibold">
                {order.totalPrice.toLocaleString("tr-TR")} {currencySymbol}
              </span>
            </div>

            {/* Coupon Discount */}
            {order.couponCode && order.discountAmount && (
              <div className="flex items-center justify-between text-sm bg-green-50 -mx-4 -mt-1 px-4 py-2 border-y border-green-100">
                <span className="flex items-center gap-1 text-green-700">
                  <Ticket className="w-3 h-3" />
                  İndirim ({order.couponCode}):
                </span>
                <span className="font-semibold text-green-700">
                  -{order.discountAmount.toFixed(2)} {currencySymbol}
                </span>
              </div>
            )}

            {/* Installment Details */}
            {order.installment && order.installment > 1 && (
              <div className="flex justify-between text-sm text-blue-600">
                <span>Aylık Ödeme:</span>
                <span className="font-semibold">
                  {(order.paidPrice / order.installment).toLocaleString(
                    "tr-TR",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}{" "}
                  {currencySymbol}
                </span>
              </div>
            )}

            {/* Final Paid Price */}
            <div className="flex justify-between text-base font-bold border-t border-slate-200 pt-2">
              <span>Ödenen:</span>
              <span>
                {order.paidPrice.toLocaleString("tr-TR")} {currencySymbol}
              </span>
            </div>
          </div>

          {/* Update Status Button */}
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
            {order.items.map((item, idx) => {
              const imageUrl = item.customImage || item.product.mainImage;
              const fileName = `siparis-${order.id}-urun-${item.productId}${item.customImage ? "-ozel-tasarim" : ""}.jpg`;

              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-200 group"
                >
                  {/* Image with hover actions */}
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded cursor-pointer transition-opacity group-hover:opacity-90"
                      onClick={() => handleOpenImage(imageUrl)}
                      title="Görseli büyüt"
                    />
                    {/* Download and Open buttons on hover */}
                    <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadImage(imageUrl, fileName);
                        }}
                        className="p-1.5 bg-white rounded-full hover:bg-slate-100 transition-colors"
                        title="Görseli indir"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenImage(imageUrl);
                        }}
                        className="p-1.5 bg-white rounded-full hover:bg-slate-100 transition-colors"
                        title="Yeni sekmede aç"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-700" />
                      </button>
                    </div>
                  </div>

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
                          Beden: {item.size.value}
                        </span>
                      )}
                      {item.customImage && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                          🎨 Özel Tasarım
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      {item.totalPrice.toLocaleString("tr-TR")} {currencySymbol}
                    </p>
                    <p className="text-xs text-slate-500">
                      Birim: {item.unitPrice.toLocaleString("tr-TR")}{" "}
                      {currencySymbol}
                    </p>
                  </div>
                </div>
              );
            })}
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
                {shippingAddress.zip && (
                  <p className="text-xs text-slate-500">
                    Posta Kodu: {shippingAddress.zip}
                  </p>
                )}
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
                {billingAddress.billingType && (
                  <p className="text-xs font-semibold text-orange-600">
                    {billingAddress.billingType === "kurumsal"
                      ? "Kurumsal Fatura"
                      : "Bireysel Fatura"}
                  </p>
                )}
                {billingAddress.tcno && (
                  <p className="text-xs">
                    {billingAddress.billingType === "kurumsal"
                      ? "Vergi No"
                      : "TC"}
                    : {billingAddress.tcno}
                  </p>
                )}
                <p className="text-xs">{billingAddress.address}</p>
                <p className="text-xs font-semibold">
                  {billingAddress.district} / {billingAddress.city}
                </p>
                {billingAddress.zip && (
                  <p className="text-xs text-slate-500">
                    Posta Kodu: {billingAddress.zip}
                  </p>
                )}
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
