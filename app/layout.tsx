import type { Metadata, Viewport } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import ScrollToTopButton from "@/components/layout/scrollToTop";
import { CartProvider } from "@/contexts/cartContext";
import { FavoriteProvider } from "@/contexts/favoriteContext";
import { Toaster } from "sonner";
import CookieConsent from "@/components/layout/cookieConsent";

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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ispool.com.tr";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "İşPool | Premium İş Elbiseleri ve Endüstriyel Güvenlik Çözümleri",
    template: "%s | İşPool",
  },
  description:
    "Yüksek standartlı, teknik donanımlı iş elbiseleri ve profesyonel iş güvenliği ekipmanları. CE sertifikalı ürünler, kurumsal baskı ve nakış hizmetleri.",
  keywords: [
    "iş elbisesi",
    "iş güvenliği ekipmanları",
    "iş ayakkabısı",
    "reflektörlü yelek",
    "kask",
    "eldiven",
    "koruyucu giysi",
    "toplu alım",
    "kurumsal iş kıyafeti",
    "CE sertifikalı",
    "İşPool",
  ],
  authors: [{ name: "İşPool Endüstriyel Güvenlik" }],
  creator: "İşPool",
  publisher: "İşPool",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: BASE_URL,
    siteName: "İşPool",
    title: "İşPool | Premium İş Elbiseleri ve Endüstriyel Güvenlik Çözümleri",
    description:
      "Yüksek standartlı iş elbiseleri ve iş güvenliği ekipmanları. CE sertifikalı ürünler, hızlı teslimat.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "İşPool - Premium İş Elbiseleri ve Güvenlik Ekipmanları",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "İşPool | Premium İş Elbiseleri",
    description:
      "CE sertifikalı iş elbiseleri ve güvenlik ekipmanları. Hızlı kargo, kurumsal çözümler.",
    images: ["/og-image.png"],
    creator: "@ispool",
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "",
  },
};

export const viewport: Viewport = {
  themeColor: "#ea580c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "İşPool Endüstriyel Güvenlik Sistemleri",
  url: BASE_URL,
  logo: `${BASE_URL}/logo/logoyeni.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+90-546-225-56-59",
    contactType: "customer service",
    availableLanguage: "Turkish",
  },
  sameAs: ["https://www.instagram.com/ispool"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Uşak",
    addressCountry: "TR",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "İşPool",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/products?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${inter.variable} ${geistSans.variable} antialiased bg-[#fafafa] text-slate-900 overflow-x-hidden`}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-9999 focus:bg-orange-600 focus:text-white focus:px-4 focus:py-2 focus:rounded focus:font-bold"
        >
          Ana içeriğe geç
        </a>
        <CartProvider>
          <FavoriteProvider>
            <ClientLayoutWrapper>
              <main
                id="main-content"
                className="min-h-screen font-sans selection:bg-orange-600 selection:text-white relative"
              >
                {children}
                <CookieConsent />
              </main>
            </ClientLayoutWrapper>
            <ScrollToTopButton />
            <Toaster
              richColors={false}
              closeButton={true}
              position="bottom-right"
              toastOptions={{
                style: {
                  borderRadius: "2px",
                  padding: "20px",
                  background: "#020617",
                  color: "#f8fafc",
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  minWidth: "350px",
                  borderLeft: "5px solid #ea580c",
                },
              }}
            />
          </FavoriteProvider>
        </CartProvider>
      </body>
    </html>
  );
}
