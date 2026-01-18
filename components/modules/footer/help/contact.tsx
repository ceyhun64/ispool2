"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";

// --- YARDIMCI BİLEŞENLER ---

const ContactInfoCard = ({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: any;
  label: string;
  value: string;
  href?: string;
}) => (
  <div className="flex flex-col gap-1 py-6 border-b border-slate-200 last:border-0">
    <div className="flex items-center gap-2 text-slate-500 mb-1">
      <Icon size={14} className="text-slate-400" />
      <span className="text-[11px] uppercase tracking-widest font-semibold italic">
        {label}
      </span>
    </div>
    {href ? (
      <a
        href={href}
        className="text-base font-medium text-slate-800 hover:text-blue-700 transition-colors inline-flex items-center gap-1.5 group w-fit"
      >
        {value}
        <ArrowUpRight
          size={14}
          className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0"
        />
      </a>
    ) : (
      <span className="text-base font-medium text-slate-800 leading-relaxed">
        {value}
      </span>
    )}
  </div>
);

// --- ANA BİLEŞEN ---

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: ["ispoolofficial@gmail.com"],
          subject: `Kurumsal İletişim Formu: ${formData.name}`,
          message: `Müşteri: ${formData.name}\nTel: ${formData.phone}\nE-posta: ${formData.email}\n\nMesaj: ${formData.message}`,
        }),
      });

      if (response.ok) {
        toast.success("Mesajınız başarıyla kurumsal sistemimize iletildi.");
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        toast.error("Bir hata oluştu, lütfen tekrar deneyiniz.");
      }
    } catch (error) {
      toast.error("Bağlantı hatası oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      <main className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        {/* ÜST BAŞLIK ALANI */}
        <header className="max-w-3xl mb-24 border-l-4 border-slate-900 pl-8">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={16} className="text-slate-400" />
            <span className="text-xs uppercase tracking-[0.3em] text-slate-500 font-bold">
              Professional Solutions
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 leading-tight mb-6">
            İş Dünyası İçin <br />
            <span className="font-serif italic text-slate-600">
              Yüksek Standartlı
            </span>{" "}
            Çözümler
          </h1>
          <p className="text-slate-500 text-lg max-w-xl font-light leading-relaxed">
            Kurumsal kimliğinizi yansıtan premium iş elbiseleri ve güvenlik
            ekipmanları projeleriniz için profesyonel ekibimizle iletişime
            geçin.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          {/* SOL: KURUMSAL BİLGİLER */}
          <section className="lg:col-span-4 space-y-2">
            <div className="pb-8 mb-8 border-b border-slate-100">
              <h3 className="text-sm uppercase tracking-widest font-bold text-slate-900 mb-2">
                Merkez Ofis & Atölye
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed uppercase tracking-tighter">
                Resmi yazışmalar ve ziyaretleriniz için randevu alınız.
              </p>
            </div>

            <ContactInfoCard
              icon={MapPin}
              label="Adres"
              value="Fatih Mahallesi, Kazım Kara Bekir Caddesi No 144 a, 64000 Merkez/Uşak"
            />
            <ContactInfoCard
              icon={Phone}
              label="Kurumsal Hattımız"
              value="+90 546 225 56 59"
              href="tel:+905462255659"
            />
            <ContactInfoCard
              icon={Mail}
              label="E-posta"
              value="ispoolofficial@gmail.com"
              href="mailto:ispoolofficial@gmail.com"
            />

            <div className="mt-12 flex items-center gap-3 text-slate-400">
              <Clock size={16} />
              <span className="text-xs font-medium italic">
                Hafta içi: 09:00 - 18:00 | Hafta sonu: Kapalı
              </span>
            </div>
          </section>

          {/* SAĞ: İLETİŞİM FORMU */}
          <section className="lg:col-span-8 bg-slate-50 p-8 md:p-12 border border-slate-100 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-[11px] uppercase tracking-widest font-bold text-slate-600"
                  >
                    Ad Soyad
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 px-4 py-3 outline-none focus:border-slate-900 transition-colors text-sm"
                    placeholder="Adınız ve Soyadınız"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-[11px] uppercase tracking-widest font-bold text-slate-600"
                  >
                    İrtibat Numarası
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 px-4 py-3 outline-none focus:border-slate-900 transition-colors text-sm"
                    placeholder="05xx xxx xx xx"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-[11px] uppercase tracking-widest font-bold text-slate-600"
                >
                  E-posta Adresi
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 px-4 py-3 outline-none focus:border-slate-900 transition-colors text-sm"
                  placeholder="kurumsal@sirketiniz.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-[11px] uppercase tracking-widest font-bold text-slate-600"
                >
                  Talebiniz / Mesajınız
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-white border border-slate-200 px-4 py-3 outline-none focus:border-slate-900 transition-colors text-sm resize-none"
                  placeholder="Ürün talepleriniz veya sorularınız hakkında detaylı bilgi veriniz..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-slate-800 transition-all disabled:bg-slate-400 group"
              >
                {isLoading ? "İletiliyor..." : "Formu Gönder"}
                <Send
                  size={14}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
              </button>
            </form>
          </section>
        </div>

        {/* HARİTA ALANI: SADE VE ŞIK */}
        <section className="mt-32">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-slate-900" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold">
                Resmi Lokasyonumuz
              </span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase italic">
              Güvenli ve Modern Tesis
            </span>
          </div>
          <div className="relative aspect-video md:aspect-[21/8] bg-slate-100 overflow-hidden border border-slate-200 transition-all duration-1000">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3114.7891129993463!2d29.370786199999998!3d38.6767144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c87f27d51a8911%3A0xaebf3af5f1f9655e!2zxLDFniBQT09MIMSwxZ4gS0lZQUZFVExFUsSwIMSwTUFMQVRJIFZFIEfDnFZFTkzEsEsgRUvEsFBNQU5MQVJJ!5e0!3m2!1str!2str!4v1768723978625!5m2!1str!2str"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
