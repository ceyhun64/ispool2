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
      icon: <Instagram size={14} strokeWidth={2} />,
      href: "https://www.instagram.com/ispool_is_kyafetleri",
    },
    {
      icon: <Facebook size={14} strokeWidth={2} />,
    },
  ];

  const menuItems = [
    { label: "İletişim", icon: <Mail size={13} />, href: "/help/contact" },
    {
      label: "Toptan Satış",
      icon: <Package size={14} />,
      href: "/products/wholesale",
      highlight: true,
      className:
        "bg-white text-orange-700 hover:bg-orange-100 shadow-[0_0_15px_rgba(0,0,0,0.35)]",
    },
    {
      label: "Özel Üretim",
      icon: <Ruler size={14} />,
      href: "/products/special_production",
      highlight: true,
      className:
        "bg-white text-orange-700 hover:bg-orange-100 shadow-[0_0_15px_rgba(255,115,0,0.45)]",
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

  // Sadece Mobil İçin Filtrelenmiş Butonlar
  const mobileButtons = menuItems.filter((item) => item.highlight);

  return (
    <div className="w-full bg-amber-500 lg:bg-amber-500  relative z-50">
      {/* MOBILE TOPBAR - Arkaplan Beyaz, Butonlar Turuncu */}
      <div className="lg:hidden flex items-center justify-center gap-3 py-2 px-4 bg-white">
        {mobileButtons.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="flex-1 flex items-center justify-center gap-2 h-10 text-[10px] font-black uppercase rounded-lg transition-all bg-amber-500 text-white shadow-md active:scale-95"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>

      {/* DESKTOP TOPBAR */}
      <div className="hidden lg:block max-w-[1700px] mx-auto px-8">
        <div className="flex items-center justify-between h-12 text-[10px]">
          {/* LEFT */}
          <div className="flex items-center gap-10">
            {/* SOCIAL */}
            <div className="flex items-center gap-4">
              {socialMedia.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-950 hover:text-black hover:scale-110 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <span className="w-px h-5 bg-black/20" />

            {/* CONTACT */}
            <div className="flex items-center gap-8">
              <a
                href="tel:+905343529420"
                className="flex items-center gap-3 group"
              >
                <span className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center group-hover:bg-black transition-all duration-300 shadow">
                  <Phone
                    size={13}
                    className="text-orange-950 group-hover:text-white transition-colors"
                  />
                </span>
                <div className="flex flex-col">
                  <span className="text-[7.5px] tracking-[0.15em] uppercase text-orange-950 font-bold">
                    Destek Hattı
                  </span>
                  <span className="text-[12px] font-bold text-black tracking-tight tabular-nums">
                    0534 352 94 20
                  </span>
                </div>
              </a>

              <a
                href="https://wa.me/900534359420"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-green-500/40 shadow-[0_0_15px_rgba(37,211,102,0.25)] hover:bg-green-500 hover:text-white transition-all duration-300"
              >
                <MessageCircleMore size={14} className="text-green-600" />
                <span className="text-[10px] font-bold tracking-widest text-green-700">
                  WHATSAPP
                </span>
              </a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center h-full gap-2">
            <nav className="flex items-center h-full">
              {menuItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className={`group relative flex items-center gap-2.5 px-5 h-8 text-[10px] font-bold tracking-wider uppercase transition-all duration-300
                    ${item.highlight ? `rounded-md ${item.className} mx-1` : "text-slate-950 hover:text-black hover:bg-white/40"}
                  `}
                >
                  <span
                    className={`transition-transform ${item.highlight ? "scale-110 group-hover:scale-125" : "group-hover:scale-110"}`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {!item.highlight && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="ml-4 h-full flex items-center">
              <Link
                href="/institutional/career"
                className="group flex items-center gap-2 px-5 h-8 text-[10px] font-black tracking-[0.15em] bg-orange-500 text-white hover:bg-black hover:text-white transition-all duration-300 rounded-md shadow-[0_0_20px_rgba(0,0,0,0.25)]"
              >
                <Briefcase size={12} strokeWidth={2.5} />
                KARİYER
                <ChevronRight
                  size={12}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
