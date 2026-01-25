"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Instagram, Facebook, MessageCircle, Phone } from "lucide-react";

export default function SocialSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("socialSidebarOpen");
    if (stored !== null) setIsOpen(stored === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("socialSidebarOpen", String(isOpen));
  }, [isOpen]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const whatsappNumber = "+90 546 225 56 59";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}`;

  const socialLinks = [
    {
      name: "Instagram",
      link: "https://www.instagram.com/ispool",
      icon: Instagram,
    },
    {
      name: "Facebook",
      link: "https://www.facebook.com/p/Balkol%C3%BCx-Balkon-Bah%C3%A7e-Mobilyalar%C4%B1-61561591640222/",
      icon: Facebook,
    },
    { name: "WhatsApp", link: whatsappLink, icon: MessageCircle },
    { name: "Telefon", link: `tel:${whatsappNumber}`, icon: Phone },
  ];

  return (
    <div className="fixed left-3 bottom-3 md:left-8 md:bottom-8 z-[40]">
      <div className="flex items-center gap-3">
        {/* ANA TETİKLEYİCİ BUTON */}
        <motion.button
          onClick={toggleSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 shadow-xl ${
            isOpen
              ? "bg-slate-900 text-white"
              : "bg-white/80 backdrop-blur-md text-slate-800 border border-slate-200"
          }`}
          aria-label="İletişim"
        >
          <motion.div
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Plus size={22} strokeWidth={1.5} />
          </motion.div>
        </motion.button>

        {/* YANA DOĞRU SÜZÜLEN İKONLAR */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="flex items-center gap-2.5"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.08 } },
                hidden: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 },
                },
              }}
            >
              {socialLinks.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={{
                    hidden: { opacity: 0, x: -15, scale: 0.8 },
                    visible: { opacity: 1, x: 0, scale: 1 },
                  }}
                  className="group relative"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-900/90 backdrop-blur-sm border border-slate-400 flex items-center justify-center text-slate-200 hover:text-slate-300 hover:border-slate-400 hover:shadow-lg transition-all duration-300">
                    <item.icon size={18} strokeWidth={1.2} />
                  </div>

                  {/* Tooltip - Sadece Desktop'ta */}
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900 text-white text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded whitespace-nowrap">
                    {item.name}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
