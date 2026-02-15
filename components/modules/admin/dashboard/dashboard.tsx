"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  Users,
  FileText,
  Bell,
  Ticket,
  Settings,
  ArrowRight,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface KPI {
  id: string;
  title: string;
  stat: number | string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export default function AdminDashboard() {
  const isMobile = useIsMobile();
  const [kpiData, setKpiData] = useState<KPI[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { label: string; className: string }> = {
      pending: {
        label: "Beklemede",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      },
      paid: {
        label: "Ödendi",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      },
      shipped: {
        label: "Kargoda",
        className: "bg-blue-50 text-blue-700 border-blue-200",
      },
      delivered: {
        label: "Teslim Edildi",
        className: "bg-slate-50 text-slate-700 border-slate-200",
      },
      cancelled: {
        label: "İptal",
        className: "bg-red-50 text-red-700 border-red-200",
      },
    };

    const { label, className } = styles[status] || styles.pending;

    return (
      <Badge
        variant="outline"
        className={`${className} text-[10px] font-semibold border px-2 py-0.5`}
      >
        {label}
      </Badge>
    );
  };

  const formatOrderId = (id: any): string => {
    if (!id) return "000000";
    const idStr = String(id);
    if (idStr.length >= 6) {
      return idStr.slice(-6).toUpperCase();
    }
    return idStr.padStart(6, "0").toUpperCase();
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productRes, orderRes, userRes, blogRes, subsRes, couponRes] =
        await Promise.all([
          fetch("/api/products"),
          fetch("/api/order"),
          fetch("/api/user/all"),
          fetch("/api/blog"),
          fetch("/api/subscribe"),
          fetch("/api/coupon"),
        ]);

      const products = productRes.ok
        ? await productRes.json().catch(() => ({}))
        : {};
      const orders = orderRes.ok ? await orderRes.json().catch(() => ({})) : {};
      const users = userRes.ok ? await userRes.json().catch(() => ({})) : {};
      const blogs = blogRes.ok ? await blogRes.json().catch(() => ({})) : {};
      const subscribers = subsRes.ok
        ? await subsRes.json().catch(() => [])
        : [];
      const coupons = couponRes.ok
        ? await couponRes.json().catch(() => ({}))
        : {};

      setKpiData([
        {
          id: "products",
          title: "Ürünler",
          stat: products.products?.length || 0,
          description: "Toplam Ürün",
          icon: <Package className="w-5 h-5" />,
          href: "/admin/products",
        },
        {
          id: "color_size",
          title: "Renkler & Bedenler",
          stat: orders.orders?.length || 0,
          description: "Renkler & Bedenler",
          icon: <Palette className="w-5 h-5" />,
          href: "/admin/color_size",
        },
        {
          id: "orders",
          title: "Siparişler",
          stat: orders.orders?.length || 0,
          description: "Toplam Sipariş",
          icon: <ShoppingCart className="w-5 h-5" />,
          href: "/admin/orders",
        },
        {
          id: "users",
          title: "Müşteriler",
          stat: users.users?.length || 0,
          description: "Kayıtlı Kullanıcı",
          icon: <Users className="w-5 h-5" />,
          href: "/admin/users",
        },
        {
          id: "blogs",
          title: "Blog Yazıları",
          stat: blogs.blogs?.length || 0,
          description: "Yayında",
          icon: <FileText className="w-5 h-5" />,
          href: "/admin/blogs",
        },
        {
          id: "subscribers",
          title: "Aboneler",
          stat: Array.isArray(subscribers)
            ? subscribers.length
            : subscribers.subscribers?.length || 0,
          description: "E-posta Abonesi",
          icon: <Bell className="w-5 h-5" />,
          href: "/admin/subscribers",
        },
        {
          id: "coupons",
          title: "Kuponlar",
          stat:
            coupons.coupons?.length ||
            (Array.isArray(coupons) ? coupons.length : 0),
          description: "Aktif Kupon",
          icon: <Ticket className="w-5 h-5" />,
          href: "/admin/coupon",
        },
        {
          id: "settings",
          title: "Ana Sayfa",
          stat: "Yönet",
          description: "Site Ayarları",
          icon: <Settings className="w-5 h-5" />,
          href: "/admin/home_settings",
        },
      ]);

      const orderList = orders.orders || [];
      setRecentOrders(
        [...orderList]
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 6),
      );
    } catch (err) {
      console.error("Dashboard yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <Spinner />
      </div>
    );

  return (
    <div
      className={`flex-1 bg-slate-50 min-h-screen p-6 sm:p-8 ${isMobile ? "mt-14" : ""}`}
    >
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Panel Özet</h1>
        <p className="text-sm text-slate-600">
          Sistem geneli operasyonel kısayollar ve veriler
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {kpiData.map((card) => (
          <Link key={card.id} href={card.href}>
            <Card className="bg-white hover:shadow-md rounded-xl transition-shadow border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-slate-100 text-slate-700 rounded">
                    {card.icon}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {card.stat}
                </div>
                <p className="text-xs font-medium text-slate-600">
                  {card.title}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="bg-white border-slate-200 py-6 rounded-sm">
        <CardHeader className="border-b border-slate-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-slate-900">
              Son Siparişler
            </CardTitle>
            <Link
              href="/admin/orders"
              className="text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Tümünü Gör →
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                    Sipariş No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                    Müşteri
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600">
                    Tutar
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">
                        #{formatOrderId(order.id)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-900">
                        {order.user?.name} {order.user?.surname}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-semibold text-slate-900">
                        {order.paidPrice?.toLocaleString("tr-TR")} ₺
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/orders?orderId=${order.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-600 hover:text-slate-900"
                        >
                          Detay
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-slate-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      #{formatOrderId(order.id)}
                    </p>
                    <p className="text-xs text-slate-600">
                      {order.user?.name} {order.user?.surname}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-bold text-slate-900">
                    {order.paidPrice?.toLocaleString("tr-TR")} ₺
                  </span>
                  <Link href={`/admin/orders?orderId=${order.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-600 hover:text-slate-900"
                    >
                      Detay
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {recentOrders.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-sm">
              Henüz sipariş bulunmuyor
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
