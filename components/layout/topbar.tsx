"use client";

import {
  Instagram,
  Linkedin,
  Youtube,
  Phone,
  FileText,
  UserCheck,
  Truck,
  Box,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function TopBar() {
  const socialMedia = [
    { icon: <Instagram size={12} />, href: "#" },
    { icon: <Linkedin size={12} />, href: "#" },
    { icon: <Youtube size={12} />, href: "#" },
  ];

  const menuItems = [
    { label: "Lojistik", icon: <Truck size={12} />, href: "/kargo-takibi" },
    {
      label: "Bayi Paneli",
      icon: <UserCheck size={12} />,
      href: "/bayi-girisi",
    },
    { label: "Katalog", icon: <FileText size={12} />, href: "/katalog" },
    { label: "Toptan Satış", icon: <Box size={12} />, href: "/toptan-satis" },
  ];

  return (
    <div className="w-full bg-[#0F1115] text-slate-400 hidden lg:block antialiased border-b border-white/5 relative overflow-hidden">
      {/* İnce Endüstriyel Çizgi Efekti */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-600/50 to-transparent opacity-50" />

      <div className="max-w-[1600px] mx-auto px-8">
        <div className="flex items-center justify-between h-10">
          {/* SOL: Kurumsal Bilgiler & Sertifikasyon */}
          <div className="flex items-center gap-8 h-full">
            <div className="flex items-center gap-4 border-r border-white/10 pr-8 h-4">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="hover:text-orange-500 transition-all duration-300 hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-6 text-[10px] font-bold tracking-wider">
              <div className="flex items-center gap-2 group cursor-pointer transition-colors hover:text-white">
                <Phone
                  size={12}
                  className="text-orange-600 group-hover:animate-pulse"
                />
                <span className="tabular-nums uppercase">
                  Müşteri Hattı: 0850 000 00 00
                </span>
              </div>

             
            </div>
          </div>

          {/* SAĞ: Fonksiyonel Navigasyon */}
          <div className="flex items-center h-full">
            <nav className="flex items-center h-full">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="px-5 h-full flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 border-l border-white/5 first:border-l-0"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-orange-600/80 group-hover:text-orange-500 transition-colors">
                      {item.icon}
                    </span>
                    {item.label}
                  </span>
                </a>
              ))}
            </nav>

            {/* Kariyer/B2B CTA - Endüstriyel Vurgu */}
            <div className="h-full flex items-center ml-4">
              <a
                href="/kariyer"
                className="group flex items-center gap-2 bg-orange-600 hover:bg-white text-white hover:text-black px-4 h-10 text-[10px] font-black tracking-[0.2em] transition-all duration-500"
              >
                KARİYER
                <div className="relative overflow-hidden w-3 h-3">
                  <ChevronRight
                    size={12}
                    className="absolute transition-all duration-300 group-hover:translate-x-4"
                  />
                  <ChevronRight
                    size={12}
                    className="absolute -translate-x-4 transition-all duration-300 group-hover:translate-x-0"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
