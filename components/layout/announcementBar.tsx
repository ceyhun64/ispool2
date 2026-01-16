"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Truck, ArrowUpRight } from "lucide-react";

export default function AnnouncementBar() {
  const announcements = [
    {
      text: "EN ISO SERTİFİKALI KORUMA",
      icon: <ShieldCheck size={14} />,
      link: "/sertifikalar",
    },
    {
      text: "KURUMSAL B2B AVANTAJLARI",
      icon: <Zap size={14} />,
      link: "/kurumsal",
    },
    {
      text: "SAAT 15:00'A KADAR AYNI GÜN SEVKİYAT",
      icon: <Truck size={14} />,
      link: "/teslimat",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 h-11 flex items-center border-b border-white/10 group">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          ease: "linear",
          duration: 25,
          repeat: Infinity,
        }}
        // Hover yapıldığında durdurma özelliği
        whileHover={{ animationPlayState: "paused" }}
        className="flex shrink-0 whitespace-nowrap items-center"
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center">
            {announcements.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center px-12 relative group/item"
              >
                <Link
                  href={item.link}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-orange-500 group-hover/item:text-orange-400 transition-colors">
                    {item.icon}
                  </span>
                  <span className="text-[10px] font-black tracking-[0.15em] text-slate-300 group-hover/item:text-white transition-all uppercase">
                    {item.text}
                  </span>
                  <ArrowUpRight 
                    size={10} 
                    className="text-slate-600 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all" 
                  />
                </Link>
                
                {/* Modern Ayraç - Eğik Çizgi */}
                <div className="ml-12 w-[1px] h-4 bg-slate-800 rotate-[25deg] group-hover:bg-orange-500/50 transition-colors" />
              </div>
            ))}
          </div>
        ))}
      </motion.div>

      {/* Modern Gradient Masking */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
      
      {/* Üstte İnce Vurgu Çizgisi */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
    </div>
  );
}

// Link bileşeni Next.js projesinde olduğu için import edilmelidir
import Link from "next/link";