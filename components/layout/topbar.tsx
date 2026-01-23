"use client";

import {
  Instagram,
  Youtube,
  Phone,
  Truck,
  ChevronRight,
  Mail,
  Users,
  Briefcase,
  Settings,
  Info,
  Facebook,
  MessageCircleMore, // WhatsApp için en uygun Lucide ikonu
} from "lucide-react";
import Link from "next/link";

export default function TopBar() {
  const socialMedia = [
    {
      icon: <Instagram size={13} strokeWidth={2} />,
      href: "https://www.instagram.com/ispool_is_kyafetleri?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    },
    {
      icon: <Facebook size={13} strokeWidth={2} />,
      href: "https://www.facebook.com/is.pool.is.k.yafetleri",
    },
  ];

  const menuItems = [
    { label: "İletişim", icon: <Mail size={13} />, href: "/help/contact" },
    {
      label: "Toptan Satış",
      icon: <Users size={13} />,
      href: "/products/wholesale",
    },
    {
      label: "Özel Üretim",
      icon: <Settings size={13} />,
      href: "/products/special_production",
    },
    {
      label: "Hakkımızda",
      icon: <Info size={13} />,
      href: "/institutional/about",
    },
    {
      label: "Kargo Takibi",
      icon: <Truck size={13} />,
      href: "/profile/cargo_tracking",
    },
  ];

  return (
    <div className="w-full bg-[#0F1115] text-slate-400 hidden lg:block antialiased border-b border-white/[0.03] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-600/30 to-transparent" />

      <div className="max-w-[1700px] mx-auto px-8">
        <div className="flex items-center justify-between h-11">
          {/* SOL BÖLÜM: Sosyal Medya & İletişim */}
          <div className="flex items-center gap-10">
            {/* Sosyal Medya */}
            <div className="flex items-center gap-5">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-slate-500 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="w-1 h-1 bg-white/10 rounded-full" />

            {/* Müşteri Hattı & WhatsApp */}
            <div className="flex items-center gap-6">
              {/* Sabit Telefon */}
              <a
                href="tel:+905343529420"
                className="flex items-center gap-3 group"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-orange-600 transition-all duration-500">
                  <Phone
                    size={12}
                    className="text-orange-500 group-hover:text-white transition-colors"
                  />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-[8px] font-black text-slate-500 tracking-widest uppercase mb-0.5 group-hover:text-orange-500 transition-colors">
                    Destek Hattı
                  </span>
                  <span className="text-[10px] font-black tracking-[0.1em] text-slate-200 tabular-nums">
                    0534 352 94 20
                  </span>
                </div>
              </a>

              {/* WhatsApp Hattı */}
              <a
                href="https://wa.me/900534359420" // Buraya numaranızı ekleyin
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#25D366] transition-colors duration-500">
                  <MessageCircleMore
                    size={12}
                    className="text-[#25D366] group-hover:text-white transition-colors"
                  />
                </div>
                <span className="text-[10px] font-black tracking-[0.15em] text-slate-400 group-hover:text-white transition-colors tabular-nums">
                  WHATSAPP
                </span>
              </a>
            </div>
          </div>

          {/* SAĞ BÖLÜM */}
          <div className="flex items-center h-full">
            <nav className="flex items-center h-full">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="group px-4 h-full flex items-center text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 hover:text-white transition-all duration-300 relative border-r border-white/[0.03] last:border-r-0"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-orange-600 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </span>
                    <span className="relative">
                      {item.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-orange-600 transition-all duration-300 group-hover:w-full" />
                    </span>
                  </span>
                </Link>
              ))}
            </nav>

            {/* Kariyer CTA */}
            <div className="h-full flex items-center ml-4 pl-4 border-l border-white/10">
              <Link
                href="/institutional/career"
                className="group relative flex items-center gap-3 bg-white text-black px-4 h-6 text-[9px] font-black tracking-[0.2em] transition-all duration-300 hover:bg-orange-600 hover:text-white"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Briefcase size={10} />
                  KARİYER
                </span>
                <ChevronRight
                  size={10}
                  className="relative z-10 transition-all duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
