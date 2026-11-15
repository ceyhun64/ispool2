"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Instagram,
  Facebook,
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { sortCategoriesByDisplayOrder } from "@/lib/categoryOrder";

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
    alisveris: {
      title: "Alışveriş",
      // Kategoriler ortak gösterim sırasıyla dizilir; Toplu Alım ve Özel
      // Tasarım listede olmadığı için kendi sırasıyla sonda kalır.
      links: sortCategoriesByDisplayOrder(
        [
          { label: "İş Elbiseleri", href: "/products/category/1" },
          {
            label: "İş Ayakkabıları",
            orderName: "İş Ayakkabıları ve Ayak Koruma",
            href: "/products/category/2",
          },
          { label: "İş Eldivenleri", href: "/products/category/3" },
          { label: "Koruyucu Teknik Kıyafet", href: "/products/category/4" },
          { label: "İş Güvenlik Ekipmanları", href: "/products/category/5" },
          { label: "Outdoor", href: "/products/category/6" },
          { label: "Toplu Alım", href: "/products/wholesale" },
          { label: "Özel Tasarım", href: "/products/special_production" },
        ],
        (l) => l.orderName ?? l.label,
      ),
    },
    sirket: {
      title: "Şirket",
      links: [
        { label: "Hakkımızda", href: "/institutional/about" },
        { label: "Neden İşPool?", href: "/institutional/why_us" },
        { label: "Kalite Yaklaşımımız", href: "/institutional/quality" },
        { label: "Markalarımız", href: "/institutional/partners" },
        { label: "İşPool Blog", href: "/institutional/blog" },
        { label: "Kariyer", href: "/institutional/career" },
        { label: "İletişim", href: "/help/contact" },
      ],
    },
    destek: {
      title: "Destek ve Yasal",
      links: [
        { label: "Sıkça Sorulan Sorular", href: "/help/faq" },
        { label: "İade ve Değişim Koşulları", href: "/help/returns-help" },
        { label: "Kargo Takibi", href: "/profile/cargo_tracking" },
        { label: "Logo Baskı ve Nakış", href: "/help/printing" },
        { label: "Havale ve EFT Bilgileri", href: "/customer/bank-details" },
        { label: "Gizlilik Politikası", href: "/customer/privacy" },
        { label: "KVKK", href: "/help/kvkk" },
        { label: "Mesafeli Satış Sözleşmesi", href: "/help/distance-sales" },
        { label: "Kullanım Koşulları", href: "/customer/terms" },
        { label: "Çerez Politikası", href: "/institutional/cookie_policy" },
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
    <footer className="bg-sax-950 text-sax-100/80 relative border-t-4 border-orange-600 font-sans">
      {/* Bülten şeridi */}
      <div className="bg-sax-900">
        <div className="container mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-10">
          <label
            htmlFor="newsletter-email"
            className="text-white text-[12px] font-bold tracking-widest uppercase block"
          >
            Bültene Katılın
          </label>
          <form
            onSubmit={handleSubscribe}
            className="relative w-full md:max-w-md"
          >
            <input
              id="newsletter-email"
              type="email"
              placeholder="E-posta adresiniz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm bg-sax-950 border border-sax-700 p-4 pr-14 text-[13px] text-white placeholder:text-sax-100/50 focus:outline-none focus:border-sax-600 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              aria-label="Gönder"
              className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-orange-500 hover:text-orange-400 transition-colors"
            >
              <Mail size={22} aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-12 md:py-16">
        <Link
          href="/"
          className="inline-block mb-10"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-12">
          {Object.entries(menuGroups).map(([key, group]) => (
            <div key={key} className="border-b border-white/10 md:border-none">
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
                    "text-sax-100/60 transition-transform md:hidden",
                    openSection === key && "rotate-180",
                  )}
                />
              </button>

              <ul
                id={`section-${key}`}
                className={cn(
                  "space-y-3 overflow-hidden transition-all duration-300 md:max-h-none",
                  openSection === key
                    ? "max-h-[40rem] pb-6"
                    : "max-h-0 md:max-h-none",
                )}
              >
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-sax-100/80 hover:text-white hover:translate-x-1 transition-all py-1 inline-block"
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

      {/* Alt Bar: telif ve sosyal ikonlar — mobilde pb-20 ile sabit bottom nav'ın altından kaçar */}
      <div className="pt-6 pb-20 lg:pb-6 border-t border-white/10">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-sax-100/70 text-center md:text-left leading-relaxed">
            © {currentYear} İŞPOOL ENDÜSTRİYEL GÜVENLİK SİSTEMLERİ.{" "}
            <br className="md:hidden" /> TÜM HAKLARI SAKLIDIR.
          </div>
          <div className="flex items-center gap-3">
            {socialLinks.map((social, i) => (
              <a
                key={i}
                href={social.href}
                aria-label={social.aria}
                className="p-2.5 bg-white/5 text-sax-100/80 hover:bg-orange-600 hover:text-white transition-all rounded-sm flex items-center justify-center min-w-11 min-h-11"
              >
                <social.icon size={20} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
