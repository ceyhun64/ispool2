import React from "react";

const OzelUretimPremium = () => {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-amber-100">
      {/* --- HERO SECTION: Kurumsal Estetik --- */}
      <section className="relative h-[85vh] flex items-center bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1558444479-c8482432b79a?auto=format&fit=crop&q=80&w=2070"
            alt="Master Tailor"
            className="w-full h-full object-cover opacity-30 scale-105"
          />
          {/* Modern Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-[1px] w-12 bg-amber-500"></span>
              <span className="text-amber-500 font-bold tracking-[0.5em] uppercase text-[10px] md:text-xs block">
                Kişiselleştirilmiş Endüstriyel Çözümler
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-extralight text-white leading-[0.95] mb-10 tracking-tighter">
              Sınırları{" "}
              <span className="font-black text-amber-500 italic drop-shadow-2xl">
                Siz Çizin,
              </span>{" "}
              <br />
              <span className="text-slate-200">Biz Gerçeğe Dönüştürelim</span>
            </h1>
            <div className="max-w-2xl border-l-2 border-amber-600 pl-8 py-2">
              <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed">
                Standartların ötesinde, firmanızın karakterini dikişlerine kadar
                taşıyan premium iş kıyafetleri. Tasarımdan üretime her aşamada
                mükemmeliyet.
              </p>
            </div>
          </div>
        </div>

        {/* Teknik Detay Dekoru */}
        <div className="absolute bottom-10 right-10 hidden lg:block">
          <div className="text-white/10 text-[180px] font-black leading-none select-none">
            CRAFT
          </div>
        </div>
      </section>

      {/* --- TASARIM SÜRECİ: Modern Galeri Yapısı --- */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                Kusursuz <br /> Üretim Döngüsü
              </h2>
              <div className="h-1.5 w-32 bg-amber-500"></div>
            </div>
            <p className="text-slate-400 font-bold text-sm tracking-[0.2em] uppercase">
              Architecture of Quality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                title: "Kreatif Tasarım",
                desc: "AR-GE ekibimizle vizyonunuzu dijital taslaklara döküyoruz.",
                img: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=600",
              },
              {
                title: "Zanaatlı Numune",
                desc: "Seri üretim öncesi kumaş ve kalıp kalitesini deneyimleyin.",
                img: "https://images.unsplash.com/photo-1524234107056-1c1f48f64ab8?auto=format&fit=crop&q=80&w=600",
              },
              {
                title: "Marka Entegrasyonu",
                desc: "Logonuzu en ileri nakış ve baskı teknikleriyle işliyoruz.",
                img: "https://images.unsplash.com/photo-1613913396648-560bb5ec8ec0?auto=format&fit=crop&q=80&w=600",
              },
            ].map((step, idx) => (
              <div key={idx} className="group relative">
                <div className="overflow-hidden aspect-[3/4] mb-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s] ease-out"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-all duration-700"></div>
                  <div className="absolute top-6 left-6 w-12 h-12 border-t border-l border-white/50 group-hover:border-amber-500 transition-colors"></div>
                </div>
                <div className="relative">
                  <span className="text-amber-500/10 font-black text-8xl absolute -top-12 -left-4 pointer-events-none">
                    0{idx + 1}
                  </span>
                  <h3 className="text-2xl font-black mb-4 text-slate-900 uppercase tracking-tight relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-[280px] relative z-10 font-medium">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PREMİUM DETAYLAR: Minimalist Grid --- */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1px bg-slate-100 border border-slate-100 shadow-2xl">
            {[
              {
                label: "Kumaş Seçimi",
                icon: "🧵",
                sub: "Teknolojik & Dayanıklı",
              },
              { label: "Kurumsal Kimlik", icon: "🏛️", sub: "Tam Marka Uyumu" },
              { label: "Özel Etiket", icon: "🏷️", sub: "Prestijli Detaylar" },
              {
                label: "V.I.P Paketleme",
                icon: "📦",
                sub: "Kusursuz Teslimat",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-16 bg-white hover:bg-slate-50 transition-all duration-500 text-center group"
              >
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0">
                  {item.icon}
                </div>
                <h4 className="font-black text-slate-900 mb-2 uppercase tracking-tighter text-lg">
                  {item.label}
                </h4>
                <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.2em]">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BİLGİLENDİRME PANELİ: Dark Mode Glassmorphism --- */}
      <section className="py-32 bg-slate-950 text-white overflow-hidden relative">
        {/* Subtle Background pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="mb-20 text-center">
              <h3 className="text-3xl md:text-5xl font-extralight italic leading-tight text-slate-200">
                "Her firma benzersizdir; <br />
                <span className="text-amber-500 font-black not-italic uppercase tracking-tighter">
                  kıyafetleri de öyle olmalı.
                </span>
                "
              </h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <p className="text-slate-400 text-base leading-relaxed font-light">
                  Yeni modellerimizi geliştirirken değişen farklı ihtiyaçları
                  dikkate alıyoruz. Ancak her firmanın kendine özgü çalışma
                  yöntemleri ve kuralları, personel kıyafetlerinde farklı
                  fonksiyonel özellikler gerektirir. Biz, markanızın profilini
                  yansıtan o özel tasarımı hayata geçiriyoruz.
                </p>
                <div className="p-10 bg-white/5 border border-white/10 backdrop-blur-sm">
                  <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-amber-500 pl-6 uppercase tracking-wider font-light">
                    Tasarım ve ARGE ekibimizle size en uygun ürünü bilgisayar
                    ortamında geliştirerek tasarımdan üretime esnek ve hızlı bir
                    sistemle hayata geçiriyoruz.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { title: "Antistatik", desc: "Statik yük koruması" },
                  { title: "FR (Alev Almaz)", desc: "Isı ve alev direnci" },
                  { title: "Yüksek Görünürlük", desc: "Maksimum farkındalık" },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-6 border border-white/5 bg-white/[0.02] hover:bg-amber-500 transition-all group"
                  >
                    <div>
                      <span className="text-lg font-black uppercase tracking-tighter group-hover:text-slate-950">
                        {feature.title}
                      </span>
                      <p className="text-[10px] text-slate-500 group-hover:text-slate-900 font-bold uppercase">
                        {feature.desc}
                      </p>
                    </div>
                    <div className="h-px w-12 bg-amber-500 group-hover:bg-slate-950"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SÜREÇLER & FOOTER CTA: Bold & Minimalist --- */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-8">
          <div className="max-w-7xl mx-auto bg-slate-900 p-1px border border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)]">
            <div className="bg-slate-950 p-12 md:p-24 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-center mb-20">
                  <h4 className="text-[10px] font-black tracking-[0.6em] text-amber-500 uppercase mb-4">
                    Operasyonel Adımlar
                  </h4>
                  <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
                    Yol Haritamız
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/10 mb-24">
                  {[
                    "İhtiyaç Analizi & Dinleme",
                    "Dijital Tasarım & Onay",
                    "Master Numune Üretimi",
                    "Yüksek Standartlı Seri Üretim",
                  ].map((text, i) => (
                    <div
                      key={i}
                      className="bg-slate-950 p-8 hover:bg-slate-900 transition-colors group"
                    >
                      <div className="w-10 h-10 border border-amber-500 text-amber-500 flex items-center justify-center text-sm font-black mb-6 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                        0{i + 1}
                      </div>
                      <span className="text-sm font-bold text-slate-200 uppercase tracking-wide leading-tight block">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-center space-y-12">
                  <div className="space-y-4">
                    <h4 className="text-4xl font-black text-white uppercase tracking-tighter">
                      Özel Üretim Atölyemize Başvurun
                    </h4>
                    <p className="text-slate-400 text-base max-w-2xl mx-auto font-light leading-relaxed">
                      İhtiyaçlarınıza yönelik en doğru çözümü uzman müşteri
                      temsilcilerimizle belirleyin. Kurumsal kimliğinizi
                      dikişlerle güçlendirelim.
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row justify-center gap-1px bg-white/10 max-w-3xl mx-auto border border-white/10">
                    <a
                      href="tel:+902164727300"
                      className="flex-1 bg-slate-950 hover:bg-slate-900 text-white px-12 py-8 transition-all group"
                    >
                      <span className="block text-[10px] text-amber-500 font-black uppercase tracking-widest mb-2">
                        Hızlı Arama
                      </span>
                      <span className="text-xl font-black tracking-tighter">
                        +90 216 472 73 00
                      </span>
                    </a>
                    <a
                      href="mailto:ismont@ismont.com.tr"
                      className="flex-1 bg-amber-600 hover:bg-amber-500 text-slate-950 px-12 py-8 transition-all group"
                    >
                      <span className="block text-[10px] text-slate-900/60 font-black uppercase tracking-widest mb-2">
                        E-Posta
                      </span>
                      <span className="text-xl font-black tracking-tighter">
                        ismont@ismont.com.tr
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Arka Plan Dekoratif Yazı */}
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] select-none pointer-events-none">
                <div className="text-[250px] font-black leading-none">VIP</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OzelUretimPremium;
