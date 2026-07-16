"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Cities from "@/public/city.json";
import { Building2, ShieldCheck, FileText, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export type BillingType = "bireysel" | "kurumsal";

export interface BillingFormData {
  differentBilling: boolean;
  billingType: BillingType;
  fullName: string;
  identityNumber: string;
  city: string;
  district: string;
  address: string;
}

export const initialBillingForm: BillingFormData = {
  differentBilling: false,
  billingType: "bireysel",
  fullName: "",
  identityNumber: "",
  city: "",
  district: "",
  address: "",
};

export function isBillingFormValid(formData: BillingFormData): boolean {
  if (!formData.differentBilling) return true;
  const requiredIdLength = formData.billingType === "kurumsal" ? 10 : 11;
  return (
    formData.fullName.trim().length >= 2 &&
    formData.identityNumber.length === requiredIdLength &&
    !!formData.city &&
    !!formData.district &&
    formData.address.trim().length >= 10
  );
}

interface BillingFormProps {
  formData: BillingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BillingFormData>>;
}

const inputStyles =
  "border-2 border-slate-100 rounded-sm px-4 focus-visible:ring-4 focus-visible:ring-orange-500/10 focus-visible:border-orange-500 transition-all bg-slate-50/50 h-12 font-bold shadow-none w-full placeholder:text-slate-300 text-sm";

export default function BillingForm({ formData, setFormData }: BillingFormProps) {
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    const cityArray = Object.entries(Cities).map(([id, name]) => ({
      id,
      name: name as string,
    }));
    setCities(cityArray);
  }, []);

  useEffect(() => {
    if (!formData.city) {
      setDistricts([]);
      return;
    }
    const selectedCityId = cities.find((c) => c.name === formData.city)?.id;
    if (!selectedCityId) return;

    fetch(`/api/location/ilceler/${selectedCityId}`)
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch(console.error);
  }, [formData.city, cities]);

  const isCorporate = formData.billingType === "kurumsal";

  return (
    <div className="space-y-6">
      <label className="flex items-start gap-3 p-4 border-2 border-slate-100 rounded-sm bg-slate-50/50 cursor-pointer hover:border-orange-200 transition-colors">
        <Checkbox
          checked={formData.differentBilling}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({
              ...prev,
              differentBilling: checked === true,
            }))
          }
          className="mt-0.5 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
        />
        <div>
          <p className="text-sm font-black text-slate-900">
            Fatura bilgilerimi farklı girmek istiyorum
          </p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Faturanız teslimat adresinizden farklı bir kişi/firma adına
            kesilecekse işaretleyin.
          </p>
        </div>
      </label>

      {formData.differentBilling && (
        <div className="space-y-6 p-6 border-2 border-dashed border-orange-100 rounded-sm bg-orange-50/20 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-4 p-4 bg-orange-50 border border-orange-100">
            <div className="bg-orange-500 p-2 text-white">
              <Building2 size={20} />
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-orange-950">
                Fatura Bilgileri
              </h4>
              <p className="text-[10px] text-orange-700/80 font-medium">
                Faturanızın düzenleneceği bilgileri giriniz.
              </p>
            </div>
          </div>

          <RadioGroup
            value={formData.billingType}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                billingType: value as BillingType,
                identityNumber: "",
              }))
            }
            className="grid grid-cols-2 gap-4"
          >
            <label
              className={cn(
                "flex items-center gap-3 p-4 border-2 rounded-sm cursor-pointer transition-all",
                !isCorporate
                  ? "border-orange-500 bg-white"
                  : "border-slate-100 bg-slate-50/50"
              )}
            >
              <RadioGroupItem value="bireysel" />
              <span className="text-xs font-black uppercase tracking-wide text-slate-800">
                Bireysel
              </span>
            </label>
            <label
              className={cn(
                "flex items-center gap-3 p-4 border-2 rounded-sm cursor-pointer transition-all",
                isCorporate
                  ? "border-orange-500 bg-white"
                  : "border-slate-100 bg-slate-50/50"
              )}
            >
              <RadioGroupItem value="kurumsal" />
              <span className="text-xs font-black uppercase tracking-wide text-slate-800">
                Kurumsal
              </span>
            </label>
          </RadioGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Ünvan / Ad Soyad - Full Width */}
            <div className="space-y-2 md:col-span-2 group">
              <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-black group-focus-within:text-orange-600 transition-colors">
                {isCorporate ? "Ünvan *" : "Ünvan / Ad Soyad *"}
              </Label>
              <Input
                className={inputStyles}
                placeholder={isCorporate ? "Firma Ünvanı" : "Ad Soyad"}
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
              />
            </div>

            {/* TC Kimlik No / Vergi Numarası - Full Width */}
            <div className="space-y-2 md:col-span-2 group">
              <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-black group-focus-within:text-orange-600 transition-colors">
                {isCorporate ? "Vergi Numarası *" : "TC Kimlik Numarası *"}
              </Label>
              <div className="relative">
                {isCorporate ? (
                  <FileText
                    size={16}
                    className="absolute right-4 top-3.5 text-slate-300"
                  />
                ) : (
                  <ShieldCheck
                    size={16}
                    className="absolute right-4 top-3.5 text-slate-300"
                  />
                )}
                <Input
                  maxLength={isCorporate ? 10 : 11}
                  className={inputStyles}
                  placeholder={
                    isCorporate ? "10 haneli vergi numarası" : "11 haneli TC kimlik no"
                  }
                  value={formData.identityNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      identityNumber: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                />
              </div>
            </div>

            {/* İl & İlçe */}
            <div className="space-y-2 group">
              <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-black group-focus-within:text-orange-600 transition-colors">
                İl *
              </Label>
              <Select
                value={cities.find((c) => c.name === formData.city)?.id || ""}
                onValueChange={(value) => {
                  const selectedCity = cities.find((c) => c.id === value);
                  setFormData((prev) => ({
                    ...prev,
                    city: selectedCity?.name || "",
                    district: "",
                  }));
                }}
              >
                <SelectTrigger className="border-2 border-slate-100 w-full rounded-sm px-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all bg-slate-50/50 font-bold shadow-none">
                  <SelectValue placeholder="İl Seçiniz" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 rounded-sm">
                  {cities.map((c) => (
                    <SelectItem
                      key={c.id}
                      value={c.id}
                      className="text-xs font-bold focus:bg-orange-50 focus:text-orange-700 rounded-sm"
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
                  }));
                }}
                disabled={!formData.city}
              >
                <SelectTrigger className="border-2 w-full rounded-sm border-slate-100 px-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all bg-slate-50/50 font-bold shadow-none disabled:opacity-40">
                  <SelectValue placeholder="İlçe Seçiniz" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 rounded-sm">
                  {districts.map((d) => (
                    <SelectItem
                      key={d.id}
                      value={d.id.toString()}
                      className="text-xs font-bold focus:bg-orange-50 focus:text-orange-700 rounded-sm"
                    >
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Adres - Full Width */}
            <div className="space-y-2 md:col-span-2 group">
              <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-black group-focus-within:text-orange-600 transition-colors flex items-center gap-2">
                <MapPin size={14} /> Adres *
              </Label>
              <textarea
                className={cn(inputStyles, "h-24 py-3 resize-none")}
                placeholder="Fatura adresinizi giriniz..."
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
