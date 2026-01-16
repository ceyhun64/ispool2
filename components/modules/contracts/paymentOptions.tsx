"use client";

import React from "react";
import {
  CreditCard,
  Banknote,
  ArrowRightCircle,
  ShieldCheck,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
  Wallet,
  ShieldAlert,
} from "lucide-react";

export default function PaymentOptions() {
  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans antialiased text-slate-900">
      {/* Üst Dekoratif Bar */}
      <div className="h-2 bg-gradient-to-r from-orange-500 via-slate-900 to-orange-500" />

      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Başlık Bölümü - Modern & Endüstriyel */}
        <header className="text-center mb-20 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] -z-10">
            <ShieldCheck size={300} />
          </div>
          <span className="inline-block px-4 py-1.5 mb-6 text-[11px] tracking-[0.3em] text-orange-600 bg-orange-50 border border-orange-100 font-bold uppercase rounded-full">
            Ödeme Bilgilendirmesi
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 uppercase">
            Ödeme <span className="text-orange-600">Seçenekleri</span>
          </h1>
          <div className="w-24 h-1.5 bg-slate-900 mx-auto mb-6" />
          <p className="text-sm text-slate-500 font-bold flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            İşpool — 06 Ocak 2026
          </p>
        </header>

        {/* Giriş Açıklaması - Kart Tasarımı */}
        <section className="max-w-3xl mx-auto mb-20">
          <div className="bg-white border-l-8 border-slate-900 shadow-xl p-8 rounded-r-2xl">
            <p className="text-lg text-slate-600 leading-relaxed font-medium italic">
              "İşpool olarak, iş elbiseleri ve iş güvenliği ekipmanları
              alışverişlerinizi güvenli ve kolay hale getirmek için çeşitli
              ödeme yöntemleri sunmaktayız. Tüm ödeme işlemleriniz, uluslararası
              güvenlik standartlarına uygun olarak gerçekleştirilmektedir."
            </p>
          </div>
        </section>

        {/* Ödeme Yöntemleri Grid Yapısı */}
        <div className="grid grid-cols-1 gap-8 mb-20">
          {/* 1. Kredi Kartı - Geniş Kart */}
          <section className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-2xl">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-slate-900 p-10 flex flex-col justify-center items-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <CreditCard size={120} />
                </div>
                <CreditCard size={48} className="mb-4 text-orange-500" />
                <h2 className="text-2xl font-bold text-center uppercase tracking-tight">
                  1. Kredi Kartı ile Ödeme
                </h2>
                <p className="text-orange-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
                  En Hızlı ve Güvenli Yöntem
                </p>
              </div>
              <div className="md:w-2/3 p-8 md:p-12 space-y-6">
                <p className="text-slate-600 leading-relaxed">
                  Visa, MasterCard ve American Express kredi kartlarınız ile
                  güvenli ödeme yapabilirsiniz. Tüm kredi kartı işlemleriniz,
                  PCI DSS güvenlik standartlarına uygun olarak 256-bit SSL
                  şifreleme teknolojisi ile korunmaktadır.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Anında onay ve hızlı sipariş işleme",
                    "Taksit seçenekleri (bankanıza göre)",
                    "3D Secure güvenlik sistemi",
                    "Ödeme bilgileriniz saklanmaz",
                    "Otomatik fatura oluşturma",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100"
                    >
                      <CheckCircle2
                        size={18}
                        className="text-orange-500 flex-shrink-0"
                      />
                      <span className="text-[13px] font-bold text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 2. Banka Kartı */}
            <section className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all border-b-4 border-b-blue-600">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Wallet size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 uppercase italic">
                    2. Banka Kartı (Debit)
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Doğrudan Hesabınızdan
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Visa Debit, MasterCard Debit ve diğer banka kartlarınız ile
                doğrudan banka hesabınızdan ödeme yapabilirsiniz. Banka kartı
                ile yapılan ödemeler, kredi kartı ile aynı güvenlik
                standartlarında işlenmektedir.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Bankanızın online işlemlere açık olması yeterlidir. Ödeme onayı
                anında gerçekleşir ve siparişiniz hemen işleme alınır.
              </p>
            </section>

            {/* 3. Havale/EFT */}
            <section className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all border-b-4 border-b-orange-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                  <Banknote size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 uppercase italic">
                    3. Havale / EFT Ödeme
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Banka Transferi
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Sipariş sonrası banka hesap bilgilerimiz e-postanıza
                  iletilecektir. Dekontunuzu{" "}
                  <span className="font-bold text-slate-900">
                    balkoluxofficial@gmail.com
                  </span>{" "}
                  adresine iletebilirsiniz.
                </p>
                <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                  <ul className="space-y-2">
                    {[
                      "Açıklamaya sipariş numarasını yazınız",
                      "Onay 1-2 iş günü sürebilir",
                    ].map((t, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-[12px] font-bold text-orange-800"
                      >
                        <ArrowRightCircle size={14} /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* 4 & 5. Kapıda ve Taksitli Ödeme - Yatay Modern Bölüm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-slate-50 border-2 border-dashed border-slate-300 p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-4">
                <ShieldAlert className="text-slate-400" />
                <h2 className="font-bold uppercase tracking-tight">
                  4. Kapıda Ödeme
                </h2>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Seçili ürün ve bölgeler için nakit veya kart ile ödeme
                mevcuttur.
              </p>
              <div className="text-[11px] bg-white p-3 rounded-lg border border-slate-200 text-slate-500 italic">
                Not: Büyük ve özel üretim ürünlerde geçerli değildir. Peşinat
                gerekebilir.
              </div>
            </section>

            <section className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="font-bold uppercase tracking-tight mb-2 text-orange-500">
                  5. Taksitli Ödeme
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Banka ve kart özelliklerine göre vade farksız veya uygun
                  oranlı taksit seçenekleri sunulmaktadır.
                </p>
                <p className="text-[10px] text-slate-500 italic">
                  * Taksit oranları bankanızca belirlenir.
                </p>
              </div>
              <div className="absolute bottom-0 right-0 opacity-10 p-4">
                <CreditCard size={100} />
              </div>
            </section>
          </div>
        </div>

        {/* Güvenlik Bölümü - Çok Modern Endüstriyel */}
        <section className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-2xl mb-20">
          <div className="bg-green-600 p-6 text-center text-white flex items-center justify-center gap-4">
            <Lock size={24} />
            <h2 className="text-2xl font-black uppercase tracking-widest italic">
              Güvenli Alışveriş Garantisi
            </h2>
          </div>
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { title: "256-bit SSL", desc: "Tam şifreli veri iletimi" },
                { title: "PCI DSS", desc: "Global güvenlik standardı" },
                { title: "3D Secure", desc: "SMS onaylı koruma katmanı" },
                { title: "Veri Koruma", desc: "Bilgileriniz asla saklanmaz" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-green-50 hover:border-green-200 transition-colors"
                >
                  <ShieldCheck
                    size={32}
                    className="mx-auto mb-4 text-green-600"
                  />
                  <p className="text-[12px] font-black text-slate-900 uppercase mb-1">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-slate-400 font-medium max-w-2xl mx-auto border-t pt-8">
              İşpool, PCI DSS Level 1 sertifikalı ödeme altyapısı
              kullanmaktadır. Ödeme bilgileriniz yalnızca işlem sırasında
              kullanılır.
            </p>
          </div>
        </section>

        {/* İletişim Kartı - Endüstriyel Siyah */}
        <section className="bg-slate-950 rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 blur-[100px]" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black uppercase mb-6 leading-tight">
                Ödeme ile ilgili <br />
                <span className="text-orange-500">sorularınız mı var?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                Müşteri hizmetlerimiz uzman ekibiyle size teknik destek
                sağlamaya hazır.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-[12px] text-slate-300 font-bold uppercase tracking-tighter">
                Çalışma Saatleri: 09:00 - 18:00 (Pzt-Cmt)
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <a
                href="mailto:balkoluxofficial@gmail.com"
                className="flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
              >
                <div className="p-4 bg-orange-500 rounded-xl group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest mb-1">
                    Kurumsal E-posta
                  </p>
                  <p className="text-lg font-bold">
                    balkoluxofficial@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="tel:+905462255659"
                className="flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
              >
                <div className="p-4 bg-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-1">
                    Destek Hattı
                  </p>
                  <p className="text-lg font-bold">+90 546 225 56 59</p>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center">
          <div className="w-12 h-1 bg-slate-200 mx-auto mb-6" />
          <p className="text-[11px] text-slate-400 tracking-[0.3em] font-bold uppercase">
            © 2026 İşpool İş Elbiseleri ve Güvenliği — Profesyonel Koruma
            Ekipmanları
          </p>
        </footer>
      </div>
    </div>
  );
}
