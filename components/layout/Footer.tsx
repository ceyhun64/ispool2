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
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  const whatsappNumber = "+90 534 352 94 20"; // Tek yetkili iletişim numarası
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}`;

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/ispool",
      label: "Instagram",
      aria: "Instagram sayfamızı ziyaret edin",
    },
    {
      icon: Facebook,
      href: "https://www.facebook.com/ispool",
      label: "Facebook",
      aria: "Facebook sayfamızı ziyaret edin",
    },
    {
      icon: MessageCircle,
      href: whatsappLink,
      label: "WhatsApp",
      aria: "WhatsApp üzerinden bizimle iletişime geçin",
    },
    {
      icon: Phone,
      href: `tel:${whatsappNumber}`,
      label: "Telefon",
      aria: "Bizi telefonla arayın",
    },
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
        { label: "Kariyer", href: "/institutional/career" },
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
        { label: "İş Elbiseleri", href: "/products/category/1" },
        { label: "İş Ayakkabıları", href: "/products/category/2" },
        { label: "İş Eldivenleri", href: "/products/category/3" },
        { label: "Koruyucu Teknik Kıyafet", href: "/products/category/4" },
        { label: "İş Güvenlik Ekipmanları", href: "/products/category/5" },
        { label: "Outdoor", href: "/products/category/6" },
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
      {/* Avantajlar Barı */}
      <div className="hidden md:block border-b border-white/5 bg-white/5">
        <div className="container mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-wrap justify-between items-center gap-6 md:gap-8">
            {[
              { Icon: ShieldCheck, text: "EN ISO Sertifikalı Ürünler" },
              { Icon: Truck, text: "Aynı Gün Lojistik Çıkışı" },
              { Icon: MapPin, text: "Global Tedarik Ağı" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 min-w-fit">
                <item.Icon
                  className="text-orange-600 shrink-0"
                  size={24}
                  aria-hidden="true"
                />
                <span className="text-[11px] font-black tracking-widest text-white uppercase">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          {/* Sol Kolon: Logo ve Bülten */}
          <div className="xl:col-span-3 space-y-8">
            <Link
              href="/"
              className="inline-block"
              aria-label="İşPool Ana Sayfa"
            >
              <Image
                src="/logo/logofooter.png"
                alt="İşPool Logo"
                width={140}
                height={40}
                className="object-contain"
              />
            </Link>

            <div className="space-y-4">
              <label
                htmlFor="newsletter-email"
                className="text-white text-[11px] font-black tracking-widest uppercase block"
              >
                Bültene Katılın
              </label>
              <form
                onSubmit={handleSubscribe}
                className="relative group max-w-sm"
              >
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-sm bg-slate-900 border border-slate-800 p-4 pr-14 text-[13px] text-white focus:outline-none focus:border-orange-600 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  aria-label="Gönder"
                  // w-12 h-full yaparak butonu 48px genişliğine ulaştırdık
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-orange-600 hover:text-orange-400 transition-colors"
                >
                  <Mail size={22} aria-hidden="true" />
                </button>
              </form>
            </div>

            {/* Sosyal Medya - İkon tıklama alanları p-2.5 ile genişletildi */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.aria}
                  className="p-2.5 bg-white/5 text-slate-400 hover:bg-orange-600 hover:text-white transition-all rounded-sm flex items-center justify-center min-w-11 min-h-11"
                >
                  <social.icon size={20} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Sağ Kolon: Menüler */}
          <div className="xl:col-span-9 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
            {Object.entries(menuGroups).map(([key, group]) => (
              <div key={key} className="border-b border-white/5 md:border-none">
                <button
                  onClick={() => toggleSection(key)}
                  aria-expanded={openSection === key}
                  aria-controls={`section-${key}`}
                  // min-h-[48px] ile mobil menü başlıkları kolay tıklanır hale getirildi
                  className="w-full py-4 md:py-0 md:mb-6 flex items-center justify-between text-left focus:outline-none min-h-12 md:min-h-0"
                >
                  <h4 className="text-white text-[15px] font-bold uppercase tracking-tight">
                    {group.title}
                  </h4>
                  <ChevronDown
                    size={20}
                    className={cn(
                      "text-slate-500 transition-transform md:hidden",
                      openSection === key && "rotate-180",
                    )}
                  />
                </button>

                <ul
                  id={`section-${key}`}
                  className={cn(
                    "space-y-4 overflow-hidden transition-all duration-300 md:max-h-none",
                    openSection === key
                      ? "max-h-96 pb-6"
                      : "max-h-0 md:max-h-none",
                  )}
                >
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-slate-400 hover:text-white hover:translate-x-1 transition-all py-1.5 inline-block"
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

      {/* Alt Bar: Copyright ve Ödeme — mobilde pb-20 ile sabit bottom nav'ın altından kaçar */}
      <div className="bg-white pt-6 pb-20 lg:pb-6 border-t border-slate-200">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center md:text-left leading-relaxed">
            © {currentYear} İŞPOOL ENDÜSTRİYEL GÜVENLİK SİSTEMLERİ.{" "}
            <br className="md:hidden" /> TÜM HAKLARI SAKLIDIR.
          </div>
          <div className="relative h-8 w-64">
            <Image
              src="/iyzico/logo_band_colored@3x.webp"
              alt="iyzico ile güvenli ödeme seçenekleri"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
