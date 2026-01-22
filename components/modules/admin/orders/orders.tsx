"use client";

import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/modules/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DefaultPagination from "@/components/layout/pagination";
import {
  Loader,
  Truck,
  CheckCircle,
  XCircle,
  Package,
  Search,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import OrderDetailDialog from "./orderDetailDialog";
import { Dialog } from "@/components/ui/dialog";
import { FormattedOrder } from "@/types/order";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner"; // Sonner import edildi
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

export default function Orders() {
  const isMobile = useIsMobile();
  const [orders, setOrders] = useState<FormattedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<FormattedOrder | null>(
    null
  );

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
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

  const getStatusInTurkish = (status: string) => {
    switch (status) {
      case "pending":
        return "Ödeme Bekleniyor";
      case "paid":
        return "Ödeme Başarılı";
      case "shipped":
        return "Kargoya Verildi";
      case "delivered":
        return "Teslim Edildi";
      case "cancelled":
        return "İptal Edildi";
      default:
        return "Bilinmiyor";
    }
  };

  const getStatusBadge = (status: string) => {
    const label = getStatusInTurkish(status);
    const baseClasses =
      "font-medium flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px]";

    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className={`${baseClasses} bg-amber-50 text-amber-600 border-amber-200`}
          >
            <Loader className="w-3 h-3 animate-spin" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">Bekliyor</span>
          </Badge>
        );
      case "paid":
        return (
          <Badge
            variant="outline"
            className={`${baseClasses} bg-blue-50 text-blue-600 border-blue-200`}
          >
            <CheckCircle className="w-3 h-3" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">Ödendi</span>
          </Badge>
        );
      case "shipped":
        return (
          <Badge
            variant="outline"
            className={`${baseClasses} bg-indigo-50 text-indigo-600 border-indigo-200`}
          >
            <Truck className="w-3 h-3" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">Kargoda</span>
          </Badge>
        );
      case "delivered":
        return (
          <Badge
            variant="outline"
            className={`${baseClasses} bg-emerald-50 text-emerald-600 border-emerald-200`}
          >
            <Package className="w-3 h-3" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">Teslim</span>
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className={`${baseClasses} bg-slate-50 text-slate-500 border-slate-200`}
          >
            <XCircle className="w-3 h-3" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">İptal</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[10px]">
            {label}
          </Badge>
        );
    }
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
      if (data.status === "success") setOrders(data.orders);
    } catch (error) {
      console.error("Siparişler yüklenirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const triggerStatusUpdate = (
    orderId: number,
    currentStatus: FormattedOrder["status"]
  ) => {
    setOrderToUpdate({ id: orderId, currentStatus });
    setIsUpdateDialogOpen(true);
  };

  // GÜNCELLENEN API FONKSİYONU (SONNER TOAST EKLENDİ)
  const confirmUpdateStatus = async () => {
    if (!orderToUpdate) return;
    const nextStatus = getNextStatus(orderToUpdate.currentStatus);
    if (!nextStatus) return;

    // Toast Promise yapısı ile işlem durumu takibi
    toast.promise(
      (async () => {
        const res = await fetch("/api/order", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderToUpdate.id,
            status: nextStatus,
          }),
        });

        const data = await res.json();
        if (data.status !== "success")
          throw new Error(data.message || "Hata oluştu");

        await fetchOrders(); // Listeyi yenile
        return data;
      })(),
      {
        loading: "Sipariş durumu güncelleniyor...",
        success: "Sipariş durumu başarıyla güncellendi.",
        error: "Güncelleme sırasında bir hata oluştu.",
      }
    );

    setIsUpdateDialogOpen(false);
    setOrderToUpdate(null);
  };

  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          `${o.user.name} ${o.user.surname}`
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          o.user.email.toLowerCase().includes(search.toLowerCase()) ||
          String(o.id).includes(search)
      ),
    [orders, search]
  );

  const paginatedOrders = useMemo(
    () =>
      filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredOrders, currentPage]
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] font-sans antialiased text-slate-900">
      <Sidebar />
      <main
        className={`flex-1 p-4 sm:p-6 lg:p-10 transition-all duration-300 ${
          isMobile ? "mt-14 sm:mt-16" : "md:ml-[240px] lg:ml-[280px]"
        }`}
      >
        {/* Header */}
        <header className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-1 sm:h-1.5 w-5 sm:w-6 bg-indigo-600 " />
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-indigo-600/80">
              Yönetici Paneli
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Sipariş Yönetimi
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Gelen siparişleri takip edin ve süreçleri yönetin.
          </p>
        </header>

        {/* Search */}
        <div className="relative max-w-full sm:max-w-md mb-6 sm:mb-8 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input
            placeholder="Müşteri, email veya ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 bg-white border-slate-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-11 text-sm"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white  border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse min-w-[768px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 sm:px-6 py-4">ID</th>
                  <th className="px-4 sm:px-6 py-4">Müşteri</th>
                  <th className="px-4 sm:px-6 py-4 hidden lg:table-cell text-center">
                    Ürünler
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-center">Tutar</th>
                  <th className="px-4 sm:px-6 py-4 text-center">Durum</th>
                  <th className="px-4 sm:px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedOrders.map((order) => {
                  const nextStatus = getNextStatus(order.status);
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-4 sm:px-6 py-5 font-mono text-xs text-slate-400">
                        #{order.id}
                      </td>
                      <td className="px-4 sm:px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800 text-sm">
                            {order.user.name} {order.user.surname}
                          </span>
                          <span className="text-xs text-slate-400 truncate max-w-[200px]">
                            {order.user.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-5 hidden lg:table-cell">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-3 overflow-hidden">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <div
                                key={idx}
                                className="inline-block h-8 w-8  ring-2 ring-white overflow-hidden bg-slate-100 border border-slate-200"
                              >
                                <img
                                  src={item.product.mainImage}
                                  alt={item.product.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                          <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">
                            {order.items[0]?.product.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-5 text-center font-semibold text-slate-700 text-sm">
                        {order.paidPrice.toLocaleString("tr-TR")} ₺
                      </td>
                      <td className="px-4 sm:px-6 py-5 text-center">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-4 sm:px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-xs"
                            onClick={() => setSelectedOrder(order)}
                          >
                            Detay
                          </Button>
                          {nextStatus && order.status !== "cancelled" && (
                            <Button
                              size="sm"
                              className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
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
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-3">
          {paginatedOrders.map((order) => {
            const nextStatus = getNextStatus(order.status);
            return (
              <div
                key={order.id}
                className="bg-white  p-4 shadow-sm border border-slate-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm mb-1">
                      {order.user.name} {order.user.surname}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {order.user.email}
                    </p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="font-mono text-xs text-slate-400">
                      #{order.id}
                    </p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <p className="font-bold text-slate-900">
                    {order.paidPrice.toLocaleString("tr-TR")} ₺
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-xs"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Detay
                    </Button>
                    {nextStatus && order.status !== "cancelled" && (
                      <Button
                        size="sm"
                        className="h-8 px-3 bg-indigo-600 text-white text-xs"
                        onClick={() =>
                          triggerStatusUpdate(order.id, order.status)
                        }
                      >
                        {getStatusInTurkish(nextStatus)} Yap
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {filteredOrders.length > itemsPerPage && (
          <div className="mt-6 sm:mt-8">
            <DefaultPagination
              totalItems={filteredOrders.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Detay Dialog */}
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
            />
          )}
        </Dialog>

        {/* MODERN DURUM GÜNCELLEME ONAY DİAYLOĞU */}
        <AlertDialog
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
        >
          <AlertDialogContent className="bg-white  border-none shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-slate-900">
                Durumu Güncelle
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500 text-sm">
                Bu siparişin durumunu{" "}
                <strong className="text-slate-900">
                  "
                  {orderToUpdate
                    ? getStatusInTurkish(orderToUpdate.currentStatus)
                    : ""}
                  "
                </strong>{" "}
                aşamasından bir sonraki aşamaya taşımak üzeresiniz.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel className=" border-slate-200 font-semibold h-11">
                Vazgeç
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmUpdateStatus}
                className="bg-indigo-600 hover:bg-indigo-700 text-white  font-semibold h-11"
              >
                Evet, Güncelle
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
