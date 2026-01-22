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
  ShieldCheck,
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
  bgColor: string;
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
        "bg-amber-100/50 text-amber-700 border-amber-200",
        <Loader size={12} className="animate-spin" />,
      ],
      paid: [
        "Ödendi",
        "bg-emerald-100/50 text-emerald-700 border-emerald-200",
        <CheckCircle size={12} />,
      ],
      shipped: [
        "Kargoda",
        "bg-blue-100/50 text-blue-700 border-blue-200",
        <Truck size={12} />,
      ],
      delivered: [
        "Teslim Edildi",
        "bg-slate-100/80 text-slate-700 border-slate-200",
        <Package size={12} />,
      ],
      cancelled: [
        "İptal",
        "bg-red-100/50 text-red-700 border-red-200",
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
        className={`${style} flex items-center w-fit gap-1.5 px-3 py-1 text-[10px] sm:text-[11px] font-bold tracking-tight border`}
      >
        {icon} <span className="hidden sm:inline uppercase">{label}</span>
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
          title: "Stok Envanteri",
          stat: products.products?.length || 0,
          description: "Premium Ürün Gamı",
          icon: <Package size={20} />,
          href: "/admin/products",
          color: "text-slate-900",
          bgColor: "bg-slate-100",
        },
        {
          id: "orders",
          title: "Sipariş Akışı",
          stat: orders.orders?.length || 0,
          description: "Net Satış Hacmi",
          icon: <ShoppingCart size={20} />,
          href: "/admin/orders",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
        {
          id: "users",
          title: "Portföy",
          stat: users.users?.length || 0,
          description: "Kurumsal Müşteriler",
          icon: <Users size={20} />,
          href: "/admin/users",
          color: "text-slate-900",
          bgColor: "bg-slate-100",
        },
        {
          id: "blogs",
          title: "Bilgi Merkezi",
          stat: blogs.blogs?.length || 0,
          description: "İSG Makaleleri",
          icon: <ShieldCheck size={20} />,
          href: "/admin/blogs",
          color: "text-slate-900",
          bgColor: "bg-slate-100",
        },
        {
          id: "subscribers",
          title: "Bülten",
          stat: Array.isArray(subscribers) ? subscribers.length : 0,
          description: "Potansiyel Lead",
          icon: <UserPlus size={20} />,
          href: "/admin/subscribers",
          color: "text-slate-900",
          bgColor: "bg-slate-100",
        },
      ]);

      setRecentOrders(
        orders.orders
          ?.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 6) || [],
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <Spinner />
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-sans selection:bg-orange-100">
      <Sidebar />
      <main
        className={`flex-1 p-4 sm:p-8 lg:p-12 transition-all duration-300 ${
          isMobile ? "mt-14" : "md:ml-[240px] lg:ml-[280px]"
        }`}
      >
        {/* Header Section */}
        <header className="flex flex-col gap-2 mb-10">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-12 bg-orange-600" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-600">
              Pro-Wear Dashboard
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 uppercase">
                Panel <span className="text-slate-400 font-light">Özet</span>
              </h1>
              <p className="text-slate-500 text-sm mt-2 font-medium">
                Endüstriyel performans ve operasyonel veriler.
              </p>
            </div>
          </div>
        </header>

        {/* KPI CARDS */}
        <div className="grid gap-4 mb-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {kpiData.map((card) => (
            <Link key={card.id} href={card.href} className="group">
              <Card className="bg-white h-full border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-none relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-0 bg-orange-600 group-hover:h-full transition-all duration-300" />
                <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0 px-5 pt-6">
                  <div
                    className={`p-2.5 ${card.bgColor} ${card.color} transition-colors duration-300`}
                  >
                    {card.icon}
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-slate-200 group-hover:text-orange-600 transition-all -translate-x-2 group-hover:translate-x-0"
                  />
                </CardHeader>
                <CardContent className="px-5 pb-6">
                  <div className="text-3xl font-bold text-slate-950 tabular-nums">
                    {card.stat}
                  </div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    {card.title}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* RECENT ORDERS TABLE */}
        <Card className="bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-none overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-600" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">
                Lojistik ve Sipariş Takibi
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-[11px] font-bold uppercase tracking-tighter text-slate-400 hover:text-orange-600 transition-colors flex items-center gap-1"
            >
              Arşivi Görüntüle <ArrowRight size={12} />
            </Link>
          </div>
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-[0.15em] font-bold">
                  <tr>
                    <th className="px-6 py-4">Müşteri Profili</th>
                    <th className="px-6 py-4 hidden lg:table-cell">
                      Ekipman Detayı
                    </th>
                    <th className="px-6 py-4">Hakediş</th>
                    <th className="px-6 py-4">Lojistik Durum</th>
                    <th className="px-6 py-4 text-right">Aksiyon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 uppercase">
                            {order.user.name} {order.user.surname}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">
                            ID: #{order.id.slice(-6).toUpperCase()} •{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "tr-TR",
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <p className="text-[12px] font-medium text-slate-600 truncate max-w-[220px]">
                          {order.items
                            ?.map((i: any) => i.product?.title)
                            .join(", ") || "Endüstriyel Çözüm"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-slate-950">
                          {order.paidPrice?.toLocaleString("tr-TR")} ₺
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/orders?orderId=${order.id}`}>
                          <Button
                            variant="outline"
                            className="h-8 w-8 p-0 border-slate-200 hover:border-orange-600 hover:bg-orange-600 hover:text-white transition-all rounded-none"
                          >
                            <ArrowRight size={14} />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (Kısıtlı alanda sadeleştirilmiş premium görünüm) */}
            <div className="md:hidden space-y-0 divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-5 bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex flex-col">
                      <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">
                        {order.user.name} {order.user.surname}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900">
                      {order.paidPrice?.toLocaleString("tr-TR")} ₺
                    </span>
                    <Link href={`/admin/orders?orderId=${order.id}`}>
                      <Button
                        variant="link"
                        className="text-orange-600 font-bold p-0 h-auto text-xs uppercase"
                      >
                        Detayları İncele
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {recentOrders.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">
                  Kayıtlı operasyon bulunamadı.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
