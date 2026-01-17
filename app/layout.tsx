import type { Metadata, Viewport } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import ScrollToTopButton from "@/components/layout/scrollToTop";
import { CartProvider } from "@/contexts/cartContext";
import { FavoriteProvider } from "@/contexts/favoriteContext";
import { Toaster } from "sonner";
import CookieConsent from "@/components/layout/cookieConsent";

// ✅ Teknik ve Endüstriyel Tipografi
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// ✅ İş Güvenliği Temasına Uygun Metadata (Gaziantep kaldırıldı)
export const metadata: Metadata = {
  title: "İşPool | Premium İş Elbiseleri ve Endüstriyel Güvenlik Çözümleri",
  description:
    "Yüksek standartlı, teknik donanımlı iş elbiseleri ve profesyonel iş güvenliği ekipmanları.",
};

export const viewport: Viewport = {
  themeColor: "#ea580c", // Safety Orange
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body
        className={`${inter.variable} ${geistSans.variable} antialiased bg-[#fafafa] text-slate-900 overflow-x-hidden`}
      >
        <CartProvider>
          <FavoriteProvider>
            <ClientLayoutWrapper>
              {/* MODERN ENDÜSTRİYEL ARKA PLAN 
                - radial-gradient: Teknik çizim kağıdı dokusu
                - scanline-effect: Sayfaya derinlik katan hafif çizgiler
              */}
              <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/50" />
              </div>

              <main className="min-h-screen font-sans selection:bg-orange-600 selection:text-white relative">
                {/* Sayfa Akışı */}
                {children}

                <CookieConsent />
              </main>
            </ClientLayoutWrapper>

            <ScrollToTopButton />

            {/* PREMIUM ENDÜSTRİYEL TOASTER TASARIMI 
              - Dark-tech tema
              - Keskin köşeler (4px)
              - Vurgulu sol kenarlık (Safety Orange)
            */}
            <Toaster
              richColors={false}
              closeButton={true}
              position="bottom-right"
              toastOptions={{
                style: {
                  borderRadius: "2px", // Daha keskin ve kurumsal hatlar
                  padding: "20px",
                  background: "#020617", // Slate-950 Teknik Siyah
                  color: "#f8fafc",
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  minWidth: "350px",
                  borderLeft: "5px solid #ea580c", // Ana vurgu rengi
                },
              }}
            />
          </FavoriteProvider>
        </CartProvider>
      </body>
    </html>
  );
}
