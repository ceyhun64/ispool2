import React from 'react';

const OzelUretimPremium = () => {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-amber-100">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-[70vh] flex items-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1558444479-c8482432b79a?auto=format&fit=crop&q=80&w=2070" 
            alt="Master Tailor" 
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="text-amber-500 font-bold tracking-[0.4em] uppercase text-xs mb-4 block">Kişiselleştirilmiş Endüstriyel Çözümler</span>
            <h1 className="text-5xl md:text-7xl font-extralight text-white leading-[1.1] mb-6">
              Sınırları <span className="font-bold text-amber-500 italic">Siz Çizin,</span> <br />
              Biz Gerçeğe Dönüştürelim
            </h1>
            <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed mb-8 border-l-2 border-amber-600 pl-6">
              Standartların ötesinde, firmanızın karakterini dikişlerine kadar taşıyan premium iş kıyafetleri. Tasarımdan üretime her aşamada mükemmeliyet.
            </p>
          </div>
        </div>
      </section>

      {/* --- TASARIM SÜRECİ (GÖRSEL ADIMLAR) --- */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 mb-2">Kusursuz Üretim Döngüsü</h2>
            <div className="h-1 w-20 bg-amber-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Kreatif Tasarım", desc: "AR-GE ekibimizle vizyonunuzu dijital taslaklara döküyoruz.", img: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=600" },
              { title: "Zanaatlı Numune", desc: "Seri üretim öncesi kumaş ve kalıp kalitesini deneyimleyin.", img: "https://images.unsplash.com/photo-1524234107056-1c1f48f64ab8?auto=format&fit=crop&q=80&w=600" },
              { title: "Marka Entegrasyonu", desc: "Logonuzu en ileri nakış ve baskı teknikleriyle işliyoruz.", img: "https://images.unsplash.com/photo-1613913396648-560bb5ec8ec0?auto=format&fit=crop&q=80&w=600" }
            ].map((step, idx) => (
              <div key={idx} className="group relative">
                <div className="overflow-hidden  aspect-[4/5] mb-6 shadow-xl">
                  <img src={step.img} alt={step.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors"></div>
                </div>
                <span className="text-amber-600 font-bold text-4xl opacity-20 absolute -top-4 -left-4">0{idx + 1}</span>
                <h3 className="text-xl font-bold mb-2 text-slate-800">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PREMİUM DETAYLAR (İKONLU ADIMLAR) --- */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Kumaş Seçimi", icon: "🧵", sub: "Teknolojik & Dayanıklı" },
              { label: "Kurumsal Kimlik", icon: "🏛️", sub: "Tam Marka Uyumu" },
              { label: "Özel Etiket", icon: "🏷️", sub: "Prestijli Detaylar" },
              { label: "V.I.P Paketleme", icon: "📦", sub: "Kusursuz Teslimat" }
            ].map((item, idx) => (
              <div key={idx} className="p-8  border border-slate-100 bg-white shadow-sm hover:shadow-2xl transition-all text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h4 className="font-bold text-slate-800 mb-1">{item.label}</h4>
                <p className="text-xs text-amber-600 font-medium uppercase tracking-tighter">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BİLGİLENDİRME PANELİ --- */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <h3 className="text-3xl font-light italic">
              "Her firma benzersizdir; <span className="text-amber-500 font-bold">kıyafetleri de öyle olmalı.</span>"
            </h3>
            <div className="grid md:grid-cols-2 gap-12 text-left">
              <p className="text-slate-400 text-sm leading-relaxed">
                Yeni modellerimizi geliştirirken değişen farklı ihtiyaçları dikkate alıyoruz. Ancak her firmanın kendine özgü çalışma yöntemleri ve kuralları, personel kıyafetlerinde farklı fonksiyonel özellikler gerektirir. Biz, markanızın profilini yansıtan o özel tasarımı hayata geçiriyoruz.
              </p>
              <div className="space-y-4">
                <p className="text-slate-400 text-sm leading-relaxed italic border-l border-amber-500 pl-4">
                  Tasarım ve ARGE ekibimizle size en uygun ürünü bilgisayar ortamında geliştirerek tasarımdan üretime esnek ve hızlı bir sistemle hayata geçiriyoruz.
                </p>
                <div className="flex gap-4 pt-4">
                  <span className="px-4 py-2 bg-amber-600/20 text-amber-500 text-[10px] font-bold  border border-amber-600/30 uppercase">Antistatik</span>
                  <span className="px-4 py-2 bg-amber-600/20 text-amber-500 text-[10px] font-bold  border border-amber-600/30 uppercase">FR (Alev Almaz)</span>
                  <span className="px-4 py-2 bg-amber-600/20 text-amber-500 text-[10px] font-bold  border border-amber-600/30 uppercase">Yüksek Görünürlük</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SÜREÇLER & FOOTER CTA --- */}
      <section className="py-24">
        <div className="container mx-auto px-8">
          <div className="max-w-5xl mx-auto bg-slate-50  p-12 md:p-20 relative shadow-inner overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5  -mr-20 -mt-20"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <h4 className="text-sm font-bold tracking-[0.4em] text-amber-600 uppercase mb-12">Operasyonel Adımlar</h4>
              <div className="flex flex-col md:flex-row gap-8 items-start w-full mb-16">
                {[
                  "İhtiyaç Analizi & Dinleme",
                  "Dijital Tasarım & Onay",
                  "Master Numune Üretimi",
                  "Yüksek Standartlı Seri Üretim"
                ].map((text, i) => (
                  <div key={i} className="flex-1 flex gap-4 items-center">
                    <div className="w-8 h-8  bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">{i+1}</div>
                    <span className="text-sm font-semibold text-slate-700">{text}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center space-y-8 w-full border-t border-slate-200 pt-16">
                <h4 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Özel Üretim Atölyemize Başvurun</h4>
                <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
                  İhtiyaçlarınıza yönelik en doğru çözümü uzman müşteri temsilcilerimizle belirleyin.
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-6">
                  <a href="tel:+902164727300" className="bg-slate-900 text-white px-10 py-5  font-bold text-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-300">
                    +90 216 472 73 00
                  </a>
                  <a href="mailto:ismont@ismont.com.tr" className="bg-amber-600 text-white px-10 py-5  font-bold text-sm hover:bg-amber-700 transition-all shadow-lg hover:shadow-amber-200">
                    ismont@ismont.com.tr
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default OzelUretimPremium;