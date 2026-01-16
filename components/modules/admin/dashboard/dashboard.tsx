"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/modules/admin/sideBar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  Users,
  FileText,
  Loader,
  CheckCircle,
  Truck,
  XCircle,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface KPI {
  id: string;
  title: string;
  stat: number;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

export default function AdminDashboard() {
  const isMobile = useIsMobile();
  const [kpiData, setKpiData] = useState<KPI[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getStatusBadge = (status: string) => {
    const tr: Record<string, any> = {
      pending: [
        "Beklemede",
        "bg-amber-50 text-amber-600 border-amber-100",
        <Loader size={12} className="animate-spin" />,
      ],
      paid: [
        "Ödendi",
        "bg-emerald-50 text-emerald-600 border-emerald-100",
        <CheckCircle size={12} />,
      ],
      shipped: [
        "Kargoda",
        "bg-blue-50 text-blue-600 border-blue-100",
        <Truck size={12} />,
      ],
      delivered: [
        "Teslim Edildi",
        "bg-slate-50 text-slate-600 border-slate-100",
        <Package size={12} />,
      ],
      cancelled: [
        "İptal",
        "bg-red-50 text-red-600 border-red-100",
        <XCircle size={12} />,
      ],
    };

    const [label, style, icon] = tr[status] || [
      "Bilinmiyor",
      "bg-slate-50",
      null,
    ];

    return (
      <Badge
        variant="outline"
        className={`${style} flex items-center w-fit gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium border`}
      >
        {icon} <span className="hidden sm:inline">{label}</span>
      </Badge>
    );
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productRes, orderRes, userRes, blogRes, subsRes] =
        await Promise.all([
          fetch("/api/products"),
          fetch("/api/order"),
          fetch("/api/user/all"),
          fetch("/api/blog"),
          fetch("/api/subscribe"),
        ]);

      const products = await productRes.json();
      const orders = await orderRes.json();
      const users = await userRes.json();
      const blogs = await blogRes.json();
      const subscribers = await subsRes.json();


      setKpiData([
        {
          id: "products",
          title: "Ürünler",
          stat: products.products?.length || 0,
          description: "Envanter durumu",
          icon: <Package size={18} className="sm:w-5 sm:h-5" />,
          href: "/admin/products",
          color: "text-blue-500",
        },
        {
          id: "orders",
          title: "Siparişler",
          stat: orders.orders?.length || 0,
          description: "Toplam satışlar",
          icon: <ShoppingCart size={18} className="sm:w-5 sm:h-5" />,
          href: "/admin/orders",
          color: "text-emerald-500",
        },
        {
          id: "users",
          title: "Müşteriler",
          stat: users.users?.length || 0,
          description: "Aktif kullanıcılar",
          icon: <Users size={18} className="sm:w-5 sm:h-5" />,
          href: "/admin/users",
          color: "text-indigo-500",
        },
        {
          id: "blogs",
          title: "Yazılar",
          stat: blogs.blogs?.length || 0,
          description: "İçerik sayısı",
          icon: <FileText size={18} className="sm:w-5 sm:h-5" />,
          href: "/admin/blogs",
          color: "text-amber-500",
        },
        {
          id: "subscribers",
          title: "Aboneler",
          stat: Array.isArray(subscribers) ? subscribers.length : 0,
          description: "Bülten kaydı",
          icon: <UserPlus size={18} className="sm:w-5 sm:h-5" />,
          href: "/admin/subscribers",
          color: "text-rose-500",
        },
      ]);

      setRecentOrders(
        orders.orders
          ?.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 6) || []
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  console.log(recentOrders)

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] font-sans selection:bg-indigo-100">
      <Sidebar />
      <main
        className={`flex-1 p-4 sm:p-6 lg:p-12 transition-all duration-300 ${
          isMobile ? "mt-14 sm:mt-16" : "md:ml-[240px] lg:ml-[280px]"
        }`}
      >
        {/* Header Section */}
        <header className="flex flex-col gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1 w-6 sm:w-8 bg-indigo-600 rounded-full" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-indigo-600">
                Yönetim Paneli
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Genel Bakış
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
              İşletmenizin performansını gerçek zamanlı izleyin.
            </p>
          </div>
        </header>

        {/* KPI CARDS */}
        <div className="grid gap-3 sm:gap-4 mb-8 sm:mb-10 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {kpiData.map((card) => (
            <Link key={card.id} href={card.href}>
              <Card className="bg-white py-2 sm:py-3 border-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-300 group rounded-xl sm:rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 space-y-0 px-3 sm:px-4">
                  <div
                    className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-50 ${card.color} group-hover:scale-110 transition-transform`}
                  >
                    {card.icon}
                  </div>
                  <ArrowRight
                    size={12}
                    className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 hidden sm:block"
                  />
                </CardHeader>
                <CardContent className="px-3 sm:px-4">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                    {card.stat}
                  </div>
                  <p className="text-[11px] sm:text-[13px] font-medium text-slate-500 mt-0.5 truncate">
                    {card.title}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* RECENT ORDERS TABLE */}
        <Card className="bg-white border-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-xl sm:rounded-2xl overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-sm sm:text-[16px] font-semibold text-slate-900">
              Son Siparişler
            </h2>
            <Link
              href="/admin/orders"
              className="text-[10px] sm:text-xs font-medium text-slate-400 hover:text-slate-900 transition-colors"
            >
              Tümünü Gör
            </Link>
          </div>
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left min-w-[640px]">
                <thead className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 sm:px-6 py-3">Müşteri</th>
                    <th className="px-4 sm:px-6 py-3 hidden lg:table-cell">
                      Ürünler
                    </th>
                    <th className="px-4 sm:px-6 py-3">Tutar</th>
                    <th className="px-4 sm:px-6 py-3">Durum</th>
                    <th className="px-4 sm:px-6 py-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs sm:text-sm font-semibold text-slate-800">
                        {order.user.name} {order.user.surname}
                          </span>
                          <span className="text-[10px] sm:text-xs text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString(
                              "tr-TR"
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                        <p className="text-xs sm:text-sm text-slate-600 truncate max-w-[150px] sm:max-w-[200px]">
                          {order.items
                            ?.map((i: any) => i.product?.title)
                            .join(", ") || "Hizmet"}
                        </p>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {order.paidPrice?.toLocaleString("tr-TR")} ₺
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <Link href={`/admin/orders?orderId=${order.id}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full hover:bg-slate-900 hover:text-white transition-all"
                          >
                            <ArrowRight
                              size={12}
                              className="sm:w-[14px] sm:h-[14px]"
                            />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3 p-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-50 rounded-xl p-3 border border-slate-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {order.user.name} {order.user.surname}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="text-sm font-bold text-slate-900">
                      {order.paidPrice?.toLocaleString("tr-TR")} ₺
                    </span>
                    <Link href={`/admin/orders?orderId=${order.id}`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-3 text-xs"
                      >
                        Detay
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {recentOrders.length === 0 && (
              <div className="py-12 sm:py-20 text-center text-slate-400 text-xs sm:text-sm italic">
                Henüz bir veri bulunmuyor.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
