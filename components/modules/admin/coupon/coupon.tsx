"use client";

import { useState } from "react";
import { toast } from "sonner";
import Sidebar from "../sideBar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Ticket,
  Percent,
  Banknote,
  Calendar,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function CouponAdmin() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    type: "PERCENTAGE",
    value: "",
    minAmount: "",
    usageLimit: "",
    expiryDate: "",
  });

  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Hata oluştu");
      toast.success("Kupon başarıyla oluşturuldu");
      setFormData({
        code: "",
        type: "PERCENTAGE",
        value: "",
        minAmount: "",
        usageLimit: "",
        expiryDate: "",
      });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

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
              <span className="h-1 w-6 sm:w-8 bg-indigo-600 " />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-indigo-600">
                Yönetim Paneli
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Kupon Yönetimi
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
              Mağazanız için yeni indirim stratejileri
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Sol: Form Alanı */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-4 sm:space-y-6"
          >
            <div className="bg-white  border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-slate-50 bg-slate-50/50">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />{" "}
                  Temel Yapılandırma
                </h3>
              </div>

              <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Kod */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">
                    Kupon Kodu
                  </label>
                  <div className="relative">
                    <input
                      required
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200  px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all uppercase font-mono font-bold"
                      placeholder="Örn: YAZ20"
                    />
                  </div>
                </div>

                {/* Tür */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">
                    İndirim Modeli
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 ">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: "PERCENTAGE" })
                      }
                      className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2  text-[10px] sm:text-xs font-medium transition-all ${
                        formData.type === "PERCENTAGE"
                          ? "bg-white shadow-sm text-indigo-600"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <Percent className="w-3 h-3" />
                      <span className="hidden sm:inline">Yüzdelik</span>
                      <span className="sm:hidden">%</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: "FIXED" })
                      }
                      className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2  text-[10px] sm:text-xs font-medium transition-all ${
                        formData.type === "FIXED"
                          ? "bg-white shadow-sm text-indigo-600"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <Banknote className="w-3 h-3" />
                      <span className="hidden sm:inline">Nakit</span>
                      <span className="sm:hidden">₺</span>
                    </button>
                  </div>
                </div>

                {/* Değer */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">
                    İndirim Miktarı
                  </label>
                  <div className="relative">
                    <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-sm font-medium">
                      {formData.type === "PERCENTAGE" ? "%" : "TL"}
                    </span>
                    <input
                      required
                      type="number"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData({ ...formData, value: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200  px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Alt Limit */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">
                    Minimum Sepet Tutarı
                  </label>
                  <input
                    type="number"
                    value={formData.minAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, minAmount: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200  px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Örn: 500 TL"
                  />
                </div>
              </div>
            </div>

            {/* Kısıtlamalar Bölümü */}
            <div className="bg-white  border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-slate-50 bg-slate-50/50">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />{" "}
                  Kullanım Kısıtlamaları
                </h3>
              </div>
              <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Toplam Kontenjan
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, usageLimit: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200  px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="Sınırsız için boş bırakın"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200  px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              className="group w-full bg-slate-900 text-white py-3 sm:py-4  text-xs sm:text-sm font-semibold uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:bg-slate-300"
            >
              {loading ? "Sistem Güncelleniyor..." : "Kuponu Aktif Et"}
            </button>
          </form>

          {/* Sağ: Preview Alanı */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Canlı Önizleme
            </h3>
            <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-800 p-5 sm:p-6  shadow-2xl shadow-indigo-200 overflow-hidden text-white group">
              {/* Estetik Arkaplan Halkası */}
              <div className="absolute -right-8 -top-8 w-20 h-20 sm:w-24 sm:h-24 bg-white/10  blur-2xl group-hover:scale-150 transition-transform duration-700" />

              <div className="relative">
                <div className="bg-white/20 w-fit px-2.5 sm:px-3 py-1  text-[9px] sm:text-[10px] font-bold tracking-tighter mb-3 sm:mb-4">
                  {formData.type === "PERCENTAGE"
                    ? "YÜZDELİK İNDİRİM"
                    : "NAKİT İNDİRİM"}
                </div>
                <div className="text-2xl sm:text-3xl font-black mb-1 leading-none tracking-tight">
                  {formData.value
                    ? formData.type === "PERCENTAGE"
                      ? `%${formData.value}`
                      : `${formData.value} TL`
                    : "---"}
                </div>
                <div className="text-white/60 text-[10px] sm:text-xs font-light italic mb-4 sm:mb-6">
                  {formData.minAmount
                    ? `${formData.minAmount} TL ve üzeri siparişlerde`
                    : "Alt limit bulunmuyor"}
                </div>

                <div className="flex items-center justify-between bg-black/20 p-3  border border-white/10">
                  <span className="font-mono text-xs sm:text-sm tracking-widest font-bold truncate">
                    {formData.code || "KOD_YAZ"}
                  </span>
                  <button
                    type="button"
                    className="text-[9px] sm:text-[10px] uppercase font-bold text-indigo-200 flex-shrink-0 ml-2"
                  >
                    Kopyala
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-3 sm:p-4  border border-orange-100">
              <p className="text-[10px] sm:text-[11px] text-orange-700 leading-relaxed font-medium italic">
                * Kupon oluşturulduğu anda mağazanızdaki tüm geçerli ürünlerde
                aktif hale gelecektir.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
