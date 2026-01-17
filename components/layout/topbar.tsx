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
    { icon: <Instagram size={13} strokeWidth={2} />, href: "#" },
    { icon: <Linkedin size={13} strokeWidth={2} />, href: "#" },
    { icon: <Youtube size={13} strokeWidth={2} />, href: "#" },
  ];

  const menuItems = [
    { label: "Lojistik", icon: <Truck size={13} />, href: "/kargo-takibi" },
    {
      label: "Bayi Paneli",
      icon: <UserCheck size={13} />,
      href: "/bayi-girisi",
    },
    { label: "Katalog", icon: <FileText size={13} />, href: "/katalog" },
    { label: "Toptan Satış", icon: <Box size={13} />, href: "/toptan-satis" },
  ];

  return (
    <div className="w-full bg-[#0F1115] text-slate-400 hidden lg:block antialiased border-b border-white/[0.03] relative overflow-hidden">
      {/* Üstte Çok İnce Vurgu Çizgisi */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-600/30 to-transparent" />

      <div className="max-w-[1700px] mx-auto px-8">
        <div className="flex items-center justify-between h-11">
          {/* SOL BÖLÜM: Sosyal Medya & İletişim */}
          <div className="flex items-center gap-10">
            {/* Sosyal Medya - Minimalist Tasarım */}
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

            {/* Müşteri Hattı - Teknik ve Net */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-500">
                <Phone
                  size={12}
                  className="text-orange-500 group-hover:text-white transition-colors"
                />
              </div>
              <span className="text-[10px] font-black tracking-[0.15em] text-slate-400 group-hover:text-white transition-colors tabular-nums">
                DESTEK: 0850 000 00 00
              </span>
            </div>
          </div>

          {/* SAĞ BÖLÜM: Fonksiyonel Menü & CTA */}
          <div className="flex items-center h-full">
            <nav className="flex items-center h-full">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="group px-6 h-full flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all duration-300 relative border-r border-white/[0.03] last:border-r-0"
                >
                  <span className="flex items-center gap-3">
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
            <div className="h-full flex items-center ml-6 pl-6 border-l border-white/10">
              <a
                href="/kariyer"
                className="group relative flex items-center gap-3 bg-white text-black px-5 h-7 text-[9px] font-black tracking-[0.25em] transition-all duration-300 hover:bg-orange-600 hover:text-white"
              >
                <span className="relative z-10">KARİYER</span>
                <div className="relative z-10 w-3 h-3 flex items-center justify-center">
                  <ChevronRight
                    size={12}
                    className="absolute transition-all duration-300 group-hover:translate-x-1"
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
