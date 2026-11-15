"use client";

import { Instagram, Facebook, Phone, Truck, MessageCircleMore } from "lucide-react";
import Link from "next/link";

export default function TopBar() {
  const socialMedia = [
    {
      icon: <Instagram size={15} />,
      href: "https://www.instagram.com/ispool_is_kyafetleri",
      label: "Instagram sayfamız",
    },
    {
      icon: <Facebook size={15} />,
      href: "#",
      label: "Facebook sayfamız",
    },
  ];

  return (
    <div
      data-topbar="true"
      className="w-full relative z-50 shadow-sm border-b border-white/10"
    >
      {/* MOBILE TOPBAR */}
      <div className="lg:hidden bg-sax-950 px-4 py-2.5 flex items-center justify-center gap-1 overflow-x-auto no-scrollbar">
        <a
          href="tel:+905343529420"
          className="flex-none text-white p-2"
          aria-label="Bizi Arayın"
        >
          <Phone size={18} />
        </a>
      </div>

      {/* DESKTOP TOPBAR */}
      <div className="hidden lg:block bg-sax-950 text-white">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-9 text-[12px]">
          {/* LEFT */}
          <div className="flex items-center gap-5">
            <a
              href="tel:+905343529420"
              className="group flex items-center gap-2"
              aria-label="Telefon numaramız: 0534 352 94 20"
            >
              <Phone
                size={13}
                className="text-orange-500 group-hover:animate-pulse"
              />
              <span className="text-[12px] font-medium tracking-tight text-slate-200 group-hover:text-white transition-colors">
                0534 352 94 20
              </span>
            </a>

            <a
              href="https://wa.me/905343529420"
              className="flex items-center gap-1.5 text-[12px] font-bold text-green-500 hover:text-green-400 transition-colors"
              aria-label="WhatsApp destek hattı"
            >
              <MessageCircleMore size={14} />
              WHATSAPP DESTEK
            </a>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">
            <Link
              href="/profile/cargo_tracking"
              className="flex items-center gap-1.5 text-[12px] font-medium text-slate-200 hover:text-white transition-colors"
            >
              <Truck size={14} />
              Kargo Takibi
            </Link>

            <div className="flex items-center gap-3">
              {socialMedia.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="text-slate-300 hover:text-orange-500 transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
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
