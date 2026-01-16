"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Cities from "@/public/city.json";
import { toast } from "sonner";
import { MapPin, ShieldCheck, Truck, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AddressFormData {
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

export interface AddressFormProps {
  formData: AddressFormData;
  setFormData: React.Dispatch<React.SetStateAction<AddressFormData>>;
  onSave: () => void;
}

// Endüstriyel Modern Stil Tanımlaması
const inputStyles =
  "border-2 border-slate-100  px-4 focus-visible:ring-4 focus-visible:ring-orange-500/10 focus-visible:border-orange-500 transition-all bg-slate-50/50 h-12 font-bold shadow-none w-full placeholder:text-slate-300 text-sm";

export default function AdresForm({
  formData,
  setFormData,
  onSave,
}: AddressFormProps) {
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    const cityArray = Object.entries(Cities).map(([id, name]) => ({
      id,
      name,
    }));
    setCities(cityArray);
  }, []);

  useEffect(() => {
    if (!formData.city) return;
    const selectedCityId = cities.find((c) => c.name === formData.city)?.id;
    if (!selectedCityId) return;

    fetch(`/api/location/ilceler/${selectedCityId}`)
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch(console.error);
  }, [formData.city, cities]);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneClean = formData.phone?.replace(/\D/g, "");

    if (!formData.title || formData.title.length < 2) {
      toast.error("Lütfen geçerli bir adres başlığı giriniz.");
      return false;
    }
    if (!formData.firstName || formData.firstName.length < 2) {
      toast.error("Lütfen geçerli bir isim giriniz.");
      return false;
    }
    if (!formData.lastName || formData.lastName.length < 2) {
      toast.error("Lütfen geçerli bir soyisim giriniz.");
      return false;
    }
    if (!formData.email || !emailRegex.test(formData.email)) {
      toast.error("Lütfen geçerli bir e-posta adresi giriniz.");
      return false;
    }
    if (!phoneClean || (phoneClean.length !== 10 && phoneClean.length !== 11)) {
      toast.error("Telefon numarası 10 veya 11 hane olmalıdır.");
      return false;
    }
    if (!formData.city) {
      toast.error("Lütfen bir şehir seçiniz.");
      return false;
    }
    if (!formData.district) {
      toast.error("Lütfen bir ilçe seçiniz.");
      return false;
    }
    if (!formData.tcno || formData.tcno.length !== 11) {
      toast.error("TC Kimlik Numarası 11 hane olmalıdır.");
      return false;
    }
    if (!formData.zip || formData.zip.length < 5) {
      toast.error("Lütfen geçerli bir posta kodu giriniz.");
      return false;
    }
    if (!formData.address || formData.address.length < 10) {
      toast.error(
        "Adres detayı çok kısa. Lütfen daha açıklayıcı bir adres giriniz."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave();
    }
  };

  return (
    <form className="space-y-10" onSubmit={handleSubmit}>
      {/* Üst Bilgilendirme Bannerı */}
      <div className="flex items-center gap-4 p-4 bg-orange-50 border border-orange-100  mb-8">
        <div className="bg-orange-500 p-2  text-white">
          <Truck size={20} />
        </div>
        <div>
          <h4 className="text-[11px] font-black uppercase tracking-wider text-orange-950">
            Sevkiyat Bilgileri
          </h4>
          <p className="text-[10px] text-orange-700/80 font-medium">
            Lütfen iş elbiselerinizin teslim edileceği güncel adresi giriniz.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Adres Başlığı - Full Width */}
        <div className="space-y-2 md:col-span-2 group">
          <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-black flex items-center gap-2 group-focus-within:text-orange-600 transition-colors">
            <ClipboardList size={14} /> Adres Başlığı *
          </Label>
          <Input
            className={inputStyles}
            placeholder="Örn: Merkez Ofis, Şantiye, Depo..."
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        {/* Ad & Soyad */}
        <div className="space-y-2 group">
          <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-black group-focus-within:text-orange-600 transition-colors">
            Ad *
          </Label>
          <Input
            className={inputStyles}
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
        </div>
        <div className="space-y-2 group">
          <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-black group-focus-within:text-orange-600 transition-colors">
            Soyad *
          </Label>
          <Input
            className={inputStyles}
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </div>

        {/* Email & Telefon */}
        <div className="space-y-2 group">
          <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-black group-focus-within:text-orange-600 transition-colors">
            E-Posta *
          </Label>
          <Input
            type="email"
            className={inputStyles}
            placeholder="ornek@alanadi.com"
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div className="space-y-2 group">
          <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-black group-focus-within:text-orange-600 transition-colors">
            Telefon *
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-xs text-slate-400 font-bold border-r pr-2 border-slate-200">
              +90
            </span>
            <Input
              className={cn(inputStyles, "pl-14")}
              placeholder="5XXXXXXXXX"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
            />
          </div>
        </div>

        {/* Şehir & İlçe */}
        <div className="space-y-2 group">
          <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-black group-focus-within:text-orange-600 transition-colors">
            Şehir *
          </Label>
          <Select
            value={cities.find((c) => c.name === formData.city)?.id || ""}
            onValueChange={(value) => {
              const selectedCity = cities.find((c) => c.id === value);
              setFormData((prev) => ({
                ...prev,
                city: selectedCity?.name || "",
                district: "",
                neighborhood: "",
              }));
            }}
          >
            <SelectTrigger className="border-2 border-slate-100  px-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all bg-slate-50/50 h-12 font-bold shadow-none">
              <SelectValue placeholder="Şehir Seçiniz" />
            </SelectTrigger>
            <SelectContent className=" border-slate-200">
              {cities.map((c) => (
                <SelectItem
                  key={c.id}
                  value={c.id}
                  className="text-xs font-bold focus:bg-orange-50 focus:text-orange-700"
                >
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 group">
          <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-black group-focus-within:text-orange-600 transition-colors">
            İlçe *
          </Label>
          <Select
            value={
              districts
                .find((d) => d.name === formData.district)
                ?.id.toString() || ""
            }
            onValueChange={(value) => {
              const selectedDistrict = districts.find(
                (d) => d.id.toString() === value
              );
              setFormData((prev) => ({
                ...prev,
                district: selectedDistrict?.name || "",
                neighborhood: "",
              }));
            }}
            disabled={!formData.city}
          >
            <SelectTrigger className="border-2 border-slate-100  px-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all bg-slate-50/50 h-12 font-bold shadow-none disabled:opacity-40">
              <SelectValue placeholder="İlçe Seçiniz" />
            </SelectTrigger>
            <SelectContent className=" border-slate-200">
              {districts.map((d) => (
                <SelectItem
                  key={d.id}
                  value={d.id.toString()}
                  className="text-xs font-bold focus:bg-orange-50 focus:text-orange-700"
                >
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* TC No & Posta Kodu */}
        <div className="space-y-2 group">
          <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-black group-focus-within:text-orange-600 transition-colors">
            TC Kimlik No *
          </Label>
          <div className="relative">
            <ShieldCheck
              size={16}
              className="absolute right-4 top-3.5 text-slate-300"
            />
            <Input
              maxLength={11}
              className={inputStyles}
              value={formData.tcno || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tcno: e.target.value.replace(/\D/g, ""),
                })
              }
            />
          </div>
        </div>
        <div className="space-y-2 group">
          <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-black group-focus-within:text-orange-600 transition-colors">
            Posta Kodu *
          </Label>
          <Input
            maxLength={5}
            className={inputStyles}
            value={formData.zip || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                zip: e.target.value.replace(/\D/g, ""),
              })
            }
          />
        </div>

        {/* Detaylı Adres - Full Width */}
        <div className="space-y-2 md:col-span-2 group">
          <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-black group-focus-within:text-orange-600 transition-colors flex items-center gap-2">
            <MapPin size={14} /> Adres Detayı *
          </Label>
          <textarea
            className={cn(inputStyles, "h-24 py-3 resize-none")}
            placeholder="Mahalle, Sokak, No, Daire, Varsa Şantiye Kodu..."
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>
      </div>

      <div className="pt-8 border-t border-slate-100">
        <Button
          type="submit"
          className="w-full md:w-auto bg-slate-900 hover:bg-orange-600 text-white  px-12 py-7 text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-300 shadow-xl shadow-slate-200 active:scale-95"
        >
          ADRESİ SİSTEME KAYDET
        </Button>
      </div>
    </form>
  );
}

