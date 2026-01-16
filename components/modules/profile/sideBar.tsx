"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LogOut,
  User,
  MapPin,
  Package,
  Truck,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface User {
  name: string;
  surname: string;
}

interface MenuItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  const menuItems: Record<string, MenuItem[]> = {
    HESABIM: [
      { name: "Profil Detayları", path: "/profile", icon: User },
      { name: "Kayıtlı Adresler", path: "/profile/addresses", icon: MapPin },
    ],
    ALIŞVERİŞ: [
      { name: "Sipariş Geçmişi", path: "/profile/orders", icon: Package },
      { name: "Kargo Takip", path: "/profile/cargo_tracking", icon: Truck },
    ],
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/account/check");
        const data = await res.json();
        setUser(data.user || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      toast.success("Oturum güvenle kapatıldı.");
      router.push("/");
    } catch {
      toast.error("Bir hata oluştu.");
    }
  };

  return (
    <aside className="w-full md:w-64 lg:w-72 md:min-h-screen bg-slate-50/50">
      <div className="flex flex-col py-12 px-6 h-full border-r border-slate-200/60 bg-white">
        {/* User Identity Section - Industrial Card Style */}
        <div className="mb-12 relative overflow-hidden p-6  bg-slate-100 text-slatw-800 ">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 opacity-10 -translate-y-8 translate-x-6">
            <ShieldCheck size={100} />
          </div>

          {loading ? (
            <div className="space-y-3 relative z-10">
              <Skeleton className="h-2 w-16 bg-slate-700" />
              <Skeleton className="h-5 w-32 bg-slate-700" />
            </div>
          ) : (
            <div className="relative z-10 flex flex-col">
            
              <h2 className="text-base font-bold tracking-tight uppercase truncate">
                {user ? `${user.name} ${user.surname}` : "Misafir Kullanıcı"}
              </h2>
              {user && (
                <button
                  onClick={handleLogout}
                  className="mt-4 flex items-center gap-2 text-[10px] tracking-widest text-slate-500 hover:text-red-600 transition-colors uppercase w-fit font-bold"
                >
                  <LogOut size={12} className="stroke-[2.5px]" />
                  <span>Güvenli Çıkış</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-10 flex-1">
          {Object.entries(menuItems).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-4 bg-orange-500" />
                <h3 className="text-[10px] tracking-[0.4em] text-slate-400 font-black uppercase">
                  {category}
                </h3>
              </div>

              <ul className="space-y-1">
                {items.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={cn(
                          "group flex items-center gap-3 px-4 py-3 text-[13px] font-bold transition-all duration-300  relative",
                          isActive
                            ? "bg-slate-50 text-slate-950 shadow-sm border border-slate-100"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
                        )}
                      >
                        <item.icon
                          size={16}
                          className={cn(
                            "transition-all duration-300",
                            isActive
                              ? "text-orange-600 stroke-[2.5px]"
                              : "text-slate-300 group-hover:text-slate-600"
                          )}
                        />
                        <span className="tracking-tight flex-1">
                          {item.name}
                        </span>

                        {isActive ? (
                          <ChevronRight size={14} className="text-orange-600" />
                        ) : (
                          <ChevronRight
                            size={14}
                            className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate-300"
                          />
                        )}

                        {/* Active Indicator Bar */}
                        {isActive && (
                          <motion.div
                            layoutId="activeTabSidebar"
                            className="absolute left-0 w-1 h-6 bg-orange-600"
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer Area - Corporate Branding */}
        <div className="mt-10 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 animate-pulse" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
              Sunucu Bağlantısı Aktif
            </span>
          </div>
          <p className="text-[9px] tracking-[0.2em] text-slate-300 uppercase font-medium">
            © 2026 İşPool Endüstriyel
          </p>
        </div>
      </div>
    </aside>
  );
}
