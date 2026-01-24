// components/HorozCargoTracking.tsx
"use client";

import { useState } from "react";
import Sidebar from "./sideBar";
import {
  Search,
  Truck,
  Package,
  MapPin,
  Clock,
  ChevronRight,
  AlertTriangle,
  Box,
  ShieldCheck,
  Calendar,
} from "lucide-react";

interface CargoMovement {
  requestNumber: string;
  atfNumber: string;
  deliveryType: string;
  senderName: string;
  receiverName: string;
  quantity: number;
  desi: number;
  status: string;
  statusDate: string;
  deliveryStatus: string;
  deliveryProblem?: string;
  amount: number;
}

interface CargoData {
  shippingDeliveryState: {
    requestNumber: string;
    cargoTrackingNumber: string;
    atfNumber: string;
    senderName: string;
    senderPhone: string;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    receiverCity: string;
    receiverDistrict: string;
    totalPieces: number;
    deliveryStatus: string;
  };
  listOfShipments: Array<{
    productCode: string;
    productName: string;
    quantity: number;
    weight: number;
    desi: number;
  }>;
  listOfMovements: CargoMovement[];
}

export default function HorozCargoTracking() {
  const [requestNumber, setRequestNumber] = useState("");
  const [cargoData, setCargoData] = useState<CargoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestNumber.trim()) {
      setError("Lütfen bir takip numarası giriniz.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/cargo-tracking?requestNumber=${encodeURIComponent(
          requestNumber.trim()
        )}`
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Kargo bulunamadı");
      setCargoData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-100 text-slate-900">
      <Sidebar />

      <main className="flex-1 px-6 py-12 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          {/* Header Section - Industrial Professional */}
          <header className="mb-14 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-500 p-2">
                <Truck className="text-white w-6 h-6" />
              </div>
              <div className="h-[2px] flex-1 bg-slate-200/60" />
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">
              Kargo <span className="text-orange-600">Takip</span>
            </h1>
            <p className="text-slate-500 text-[11px] uppercase tracking-[0.3em] font-bold mt-2 flex items-center gap-2">
              <ShieldCheck size={14} className="text-green-600" />
              Güvenli Kargo Takip ve Yetkilendirme Sistemi
            </p>
          </header>

          {/* Search Section - Modern Industrial Design */}
          <section className="mb-20">
            <form onSubmit={handleTrack} className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors">
                <Search size={24} />
              </div>
              <input
                type="text"
                value={requestNumber}
                onChange={(e) => setRequestNumber(e.target.value)}
                placeholder="Takip Numarası veya Sipariş Kodu"
                className="w-full bg-white border-2 border-slate-200  py-6 pl-16 pr-44 text-lg font-bold shadow-sm focus:outline-none focus:border-orange-500 transition-all placeholder:text-slate-300 shadow-slate-100"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 hover:bg-orange-600 text-white px-8 py-3.5  text-xs font-black tracking-widest uppercase transition-all shadow-lg active:scale-95 disabled:bg-slate-300"
              >
                {loading ? "Sorgulanıyor..." : "Sorgula"}
              </button>
            </form>
            {error && (
              <div className="mt-4 flex items-center gap-2 text-red-600 font-bold text-[10px] uppercase tracking-widest bg-red-50 p-3  border border-red-100">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}
          </section>

          {cargoData && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6  border border-slate-200 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Truck size={64} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Güncel Durum
                  </span>
                  <p className="text-xl font-black text-orange-600 mt-2">
                    {cargoData.shippingDeliveryState.deliveryStatus ||
                      "Hazırlanıyor"}
                  </p>
                </div>
                <div className="bg-white p-6  border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Takip Referansı
                  </span>
                  <p className="text-xl font-black text-slate-900 mt-2 font-mono">
                    {cargoData.shippingDeliveryState.cargoTrackingNumber}
                  </p>
                </div>
                <div className="bg-white p-6  border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Teslimat Şehri
                  </span>
                  <p className="text-xl font-black text-slate-900 mt-2">
                    {cargoData.shippingDeliveryState.receiverCity}
                  </p>
                </div>
              </div>

              {/* Grid Content */}
              <div className="grid lg:grid-cols-12 gap-12 mb-20">
                {/* Details Section */}
                <section className="lg:col-span-5 space-y-8">
                  <div className="bg-slate-900 text-white p-8  shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-orange-600  blur-3xl opacity-20" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-8 flex items-center gap-2">
                      <ShieldCheck size={16} /> Sevkiyat Bilgileri
                    </h3>
                    <div className="space-y-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                          Alıcı
                        </span>
                        <span className="text-lg font-bold">
                          {cargoData.shippingDeliveryState.receiverName}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                          Koli Miktarı
                        </span>
                        <span className="text-lg font-bold">
                          {cargoData.shippingDeliveryState.totalPieces} Parça
                          Ekipman
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                          Teslimat Adresi
                        </span>
                        <span className="text-sm font-medium text-slate-300 leading-relaxed italic">
                          {cargoData.shippingDeliveryState.receiverAddress}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Package Content Mini-List */}
                  <div className="bg-white border border-slate-200  p-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 text-center">
                      Paket İçeriği
                    </h3>
                    <div className="space-y-3">
                      {cargoData.listOfShipments.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 bg-slate-50  border border-slate-100 hover:border-orange-200 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Box size={16} className="text-orange-600" />
                            <span className="text-xs font-bold text-slate-700 uppercase truncate max-w-[150px]">
                              {item.productName}
                            </span>
                          </div>
                          <span className="bg-white px-3 py-1  text-[10px] font-black text-slate-900 border border-slate-200">
                            {item.quantity} ADET
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Timeline Section */}
                <section className="lg:col-span-7">
                  <div className="flex items-center gap-3 mb-10">
                    <Clock size={20} className="text-orange-600" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">
                      Transfer Geçmişi
                    </h3>
                  </div>

                  <div className="relative pl-12 space-y-12 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {cargoData.listOfMovements.map((movement, index) => (
                      <div key={index} className="relative group">
                        {/* Dot with Pulse Effect for Last Item */}
                        <div
                          className={`absolute -left-[12px] top-1 w-10 h-10  bg-white border-2 flex items-center justify-center z-10 transition-all ${
                            index === 0
                              ? "border-orange-600 shadow-lg shadow-orange-100 scale-110"
                              : "border-slate-200 shadow-sm"
                          }`}
                        >
                          {index === 0 ? (
                            <div className="w-2.5 h-2.5  bg-orange-600 animate-pulse" />
                          ) : (
                            <div className="w-2 h-2  bg-slate-200" />
                          )}
                        </div>

                        <div
                          className={`p-6  transition-all border ${
                            index === 0
                              ? "bg-white border-orange-100 shadow-xl shadow-slate-100"
                              : "bg-transparent border-transparent"
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <h4
                                className={`text-sm font-black uppercase tracking-tight ${
                                  index === 0
                                    ? "text-slate-900"
                                    : "text-slate-500"
                                }`}
                              >
                                {movement.status}
                              </h4>
                              <div className="flex items-center gap-2 mt-2 text-slate-400">
                                <Calendar size={12} />
                                <span className="text-[11px] font-bold tracking-widest">
                                  {movement.statusDate}
                                </span>
                              </div>
                            </div>
                            {movement.deliveryProblem && (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5  bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest animate-bounce">
                                <AlertTriangle size={12} />
                                {movement.deliveryProblem}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
