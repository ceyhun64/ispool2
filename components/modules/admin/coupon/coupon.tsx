"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Ticket,
  Percent,
  Banknote,
  Loader2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface Coupon {
  id: number;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minAmount: number | null;
  usageLimit: number | null;
  usedCount: number;
  expiryDate: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function CouponAdmin() {
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponsLoading, setCouponsLoading] = useState(true);
  const [formData, setFormData] = useState({
    code: "",
    type: "PERCENTAGE",
    value: "",
    minAmount: "",
    usageLimit: "",
    expiryDate: "",
  });

  const isMobile = useIsMobile();

  // Kuponları getir
  const fetchCoupons = async () => {
    setCouponsLoading(true);
    try {
      const res = await fetch("/api/coupon");
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data);
      } else {
        toast.error(data.error || "Kuponlar yüklenemedi");
      }
    } catch {
      toast.error("Sunucu ile bağlantı kurulamadı");
    } finally {
      setCouponsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

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
      fetchCoupons();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu kuponu silmek istediğinizden emin misiniz?")) return;
    try {
      const res = await fetch("/api/coupon", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Silinemedi");
      toast.success("Kupon silindi");
      fetchCoupons();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`"${code}" kopyalandı`);
  };

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date() > new Date(expiryDate);
  };

  const getCouponStatus = (coupon: Coupon) => {
    if (!coupon.isActive)
      return { label: "Pasif", color: "text-slate-500 bg-slate-100" };
    if (isExpired(coupon.expiryDate))
      return { label: "Süresi Doldu", color: "text-red-600 bg-red-50" };
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
      return { label: "Limit Doldu", color: "text-orange-600 bg-orange-50" };
    return { label: "Aktif", color: "text-green-700 bg-green-50" };
  };

  return (
    <div
      className={`flex-1 bg-slate-50 min-h-screen p-6 sm:p-8 ${isMobile ? "mt-14" : ""}`}
    >
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Kupon Yönetimi
        </h1>
        <p className="text-sm text-slate-600">
          İndirim kuponları oluşturun ve yönetin
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-slate-200 rounded-sm">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-6">
                Kupon Bilgileri
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kod */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-2 block">
                    Kupon Kodu
                  </label>
                  <Input
                    required
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    className="bg-slate-50 border-slate-200 uppercase font-mono rounded-xl"
                    placeholder="Örn: SUMMER20"
                  />
                </div>

                {/* Tür */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-2 block">
                    İndirim Tipi
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: "PERCENTAGE" })
                      }
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                        formData.type === "PERCENTAGE"
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <Percent className="w-4 h-4" />
                      Yüzde
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: "FIXED" })
                      }
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                        formData.type === "FIXED"
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      Sabit
                    </button>
                  </div>
                </div>

                {/* Değer */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-2 block">
                    İndirim Miktarı
                  </label>
                  <div className="relative">
                    <Input
                      required
                      type="number"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData({ ...formData, value: e.target.value })
                      }
                      className="bg-slate-50 border-slate-200 pr-12 rounded-xl"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      {formData.type === "PERCENTAGE" ? "%" : "TL"}
                    </span>
                  </div>
                </div>

                {/* Minimum Tutar */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-2 block">
                    Minimum Sepet
                  </label>
                  <Input
                    type="number"
                    value={formData.minAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, minAmount: e.target.value })
                    }
                    className="bg-slate-50 border-slate-200 rounded-xl"
                    placeholder="0 TL"
                  />
                </div>

                {/* Kullanım Limiti */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-2 block">
                    Kullanım Limiti
                  </label>
                  <Input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, usageLimit: e.target.value })
                    }
                    className="bg-slate-50 border-slate-200 rounded-xl"
                    placeholder="Sınırsız"
                  />
                </div>

                {/* Son Kullanma */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-2 block">
                    Son Kullanma Tarihi
                  </label>
                  <Input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    className="bg-slate-50 border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white rounded-full"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Kupon Oluştur"
                )}
              </Button>
            </CardContent>
          </Card>
        </form>

        {/* Right: Preview */}
        <div className="space-y-6">
          <Card className="bg-white border-slate-200 rounded-sm">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Önizleme
              </h3>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-sm text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Ticket className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {formData.type === "PERCENTAGE"
                      ? "Yüzdelik İndirim"
                      : "Sabit İndirim"}
                  </span>
                </div>

                <div className="text-3xl font-bold mb-2">
                  {formData.value
                    ? formData.type === "PERCENTAGE"
                      ? `%${formData.value}`
                      : `${formData.value} TL`
                    : "---"}
                </div>

                <p className="text-sm text-slate-300 mb-4">
                  {formData.minAmount
                    ? `${formData.minAmount} TL üzeri siparişlerde`
                    : "Tüm siparişlerde geçerli"}
                </p>

                <div className="bg-white/10 p-3 rounded-sm border border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm tracking-wider">
                      {formData.code || "KOD"}
                    </span>
                    <button
                      type="button"
                      className="text-xs text-slate-300 hover:text-white"
                    >
                      Kopyala
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-amber-50 border border-amber-200 rounded p-4">
            <p className="text-xs text-amber-800 leading-relaxed">
              Kupon oluşturulduktan sonra tüm müşterilere açık olacaktır.
            </p>
          </div>
        </div>
      </div>

      {/* Coupon List */}
      <div className="mt-8">
        <Card className="bg-white border-slate-200 rounded-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-slate-900">
                Tüm Kuponlar
              </h3>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                {coupons.length} kupon
              </span>
            </div>

            {couponsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                <span className="ml-2 text-sm text-slate-500">
                  Yükleniyor...
                </span>
              </div>
            ) : coupons.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">
                  Henüz kupon oluşturulmamış
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3 pr-4">
                        Kod
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3 pr-4">
                        İndirim
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3 pr-4">
                        Min. Sepet
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3 pr-4">
                        Kullanım
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3 pr-4">
                        Son Tarih
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3 pr-4">
                        Durum
                      </th>
                      <th className="text-right text-xs font-semibold text-slate-500 uppercase pb-3">
                        İşlem
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {coupons.map((coupon) => {
                      const status = getCouponStatus(coupon);
                      return (
                        <tr
                          key={coupon.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          {/* Kod */}
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold text-slate-900 text-xs tracking-wider">
                                {coupon.code}
                              </span>
                              <button
                                onClick={() => handleCopy(coupon.code)}
                                className="text-slate-400 hover:text-slate-700 transition-colors"
                                title="Kopyala"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </td>

                          {/* İndirim */}
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-1.5">
                              {coupon.type === "PERCENTAGE" ? (
                                <Percent className="w-3.5 h-3.5 text-slate-400" />
                              ) : (
                                <Banknote className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span className="font-semibold text-slate-800">
                                {coupon.type === "PERCENTAGE"
                                  ? `%${coupon.value}`
                                  : `${coupon.value} TL`}
                              </span>
                            </div>
                          </td>

                          {/* Min. Sepet */}
                          <td className="py-3 pr-4 text-slate-600">
                            {coupon.minAmount ? `${coupon.minAmount} TL` : "—"}
                          </td>

                          {/* Kullanım */}
                          <td className="py-3 pr-4">
                            <span className="text-slate-700">
                              {coupon.usedCount}
                              {coupon.usageLimit ? (
                                <span className="text-slate-400">
                                  {" "}
                                  / {coupon.usageLimit}
                                </span>
                              ) : (
                                <span className="text-slate-400"> / ∞</span>
                              )}
                            </span>
                          </td>

                          {/* Son Tarih */}
                          <td className="py-3 pr-4">
                            {coupon.expiryDate ? (
                              <div className="flex items-center gap-1 text-slate-600">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {new Date(
                                    coupon.expiryDate,
                                  ).toLocaleDateString("tr-TR")}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          {/* Durum */}
                          <td className="py-3 pr-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                            >
                              {status.label === "Aktif" ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              {status.label}
                            </span>
                          </td>

                          {/* İşlem */}
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleDelete(coupon.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
