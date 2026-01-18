"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, ExternalLink } from "lucide-react";

const bankAccounts = [
  {
    bankName: "Yapı Kredi",
    logo: "/banks/yapikredi.png", // Buraya kendi logo yolunuzu ekleyin
    recipient: "İşPool Tekstil Üretim Paz. San. Tic. A.Ş.",
    branchName: "ÜMRANİYE TİCARİ",
    branchCode: "740",
    iban: "TR51 0006 7010 0000 0033 3335 21",
  },
  {
    bankName: "Garanti",
    logo: "/banks/garanti.png",
    recipient: "İşPool Tekstil Üretim Paz. San. Tic. A.Ş.",
    branchName: "ATAŞEHİR",
    branchCode: "1676",
    iban: "TR 8200 0620 0167 6000 0629 4604",
  },
  {
    bankName: "Ziraat Bankası",
    logo: "/banks/ziraat.png",
    recipient: "İşPool Tekstil Üretim Paz. San. Tic. A.Ş.",
    branchName: "VELİ BABA - PENDİK",
    branchCode: "2508",
    iban: "TR49 0001 0025 0862 2986 4250 01",
  },
];

export default function BankAccounts() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
        {/* Başlık Alanı */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Banka Hesap Bilgileri
          </h1>
          <div className="h-1 w-20 bg-orange-600 rounded-full"></div>
        </div>

        {/* Banka Kartları Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bankAccounts.map((account, index) => (
            <div
              key={index}
              className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Turuncu Üst Şerit ve Ok İşareti */}
              <div className="h-2 bg-orange-600 w-full relative">
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-orange-600"></div>
              </div>

              <div className="p-8 pt-10 flex-grow flex flex-col items-center text-center">
                {/* Banka Logosu (Placeholder) */}
                <div className="h-16 w-full relative mb-6 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                  <span className="text-2xl font-black text-slate-700 italic">
                    {account.bankName}
                  </span>
                  {/* Gerçek logolar için: <Image src={account.logo} alt={account.bankName} fill className="object-contain" /> */}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-6">
                  {account.bankName}
                </h3>

                {/* Detaylar */}
                <div className="space-y-3 text-[13px] text-slate-600 mb-8 w-full">
                  <p>
                    <span className="font-bold text-slate-900">Alıcı:</span>{" "}
                    {account.recipient}
                  </p>
                  <p>
                    <span className="font-bold text-slate-900">Şube Adı:</span>{" "}
                    {account.branchName}
                  </p>
                  <p>
                    <span className="font-bold text-slate-900">Şube Kodu:</span>{" "}
                    {account.branchCode}
                  </p>
                  <p className="text-orange-600 font-bold text-[15px] mt-4 tracking-tight">
                    {account.iban}
                  </p>
                </div>

                {/* Buton */}
                <Link
                  href="/payment/transfer-form"
                  className="mt-auto w-full py-3 px-6 border border-gray-200 rounded-lg text-orange-600 font-bold text-sm hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  Ödeme Bildir
                  <ExternalLink size={14} />
                </Link>
              </div>

              {/* Alt Dekoratif Çizgi */}
              <div className="h-1.5 bg-orange-600/10 w-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp Destek Hattı (Görseldeki gibi sağ altta) */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/905462255659"
          target="_blank"
          className="flex items-center gap-3 bg-white p-2 pr-4 rounded-full shadow-lg border border-green-500 hover:scale-105 transition-transform"
        >
          <div className="bg-green-500 p-2 rounded-full text-white">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-4.7 8.38 8.38 0 0 1 3.8.9L21 3.5z"></path>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-green-600 leading-none">
              Whatsapp
            </span>
            <span className="text-[11px] font-black text-slate-800">
              Destek Hattı
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}
