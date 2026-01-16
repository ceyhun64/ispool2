"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Instagram,
  Facebook,
  Phone,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Truck,
  Mail,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
      title: "KURUMSAL STRATEJİ",
      links: [
        { label: "Hakkımızda", href: "/institutional/about" },
        { label: "Sertifikalarımız", href: "/institutional/certificates" },
        { label: "Neden İşPool?", href: "/institutional/why_us" },
        { label: "İletişim", href: "/contact" },
      ],
    },
    cozumler: {
      title: "ENDÜSTRİYEL ÇÖZÜMLER",
      links: [
        { label: "Kurumsal Tedarik", href: "/institutional/corporate" },
        { label: "Teknik Şartnameler", href: "/specs" },
        { label: "Kargo Takip", href: "/profile/cargo_tracking" },
        { label: "Ödeme Seçenekleri", href: "/contracts/payment_options" },
      ],
    },
    yasal: {
      title: "YASAL MEVZUAT",
      links: [
        { href: "/contracts/kvkk", label: "KVKK Aydınlatma" },
        { href: "/contracts/distance_sale", label: "Satış Sözleşmesi" },
        { href: "/contracts/personal_data", label: "Veri Politikası" },
        { href: "/contracts/cookie_policy", label: "Çerezler" },
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
      {/* Üst Bilgi Bantı: İSG Güven Paneli */}
      <div className="border-b border-white/5 bg-white/5">
        <div className="container mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-wrap justify-between gap-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-orange-600" size={24} />
              <span className="text-[11px] font-black tracking-widest text-white uppercase">
                EN ISO Sertifikalı Ürünler
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="text-orange-600" size={24} />
              <span className="text-[11px] font-black tracking-widest text-white uppercase">
                Aynı Gün Lojistik Çıkışı
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-orange-600" size={24} />
              <span className="text-[11px] font-black tracking-widest text-white uppercase">
                Global Tedarik Ağı
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* 1. Kolon: Marka ve İletişim */}
          <div className="lg:col-span-4 space-y-10">
            <Link
              href="/"
              className="inline-block brightness-0 invert opacity-100"
            >
              <Image
                src="/logo/logois2.png"
                alt="İşPool"
                width={160}
                height={50}
                className="object-contain"
              />
            </Link>

            <p className="text-slate-400 text-[14px] leading-relaxed font-medium max-w-sm italic border-l-2 border-orange-600 pl-6">
              "İş güvenliği bir maliyet değil, sürdürülebilir üretimin temel
              taşıdır. Teknik tekstilde mühendislik çözümleri sunuyoruz."
            </p>

            <div className="space-y-4">
              <h5 className="text-white text-[11px] font-black tracking-[0.2em] uppercase">
                Bizi Takip Edin
              </h5>
              <div className="flex items-center gap-3">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className="w-10 h-10 flex items-center justify-center bg-white/5 text-slate-400 hover:bg-orange-600 hover:text-white transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Orta Alan: Link Grupları */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(menuGroups).map(([key, group]) => (
              <div key={key} className="space-y-8">
                <h4 className="text-white text-[11px] font-black tracking-[0.2em] uppercase">
                  {group.title}
                </h4>
                <ul className="space-y-4">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[13px] font-semibold text-slate-500 hover:text-orange-500 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 3. Sağ Kolon: Bülten */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white/5 p-8  border border-white/5">
              <h4 className="text-white text-[11px] font-black tracking-[0.2em] uppercase mb-4">
                TEKNİK BÜLTEN
              </h4>
              <p className="text-[12px] text-slate-400 font-medium leading-relaxed mb-6">
                Yeni yönetmelikler ve ürün teknolojileri hakkında periyodik
                bilgilendirme alın.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 p-4 text-[13px] text-white focus:outline-none focus:border-orange-600 transition-all "
                  />
                  <Mail
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600"
                    size={18}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-white hover:text-slate-950 text-white font-black text-[11px] tracking-[0.2em] py-4 transition-all duration-500 uppercase"
                >
                  {loading ? "KAYDEDİLİYOR..." : "ABONE OL"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* En Alt Bar */}
      <div className="bg-black py-8 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">
            © {currentYear} İŞPOOL ENDÜSTRİYEL GÜVENLİK SİSTEMLERİ.
          </div>

          <div className="flex items-center gap-8 transition-all duration-500">
            <Image
              src="/iyzico/logo_band_colored@3x.webp"
              alt="Güvenli Ödeme"
              width={200}
              height={35}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
