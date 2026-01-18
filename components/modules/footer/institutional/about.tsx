"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  ArrowUpRight,
  Shield,
  HardHat,
  Construction,
  Briefcase,
  Factory,
  Target,
  CheckCircle2,
  Users,
  Award,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

// --- YARDIMCI BİLEŞENLER ---

const SectionTitle = ({
  subtitle,
  title,
}: {
  subtitle: string;
  title: string;
}) => (
  <div className="space-y-4 mb-16">
    <div className="flex items-center gap-4">
      <span className="text-[10px] tracking-[0.5em] uppercase text-orange-600 font-bold">
        {subtitle}
      </span>
      <div className="h-[1px] flex-1 bg-slate-200" />
    </div>
    <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter uppercase">
      {title}
    </h2>
  </div>
);

const ContentSection = ({
  title,
  text,
  image,
  alt,
  list,
  reverse,
}: {
  title: string;
  text?: string;
  image: string;
  alt: string;
  list?: string[];
  reverse: boolean;
}) => (
  <div
    className={`flex flex-col ${
      reverse ? "md:flex-row-reverse" : "md:flex-row"
    } gap-12 md:gap-24 items-center py-24 border-b border-slate-100 last:border-0`}
  >
    <div className="w-full md:w-1/2 relative aspect-[4/5] overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover transition-transform duration-1000 hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 bg-slate-900 text-white p-6 md:p-8">
        <Shield className="w-6 h-6 text-orange-600 mb-2" />
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase">
          CE & ISO Sertifikalı
        </p>
      </div>
    </div>

    <div className="w-full md:w-1/2 space-y-8">
      <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
        {title}
      </h3>
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed text-base md:text-lg font-medium">
          {text}
        </p>
      </div>
      {list && (
        <div className="grid grid-cols-1 gap-4 pt-6">
          {list.map((item, i) => (
            <div key={i} className="flex items-start gap-4 group">
              <CheckCircle2 className="w-5 h-5 text-orange-600 mt-1 shrink-0" />
              <span className="font-bold text-slate-800 tracking-tight uppercase text-sm group-hover:text-orange-600 transition-colors">
                {item}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

// --- ANA BİLEŞEN ---

export default function AboutPage() {
  const sections = [
    {
      title: "Güvenliğin Yeni Standartı",
      text: `İşPool, ağır sanayiden lojistik operasyonlarına kadar geniş bir yelpazede "sıfır iş kazası" vizyonuyla hareket eder. Bizim için bir iş elbisesi sadece bir üniforma değildir; o, personelin fiziksel bütünlüğünü koruyan birinci hat savunma mekanizmasıdır. Modern üretim tekniklerimizi, ergonomik tasarımlarla birleştirerek zorlu çalışma koşullarında dahi personelin hareket kabiliyetini maksimumda tutuyoruz. Her bir dikiş, uluslararası İSG regülasyonlarına tam uyum sağlamak amacıyla titizlikle incelenir.`,
      image: "/about/2.jpg",
      alt: "Yüksek görünürlüklü iş elbiseleri",
      list: [
        "Aşınmaya Dayanıklı Teknik Kumaş Teknolojisi",
        "Gövde Isısını Optimize Eden Nefes Alabilir Yapı",
        "Gece Operasyonları İçin Yüksek Görünürlüklü Reflektifler",
      ],
      reverse: false,
    },
    {
      title: "Uçtan Uca Teknik Tedarik",
      text: `Endüstriyel sahaların ihtiyacı olan teknik donanımı sağlamak, sadece ürün satışı değil bir mühendislik disiplinidir. Baş koruyuculardan emniyet ayakkabılarına, düşüş durdurucu sistemlerden solunum maskelerine kadar tüm ürün gamımızda Avrupa Birliği standartlarını (CE, EN) temel alıyoruz. Uşak lojistik merkezimiz üzerinden tüm Türkiye'ye yayılmış hızlı dağıtım ağımızla, projelerinizin aksamadan devam etmesini sağlıyoruz. Kurumsal çözüm ortaklığımız, satış sonrası teknik destek ve eğitim faaliyetlerini de kapsayan bütüncül bir yaklaşımdır.`,
      image: "/about/1.jpg",
      alt: "İş güvenliği donanımları",
      list: [
        "Kategorize Edilmiş Risk Analizine Uygun KKD Seçimi",
        "Toplu Alımlarda Kurumsal Kimliğe Özel Markalama",
        "Sürekli Stok Takibi ve Hızlı Sevkiyat Güvencesi",
      ],
      reverse: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-slate-900 selection:text-white font-sans">
      {/* HERO SECTION */}
      <header className="relative py-24 md:py-32 px-6 bg-slate-50 border-b border-slate-200">
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-12"
          >
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-600" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-slate-400 font-bold">
                  İşPool Industrial / Kurumsal Profil
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 uppercase leading-[0.95]">
                İnsan Faktörünü <br />
                <span className="text-orange-600 font-black">
                  Merkeze Alıyoruz
                </span>
              </h1>

              <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                İşPool Industrial, profesyonel personelin ihtiyaç duyduğu yüksek
                dayanıklılıktaki iş elbiselerini ve teknik güvenlik
                ekipmanlarını modern bir vizyonla üretir.
              </p>
            </div>

            <div className="hidden lg:flex flex-col border-l-2 border-orange-600 pl-8 space-y-2">
              <span className="text-[40px] font-black text-slate-900 leading-none tracking-tighter uppercase">
                Güvenlik
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Taviz Verilemez Tek Değerimiz
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* DETAYLI HAKKIMIZDA METNİ - NEW SECTION */}
        <section className="py-24 border-b border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <h4 className="text-xs font-bold text-orange-600 uppercase tracking-[0.3em]">
                Hikayemiz ve Değerlerimiz
              </h4>
              <p className="text-2xl font-bold text-slate-900 leading-snug">
                Uşak'tan doğan bir güçle, Türkiye'nin endüstriyel dönüşümüne
                güvenli adımlarla eşlik ediyoruz.
              </p>
            </div>
            <div className="space-y-6 text-slate-500 font-medium leading-relaxed">
              <p>
                İşPool Industrial, kuruluşundan bu yana iş sağlığı ve güvenliği
                alanında "geleneksel tedarikçi" kalıplarını yıkarak "çözüm
                ortağı" kimliğiyle öne çıkmıştır. Üretim tesislerimizde
                kullandığımız her iplik, tedarik ettiğimiz her kask, bir
                çalışanın akşam ailesine sağ salim dönmesi sorumluluğunu taşır.
              </p>
              <p>
                Bugün otomotivden madenciliğe, inşaattan gıda üretimine kadar
                Türkiye'nin öncü kuruluşlarına hizmet verirken; sadece bugünü
                değil, sürdürülebilir üretim tekniklerimizle yarını da koruma
                altına alıyoruz. Teknolojinin imkanlarını kullanarak, personelin
                verimliliğini düşürmeden güvenliğini artıran akıllı tekstil
                ürünleri üzerine Ar-Ge çalışmalarımızı sürdürüyoruz.
              </p>
            </div>
          </div>
        </section>

        {/* HİKAYE BÖLÜMLERİ */}
        <section>
          {sections.map((sec, idx) => (
            <ContentSection key={idx} {...sec} />
          ))}
        </section>

        {/* İSTATİSTİKSEL GÖRÜNÜM - NEW SECTION */}
        <section className="py-24 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Yıllık Üretim Kapasitesi", val: "500K+" },
            { label: "Mutlu Kurumsal Partner", val: "1200+" },
            { label: "Sertifikalı Ürün Gamı", val: "850+" },
            { label: "Lojistik Ulaşım Gücü", val: "81 İl" },
          ].map((stat, i) => (
            <div key={i} className="space-y-2 border-l border-slate-200 pl-6">
              <p className="text-3xl md:text-4xl font-black text-slate-900">
                {stat.val}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* ÖZET DEĞERLER */}
        <section className="py-24 grid grid-cols-1 md:grid-cols-3 gap-px  border-y border-slate-200">
          {[
            {
              t: "İleri Teknoloji Üretim",
              d: "Otomatik kesim sistemleri ve hata payını sıfıra indiren dikiş robotları ile yüksek kaliteli üretim parkuru.",
              icon: <Factory size={28} />,
            },
            {
              t: "Sertifikalı Güvence",
              d: "Ürünlerimizin tamamı akredite laboratuvarlarda test edilmiş, CE ve EN normlarına tam uygunluk belgesine sahiptir.",
              icon: <Award size={28} />,
            },
            {
              t: "Müşteri Odaklı Analiz",
              d: "Firmanıza özel risk analizi yaparak, personelinize en uygun donanımı seçmeniz için profesyonel danışmanlık.",
              icon: <Users size={28} />,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-12 bg-white hover:bg-slate-50 transition-colors group"
            >
              <div className="text-orange-600 mb-8">{item.icon}</div>
              <h4 className="text-lg font-black uppercase tracking-tighter text-slate-900 mb-4">
                {item.t}
              </h4>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                {item.d}
              </p>
            </div>
          ))}
        </section>

        {/* İLETİŞİM */}
        <section className="py-32">
          <SectionTitle
            subtitle="Kurumsal İletişim"
            title="Toplu Tedarik Talepleri İçin"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 border border-slate-100">
            {[
              {
                icon: Phone,
                label: "Müşteri Hattı",
                val: "+90 546 225 56 59",
                href: "tel:+905462255659",
              },
              {
                icon: Mail,
                label: "Kurumsal E-Posta",
                val: "ispoolofficial@gmail.com",
                href: "mailto:ispoolofficial@gmail.com",
              },
              {
                icon: Instagram,
                label: "Sosyal Ağlar",
                val: "@ispoolindustrial",
                href: "https://www.instagram.com/ispool",
              },
              {
                icon: MapPin,
                label: "Lojistik Merkezi",
                val: "Uşak / Türkiye",
                href: "#",
              },
            ].map((item, i) => (
              <a
                href={item.href}
                key={i}
                className="group flex flex-col justify-between p-10 bg-white hover:bg-slate-900 transition-all duration-500 h-64"
              >
                <div className="flex justify-between items-start">
                  <item.icon className="w-6 h-6 text-slate-900 group-hover:text-orange-600 transition-colors" />
                  <ArrowUpRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold">
                    {item.label}
                  </span>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-white transition-colors">
                    {item.val}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER STRIP */}
      <footer className="bg-slate-900 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <p className="text-[10px] text-slate-500 tracking-[0.4em] font-bold uppercase">
            © 2026 İşpool Industrial & Safety / Koruyucu Ekipman Çözümleri
          </p>
          <div className="flex gap-12">
            {["İSG Uyum", "Direnç", "Maksimum Koruma"].map((t) => (
              <span
                key={t}
                className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
