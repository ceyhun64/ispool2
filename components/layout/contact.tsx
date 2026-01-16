"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

// --- YARDIMCI BİLEŞENLER ---

const MinimalContactItem = ({
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
  <div className="group flex flex-col gap-2 py-6 border-b border-slate-100 last:border-0">
    <div className="flex items-center gap-3 text-slate-400">
      <Icon size={14} strokeWidth={1.5} />
      <span className="text-[10px] uppercase tracking-[0.3em] font-medium">
        {label}
      </span>
    </div>
    {href ? (
      <a
        href={href}
        className="text-sm md:text-base font-light text-slate-800 hover:text-slate-500 transition-colors inline-flex items-center gap-1 w-fit"
      >
        {value}
        <ArrowUpRight
          size={14}
          className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </a>
    ) : (
      <span className="text-sm md:text-base font-light text-slate-800">
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients: ["balkoluxofficial@gmail.com"],
          subject: `Yeni Form Bildirimi: ${formData.name}`,
          message: `Müşteri Adı: ${formData.name}\nTelefon: ${formData.phone}\nE-posta: ${formData.email}\n\nMesaj: ${formData.message}`,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          "Mesajınız başarıyla iletildi. En kısa sürede dönüş yapılacaktır."
        );
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        toast.error(result.error || "Bir sorun oluştu.");
      }
    } catch (error) {
      console.error("Gönderim hatası:", error);
      toast.error("Şu anda mesajınız iletilemiyor. Lütfen daha sonra deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-light">
      <main className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        {/* HEADER */}
        <header className="max-w-3xl mb-24 space-y-4">
          <span className="text-[10px] tracking-[0.4em] uppercase text-slate-400 font-medium">
            İletişim
          </span>
          <h1 className="text-4xl md:text-6xl font-extralight tracking-tighter text-slate-900 italic leading-[1.1]">
            Mekanınıza Değer <br /> Katmak İçin Buradayız
          </h1>
          <p className="text-slate-500 max-w-md pt-4 leading-relaxed text-sm md:text-base">
            Sorularınız, iş birliği talepleriniz veya projeleriniz için bize
            dilediğiniz zaman ulaşabilirsiniz.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* SOL: İLETİŞİM BİLGİLERİ */}
          <section className="lg:col-span-5 space-y-2">
            <MinimalContactItem
              icon={MapPin}
              label="Atölye & Adres"
              value="Esentepe Bulvarı Prof Necmettin Erbakan Bulvarı No353, 01150 Çukurova/Adana"
            />
            <MinimalContactItem
              icon={Phone}
              label="Telefon"
              value="+90 546 225 56 59"
              href="tel:+905462255659"
            />
            <MinimalContactItem
              icon={Mail}
              label="E-posta"
              value="balkoluxofficial@gmail.com"
              href="mailto:balkoluxofficial@gmail.com"
            />
          </section>

          {/* SAĞ: FORM */}
          <section className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                <div className="group relative border-b border-slate-200 focus-within:border-slate-800 transition-colors">
                  <label
                    htmlFor="name"
                    className="text-[10px] uppercase tracking-widest text-slate-600 mb-2 block"
                  >
                    Adınız Soyadınız
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent pb-3 outline-none text-slate-800 placeholder:text-slate-400 font-light text-sm"
                    placeholder="Örn: Selin Yılmaz"
                    required
                  />
                </div>
                <div className="group relative border-b border-slate-200 focus-within:border-slate-800 transition-colors">
                  <label
                    htmlFor="phone"
                    className="text-[10px] uppercase tracking-widest text-slate-600 mb-2 block"
                  >
                    Telefon Numaranız
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-transparent pb-3 outline-none text-slate-800 placeholder:text-slate-400 font-light text-sm"
                    placeholder="05xx xxx xx xx"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-12">
                <div className="group relative border-b border-slate-200 focus-within:border-slate-800 transition-colors">
                  <label
                    htmlFor="email"
                    className="text-[10px] uppercase tracking-widest text-slate-600 mb-2 block"
                  >
                    E-posta
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent pb-3 outline-none text-slate-800 placeholder:text-slate-400 font-light text-sm"
                    placeholder="selin@example.com"
                    required
                  />
                </div>
              </div>

              <div className="group relative border-b border-slate-200 focus-within:border-slate-800 transition-colors">
                <label
                  htmlFor="message"
                  className="text-[10px] uppercase tracking-widest text-slate-600 mb-2 block"
                >
                  Mesajınız
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-transparent pb-3 outline-none text-slate-800 placeholder:text-slate-400 font-light text-sm resize-none min-h-[100px]"
                  placeholder="Projenizden bahsedin..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group flex items-center gap-4 text-xs tracking-[0.3em] uppercase font-bold text-slate-900 disabled:opacity-50 transition-opacity"
              >
                {isLoading ? "Gönderiliyor..." : "Mesajı Gönder"}
                <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                  <Send
                    size={14}
                    className={
                      isLoading
                        ? "animate-pulse"
                        : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    }
                  />
                </div>
              </button>
            </form>
          </section>
        </div>

        {/* HARİTA SECTION */}
        <section className="mt-32 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative w-full aspect-video md:aspect-[21/9] bg-slate-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3183.9685387949653!2d35.23500959999999!3d37.05823290000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15288937bb30296f%3A0xba1e46a2a25b37f5!2sBalkoL%C3%BCX%20Balkon%20ve%20Bah%C3%A7e%20Mobilyalar%C4%B1!5e0!3m2!1str!2str!4v1768113624881!5m2!1str!2str"
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>
      </main>
    </div>
  );
}
