"use client";

import {
  Instagram,
  Facebook,
  Phone,
  Truck,
  ChevronRight,
  Mail,
  Users,
  Settings,
  Info,
  Briefcase,
  MessageCircleMore,
} from "lucide-react";
import Link from "next/link";

export default function TopBar() {
  const socialMedia = [
    {
      icon: <Instagram size={14} strokeWidth={1.8} />,
      href: "https://www.instagram.com/ispool_is_kyafetleri",
    },
    {
      icon: <Facebook size={14} strokeWidth={1.8} />,
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
    <div className="hidden lg:block w-full bg-[#0E1116] text-slate-400 border-b border-white/[0.04]">
      {/* subtle top glow */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-600/20 to-transparent" />

      <div className="max-w-[1700px] mx-auto px-8">
        <div className="flex items-center justify-between h-11 text-[10px]">
          {/* LEFT */}
          <div className="flex items-center gap-8">
            {/* SOCIAL */}
            <div className="flex items-center gap-4">
              {socialMedia.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <span className="w-px h-4 bg-white/10" />

            {/* CONTACT */}
            <div className="flex items-center gap-6">
              {/* PHONE */}
              <a
                href="tel:+905343529420"
                className="flex items-center gap-3 group"
              >
                <span className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                  <Phone
                    size={12}
                    className="text-orange-500 group-hover:text-white"
                  />
                </span>
                <div className="leading-tight">
                  <div className="text-[8px] tracking-widest uppercase text-slate-500 group-hover:text-orange-500">
                    Destek Hattı
                  </div>
                  <div className="text-[11px] font-semibold tracking-wide text-slate-200 tabular-nums">
                    0534 352 94 20
                  </div>
                </div>
              </a>

              {/* WHATSAPP */}
              <a
                href="https://wa.me/900534359420"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group"
              >
                <span className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center group-hover:bg-[#25D366] transition-colors">
                  <MessageCircleMore
                    size={12}
                    className="text-[#25D366] group-hover:text-white"
                  />
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-slate-400 group-hover:text-white">
                  WHATSAPP
                </span>
              </a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center h-full">
            <nav className="flex items-center h-full">
              {menuItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="group h-full px-4 flex items-center gap-2
                             text-[9px] font-semibold tracking-[0.18em] uppercase
                             text-slate-400 hover:text-white
                             border-r border-white/[0.04] last:border-r-0 transition-colors"
                >
                  <span className="text-orange-600 opacity-70 group-hover:opacity-100">
                    {item.icon}
                  </span>
                  <span className="relative">
                    {item.label}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-orange-600 transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              ))}
            </nav>

            {/* CAREER CTA */}
            <div className="ml-4 pl-4 h-full flex items-center border-l border-white/10">
              <Link
                href="/institutional/career"
                className="group inline-flex items-center gap-2
                           px-4 h-7 text-[9px] font-semibold tracking-[0.2em]
                           border border-orange-600/50 text-orange-500
                           hover:bg-orange-600 hover:text-white
                           transition-all"
              >
                <Briefcase size={11} />
                KARİYER
                <ChevronRight
                  size={11}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
