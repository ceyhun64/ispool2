"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Instagram,
  Facebook,
  Phone,
  ShieldCheck,
  Truck,
  Mail,
  MapPin,
  MessageCircle,
  ChevronDown, // Yeni ikon eklendi
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils"; // Tailwind sınıflarını yönetmek için yardımcı

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Mobil accordion durumu için state
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  const whatsappNumber = "+90 546 225 56 59";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}`;

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/ispool",
      label: "Instagram",
    },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: MessageCircle, href: whatsappLink, label: "WhatsApp" },
    { icon: Phone, href: `tel:${whatsappNumber}`, label: "Telefon" },
  ];

  const menuGroups = {
    kurumsal: {
      title: "Kurumsal",
      links: [
        { label: "Hakkımızda", href: "/institutional/about" },
        { label: "İşPool Neden Farklıdır?", href: "/institutional/why_us" },
        { label: "Kalite Politikamız", href: "/institutional/quality" },
        { label: "İşPool Blog", href: "/institutional/blog" },
        { label: "İş Ortaklarımız", href: "/institutional/partners" },
      ],
    },
    musteriIliskileri: {
      title: "Müşteri İlişkileri",
      links: [
        { label: "Banka Hesap Bilgileri", href: "/customer/bank-details" },
        { label: "Gizlilik ve Güvenlik", href: "/customer/privacy" },
        { label: "Satış Sözleşmesi", href: "/customer/sales-agreement" },
        { label: "Site Kullanım Şartları", href: "/customer/terms" },
        { label: "İade ve Değişim", href: "/customer/returns" },
      ],
    },
    populerLinkler: {
      title: "Popüler Linkler",
      links: [
        { label: "İş Ayakkabıları", href: "/category/shoes" },
        { label: "Toz Maskeleri", href: "/category/masks" },
        { label: "İş Pantolonları", href: "/category/pants" },
        { label: "İkaz Yelekleri", href: "/category/vests" },
        { label: "İş Yelekleri", href: "/category/work-vests" },
        { label: "Koruyucu Teknik Giysiler", href: "/category/protective" },
        { label: "Yüksek Görünümlü Ürünler", href: "/category/hi-vis" },
      ],
    },
    yardim: {
      title: "Yardım",
      links: [
        { label: "İletişim", href: "/help/contact" },
        { label: "Sıkça Sorulan Sorular", href: "/help/faq" },
        { label: "KVKK", href: "/help/kvkk" },
        { label: "Mesafeli Satış Sözleşmesi", href: "/help/distance-sales" },
        { label: "Banka Bilgileri & Havale Bildirim", href: "/help/bank-info" },
        { label: "İade ve Değişim", href: "/help/returns-help" },
        { label: "Baskı ve Nakış Hizmetleri", href: "/help/printing" },
      ],
    },
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!response.ok) throw new Error();
      toast.success("Bültene başarıyla kayıt oldunuz.");
      setEmail("");
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 relative border-t-4 border-orange-600 font-sans">
      {/* Üst Bilgi Bantı - Mobilde gizlendi, orta ve büyük ekranlarda görünür */}
      <div className="hidden md:block border-b border-white/5 bg-white/5">
        <div className="container mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-wrap justify-between items-center gap-6 md:gap-8">
            {[
              { Icon: ShieldCheck, text: "EN ISO Sertifikalı Ürünler" },
              { Icon: Truck, text: "Aynı Gün Lojistik Çıkışı" },
              { Icon: MapPin, text: "Global Tedarik Ağı" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 min-w-fit">
                <item.Icon className="text-orange-600 shrink-0" size={24} />
                <span className="text-[11px] font-black tracking-widest text-white uppercase whitespace-nowrap">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          {/* 1. Kolon: Marka ve Bülten */}
          <div className="xl:col-span-3 space-y-8">
            <Link
              href="/"
              className="inline-block brightness-0 invert opacity-100"
            >
              <Image
                src="/logo/logois2.png"
                alt="İşPool"
                width={140}
                height={40}
                className="object-contain"
              />
            </Link>

            <div className="space-y-4">
              <h4 className="text-white text-[11px] font-black tracking-widest uppercase">
                Bültene Katılın
              </h4>
              <form onSubmit={handleSubscribe} className="relative group">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-3 pr-12 text-[13px] text-white focus:outline-none focus:border-orange-600 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-600 hover:text-white transition-colors"
                >
                  <Mail size={20} />
                </button>
              </form>
            </div>

            <div className="flex items-center gap-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-9 h-9 flex items-center justify-center bg-white/5 text-slate-400 hover:bg-orange-600 hover:text-white transition-all"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Orta Alan: Accordion Link Grupları */}
          <div className="xl:col-span-9 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
            {Object.entries(menuGroups).map(([key, group]) => (
              <div key={key} className="border-b border-white/5 md:border-none">
                {/* Accordion Başlığı (Mobilde buton, masaüstünde düz yazı) */}
                <button
                  onClick={() => toggleSection(key)}
                  className="w-full md:cursor-default py-4 md:py-0 flex items-center justify-between text-left focus:outline-none group"
                >
                  <h4 className="text-white text-[15px] font-bold">
                    {group.title}
                  </h4>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "text-slate-500 transition-transform md:hidden",
                      openSection === key && "rotate-180",
                    )}
                  />
                </button>

                {/* Link Listesi (Mobilde gizlenip açılır, masaüstünde hep açık) */}
                <ul
                  className={cn(
                    "space-y-3 overflow-hidden transition-all duration-300 ease-in-out md:max-h-none md:mt-6 md:pb-0",
                    openSection === key
                      ? "max-h-96 pb-6 mt-2"
                      : "max-h-0 md:max-h-none",
                  )}
                >
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alt Bar */}
      <div className="bg-black py-8 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600 text-center md:text-left">
            © {currentYear} İŞPOOL ENDÜSTRİYEL GÜVENLİK SİSTEMLERİ.
          </div>
          <Image
            src="/iyzico/logo_band_colored@3x.webp"
            alt="Güvenli Ödeme"
            width={200}
            height={35}
            className="object-contain"
          />
        </div>
      </div>
    </footer>
  );
}
