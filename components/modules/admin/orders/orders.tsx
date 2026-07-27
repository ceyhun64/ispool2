"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DefaultPagination from "@/components/layout/pagination";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import OrderDetailDialog from "./orderDetailDialog";
import { Dialog } from "@/components/ui/dialog";
import { FormattedOrder } from "@/types/order";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { formatPrice } from "@/lib/pricing";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";

export default function Orders() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<FormattedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<FormattedOrder | null>(
    null,
  );
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState<{
    id: number;
    currentStatus: FormattedOrder["status"];
  } | null>(null);

  const itemsPerPage = 15;
  const statusOrder: FormattedOrder["status"][] = [
    "pending",
    "paid",
    "shipped",
    "delivered",
  ];

  const getCurrencySymbol = (currency?: string) => {
    const symbols: Record<string, string> = {
      TRY: "₺",
      USD: "$",
      EUR: "€",
    };
    return symbols[currency || "TRY"] || "₺";
  };

  const getStatusInTurkish = (status: string) => {
    const map: Record<string, string> = {
      pending: "Beklemede",
      paid: "Ödendi",
      shipped: "Kargoda",
      delivered: "Teslim Edildi",
      cancelled: "İptal",
    };
    return map[status] || "Bilinmiyor";
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      paid: "bg-blue-50 text-blue-700 border-blue-200",
      shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
      delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-slate-50 text-slate-600 border-slate-200",
    };

    return (
      <Badge
        variant="outline"
        className={`${styles[status]} text-xs font-semibold border`}
      >
        {getStatusInTurkish(status)}
      </Badge>
    );
  };

  const getNextStatus = (currentStatus: FormattedOrder["status"]) => {
    const index = statusOrder.indexOf(currentStatus);
    return index >= 0 && index < statusOrder.length - 1
      ? statusOrder[index + 1]
      : null;
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/order");
      const data = await res.json();
      if (data.status === "success") {
        setOrders(data.orders);
      }
    } catch (error) {
      toast.error("Siparişler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Dashboard'daki "Detay" linki ?orderId= ile buraya yönlendiriyor — sipariş
  // listesi yüklendiğinde ilgili siparişi otomatik açıp query'yi temizler.
  useEffect(() => {
    const orderIdParam = searchParams.get("orderId");
    if (!orderIdParam || orders.length === 0) return;
    const found = orders.find((o) => o.id === Number(orderIdParam));
    if (found) {
      setSelectedOrder(found);
      router.replace("/admin/orders");
    }
  }, [orders, searchParams, router]);

  const triggerStatusUpdate = (
    orderId: number,
    currentStatus: FormattedOrder["status"],
  ) => {
    setOrderToUpdate({ id: orderId, currentStatus });
    setIsUpdateDialogOpen(true);
  };

  const confirmUpdateStatus = async () => {
    if (!orderToUpdate || isUpdatingStatus) return;
    const nextStatus = getNextStatus(orderToUpdate.currentStatus);
    if (!nextStatus) return;

    const updatedOrderId = orderToUpdate.id;
    setIsUpdatingStatus(true);
    try {
      const res = await fetch("/api/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: updatedOrderId,
          status: nextStatus,
        }),
      });

      const data = await res.json();
      if (data.status !== "success")
        throw new Error(data.message || "Hata oluştu");

      toast.success("Sipariş durumu güncellendi.");
      await fetchOrders();
      // Detay dialogu bu sipariş için açıksa, yeniden fetch edilen listeden
      // stale kalmaması için durumunu burada da güncelle.
      setSelectedOrder((prev) =>
        prev && prev.id === updatedOrderId
          ? { ...prev, status: nextStatus }
          : prev,
      );
    } catch (error) {
      toast.error("Güncelleme başarısız.");
    } finally {
      setIsUpdatingStatus(false);
      setIsUpdateDialogOpen(false);
      setOrderToUpdate(null);
    }
  };

  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          `${o.user.name} ${o.user.surname}`
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          o.user.email.toLowerCase().includes(search.toLowerCase()) ||
          String(o.id).includes(search),
      ),
    [orders, search],
  );

  const paginatedOrders = useMemo(
    () =>
      filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      ),
    [filteredOrders, currentPage],
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className={`flex-1 bg-slate-50 min-h-screen p-6 sm:p-8 ${isMobile ? "mt-14" : ""}`}
    >
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Sipariş Yönetimi
        </h1>
        <p className="text-sm text-slate-600">
          Siparişleri takip edin ve yönetin
        </p>
      </header>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Müşteri, email veya sipariş no..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10 bg-white border-slate-200 rounded-xl"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-sm overflow-hidden border border-slate-200">
        <table className="w-full bg-white border-separate border-spacing-0">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 border-b border-slate-200">
                Sipariş No
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 border-b border-slate-200">
                Müşteri
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 border-b border-slate-200">
                Tutar
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 border-b border-slate-200">
                Durum
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 border-b border-slate-200">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedOrders.map((order) => {
              const nextStatus = getNextStatus(order.status);
              const currencySymbol = getCurrencySymbol(order.currency);
              return (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-900">
                      #{order.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {order.user.name} {order.user.surname}
                      </p>
                      <p className="text-xs text-slate-500">
                        {order.user.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatPrice(order.paidPrice)} {currencySymbol}
                    </p>
                    {order.installment && order.installment > 1 && (
                      <p className="text-xs text-blue-600">
                        💳 {order.installment} Taksit
                      </p>
                    )}
                    {order.couponCode && (
                      <p className="text-xs text-green-600">
                        🎟️ {order.couponCode}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Detay
                      </Button>
                      {nextStatus && order.status !== "cancelled" && (
                        <Button
                          size="sm"
                          className="bg-slate-900 hover:bg-slate-800 text-white rounded-full"
                          onClick={() =>
                            triggerStatusUpdate(order.id, order.status)
                          }
                        >
                          {getStatusInTurkish(nextStatus)} Yap
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {paginatedOrders.map((order) => {
          const nextStatus = getNextStatus(order.status);
          const currencySymbol = getCurrencySymbol(order.currency);
          return (
            <Card key={order.id} className="bg-white border-slate-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      #{order.id}
                    </p>
                    <p className="text-xs text-slate-600">
                      {order.user.name} {order.user.surname}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {formatPrice(order.paidPrice)} {currencySymbol}
                    </p>
                    {order.installment && order.installment > 1 && (
                      <p className="text-xs text-blue-600">
                        💳 {order.installment} Taksit
                      </p>
                    )}
                    {order.couponCode && (
                      <p className="text-xs text-green-600">
                        🎟️ {order.couponCode}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Detay
                    </Button>
                    {nextStatus && order.status !== "cancelled" && (
                      <Button
                        size="sm"
                        className="bg-slate-900 text-white text-xs"
                        onClick={() =>
                          triggerStatusUpdate(order.id, order.status)
                        }
                      >
                        Güncelle
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {filteredOrders.length > itemsPerPage && (
        <div className="mt-6">
          <DefaultPagination
            totalItems={filteredOrders.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        {selectedOrder && (
          <OrderDetailDialog
            order={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            onUpdateStatus={triggerStatusUpdate}
            getStatusInTurkish={getStatusInTurkish}
            getStatusBadge={getStatusBadge}
            getNextStatus={getNextStatus}
            getCurrencySymbol={getCurrencySymbol}
          />
        )}
      </Dialog>

      {/* Update Confirmation */}
      <AlertDialog
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Durumu Güncelle</AlertDialogTitle>
            <AlertDialogDescription>
              Bu siparişin durumunu bir sonraki aşamaya taşımak istediğinize
              emin misiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdatingStatus}>
              İptal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmUpdateStatus();
              }}
              disabled={isUpdatingStatus}
              className="bg-slate-900 hover:bg-slate-800"
            >
              {isUpdatingStatus ? <Spinner className="w-4 h-4" /> : "Evet, Güncelle"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
