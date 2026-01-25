"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowUpRight,
  Clock,
  Globe,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: ["ispoolofficial@gmail.com"],
          subject: `Yeni İletişim Formu: ${formData.name}`,
          message: `Gönderen: ${formData.name}\nE-Posta: ${formData.email}\n\nMesaj:\n${formData.message}`,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(
          "Mesajınız başarıyla iletildi. En kısa sürede döneceğiz.",
        );
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(result.error || "Bir hata oluştu.");
      }
    } catch (error: any) {
      toast.error(
        error.message || "Mesaj gönderilemedi, lütfen tekrar deneyin.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-orange-600 selection:text-white">
      <main className="max-w-[1400px] mx-auto px-6 py-24 md:py-40">
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-32">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <span className="text-[10px] tracking-[0.5em] text-orange-600 font-bold uppercase block">
                İletişim Kanalları
              </span>
              <h1 className="text-5xl md:text-7xl font-extralight tracking-tighter leading-[0.9]">
                Sizin için <br />
                <span className="font-bold">buradayız.</span>
              </h1>
            </motion.div>
          </div>
          <div className="lg:col-span-4 flex items-end">
            <p className="text-slate-400 text-sm leading-relaxed max-w-[280px]">
              Projeleriniz, talepleriniz veya teknik destek ihtiyaçlarınız için
              küresel standartlarda kurumsal destek sağlıyoruz.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          <aside className="lg:col-span-4 space-y-16">
            <div className="space-y-12">
              <ContactItem
                icon={<MapPin size={18} />}
                title="Genel Merkez"
                content="Fatih Mah. Kazım Kara Bekir Cad. No: 144/A, Uşak"
                subContent="Pazartesi — Cuma / 09:00 — 18:00"
              />
              <ContactItem
                icon={<Phone size={18} />}
                title="Doğrudan Hat"
                content="+90 546 225 56 59"
                href="tel:+905462255659"
              />
              <ContactItem
                icon={<Mail size={18} />}
                title="Dijital Yazışma"
                content="ispoolofficial@gmail.com"
                href="mailto:ispoolofficial@gmail.com"
              />
            </div>
            <div className="pt-12 border-t border-slate-100 flex items-center gap-4 text-slate-400 text-[10px] tracking-widest uppercase font-bold">
              <Globe size={14} className="text-orange-600" />
              <span>Uşak, Türkiye — Global Shipping</span>
            </div>
          </aside>

          <section className="lg:col-span-8">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
            >
              <div className="group space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 group-focus-within:text-orange-600 transition-colors">
                  İsim Soyisim
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-slate-200 py-4 outline-none focus:border-orange-600 transition-all text-lg font-light placeholder:text-slate-200"
                  placeholder="Ali Yılmaz"
                  required
                />
              </div>
              <div className="group space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 group-focus-within:text-orange-600 transition-colors">
                  E-Posta
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-slate-200 py-4 outline-none focus:border-orange-600 transition-all text-lg font-light placeholder:text-slate-200"
                  placeholder="office@company.com"
                  required
                />
              </div>
              <div className="md:col-span-2 group space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 group-focus-within:text-orange-600 transition-colors">
                  Mesajınız
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-transparent border-b border-slate-200 py-4 outline-none focus:border-orange-600 transition-all text-lg font-light resize-none placeholder:text-slate-200"
                  placeholder="Projenizden kısaca bahsedin..."
                  required
                />
              </div>
              <div className="md:col-span-2 pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative flex items-center gap-4 bg-slate-900 text-white px-12 py-6 overflow-hidden transition-all hover:bg-orange-600 disabled:bg-slate-200 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.3em]">
                    {isLoading ? "Gönderiliyor..." : "Mesajı İletin"}
                  </span>
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin relative z-10" />
                  ) : (
                    <Send
                      size={16}
                      className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        <section className="mt-40 border-t border-slate-100 pt-20">
          <div className="flex justify-between items-center mb-10">
            <h5 className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-400 italic">
              Location Terminal v1.0
            </h5>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock size={12} />
              <span className="text-[10px] uppercase">GMT +3</span>
            </div>
          </div>
          <div className="aspect-[21/7] w-full bg-slate-50 relative overflow-hidden rounded-xl border border-slate-100 group">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3131.796033873426!2d29.4184654!3d38.6534563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c87f872338d977%3A0xc3f34568868f7b3a!2sİspool%20İş%20Güvenliği!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
              className="absolute inset-0 w-full h-full grayscale contrast-125 opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 border-0"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function ContactItem({ icon, title, content, subContent, href }: any) {
  return (
    <div className="group space-y-3">
      <div className="flex items-center gap-3 text-orange-600 transition-transform group-hover:translate-x-1">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
          {title}
        </span>
      </div>
      <div className="space-y-1">
        {href ? (
          <a
            href={href}
            className="text-xl font-medium hover:text-orange-600 transition-colors flex items-center gap-2"
          >
            {content}
            <ArrowUpRight
              size={14}
              className="opacity-20 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
            />
          </a>
        ) : (
          <p className="text-xl font-medium leading-tight text-slate-800">
            {content}
          </p>
        )}
        {subContent && (
          <p className="text-xs text-slate-400 font-medium">{subContent}</p>
        )}
      </div>
    </div>
  );
}
