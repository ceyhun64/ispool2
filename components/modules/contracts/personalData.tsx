"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Globe,
  Mail,
  ShieldCheck,
  FileText,
  CheckCircle,
  ArrowRight,
  UserCheck,
  Building2,
} from "lucide-react";

export default function PersonalDataConsent() {
  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans antialiased text-slate-900">
      {/* Üst Dekoratif Bant - İş Güvenliği Teması */}
      <div className="h-3 bg-gradient-to-r from-orange-600 via-slate-900 to-orange-600 shadow-md" />

      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-20">
        {/* Başlık Bölümü - Modern Endüstriyel */}
        <header className="text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
            <ShieldCheck size={400} />
          </div>
          <span className="inline-block px-5 py-1.5 mb-6 text-[10px] tracking-[0.5em] text-orange-600 bg-orange-50 border border-orange-100 font-black uppercase ">
            Hukuki Bilgilendirme
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter uppercase leading-[0.9]">
            Kişisel Verilerin <br />
            <span className="text-orange-600">İşlenmesi</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-light text-slate-500 mt-4 tracking-tight">
            Açık Rıza Beyanı
          </h2>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-[2px] w-12 bg-slate-200" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              İşpool — 06 Ocak 2026
            </p>
            <div className="h-[2px] w-12 bg-slate-200" />
          </div>
        </header>

        {/* Giriş Açıklaması - Vurgulu Kutu */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-slate-950 text-white  p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <UserCheck size={120} />
            </div>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium relative z-10">
              <span className="text-orange-500 font-black">6698 sayılı</span>{" "}
              Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, kişisel
              verilerinizin işlenmesi ve korunması hususunda bilgilendirilmiş
              olarak aşağıdaki onay metnini dikkatlice okumanızı ve onaylamanızı
              rica ederiz.
            </p>
          </div>
        </section>

        {/* Ana İçerik Grid Yapısı */}
        <div className="grid grid-cols-1 gap-12">
          {/* Onay Metni Bölümü */}
          <section className="bg-white border border-slate-200  overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500">
            <div className="flex flex-col md:flex-row border-b border-slate-100">
              <div className="md:w-80 bg-slate-50 p-10 flex flex-col justify-between border-r border-slate-100">
                <div className="p-4 bg-slate-900 text-white inline-flex  w-fit shadow-lg shadow-slate-200">
                  <FileText size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase leading-none mb-2">
                    Açık Rıza <br />
                    Beyanı
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Kişisel Veri Onayı
                  </p>
                </div>
              </div>
              <div className="flex-1 p-8 md:p-12 space-y-8">
                <p className="text-slate-600 leading-relaxed text-sm">
                  <strong>İşpool Bahçe ve Balkon Mobilyaları</strong> tarafından
                  hazırlanan KVKK Aydınlatma Metni'ni okudum ve anladım. Bu
                  kapsamda, tarafıma ait kişisel verilerin,{" "}
                  <span className="text-slate-900 font-bold underline decoration-orange-500 decoration-2">
                    6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)
                  </span>{" "}
                  uyarınca, İşpool tarafından aşağıda belirtilen amaçlarla
                  işlenmesine ve gerektiğinde üçüncü kişilerle paylaşılmasına
                  açıkça rıza gösteriyorum.
                </p>

                <div className="bg-slate-50  p-8 border border-slate-100">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-orange-600 block" />
                    Kişisel Verilerimin İşlenme Amaçları:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                    {[
                      "Sipariş işlemlerimin gerçekleştirilmesi ve takibi",
                      "Satış sözleşmesinin kurulması ve ifası",
                      "Ödeme işlemlerinin yürütülmesi",
                      "Kargo ve teslimat süreçlerinin yönetimi",
                      "Müşteri memnuniyeti ve destek hizmetlerinin sağlanması",
                      "Satış sonrası hizmetler ve garanti işlemleri",
                      "Ürün ve hizmetlerin geliştirilmesi",
                      "Pazarlama ve iletişim faaliyetleri",
                      "Kampanya, promosyon ve bilgilendirme",
                      "Finans ve muhasebe işlemleri",
                      "Yasal yükümlülüklerin yerine getirilmesi",
                      "Hukuki işlemlerin yürütülmesi ve takibi",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 group">
                        <CheckCircle
                          size={16}
                          className="text-green-600 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform"
                        />
                        <span className="text-[13px] text-slate-600 font-medium">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-orange-50/50  border border-orange-100">
                  <p className="text-sm text-slate-700 leading-[1.8]">
                    Bu kapsamda;{" "}
                    <strong className="text-slate-900">ad-soyad</strong>,{" "}
                    <strong>T.C. kimlik numarası</strong>,
                    <strong> telefon numarası</strong>,{" "}
                    <strong>e-posta adresi</strong>,{" "}
                    <strong>açık adres bilgileri</strong>,
                    <strong> IP adresi</strong>,{" "}
                    <strong>çerez bilgileri</strong>,{" "}
                    <strong>banka hesap ve kredi kartı bilgileri</strong>,
                    <strong> sipariş ve alışveriş geçmişi</strong> ile{" "}
                    <strong>iletişim tercihleri</strong> gibi kişisel
                    verilerimin paylaşılmasına açık rıza veriyorum.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Veri Aktarımı - Kart Tasarımı */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <div className="md:col-span-2 bg-white border border-slate-200 p-10  shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-50 text-blue-600 ">
                  <Globe size={28} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase italic">
                  Veri Aktarımı
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Kargo ve lojistik sağlayıcıları",
                  "Ödeme kuruluşları ve bankalar",
                  "Pazarlama ve reklam ajansları",
                  "Bilgi teknolojileri servisleri",
                  "Kamu kurum ve kuruluşları",
                  "İş ortakları ve tedarikçiler",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-slate-50  border border-slate-100 text-[12px] font-bold text-slate-700"
                  >
                    <ArrowRight size={14} className="text-blue-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-10  flex flex-col justify-center">
              <ShieldCheck size={40} className="text-amber-600 mb-6" />
              <p className="text-xs text-amber-900 font-bold leading-relaxed italic">
                "Kişisel verilerimin yurt dışına aktarılması gerektiğinde,
                KVKK'nın 9. maddesi ve kurul kararları çerçevesinde aktarım
                yapılacağını biliyorum."
              </p>
            </div>
          </section>

          {/* Ticari İleti & Haklar - Yan Yana */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="bg-white border border-slate-200 p-10  relative overflow-hidden">
              <div className="absolute -top-10 -right-10 opacity-[0.05] rotate-12">
                <Mail size={150} />
              </div>
              <h3 className="text-xl font-black uppercase text-slate-900 mb-6 flex items-center gap-3">
                <Mail className="text-orange-600" /> Ticari İleti Onayı
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                İşpool tarafından sunulan ürünler, kampanyalar ve indirimler
                hakkında ticari elektronik ileti almayı kabul ediyorum.
              </p>
              <div className="flex flex-wrap gap-2">
                {["E-posta", "SMS", "Telefon Araması"].map((m, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest "
                  >
                    {m}
                  </span>
                ))}
              </div>
            </section>

            <section className="bg-slate-900 text-white p-10 ">
              <h3 className="text-xl font-black uppercase text-orange-500 mb-6 flex items-center gap-3">
                <ShieldCheck /> Haklarınız
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                KVKK Madde 11 uyarınca; verilerinizin işlenip işlenmediğini
                öğrenme, düzeltme isteme ve silinmesini talep etme gibi haklara
                sahipsiniz.
              </p>
              <button className="mt-8 px-6 py-3 border border-white/20  text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all flex items-center gap-2">
                Tüm Listeyi Gör <ArrowRight size={14} />
              </button>
            </section>
          </div>

          {/* Son Beyan - Koyu Endüstriyel */}
          <section className="bg-orange-600 p-10 md:p-16 text-white shadow-2xl shadow-orange-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-20">
              <UserCheck size={200} />
            </div>
            <div className="max-w-3xl relative z-10">
              <h2 className="text-3xl font-black uppercase mb-6 tracking-tighter">
                Son Beyan ve Onay
              </h2>
              <p className="text-lg font-medium leading-relaxed mb-8 text-orange-50">
                İşbu açık rıza metninde yer alan tüm hususları okudum, anladım
                ve kabul ediyorum. Kişisel verilerimin belirtilen amaçlarla
                işlenmesine özgür iradem ile açık rıza gösteriyorum.
              </p>
              <div className="inline-block p-4 bg-black/20  border border-white/10 text-xs font-bold uppercase tracking-tight">
                Not: Bu belge elektronik ortamda onaylanmış olup dijital imza
                yerine geçer.
              </div>
            </div>
          </section>
        </div>

        {/* İletişim Kartı - Modern Grid */}
        <section className="bg-slate-50  p-10 border border-slate-200">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/3">
              <h2 className="text-3xl font-black uppercase text-slate-950 mb-4 italic">
                İletişim
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Kişisel verilerinizle ilgili her türlü soru ve talep için teknik
                destek ekibimizle iletişime geçin.
              </p>
              <div className="mt-8 p-4 bg-green-50 border border-green-100  flex gap-3 items-center">
                <ShieldCheck className="text-green-600" />
                <p className="text-[11px] font-black text-green-800 uppercase">
                  Verileriniz Güvende
                </p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: <MapPin />, label: "Adres", val: "Çukurova/Adana" },
                { icon: <Phone />, label: "Telefon", val: "+90 546 225 56 59" },
                {
                  icon: <Mail />,
                  label: "E-posta",
                  val: "ispoolofficial@gmail.com",
                },
                { icon: <Globe />, label: "Web", val: "www.ispool.com" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-6 p-6 bg-white border border-slate-100  hover:border-orange-500 transition-colors group"
                >
                  <div className="p-4 bg-slate-900 text-white  group-hover:bg-orange-600 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {item.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-12">
          <div className="w-16 h-1 bg-slate-200 mx-auto mb-8 " />
          <p className="text-[11px] text-slate-400 tracking-[0.4em] font-black uppercase">
            © 2026 İşpool İş Elbiseleri ve Güvenliği
          </p>
          <p className="text-[9px] text-slate-300 font-bold uppercase mt-2">
            Resmi KVKK Protokolü — Profesyonel Koruma Ekipmanları
          </p>
        </footer>
      </div>
    </div>
  );
}
