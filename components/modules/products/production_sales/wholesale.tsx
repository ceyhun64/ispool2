import Link from "next/link";
import React from "react";

const ToptanSatisPremium = () => {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-amber-100">
      {/* --- HERO SECTION: Kurumsal Güç --- */}
      <section className="relative h-[60vh] flex items-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2070"
            alt="Wholesale Logistics"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="text-amber-500 font-bold tracking-[0.4em] uppercase text-xs mb-4 block">
              B2B Kurumsal Çözümler
            </span>
            <h1 className="text-5xl md:text-7xl font-extralight text-white leading-tight mb-6">
              Büyük Ölçekli <br />
              <span className="font-bold text-amber-500 italic">
                Güvenilir Tedarik
              </span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed border-l-2 border-amber-600 pl-6">
              Perakende şıklığını toptan satışın gücüyle birleştiriyoruz.
              Merkezimiz ve global mağaza ağımızla kurumsal ihtiyaçlarınıza
              profesyonel çözümler sunuyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* --- SÜREÇ YÖNETİMİ --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4 uppercase tracking-tighter">
              Toptan Satış Süreç Yönetimi
            </h2>
            <div className="h-1 w-20 bg-amber-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Kişisel Danışman",
                desc: "Talebiniz ulaştığı an bölge temsilcimiz sizinle iletişime geçer ve tüm süreçte yanınızda olur.",
                icon: "👤",
              },
              {
                title: "İhtiyaç Analizi",
                desc: "Seçim yapmakta zorlanırsanız, iş sahanızı analiz ederek en doğru teknik ürünü tavsiye ederiz.",
                icon: "🔍",
              },
              {
                title: "Özel Fiyatlandırma",
                desc: "Kurumsal hacminize özel, rekabetçi ve sürdürülebilir fiyat tekliflerimizi hazırlarız.",
                icon: "💎",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-10  shadow-sm border border-slate-100 hover:shadow-xl transition-all group"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HIZLI ERİŞİM: Premium Kartlar --- */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "BİZE ULAŞIN",
              img: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=800",
            },
            {
              name: "ÜRÜNLERİMİZ",
              img: "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?auto=format&fit=crop&q=80&w=800",
            },
            {
              name: "KATALOGLARIMIZ",
              img: "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=800",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative h-64 overflow-hidden  group cursor-pointer shadow-lg"
            >
              <img
                src={item.img}
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:rotate-2"
              />
              <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                <span className="text-white font-bold text-xl tracking-widest border-b-2 border-amber-500 pb-1">
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- LOGO & ÖZELLEŞTİRME --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 bg-slate-900  overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 p-12 md:p-20">
              <span className="text-amber-500 font-bold text-xs tracking-widest uppercase mb-4 block">
                Kurumsal İmza
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Logo ve Marka Entegrasyonu
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Toptan alımlarınızda dikili ürünlere, markanızın prestijini
                yansıtacak son teknoloji baskı veya nakış teknikleri
                uyguluyoruz. Önce dijital onay, ardından numune ile kusursuz
                sonuç garanti ediyoruz.
              </p>
              <Link href="/help/printing">
                <button className="bg-white text-slate-900 px-8 py-4  font-bold text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all">
                  Teknikleri İncele
                </button>
              </Link>
            </div>
            <div className="w-full md:w-1/2 h-[400px] md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1621335829175-95f437384d7c?auto=format&fit=crop&q=80&w=1000"
                className="w-full h-full object-cover opacity-80"
                alt="Logo Printing"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- SEVKİYAT AĞI --- */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 relative">
            <div className="absolute -inset-4 bg-amber-500/10 blur-3xl "></div>
            <img
              src="/images/turkiye-haritasi.png"
              alt="Sevkiyat Haritası"
              className="w-full relative z-10 filter grayscale contrast-125"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-3xl font-bold text-slate-800">Lojistik Gücü</h3>
            <p className="text-slate-600 leading-relaxed italic">
              "Sadece üretmiyoruz, tam zamanında kapınıza ulaştırıyoruz."
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Tüm Türkiye genelinde yaygın dağıtım ağına sahibiz.{" "}
              <strong>İstanbul, İzmir, Kocaeli ve Antalya</strong> içi kendi
              sevkiyat filomuzla, diğer illerimize ise profesyonel kargo
              partnerlerimizle en hızlı gönderimi sağlıyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* --- ILETISIM: Modern Call to Action --- */}
      <section className="bg-slate-50 py-24 border-t border-slate-200">
        <div className="container mx-auto px-6 text-center">
          <h4 className="text-sm font-bold text-amber-600 tracking-[0.3em] uppercase mb-4">
            İletişime Geçin
          </h4>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tighter uppercase">
            Kurumsal Teklif Alın
          </h2>
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <div className="bg-white p-6  shadow-sm border border-slate-100 min-w-[280px]">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">
                  Müşteri Hattı
                </p>
                <p className="text-xl font-bold text-slate-800">
                  +90 216 472 73 00
                </p>
              </div>
              <div className="bg-white p-6  shadow-sm border border-slate-100 min-w-[280px]">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">
                  E-Posta Adresi
                </p>
                <p className="text-xl font-bold text-slate-800">
                  ismont@ismont.com.tr
                </p>
              </div>
            </div>
            <button className="bg-slate-900 text-white px-12 py-5  font-bold text-sm hover:bg-slate-800 transition-all shadow-xl hover:shadow-slate-300 uppercase tracking-widest">
              Hemen Mesaj Gönder
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ToptanSatisPremium;
