"use client";

import {
  Instagram,
  Facebook,
  Phone,
  Truck,
  ChevronRight,
  Mail,
  Info,
  Briefcase,
  MessageCircleMore,
  Package,
  Ruler,
} from "lucide-react";
import Link from "next/link";

export default function TopBar() {
  const socialMedia = [
    {
      icon: <Instagram size={15} />,
      href: "https://www.instagram.com/ispool_is_kyafetleri",
    },
    {
      icon: <Facebook size={15} />,
      href: "#",
    },
  ];

  const menuItems = [
    { label: "İletişim", icon: <Mail size={14} />, href: "/help/contact" },
    {
      label: "Hakkımızda",
      icon: <Info size={14} />,
      href: "/institutional/about",
    },
    {
      label: "Kargo Takibi",
      icon: <Truck size={14} />,
      href: "/profile/cargo_tracking",
    },
  ];

  const highlightItems = [
    {
      label: "Toptan Satış",
      icon: <Package size={14} />,
      href: "/products/wholesale",
      color: "bg-orange-600 hover:bg-orange-700",
    },
    {
      label: "Özel Üretim",
      icon: <Ruler size={14} />,
      href: "/products/special_production",
      color: "bg-slate-800 hover:bg-slate-900",
    },
  ];

  return (
    <div className="w-full relative z-50 shadow-sm border-b border-white/10">
      {/* MOBILE TOPBAR - Yatay Kaydırılabilir Modern Tasarım */}
      <div className="lg:hidden bg-slate-950 px-4 py-2.5 flex items-center gap-3 overflow-x-auto no-scrollbar">
        {highlightItems.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className={`flex-none flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow-lg active:scale-95 transition-all ${item.color}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
        <div className="h-6 w-[1px] bg-white/20 flex-none" />
        <a href="tel:+905343529420" className="flex-none text-white p-2">
          <Phone size={18} />
        </a>
      </div>

      {/* DESKTOP TOPBAR */}
      <div className="hidden lg:block bg-slate-950 text-white">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-11">
          {/* LEFT: Sosyal Medya ve İletişim */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              {socialMedia.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="text-slate-400 hover:text-orange-500 transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="h-4 w-[1px] bg-white/10" />

            <div className="flex items-center gap-5">
              <a
                href="tel:+905343529420"
                className="group flex items-center gap-2"
              >
                <Phone
                  size={13}
                  className="text-orange-500 group-hover:animate-pulse"
                />
                <span className="text-[11px] font-medium tracking-tight text-slate-300 group-hover:text-white transition-colors">
                  0534 352 94 20
                </span>
              </a>

              <a
                href="https://wa.me/900534359420"
                className="flex items-center gap-1.5 text-[11px] font-bold text-green-500 hover:text-green-400 transition-colors"
              >
                <MessageCircleMore size={14} />
                WHATSAPP DESTEK
              </a>
            </div>
          </div>

          {/* RIGHT: Navigasyon ve Özel Butonlar */}
          <div className="flex items-center gap-2 h-full">
            <nav className="flex items-center gap-1">
              {menuItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="px-3 py-1 text-[11px] font-medium text-slate-300 hover:text-white transition-all rounded-md hover:bg-white/5"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 ml-4">
              {highlightItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 h-8 text-[10px] font-extrabold uppercase tracking-widest text-white rounded-md transition-all duration-300 shadow-sm ${item.color}`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              <Link
                href="/institutional/career"
                className="flex items-center gap-2 px-4 h-8 text-[10px] font-extrabold bg-white text-slate-950 hover:bg-orange-500 hover:text-white transition-all duration-300 rounded-md ml-2"
              >
                <Briefcase size={13} />
                KARİYER
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
