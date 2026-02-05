"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Ticket, Percent, Banknote, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 ">
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
    </div>
  );
}
