"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import AdresForm, {
  AddressFormData,
} from "@/components/modules/profile/addressForm";
import { Spinner } from "@/components/ui/spinner";
import {
  MapPin,
  Plus,
  CheckCircle2,
  Home,
  Building2,
  User,
  Phone,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

interface Address {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  address: string;
  district: string;
  city: string;
  neighborhood?: string | null;
  zip?: string;
  phone?: string;
  country?: string;
  tcno?: string;
}

interface StepAddressProps {
  addresses: Address[];
  selectedAddress: number | null;
  onSelectAddress: (id: number) => void;
  onNext: () => void;
  newAddressForm: AddressFormData & { email?: string };
  setNewAddressForm: React.Dispatch<
    React.SetStateAction<AddressFormData & { email?: string }>
  >;
  onSaveAddress: () => void;
  isAddingNewAddress: boolean;
  setIsAddingNewAddress: (v: boolean) => void;
  isSavingAddress: boolean;
}

export default function StepAddress({
  addresses,
  selectedAddress,
  onSelectAddress,
  onNext,
  newAddressForm,
  setNewAddressForm,
  onSaveAddress,
  isAddingNewAddress,
  setIsAddingNewAddress,
  isSavingAddress,
}: StepAddressProps) {
  const selected = addresses?.find((a) => a.id === selectedAddress);

  if (!addresses || !Array.isArray(addresses)) {
    return (
      <div className="flex justify-center p-20">
        <Spinner />
      </div>
    );
  }

  const getAddressIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("ev") || lowerTitle.includes("home"))
      return <Home className="w-4 h-4 text-slate-900" />;
    if (
      lowerTitle.includes("iş") ||
      lowerTitle.includes("ofis") ||
      lowerTitle.includes("work")
    )
      return <Building2 className="w-4 h-4 text-slate-900" />;
    return <MapPin className="w-4 h-4 text-slate-900" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* İnce Bilgilendirme */}
      <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full w-fit mx-auto sm:mx-0">
        <MapPin className="w-3.5 h-3.5 text-slate-400" />
        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">
          Teslimat Adresi Seçimi
        </p>
      </div>

      <Card className="border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white">
        <CardHeader className="pb-6 border-b border-slate-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold tracking-tight text-slate-950">
                Teslimat Bilgileri
              </CardTitle>
              <CardDescription className="text-xs">
                Siparişinizin ulaştırılacağı adresi belirleyin.
              </CardDescription>
            </div>
            {!isAddingNewAddress && addresses.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-full px-4 border-slate-200 text-xs font-bold uppercase tracking-tighter"
                onClick={() => {
                  setIsAddingNewAddress(true);
                  onSelectAddress(0);
                }}
              >
                <Plus className="w-3 h-3 mr-2" /> Yeni Ekle
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-8 space-y-8">
          {/* Adres Listesi - Grid Görünümü */}
          {addresses.length > 0 && !isAddingNewAddress && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    onSelectAddress(addr.id);
                    setIsAddingNewAddress(false);
                  }}
                  className={`
                    relative p-5 border rounded-2xl cursor-pointer transition-all duration-300
                    ${
                      selectedAddress === addr.id
                        ? "border-slate-950 bg-slate-50/50 shadow-lg shadow-slate-200/50"
                        : "border-slate-100 hover:border-slate-300 bg-white"
                    }
                  `}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`p-2 rounded-xl ${
                        selectedAddress === addr.id ? "bg-white" : "bg-slate-50"
                      }`}
                    >
                      {getAddressIcon(addr.title)}
                    </div>
                    {selectedAddress === addr.id && (
                      <CheckCircle2 className="w-5 h-5 text-slate-950" />
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-slate-950 mb-3 uppercase tracking-tight">
                    {addr.title}
                  </h4>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User className="w-3.5 h-3.5 text-slate-300" />
                      <span className="font-medium">
                        {addr.firstName} {addr.lastName}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-slate-300 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">
                        {addr.address}, {addr.district}/{addr.city}
                      </span>
                    </div>
                    {addr.phone && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-slate-300" />
                        <span>{addr.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hızlı Seçim Dropdown - Minimal */}
          {addresses.length > 0 && !isAddingNewAddress && (
            <div className="max-w-xs">
              <Label className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 block">
                Veya listeden seçin
              </Label>
              <Select
                value={selectedAddress?.toString() || ""}
                onValueChange={(val) => onSelectAddress(Number(val))}
              >
                <SelectTrigger className="rounded-full border-slate-100 bg-slate-50/50 h-10 text-xs">
                  <SelectValue placeholder="Adres Seçin" />
                </SelectTrigger>
                <SelectContent>
                  {addresses.map((addr) => (
                    <SelectItem
                      key={addr.id}
                      value={addr.id.toString()}
                      className="text-xs"
                    >
                      {addr.title} - {addr.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Boş Durum */}
          {addresses.length === 0 && !isAddingNewAddress && (
            <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50/30">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <MapPin className="w-5 h-5 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-950 mb-1">
                Kayıtlı Adres Bulunamadı
              </p>
              <p className="text-xs text-slate-400 mb-6">
                Devam etmek için bir teslimat adresi tanımlamalısınız.
              </p>
              <Button
                onClick={() => setIsAddingNewAddress(true)}
                className="rounded-full bg-slate-950 px-6 h-10 text-xs uppercase tracking-widest font-bold"
              >
                <Plus className="w-4 h-4 mr-2" /> Adres Tanımla
              </Button>
            </div>
          )}

          {/* Form Alanı */}
          {isAddingNewAddress && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-950">
                  Yeni Adres Detayları
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingNewAddress(false)}
                  className="text-slate-400 text-xs"
                >
                  ← Listeye Dön
                </Button>
              </div>
              <div className="p-8 border border-slate-100 rounded-3xl bg-slate-50/30">
                <AdresForm
                  formData={newAddressForm}
                  setFormData={setNewAddressForm}
                  onSave={onSaveAddress}
                />
              </div>
              <Button
                onClick={onSaveAddress}
                disabled={isSavingAddress}
                className="w-full h-14 bg-slate-950 rounded-2xl text-sm font-bold shadow-xl shadow-slate-200"
              >
                {isSavingAddress ? (
                  <Spinner />
                ) : (
                  <span className="flex items-center gap-2">
                    Adresi Kaydet ve Devam Et{" "}
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
          )}
        </CardContent>

        {/* Footer Butonu */}
        {!isAddingNewAddress && (
          <CardFooter className="p-8 bg-slate-50/50 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  selectedAddress
                    ? "bg-green-500 animate-pulse"
                    : "bg-slate-300"
                }`}
              />
              <p className="text-xs font-medium text-slate-500">
                {selectedAddress
                  ? "Adres doğrulandı, ödeme aşamasına geçilebilir."
                  : "Lütfen ilerlemek için bir adres seçin."}
              </p>
            </div>
            <Button
              onClick={onNext}
              disabled={!selectedAddress || isSavingAddress}
              size="lg"
              className="w-full sm:w-auto px-10 h-14 bg-slate-950 hover:bg-slate-800 rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
            >
              Ödeme Bilgilerine Geç <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Alt Bilgilendirme - Minimalist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-4">
        {[
          "Hızlı teslimat adresi",
          "Güvenli paketleme",
          "Kolay adres yönetimi",
        ].map((text, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-xs text-slate-400"
          >
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
