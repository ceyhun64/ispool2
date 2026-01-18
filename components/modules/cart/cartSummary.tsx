"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Truck, Lock } from "lucide-react";
import Link from "next/link";

interface CartSummaryProps {
  subtotal: number;
}

export default function CartSummary({ subtotal }: CartSummaryProps) {
  // Hesaplamalar
  const taxRate = 0.1; // %10 KDV
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  // Para birimi formatlayıcı
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(value);
  };

  return (
    <div className="w-full bg-slate-50 p-8 md:p-10 border border-slate-100 flex flex-col gap-10">
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-slate-900">
            SİPARİŞ ÖZETİ
          </h2>
          <span className="text-[10px] font-mono text-slate-400">V.2026</span>
        </div>

        <div className="space-y-5">
          {/* Ara Toplam */}
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-slate-500 font-medium">Ara Toplam</span>
            <span className="text-slate-900 font-bold font-mono">
              {formatCurrency(subtotal)}
            </span>
          </div>

          {/* KDV Tutarı */}
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-slate-500 font-medium">Vergi / KDV (%10)</span>
            <span className="text-slate-900 font-bold font-mono">
              {formatCurrency(taxAmount)}
            </span>
          </div>

          {/* Teslimat */}
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-slate-500 font-medium">
              Lojistik / Teslimat
            </span>
            <span className="text-slate-400 text-[10px] tracking-widest uppercase font-bold">
              Hesaplanıyor
            </span>
          </div>

          {/* Genel Toplam */}
          <div className="pt-8 mt-4 border-t border-slate-200 flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">
                TOPLAM
              </span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                KDV Dahil Net Tutar
              </span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black tracking-tighter text-slate-900 font-mono">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Link href="/checkout" className="block w-full">
          <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-none h-16 text-[11px] tracking-[0.2em] font-bold transition-all duration-500 group relative overflow-hidden">
            <span className="relative z-10 flex items-center justify-center">
              ÖDEME ADIMINA İLERLE
              <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </Link>

        {/* Güvenlik ve Lojistik İkonları */}
        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-4 text-slate-500 group">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center transition-colors group-hover:border-slate-900">
              <Lock size={14} className="text-slate-900" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-wider uppercase font-bold text-slate-900">
                Endüstriyel Güvenlik
              </span>
              <span className="text-[9px] font-medium text-slate-400 uppercase">
                256-Bit SSL Şifreleme Korunuyor
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-500 group">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center transition-colors group-hover:border-slate-900">
              <Truck size={14} className="text-slate-900" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-wider uppercase font-bold text-slate-900">
                Lojistik Partneri
              </span>
              <span className="text-[9px] font-medium text-slate-400 uppercase">
                Sigortalı ve Hızlı Sevkiyat
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
