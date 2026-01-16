"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
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
    <div className="w-full bg-slate-50/50 p-8 md:p-10 border border-slate-100 flex flex-col gap-8">
      <div className="space-y-6">
        <h2 className="text-xs font-medium tracking-[0.2em] uppercase text-slate-400 border-b border-slate-100 pb-4">
          Sipariş Özeti
        </h2>

        <div className="space-y-4">
          {/* Ara Toplam */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-light">Ara Toplam</span>
            <span className="text-slate-900 font-medium">
              {formatCurrency(subtotal)}
            </span>
          </div>

          {/* KDV Tutarı */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-light">KDV (%10)</span>
            <span className="text-slate-900 font-medium">
              {formatCurrency(taxAmount)}
            </span>
          </div>

          {/* Teslimat */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-light">Teslimat</span>
            <span className="text-slate-400 text-[11px] tracking-tight uppercase">
              Ödeme adımında hesaplanır
            </span>
          </div>

          {/* Genel Toplam */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-baseline">
            <span className="text-base font-light text-slate-900">Toplam</span>
            <div className="text-right">
              <span className="text-2xl font-medium tracking-tight text-slate-950">
                {formatCurrency(total)}
              </span>
              <p className="text-[10px] text-slate-400 mt-1 font-light">
                KDV Dahil Toplam Tutar
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Link href="/checkout" className="block w-full">
          <Button className="w-full bg-slate-950 hover:bg-slate-800 text-white rounded-none h-14 text-xs tracking-[0.15em] font-light transition-all duration-300 group">
            ÖDEMEYİ TAMAMLA
            <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>

        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center gap-3 text-slate-400">
            <ShieldCheck size={14} strokeWidth={1} />
            <span className="text-[10px] tracking-wide uppercase font-light">
              Güvenli Ödeme Altyapısı
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <Truck size={14} strokeWidth={1} />
            <span className="text-[10px] tracking-wide uppercase font-light">
              Ücretsiz Sigortalı Gönderim
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
