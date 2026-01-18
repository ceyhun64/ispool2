import Link from "next/link";
import React from "react";

const ToptanSatisPremium = () => {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-amber-100">
      {/* --- HERO SECTION: Kurumsal Güç --- */}
      <section className="relative h-[70vh] flex items-center bg-slate-950 overflow-hidden">
        {/* Modern Maskelenmiş Arka Plan */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2070"
            alt="Wholesale Logistics"
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-amber-500"></div>
              <span className="text-amber-500 font-bold tracking-[0.5em] uppercase text-[10px]">
                B2B Kurumsal Çözümler
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-extralight text-white leading-[0.9] mb-8 tracking-tighter">
              Büyük Ölçekli <br />
              <span className="font-black text-amber-500 italic drop-shadow-2xl">
                Güvenilir Tedarik
              </span>
            </h1>
            <p className="text-slate-300 text-lg md:text-2xl font-light leading-relaxed max-w-2xl border-l border-white/20 pl-8">
              Perakende şıklığını toptan satışın gücüyle birleştiriyoruz.
              Merkezimiz ve global mağaza ağımızla kurumsal ihtiyaçlarınıza
              profesyonel çözümler sunuyoruz.
            </p>
          </div>
        </div>

        {/* Aşağı Kaydır İndikatörü */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
          <div className="w-[1px] h-20 bg-gradient-to-b from-amber-500 to-transparent"></div>
        </div>
      </section>

      {/* --- SÜREÇ YÖNETİMİ --- */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                Toptan Satış <br /> Süreç Yönetimi
              </h2>
            </div>
            <div className="h-[2px] flex-grow mx-12 bg-slate-100 hidden lg:block mb-4"></div>
            <div className="text-amber-500 font-black text-6xl opacity-10 leading-none">
              PROCESS
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Kişisel Danışman",
                desc: "Talebiniz ulaştığı an bölge temsilcimiz sizinle iletişime geçer ve tüm süreçte yanınızda olur.",
                icon: "01",
              },
              {
                title: "İhtiyaç Analizi",
                desc: "Seçim yapmakta zorlanırsanız, iş sahanızı analiz ederek en doğru teknik ürünü tavsiye ederiz.",
                icon: "02",
              },
              {
                title: "Özel Fiyatlandırma",
                desc: "Kurumsal hacminize özel, rekabetçi ve sürdürülebilir fiyat tekliflerimizi hazırlarız.",
                icon: "03",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="relative p-12 bg-slate-50 border border-slate-100 group hover:bg-slate-900 transition-all duration-500 ease-in-out"
              >
                <span className="absolute top-8 right-8 text-4xl font-black text-slate-200 group-hover:text-amber-500/20 transition-colors">
                  {step.icon}
                </span>
                <h3 className="text-2xl font-bold mb-6 text-slate-800 group-hover:text-white transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors">
                  {step.desc}
                </p>
                <div className="mt-8 w-0 group-hover:w-full h-1 bg-amber-500 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HIZLI ERİŞİM: Premium Kartlar --- */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              className="relative h-[450px] overflow-hidden group cursor-pointer"
            >
              <img
                src={item.img}
                className="w-full h-full object-cover transition duration-[1.5s] group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-slate-900/60 group-hover:bg-amber-500/20 transition-all duration-500 flex items-end p-10">
                <span className="text-white font-bold text-2xl tracking-[0.2em] border-l-4 border-amber-500 pl-4 uppercase">
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- LOGO & ÖZELLEŞTİRME --- */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 bg-white border border-slate-200 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col md:flex-row items-stretch">
            <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center">
              <span className="text-amber-600 font-black text-[10px] tracking-[0.4em] uppercase mb-6 block">
                Kurumsal İmza
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-tight uppercase">
                Logo ve Marka <br /> Entegrasyonu
              </h2>
              <p className="text-slate-500 text-base leading-relaxed mb-10 font-light">
                Toptan alımlarınızda dikili ürünlere, markanızın prestijini
                yansıtacak son teknoloji baskı veya nakış teknikleri
                uyguluyoruz. Önce dijital onay, ardından numune ile kusursuz
                sonuç garanti ediyoruz.
              </p>
              <Link href="/help/printing">
                <button className="inline-flex items-center group bg-slate-900 text-white px-10 py-5 font-bold text-xs uppercase tracking-[0.2em] hover:bg-amber-500 transition-all duration-300">
                  Teknikleri İncele
                  <span className="ml-4 group-hover:translate-x-2 transition-transform">
                    →
                  </span>
                </button>
              </Link>
            </div>
            <div className="w-full md:w-1/2 min-h-[500px] relative">
              <img
                src="https://images.unsplash.com/photo-1621335829175-95f437384d7c?auto=format&fit=crop&q=80&w=1000"
                className="absolute inset-0 w-full h-full object-cover"
                alt="Logo Printing"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- SEVKİYAT AĞI --- */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-24">
          <div className="w-full md:w-1/2 relative p-12">
            <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-amber-500/30"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-amber-500/30"></div>
            <img
              src="/images/turkiye-haritasi.png"
              alt="Sevkiyat Haritası"
              className="w-full relative z-10 filter grayscale opacity-80"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-8">
            <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
              Lojistik Gücü
            </h3>
            <p className="text-amber-600 text-xl font-medium italic border-l-4 border-amber-500 pl-6 leading-relaxed">
              "Sadece üretmiyoruz, tam zamanında kapınıza ulaştırıyoruz."
            </p>
            <p className="text-base text-slate-500 leading-relaxed font-light">
              Tüm Türkiye genelinde yaygın dağıtım ağına sahibiz.{" "}
              <strong className="text-slate-900 font-bold underline decoration-amber-500 decoration-2 underline-offset-4">
                İstanbul, İzmir, Kocaeli ve Antalya
              </strong>{" "}
              içi kendi sevkiyat filomuzla, diğer illerimize ise profesyonel
              kargo partnerlerimizle en hızlı gönderimi sağlıyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* --- ILETISIM: Minimalist & Bold --- */}
      <section className="bg-white py-32 border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h4 className="text-[10px] font-black text-amber-600 tracking-[0.5em] uppercase mb-8">
              İletişime Geçin
            </h4>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-16 tracking-tighter uppercase leading-none">
              Kurumsal <br /> Teklif Alın
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1px bg-slate-200 mb-12 border border-slate-200 shadow-2xl">
              <div className="bg-white p-12 hover:bg-slate-50 transition-colors">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">
                  Müşteri Hattı
                </p>
                <p className="text-2xl font-black text-slate-900">
                  +90 216 472 73 00
                </p>
              </div>
              <div className="bg-white p-12 hover:bg-slate-50 transition-colors">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">
                  E-Posta Adresi
                </p>
                <p className="text-2xl font-black text-slate-900">
                  ismont@ismont.com.tr
                </p>
              </div>
            </div>

            <button className="group relative overflow-hidden bg-slate-900 text-white px-16 py-7 font-black text-sm uppercase tracking-[0.3em] transition-all duration-500">
              <span className="relative z-10">Hemen Mesaj Gönder</span>
              <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ToptanSatisPremium;
