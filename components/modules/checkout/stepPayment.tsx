"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Lock,
  CreditCard,
  Calendar,
  Shield,
  Receipt,
  CheckCircle2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepPaymentCardProps {
  holderName: string;
  setHolderName: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  formattedCardNumber: string;
  expireMonth: string;
  setExpireMonth: (value: string) => void;
  expireYear: string;
  setExpireYear: (value: string) => void;
  cvc: string;
  setCvc: (value: string) => void;
  handlePayment: () => Promise<void>;
  totalPrice: number;
  setStep: (step: number) => void;
  isProcessing?: boolean;
  selectedInstallment: number;
  setSelectedInstallment: (value: number) => void;
}

const installmentOptions = [
  { label: "Tek Çekim", count: 1, rate: 0 },
  { label: "2 Taksit", count: 2, rate: 3.5 },
  { label: "3 Taksit", count: 3, rate: 5.2 },
  { label: "6 Taksit", count: 6, rate: 9.8 },
  { label: "9 Taksit", count: 9, rate: 13.5 },
  { label: "12 Taksit", count: 12, rate: 17.0 },
];

export default function StepPaymentCard({
  holderName,
  setHolderName,
  cardNumber,
  setCardNumber,
  expireMonth,
  setExpireMonth,
  expireYear,
  setExpireYear,
  cvc,
  setCvc,
  handlePayment,
  totalPrice,
  setStep,
  isProcessing: externalProcessing,
  selectedInstallment,
  setSelectedInstallment,
}: StepPaymentCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const processing = externalProcessing || isProcessing;

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
  };

  const getCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    return "unknown";
  };

  const cardType = getCardType(cardNumber);

  const installmentCalculation = useMemo(() => {
    const selectedOption = installmentOptions.find(
      (opt) => opt.count === selectedInstallment
    );
    if (!selectedOption)
      return {
        total: totalPrice,
        monthly: totalPrice,
        interestAmount: 0,
        rate: 0,
      };
    const interestAmount = totalPrice * (selectedOption.rate / 100);
    const total = totalPrice + interestAmount;
    return {
      total: parseFloat(total.toFixed(2)),
      monthly: parseFloat((total / selectedOption.count).toFixed(2)),
      interestAmount: parseFloat(interestAmount.toFixed(2)),
      rate: selectedOption.rate,
    };
  }, [selectedInstallment, totalPrice]);

  const validateCardNumber = (num: string) =>
    num.replace(/\s/g, "").length === 16;
  const validateExpiry = (m: string, y: string) => {
    if (!m || !y) return false;
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    const mNum = parseInt(m);
    const yNum = parseInt(y);
    return yNum > currentYear || (yNum === currentYear && mNum >= currentMonth);
  };
  const validateCVC = (v: string) => v.length === 3;

  const isFormValid =
    holderName.trim().length >= 3 &&
    validateCardNumber(cardNumber) &&
    validateExpiry(expireMonth, expireYear) &&
    validateCVC(cvc);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Visual Card Preview - Minimalist Style */}
      <div className="relative h-48 w-full bg-slate-900 rounded-2xl p-6 text-white shadow-2xl overflow-hidden group border border-white/10">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
          <CreditCard size={120} />
        </div>
        <div className="relative h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-12 h-8 bg-slate-700/50 rounded-md" />
            <div className="h-6 uppercase tracking-widest text-[10px] font-medium opacity-50">
              Secure Payment
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xl tracking-[0.25em] font-mono">
              {formatCardNumber(cardNumber) || "•••• •••• •••• ••••"}
            </div>
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <div className="text-[10px] uppercase opacity-40 tracking-tighter">
                  Card Holder
                </div>
                <div className="text-sm tracking-wide truncate max-w-[180px]">
                  {holderName || "AD SOYAD"}
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-[10px] uppercase opacity-40 tracking-tighter">
                  Expires
                </div>
                <div className="text-sm font-mono">
                  {expireMonth || "MM"}/{expireYear || "YY"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Side: Form */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="holderName"
                className="text-xs uppercase tracking-widest text-slate-500"
              >
                Kart Sahibi
              </Label>
              <Input
                id="holderName"
                placeholder="AD SOYAD"
                value={holderName}
                disabled={processing}
                className="border-slate-200 focus:border-slate-900 focus:ring-0 rounded-none border-t-0 border-x-0 px-0 h-10 transition-all"
                onChange={(e) => setHolderName(e.target.value.toUpperCase())}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="cardNumber"
                className="text-xs uppercase tracking-widest text-slate-500"
              >
                Kart Numarası
              </Label>
              <Input
                id="cardNumber"
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                value={formatCardNumber(cardNumber)}
                disabled={processing}
                className="border-slate-200 focus:border-slate-900 focus:ring-0 rounded-none border-t-0 border-x-0 px-0 h-10 transition-all font-mono"
                onChange={(e) =>
                  setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-slate-500">
                  Son Kullanma
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="AA"
                    maxLength={2}
                    value={expireMonth}
                    className="border-slate-200 focus:border-slate-900 focus:ring-0 rounded-none border-t-0 border-x-0 px-0 h-10 transition-all text-center w-full"
                    onChange={(e) =>
                      setExpireMonth(e.target.value.replace(/\D/g, ""))
                    }
                  />
                  <span className="text-slate-300">/</span>
                  <Input
                    placeholder="YY"
                    maxLength={2}
                    value={expireYear}
                    className="border-slate-200 focus:border-slate-900 focus:ring-0 rounded-none border-t-0 border-x-0 px-0 h-10 transition-all text-center w-full"
                    onChange={(e) =>
                      setExpireYear(e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="cvc"
                  className="text-xs uppercase tracking-widest text-slate-500"
                >
                  CVC
                </Label>
                <Input
                  id="cvc"
                  type="password"
                  placeholder="•••"
                  maxLength={3}
                  value={cvc}
                  className="border-slate-200 focus:border-slate-900 focus:ring-0 rounded-none border-t-0 border-x-0 px-0 h-10 transition-all text-center tracking-widest"
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Summary & Installments */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl space-y-4">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-widest text-slate-400">
                Taksit Seçimi
              </Label>
              <Select
                value={selectedInstallment.toString()}
                onValueChange={(value) => setSelectedInstallment(Number(value))}
                disabled={processing}
              >
                <SelectTrigger className="bg-transparent border-none shadow-none p-0 h-auto focus:ring-0 text-slate-900 font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  {installmentOptions.map((opt) => (
                    <SelectItem
                      key={opt.count}
                      value={opt.count.toString()}
                      className="py-3 px-4 focus:bg-slate-50"
                    >
                      <div className="flex justify-between items-center w-full min-w-[200px]">
                        <span>{opt.label}</span>
                        <span className="text-xs text-slate-400">
                          %{opt.rate} vade
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-200/60">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Ara Toplam</span>
                <span>₺{totalPrice.toFixed(2)}</span>
              </div>
              {selectedInstallment > 1 && (
                <div className="flex justify-between text-xs text-orange-600/80 font-medium">
                  <span>Vade Farkı (%{installmentCalculation.rate})</span>
                  <span>
                    +₺{installmentCalculation.interestAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-end pt-2">
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-tighter">
                  Toplam
                </span>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  ₺{installmentCalculation.total.toFixed(2)}
                </span>
              </div>
              {selectedInstallment > 1 && (
                <p className="text-[10px] text-slate-400 text-right italic font-light">
                  {selectedInstallment} taksit x ₺
                  {installmentCalculation.monthly.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={async () => {
                if (isFormValid && !processing) {
                  setIsProcessing(true);
                  try {
                    await handlePayment();
                  } finally {
                    setIsProcessing(false);
                  }
                }
              }}
              disabled={!isFormValid || processing}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
              {processing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" /> Ödemeyi Tamamla
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setStep(1)}
              disabled={processing}
              className="text-slate-400 text-xs hover:text-slate-900 transition-colors"
            >
              ← Bilgileri Güncelle
            </Button>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-500 pt-4">
        <div className="flex items-center gap-1.5 grayscale">
          <img src="/cards/visa.svg" alt="Visa" className="h-4" />
          <img src="/cards/mastercard.svg" alt="Mastercard" className="h-4" />
        </div>
        <div className="h-4 w-[1px] bg-slate-300" />
        <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-tight uppercase">
          <Shield size={12} /> SSL SECURE
        </div>
      </div>
    </div>
  );
}
