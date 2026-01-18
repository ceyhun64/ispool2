"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sideBar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  X,
  MapPin,
  Phone,
  ShieldCheck,
  Trash2,
  Edit3,
  Truck,
  LocationEdit,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import AdresForm from "./addressForm";

// ==== Tip Tanımları ====
interface Address {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  address: string;
  district: string;
  city: string;
  neighborhood?: string;
  zip?: string;
  phone?: string;
  country?: string;
  email?: string;
  tcno?: string;
}

interface AddressFormData {
  title: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  district: string;
  neighborhood: string;
  zip?: string;
  phone?: string;
  country?: string;
  email?: string;
  tcno?: string;
}

export default function Adreslerim() {
  const router = useRouter();
  const [adresler, setAdresler] = useState<Address[]>([]);
  const [yeniAdresForm, setYeniAdresForm] = useState(false);
  const [duzenleForm, setDuzenleForm] = useState(false);
  const [duzenlenenAdres, setDuzenlenenAdres] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const initialFormData: AddressFormData = {
    title: "",
    firstName: "",
    lastName: "",
    address: "",
    district: "",
    city: "",
    neighborhood: "",
    zip: "",
    phone: "",
    country: "Türkiye",
    email: "",
    tcno: "",
  };

  const [ekleFormData, setEkleFormData] =
    useState<AddressFormData>(initialFormData);
  const [duzenleFormData, setDuzenleFormData] =
    useState<AddressFormData>(initialFormData);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch("/api/address", { method: "GET" });
        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }
        if (!res.ok) throw new Error("Adresler yüklenemedi.");
        const data = await res.json();
        setAdresler(data.addresses || []);
        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth/Fetch error:", error);
        toast.error("Oturum doğrulanamadı.");
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [router]);

  const handleSil = async (id: number) => {
    try {
      const res = await fetch(`/api/address/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silinemedi");
      setAdresler((prev) => prev.filter((a) => a.id !== id));
      toast.success("Adres kaydı sistemden silindi.");
    } catch (error) {
      toast.error("Silme işlemi başarısız.");
    }
  };

  const handleEkleKaydet = async () => {
    if (
      !ekleFormData.firstName ||
      !ekleFormData.address ||
      !ekleFormData.city
    ) {
      toast.error("Lütfen zorunlu sevkiyat alanlarını doldurun.");
      return;
    }
    try {
      const res = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ekleFormData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAdresler((prev) => [data.address, ...prev]);
      toast.success("Sevkiyat adresi başarıyla kaydedildi.");
      setYeniAdresForm(false);
      setEkleFormData(initialFormData);
    } catch (error) {
      toast.error("Kaydedilemedi.");
    }
  };

  const handleDuzenle = (adres: Address) => {
    setDuzenlenenAdres(adres);
    setDuzenleFormData({ ...adres, neighborhood: adres.neighborhood || "" });
    setDuzenleForm(true);
    setYeniAdresForm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDuzenleKaydet = async () => {
    if (!duzenlenenAdres) return;
    try {
      const res = await fetch(`/api/address/${duzenlenenAdres.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duzenleFormData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAdresler((prev) =>
        prev.map((a) => (a.id === duzenlenenAdres.id ? data.address : a)),
      );
      toast.success("Adres bilgileri güncellendi.");
      setDuzenleForm(false);
    } catch (error) {
      toast.error("Güncellenemedi.");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <main className="flex-1 px-6 py-12 md:px-16 lg:px-24">
          <div className="max-w-5xl mx-auto">
            <LoadingSkeleton />
          </div>
        </main>
      </div>
    );

  if (!isAuthorized) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC] text-slate-900">
      <Sidebar />

      <main className="flex-1 px-6 py-12 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          {/* Header Section - Industrial Professional */}
          <header className="mb-14 relative flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Sol Taraf: Başlık ve Bilgi */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-500 p-2">
                  <MapPin className="text-white w-6 h-6" />{" "}
                  {/* Not: LocationEdit yerine MapPin kullandım, kütüphanenize göre değiştirebilirsiniz */}
                </div>
                <div className="h-[2px] flex-1 bg-slate-200/60" />
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">
                Adres <span className="text-orange-600">Defteri</span>
              </h1>

              <div className="flex items-center gap-2 mt-2">
                <p className="text-slate-500 text-[11px] uppercase tracking-[0.3em] font-bold flex items-center gap-2">
                  <ShieldCheck size={14} className="text-green-600" />
                  Lojistik Yönetimi
                </p>
              </div>
            </div>

            {/* Sağ Taraf: Aksiyon Butonu */}
            <div className="flex-shrink-0">
              <button
                onClick={() => {
                  setYeniAdresForm(!yeniAdresForm);
                  setDuzenleForm(false);
                  setEkleFormData(initialFormData);
                }}
                className={`flex items-center gap-3 px-8 py-4 text-[11px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                  yeniAdresForm
                    ? "bg-white text-slate-900 border border-slate-200 shadow-slate-200/50"
                    : "bg-slate-950 text-white shadow-slate-900/30 hover:bg-orange-600 hover:-translate-y-1"
                }`}
              >
                {yeniAdresForm ? <X size={16} /> : <Plus size={16} />}
                <span>{yeniAdresForm ? "Vazgeç" : "Yeni Lokasyon Ekle"}</span>
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {(yeniAdresForm || duzenleForm) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="mb-16 bg-white border border-slate-200  shadow-xl shadow-slate-200/60 overflow-hidden"
              >
                <div className="bg-slate-900 px-10 py-4 flex items-center justify-between">
                  <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Edit3 size={14} className="text-orange-500" />
                    {duzenleForm ? "Kayıt Revizyonu" : "Yeni Sevkiyat Noktası"}
                  </span>
                </div>
                <div className="p-10">
                  <AdresForm
                    formData={duzenleForm ? duzenleFormData : ekleFormData}
                    setFormData={
                      duzenleForm ? setDuzenleFormData : setEkleFormData
                    }
                    onSave={
                      duzenleForm ? handleDuzenleKaydet : handleEkleKaydet
                    }
                  />
                </div>
              </motion.div>
            )}

            {!yeniAdresForm && !duzenleForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {adresler.length > 0 ? (
                  adresler.map((a) => (
                    <div
                      key={a.id}
                      className="group bg-white border border-slate-200  p-8 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-100 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Industrial Accent */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rotate-45 translate-x-8 -translate-y-8 group-hover:bg-orange-50 transition-colors" />

                      <div className="relative z-10 space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest px-2 py-1 bg-orange-50 rounded">
                              #{a.id}
                            </span>
                            <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 pt-2">
                              {a.title}
                            </h3>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDuzenle(a)}
                              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100  transition-all"
                              title="Düzenle"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() => handleSil(a.id)}
                              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50  transition-all"
                              title="Sil"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <MapPin
                              className="text-slate-400 mt-1 flex-shrink-0"
                              size={16}
                            />
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-slate-800 leading-tight">
                                {a.firstName} {a.lastName}
                              </p>
                              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                {a.address} <br />
                                <span className="text-slate-900 font-bold text-xs">
                                  {a.neighborhood && `${a.neighborhood}, `}
                                  {a.district} / {a.city}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                              <Phone size={14} className="text-orange-500" />
                              {a.phone}
                            </div>
                            {a.tcno && (
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                <ShieldCheck
                                  size={14}
                                  className="text-blue-500"
                                />
                                <span className="tracking-tighter uppercase text-[10px]">
                                  TC: {a.tcno}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="lg:col-span-2">
                    <EmptyState />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-32 flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 ">
      <div className="bg-slate-50 p-6 mb-6">
        <MapPin className="text-slate-300 w-12 h-12" />
      </div>
      <p className="text-sm font-black tracking-[0.2em] text-slate-400 uppercase">
        Sisteme kayıtlı adres bulunamadı
      </p>
      <p className="text-xs text-slate-400 mt-2">
        Hızlı sevkiyat için lütfen bir teslimat noktası tanımlayın.
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end mb-12">
        <div className="space-y-4">
          <Skeleton className="h-4 w-32 bg-slate-200" />
          <Skeleton className="h-12 w-64 bg-slate-200" />
        </div>
        <Skeleton className="h-14 w-48 bg-slate-200 " />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            className="h-64 w-full bg-white  border border-slate-100"
          />
        ))}
      </div>
    </div>
  );
}
