import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google"; // Playfair yerine daha teknik olan Inter eklendi
import "./globals.css";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import ScrollToTopButton from "@/components/layout/scrollToTop";
import { CartProvider } from "@/contexts/cartContext";
import { FavoriteProvider } from "@/contexts/favoriteContext";
import { Toaster } from "sonner";
import CookieConsent from "@/components/layout/cookieConsent";

// ✅ Endüstriyel ve Modern Font Optimizasyonu
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

// ✅ İş Güvenliği Temasına Uygun Metadata
export const metadata: Metadata = {
  title: "İşPool | İş Elbiseleri ve İş Güvenliği Ekipmanları",
  description:
    "Gaziantep merkezli, yüksek standartlı iş elbiseleri ve iş güvenliği çözümleri.",
};

export const viewport: Viewport = {
  themeColor: "#ea580c", // İş güvenliği turuncusu
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${inter.variable} ${geistSans.variable} antialiased bg-[#fcfcfc]`}
      >
        <CartProvider>
          <FavoriteProvider>
            <ClientLayoutWrapper>
              {/* Modern Grid Arka Plan Efekti (Opsiyonel teknik doku) */}
              <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              <main className="min-h-screen font-sans selection:bg-orange-600 selection:text-white">
                {children}
                <CookieConsent />
              </main>
            </ClientLayoutWrapper>

            <ScrollToTopButton />

            {/* Endüstriyel Arayüze Uygun Bildirim Tasarımı */}
            <Toaster
              richColors={true}
              closeButton={true}
              position="top-center" // Güvenlik uyarıları genellikle üstte daha dikkat çeker
              toastOptions={{
                style: {
                  borderRadius: "4px", // Daha sert, endüstriyel hatlar
                  padding: "16px 24px",
                  background: "#0f172a", // Koyu lacivert/siyah profesyonel zemin
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow:
                    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "13px",
                  fontWeight: "600",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  minWidth: "320px",
                  borderLeft: "4px solid #ea580c", // İş güvenliği vurgu rengi
                },
              }}
            />
          </FavoriteProvider>
        </CartProvider>
      </body>
    </html>
  );
}
