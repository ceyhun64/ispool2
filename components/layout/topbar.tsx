"use client";

import {
  Instagram,
  Linkedin,
  Youtube,
  Phone,
  FileText,
  Truck,
  Box,
  ChevronRight,
  Store,
  Mail,
  Users,
  Briefcase,
  Settings,
  Info,
} from "lucide-react";
import Link from "next/link";

export default function TopBar() {
  const socialMedia = [
    { icon: <Instagram size={13} strokeWidth={2} />, href: "#" },
    { icon: <Linkedin size={13} strokeWidth={2} />, href: "#" },
    { icon: <Youtube size={13} strokeWidth={2} />, href: "#" },
  ];

  const menuItems = [
   
    { label: "İletişim", icon: <Mail size={13} />, href: "/help/contact" },
    { label: "Toptan Satış", icon: <Users size={13} />, href: "/products/wholesale" },
    {
      label: "Özel Üretim",
      icon: <Settings size={13} />,
      href: "/products/special_production",
    },
    { label: "Hakkımızda", icon: <Info size={13} />, href: "/institutional/about" },
    { label: "Kargo Takibi", icon: <Truck size={13} />, href: "/profile/cargo_tracking" },
  ];

  return (
    <div className="w-full bg-[#0F1115] text-slate-400 hidden lg:block antialiased border-b border-white/[0.03] relative overflow-hidden">
      {/* Üstte Çok İnce Vurgu Çizgisi */}
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

            {/* Ayırıcı Nokta */}
            <div className="w-1 h-1 bg-white/10 rounded-full" />

            {/* Müşteri Hattı */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-500">
                <Phone
                  size={12}
                  className="text-orange-500 group-hover:text-white transition-colors"
                />
              </div>
              <span className="text-[10px] font-black tracking-[0.15em] text-slate-400 group-hover:text-white transition-colors tabular-nums">
                DESTEK: 0216 472 73 00
              </span>
            </div>
          </div>

          {/* SAĞ BÖLÜM: Fonksiyonel Menü & Kariyer CTA */}
          <div className="flex items-center h-full">
            <nav className="flex items-center h-full">
              {menuItems.map((item, index) => (
                <a
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
                </a>
              ))}
            </nav>

            {/* Kariyer CTA - Endüstriyel Premium Buton */}
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
