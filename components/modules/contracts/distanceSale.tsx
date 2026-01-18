"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  FileText,
  ShieldAlert,
  BadgeCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DistanceSalesContract() {
  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans selection:bg-orange-100">
      {/* Üst Dekoratif Şerit */}
      <div className="h-2 w-full bg-slate-950 flex">
        <div className="h-full w-1/3 bg-orange-600" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* --- HEADER: RESMİ DOKÜMAN GÖRÜNÜMÜ --- */}
        <header className="relative border-b-2 border-slate-950 pb-12 mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="bg-slate-950 p-2 text-white">
                  <FileText size={20} />
                </div>
                <span className="text-[10px] tracking-[0.5em] text-slate-500 uppercase font-black">
                  Legal Documentation / v2.0
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-none tracking-tighter uppercase">
                Mesafeli Satış <br />
                <span className="text-orange-600">Sözleşmesi</span>
              </h1>
            </motion.div>

            <div className="text-left md:text-right space-y-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Referans Kod: PRO-SEC/2026-01
              </p>
              <p className="text-[10px] text-slate-900 font-black uppercase tracking-widest bg-orange-100 px-2 py-1 inline-block">
                Son Güncelleme: 06 Ocak 2026
              </p>
            </div>
          </div>

          {/* Köşe İşareti */}
          <div className="absolute -bottom-[2px] right-0 w-24 h-[2px] bg-orange-600" />
        </header>

        {/* --- SÖZLEŞME GÖVDESİ --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sol Navigasyon / Hızlı Bakış (Sticky) */}
          <aside className="hidden lg:block lg:col-span-3 h-fit sticky top-10 space-y-8">
            <div className="p-6 bg-white border border-slate-200 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <BadgeCheck size={14} className="text-orange-600" />
                Güvenli İşlem
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Bu sözleşme 6502 sayılı kanun uyarınca iş güvenliği
                standartlarına uygun olarak hazırlanmıştır.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <div
                  key={num}
                  className="text-[10px] font-bold text-slate-400 hover:text-orange-600 cursor-pointer transition-colors uppercase tracking-widest"
                >
                  Madde {num}.
                </div>
              ))}
            </div>
          </aside>

          {/* Ana Metin Alanı */}
          <div className="lg:col-span-9 space-y-24 pb-20">
            {/* Madde 1: Taraflar */}
            <section className="relative group">
              <span className="absolute -left-8 top-0 text-slate-200 font-black text-4xl group-hover:text-orange-100 transition-colors">
                01
              </span>
              <div className="space-y-6">
                <h2 className="text-sm font-black text-slate-900 tracking-[0.2em] uppercase border-l-4 border-orange-600 pl-4">
                  Madde 1. Taraflar
                </h2>
                <div className="space-y-8">
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    İşbu sözleşme, aşağıda belirtilen Satıcı ile Alıcı arasında
                    6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
                    Sözleşmeler Yönetmeliği hükümleri gereğince mesafeli
                    iletişim araçları kullanılarak akdedilmiştir.
                  </p>
                  <div className="bg-white border border-slate-200 p-8 shadow-sm group-hover:border-orange-200 transition-all">
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mb-4">
                      Tedarikçi / Satıcı Verileri
                    </p>
                    <address className="not-italic text-sm text-slate-700 space-y-2 leading-relaxed">
                      <strong className="text-slate-900 text-lg tracking-tight block">
                        İşpool Bahçe ve Balkon Mobilyaları
                      </strong>
                      <div className="flex items-start gap-2 pt-2">
                        <MapPin
                          size={16}
                          className="text-slate-400 mt-1 shrink-0"
                        />
                        <span>
                          Fatih Mahallesi, Kazım Kara Bekir Caddesi No 144 a,
                          64000 Merkez/Uşak
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-50 mt-4">
                        <span className="flex items-center gap-2">
                          <Phone size={14} className="text-orange-600" /> +90
                          546 225 56 59
                        </span>
                        <span className="flex items-center gap-2">
                          <Mail size={14} className="text-orange-600" />{" "}
                          ispoolofficial@gmail.com
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 pt-2">
                        MERSIS_ID: 0123456789012345
                      </p>
                    </address>
                  </div>
                </div>
              </div>
            </section>

            {/* Madde 2: Konu */}
            <section className="relative group">
              <span className="absolute -left-8 top-0 text-slate-200 font-black text-4xl group-hover:text-orange-100">
                02
              </span>
              <div className="space-y-6">
                <h2 className="text-sm font-black text-slate-900 tracking-[0.2em] uppercase border-l-4 border-orange-600 pl-4">
                  Madde 2. Konu ve Kapsam
                </h2>
                <div className="text-sm text-slate-600 leading-[1.8] font-medium bg-slate-100 p-6">
                  <p>
                    İşbu sözleşmenin konusu, Alıcı&apos;nın Satıcı&apos;ya ait
                    www.ispool.com internet sitesi üzerinden elektronik ortamda
                    siparişini verdiği, özellikleri ve satış bedeli aşağıda
                    belirtilen bahçe ve balkon mobilyası ürünlerinin satışı ve
                    teslimi ile ilgili yasal hakların belirlenmesidir.
                  </p>
                </div>
              </div>
            </section>

            {/* Madde 3: Ürün Bilgileri */}
            <section className="relative group">
              <span className="absolute -left-8 top-0 text-slate-200 font-black text-4xl group-hover:text-orange-100">
                03
              </span>
              <div className="space-y-6">
                <h2 className="text-sm font-black text-slate-900 tracking-[0.2em] uppercase border-l-4 border-orange-600 pl-4">
                  Madde 3. Ürün Bilgileri
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-slate-950 p-8 text-white relative overflow-hidden">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-6 relative z-10">
                      Onaylı Üretim Kategorileri
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 relative z-10">
                      {[
                        "Balkon masa ve sandalye takımları",
                        "Bahçe oturma grupları ve köşe takımları",
                        "Dış mekan dinlenme yatakları",
                        "Bahçe salıncakları ve hamaklar",
                        "Dış mekan dekorasyon ürünleri",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="text-[12px] font-bold flex items-center gap-3 border-b border-white/10 pb-2"
                        >
                          <span className="text-orange-600 text-lg">›</span>{" "}
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="absolute right-[-10%] bottom-[-20%] opacity-10">
                      <BadgeCheck size={200} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Madde 5: Cayma Hakkı (Daha Vurgulu) */}
            <section className="relative group">
              <span className="absolute -left-8 top-0 text-slate-200 font-black text-4xl group-hover:text-orange-100">
                05
              </span>
              <div className="space-y-6">
                <h2 className="text-sm font-black text-slate-900 tracking-[0.2em] uppercase border-l-4 border-orange-600 pl-4">
                  Madde 5. Cayma Hakkı
                </h2>
                <div className="space-y-6">
                  <div className="p-6 bg-orange-50 border-r-4 border-orange-600">
                    <p className="text-sm text-slate-800 leading-relaxed font-bold">
                      Alıcı, teslim tarihinden itibaren 14 (on dört) gün içinde
                      hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden
                      cayma hakkına sahiptir.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 p-6 space-y-4">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase flex items-center gap-2">
                        <ArrowUpRight size={14} className="text-orange-600" />{" "}
                        Kullanım Şartları
                      </h4>
                      <ul className="space-y-3">
                        {[
                          "Ürün kullanılmamış ve ambalajı zarar görmemiş olmalıdır.",
                          "Bildirim yazılı olarak veya telefonla yapılmalıdır.",
                          "Fatura ve iade formu gönderilmelidir.",
                        ].map((item, i) => (
                          <li
                            key={i}
                            className="text-[12px] text-slate-500 font-semibold flex gap-2"
                          >
                            <span className="text-orange-600">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 space-y-4">
                      <h4 className="text-[11px] font-black text-orange-500 uppercase flex items-center gap-2">
                        <ShieldAlert size={14} /> İstisnai Haller
                      </h4>
                      <ul className="space-y-3">
                        {[
                          "Kişiye özel ölçü/tasarım ürünler.",
                          "Montajı yapılmış ürünler.",
                          "Hijyen açısından uygun olmayan mallar.",
                        ].map((item, i) => (
                          <li
                            key={i}
                            className="text-[12px] text-slate-400 font-semibold flex gap-2"
                          >
                            <span className="text-orange-600">!</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Diğer Maddeler (Madde 6-10 Arası Kompakt Görünüm) */}
            {[
              {
                m: 6,
                t: "Teslimat",
                c: "Ödeme onayından sonra en geç 30 gün içindedir. Hasarlı ürünler için tutanak tutulmalıdır.",
              },
              {
                m: 7,
                t: "Ödeme",
                c: "SSL 128-bit güvenlik protokolü ile kredi kartı veya havale seçenekleri sunulmaktadır.",
              },
              {
                m: 8,
                t: "Garanti",
                c: "Tüm ürünler üretici garantisi altındadır. Kullanım hataları kapsam dışıdır.",
              },
              {
                m: 9,
                t: "Uyuşmazlıklar",
                c: "Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkili kılınmıştır.",
              },
              {
                m: 10,
                t: "Yürürlük",
                c: "Sözleşme, Alıcı tarafından elektronik onay verildiği anda yürürlüğe girer.",
              },
            ].map((item) => (
              <section
                key={item.m}
                className="relative group border-t border-slate-200 pt-12"
              >
                <span className="absolute -left-8 top-12 text-slate-200 font-black text-2xl">
                  0{item.m}
                </span>
                <div className="space-y-4">
                  <h2 className="text-sm font-black text-slate-900 tracking-[0.2em] uppercase">
                    {item.t}
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-2xl font-medium">
                    {item.c}
                  </p>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* --- FOOTER: HUKUKİ İLETİŞİM --- */}
        <footer className="mt-20">
          <div className="bg-slate-950 p-10 md:p-20 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
              <div className="space-y-6">
                <h3 className="text-3xl font-black tracking-tighter uppercase italic">
                  Hukuki Destek <span className="text-orange-600">Hattı</span>
                </h3>
                <div className="flex flex-col md:flex-row gap-8 text-[11px] font-black tracking-[0.2em] uppercase text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-orange-600" />{" "}
                    ispoolofficial@gmail.com
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-orange-600" /> +90 546 225
                    56 59
                  </div>
                </div>
              </div>

              <Link href="/contact" className="group">
                <div className="border-2 border-orange-600 px-10 py-5 hover:bg-orange-600 transition-all duration-500">
                  <span className="text-sm font-black tracking-widest uppercase flex items-center gap-3">
                    Müşteri Hizmetleri <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            </div>

            {/* Arka Plan Büyük Yazı */}
            <div className="absolute -bottom-10 -right-5 text-[150px] font-black text-white/[0.03] leading-none select-none">
              PROSEC
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
