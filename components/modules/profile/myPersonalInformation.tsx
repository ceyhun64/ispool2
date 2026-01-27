"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Sidebar from "./sideBar";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, UserCog, Smartphone, Mail } from "lucide-react";

interface UserData {
  name: string;
  surname: string;
  phone?: string | null;
  email: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export default function KisiselBilgilerim() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", { method: "GET" });

        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }

        if (!res.ok) throw new Error("Veri alınamadı");

        const data = await res.json();
        const userData = data.user;

        if (!userData) {
          router.push("/auth/login");
          return;
        }

        setUser(userData);
        setFormData({
          firstName: userData.name || "",
          lastName: userData.surname || "",
          phone: userData.phone?.replace("+90", "") || "",
          email: userData.email || "",
        });
      } catch (error) {
        console.error("Auth Error:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const validateForm = () => {
    const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/;
    const phoneClean = formData.phone.replace(/\D/g, "");

    if (!formData.firstName.trim() || formData.firstName.length < 2) {
      toast.error("Lütfen geçerli bir isim giriniz.");
      return false;
    }
    if (!nameRegex.test(formData.firstName)) {
      toast.error("İsim sadece harflerden oluşmalıdır.");
      return false;
    }
    if (!formData.lastName.trim() || formData.lastName.length < 2) {
      toast.error("Lütfen geçerli bir soyisim giriniz.");
      return false;
    }
    if (!nameRegex.test(formData.lastName)) {
      toast.error("Soyisim sadece harflerden oluşmalıdır.");
      return false;
    }
    if (phoneClean && (phoneClean.length < 10 || phoneClean.length > 11)) {
      toast.error("Telefon numarası 10 veya 11 hane olmalıdır.");
      return false;
    }
    if (phoneClean && !phoneClean.startsWith("5")) {
      toast.error("Telefon numarası 5xx ile başlamalıdır.");
      return false;
    }

    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone
            ? `+90${formData.phone.replace(/\D/g, "")}`
            : null,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Bilgileriniz başarıyla güncellendi.");
    } catch (err) {
      toast.error("Güncelleme yapılamadı, lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PersonalLoadingSkeleton />;
  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-100 text-slate-900">
      <Sidebar />

      <main className="flex-1 px-6 py-12 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          {/* Header Section - Industrial Professional */}
          <header className="mb-14 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-500 p-2 ">
                <UserCog className="text-white w-6 h-6" />
              </div>
              <div className="h-[2px] flex-1 bg-slate-200/60" />
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">
              Personel <span className="text-orange-600">Kartı</span>
            </h1>
            <p className="text-slate-500 text-[11px] uppercase tracking-[0.3em] font-bold mt-2 flex items-center gap-2">
              <ShieldCheck size={14} className="text-green-600" />
              Sistem Kayıtlı Profil ve Yetkilendirme Bilgileri
            </p>
          </header>

          <div className="bg-white border border-slate-200  shadow-sm overflow-hidden">
            {/* Form Banner */}
            <div className="bg-slate-900 h-2 w-full" />

            <form onSubmit={handleSave} className="p-8 md:p-12 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Ad */}
                <div className="group space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-[11px] uppercase tracking-widest text-slate-500 font-black group-focus-within:text-orange-600 transition-colors"
                  >
                    Ad <span className="text-orange-600">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="border-2 rounded-sm border-slate-100  px-4 focus-visible:ring-4 focus-visible:ring-orange-500/10 focus-visible:border-orange-500 transition-all bg-slate-50/50 h-12 font-bold shadow-none"
                      placeholder="Adınız"
                    />
                  </div>
                </div>

                {/* Soyad */}
                <div className="group space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-[11px] uppercase tracking-widest text-slate-500 font-black group-focus-within:text-orange-600 transition-colors"
                  >
                    Soyad <span className="text-orange-600">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="border-2 rounded-sm border-slate-100  px-4 focus-visible:ring-4 focus-visible:ring-orange-500/10 focus-visible:border-orange-500 transition-all bg-slate-50/50 h-12 font-bold shadow-none"
                    placeholder="Soyadınız"
                  />
                </div>

                {/* E-posta (Statik) */}
                <div className="space-y-2 opacity-80">
                  <Label
                    htmlFor="email"
                    className="text-[11px] uppercase tracking-widest text-slate-400 font-black"
                  >
                    E-Posta (Değiştirilemez)
                  </Label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-3.5 text-slate-300 w-5 h-5" />
                    <Input
                      id="email"
                      value={formData.email}
                      disabled
                      className="border-2 rounded-sm border-slate-100  px-4 bg-slate-100/50 text-slate-400 cursor-not-allowed h-12 font-medium shadow-none"
                    />
                  </div>
                </div>

                {/* Telefon */}
                <div className="group space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-[11px] uppercase tracking-widest text-slate-500 font-black group-focus-within:text-orange-600 transition-colors"
                  >
                    İletişim Hattı
                  </Label>
                  <div className="relative">
                    <div className="absolute left-4 top-3.5 flex items-center gap-2 pr-2 border-r border-slate-200">
                      <Smartphone className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-900 font-bold">
                        +90
                      </span>
                    </div>
                    <Input
                      id="phone"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      className="border-2 rounded-sm border-slate-100  pl-20 pr-4 focus-visible:ring-4 focus-visible:ring-orange-500/10 focus-visible:border-orange-500 transition-all bg-slate-50/50 h-12 font-bold shadow-none"
                      placeholder="5xx xxx xx xx"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-[10px] text-slate-400 font-medium italic max-w-xs text-center md:text-left">
                  * işaretli alanların doldurulması, sipariş ve fatura
                  süreçlerinin güvenliği için zorunludur.
                </p>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-slate-900 rounded-sm hover:bg-orange-600 text-white  px-10 py-6 text-xs tracking-[0.2em] font-black uppercase transition-all duration-300 disabled:opacity-30 active:scale-[0.98] shadow-xl shadow-slate-200 w-full md:w-auto"
                >
                  {saving ? "VERİLER İŞLENİYOR..." : "VERİLERİ GÜNCELLE"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

function PersonalLoadingSkeleton() {
  return (
    <div className="flex min-h-screen bg-white">
      <Skeleton className="w-64 md:w-72 h-screen bg-slate-50" />
      <div className="flex-1 px-16 py-24 space-y-12">
        <Skeleton className="h-12 w-64 bg-slate-100 " />
        <div className="bg-white border border-slate-100 p-12  space-y-10">
          <div className="grid grid-cols-2 gap-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-3 w-20 bg-slate-50" />
                <Skeleton className="h-12 w-full bg-slate-50 " />
              </div>
            ))}
          </div>
          <Skeleton className="h-14 w-48 bg-slate-100  ml-auto" />
        </div>
      </div>
    </div>
  );
}
