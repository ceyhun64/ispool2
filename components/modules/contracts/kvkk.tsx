"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  FileText,
  Lock,
} from "lucide-react";

export default function KvkkPage() {
  return (
    <div className="bg-[#fcfcfc] min-h-screen selection:bg-amber-100 selection:text-amber-900 font-sans antialiased text-slate-900">
      {/* Dekoratif Arka Plan Elementi */}
      <div className="absolute top-0 right-0 w-1/3 h-screen bg-slate-50 -z-10 hidden lg:block" />

      <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        {/* Üst Başlık Bölümü */}
        <header className="mb-24 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-amber-600 mb-8"
          >
            <div className="p-2 bg-amber-50 rounded-lg">
              <Shield size={20} strokeWidth={2} />
            </div>
            <span className="text-[11px] tracking-[0.3em] uppercase font-bold">
              Endüstriyel Güvenlik Standartları
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-slate-950 leading-[1.1]"
            >
              KVKK <br />
              <span className="text-slate-400 font-light italic">
                Aydınlatma
              </span>{" "}
              Metni
            </motion.h1>

            <div className="space-y-4 border-l-2 border-amber-500 pl-8 mb-2">
              <p className="text-[11px] text-slate-400 font-bold tracking-widest uppercase">
                Veri Sorumlusu: İşpool
              </p>
              <p className="text-[13px] text-slate-500 leading-relaxed max-w-sm">
                İş güvenliği ve personel koruma ekipmanları sektöründeki
                liderliğimizi, dijital verilerinizin korunmasında da
                sürdürüyoruz.
              </p>
              <p className="text-[10px] text-slate-400 tabular-nums">
                Yürürlük Tarihi: 06 Ocak 2026
              </p>
            </div>
          </div>
        </header>

        {/* Ana İçerik Alanı */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sol Sütun - Giriş ve Özet */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-12 bg-slate-900 p-8 rounded-2xl text-white shadow-2xl shadow-slate-200">
              <Lock className="text-amber-400 mb-6" size={32} />
              <h3 className="text-xl font-bold mb-4">
                Veri Güvenliği Taahhüdümüz
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK")
                uyarınca, İşpool olarak kişisel verilerinizin güvenliği ve
                gizliliği konusunda azami hassasiyeti göstermekteyiz.
              </p>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-tighter">
                <span>Tam Uyumlu Sistem</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </aside>

          {/* Sağ Sütun - Detaylı Maddeler */}
          <div className="lg:col-span-8 space-y-24">
            {/* Madde 1 */}
            <section className="group">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-black text-slate-100 group-hover:text-amber-100 transition-colors">
                  01
                </span>
                <h2 className="text-xs font-black text-slate-900 tracking-[0.2em] uppercase">
                  Veri Sorumlusu
                </h2>
              </div>
              <div className="pl-2 space-y-6">
                <p className="text-sm text-slate-600 leading-[1.8]">
                  6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK")
                  kapsamında veri sorumlusu sıfatıyla hareket eden İşpool Bahçe
                  ve Balkon Mobilyaları ("İşpool" veya "Şirket"), kişisel
                  verilerinizi aşağıda açıklanan çerçevede işlemektedir.
                </p>
                <address className="not-italic bg-white border border-slate-100 rounded-xl p-8 shadow-sm space-y-4">
                  <span className="text-slate-950 font-bold block text-lg">
                    İşpool Endüstriyel Çözümler
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] text-slate-500">
                    <p className="flex items-start gap-3 italic">
                      <MapPin size={16} className="text-amber-500 shrink-0" />
                      Esentepe Bulvarı Prof Necmettin Erbakan Bulvarı No353,
                      01150 Çukurova/Adana
                    </p>
                    <div className="space-y-2">
                      <p className="flex items-center gap-3 font-medium text-slate-700">
                        <Mail size={16} className="text-amber-500" />
                        balkoluxofficial@gmail.com
                      </p>
                      <p className="flex items-center gap-3 font-medium text-slate-700">
                        <Phone size={16} className="text-amber-500" />
                        +90 546 225 56 59
                      </p>
                    </div>
                  </div>
                </address>
              </div>
            </section>

            {/* Madde 2 */}
            <section className="group">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-black text-slate-100 group-hover:text-amber-100 transition-colors">
                  02
                </span>
                <h2 className="text-xs font-black text-slate-900 tracking-[0.2em] uppercase">
                  İşlenen Kişisel Veriler
                </h2>
              </div>
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {[
                    "Kimlik Bilgileri (Ad, Soyad, T.C. Kimlik No)",
                    "İletişim Bilgileri (Telefon, E-posta, Adres)",
                    "Müşteri İşlem Bilgileri (Sipariş, Ödeme)",
                    "Finansal Bilgiler (Banka Hesap, Kredi Kartı)",
                    "İşlem Güvenliği Bilgileri (IP Adresi, Log)",
                    "Pazarlama Bilgileri (İlgi Alanları, Tercihler)",
                    "Görsel ve İşitsel Kayıtlar (Fotoğraf, Video)",
                    "Hukuki İşlem Bilgileri (Şikayet, Dava)",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-[13px] text-slate-600 border-b border-slate-200/50 pb-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Madde 3 */}
            <section className="group">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-black text-slate-100 group-hover:text-amber-100 transition-colors">
                  03
                </span>
                <h2 className="text-xs font-black text-slate-900 tracking-[0.2em] uppercase">
                  İşlenme Amaçları
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: "Sözleşme Yükümlülükleri",
                    desc: "Sipariş süreçlerinin yönetimi ve lojistik operasyonlar.",
                  },
                  {
                    title: "Ticari Faaliyetler",
                    desc: "Müşteri ilişkileri ve stratejik pazar araştırmaları.",
                  },
                  {
                    title: "Yasal Zorunluluklar",
                    desc: "Vergi, muhasebe ve resmi denetim raporlamaları.",
                  },
                  {
                    title: "İletişim ve Destek",
                    desc: "Bilgilendirme, kampanya ve satış sonrası destek.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-6 bg-white border-l-4 border-slate-900 shadow-sm rounded-r-xl"
                  >
                    <h4 className="text-[13px] font-bold text-slate-950 mb-1 tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-[12px] text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Madde 7 - Haklar (Önemli Bölüm) */}
            <section className="bg-amber-50 rounded-3xl p-10 border border-amber-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-amber-200/50">
                <FileText size={120} />
              </div>
              <h2 className="text-xl font-bold text-amber-900 mb-6 relative">
                Veri Sahibi Olarak Haklarınız
              </h2>
              <ul className="space-y-4 relative">
                {[
                  "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
                  "İşlenmişse buna ilişkin bilgi talep etme",
                  "Aktarıldığı üçüncü kişileri bilme",
                  "Düzeltme, silme veya yok edilmesini isteme",
                  "Zararın giderilmesini talep etme",
                ].map((text, i) => (
                  <li key={i} className="flex gap-4 text-sm text-amber-800/80">
                    <span className="font-bold text-amber-600">0{i + 1}.</span>
                    {text}
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-amber-200">
                <p className="text-xs font-bold text-amber-900 uppercase tracking-widest mb-2">
                  Başvuru Yöntemi
                </p>
                <p className="text-[13px] text-amber-800/70 leading-relaxed">
                  Taleplerinizi yazılı olarak Adana adresimize veya{" "}
                  <strong>balkoluxofficial@gmail.com</strong> adresine
                  iletebilirsiniz. En geç 30 gün içinde yanıtlanacaktır.
                </p>
              </div>
            </section>

            {/* Madde 9 - Güvenlik */}
            <section>
              <h2 className="text-xs font-black text-slate-900 tracking-[0.2em] uppercase mb-8">
                Veri Güvenliği Önlemleri
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "SSL Şifreleme",
                  "Firewall",
                  "Erişim Kontrolü",
                  "Veri Yedekleme",
                ].map((tech, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-900 text-white rounded-xl text-center"
                  >
                    <Shield size={16} className="mx-auto mb-2 text-amber-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      {tech}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Minimal Footer */}
        <footer className="mt-40 pt-12 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-950 rounded flex items-center justify-center text-white font-bold text-sm">
                İP
              </div>
              <span className="text-sm font-bold tracking-tighter">
                İŞPOOL{" "}
                <span className="text-slate-400 font-light">Endüstriyel</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-[0.2em] uppercase">
              © 2026 İşpool — Emniyetle ve Güvenle.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
