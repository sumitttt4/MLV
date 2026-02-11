import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ToasterProvider } from "@/components/ToasterProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#4A1F1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Hotel MLV Grand",
  description: "Luxury dining and ordering experience",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MLV Grand",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  openGraph: {
    title: "Hotel MLV Grand",
    description: "Premium Dining",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Hotel MLV Grand - Premium Dining"
      }
    ]
  }
};

import { CartDrawer } from "@/components/layout/CartDrawer";
import { Navbar } from "@/components/Navbar";
import { OfferBar } from "@/components/layout/OfferBar";
import { InstallPrompt } from "@/components/layout/InstallPrompt";
import { MobileCartFab } from "@/components/layout/MobileCartFab";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: "Hotel MLV Grand",
              image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
              "@id": "https://mlvgrand.com",
              url: "https://mlvgrand.com",
              telephone: "+917795676809",
              address: {
                "@type": "PostalAddress",
                streetAddress: "# 174/3, Opp. Ferra, Mandur Post, Budigere Main Road, Near Baldwin School",
                addressLocality: "Bengaluru",
                postalCode: "560049",
                addressRegion: "Karnataka",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 13.035,
                longitude: 77.714,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "11:00",
                  closes: "23:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Saturday", "Sunday"],
                  opens: "10:00",
                  closes: "00:00",
                },
              ],
              servesCuisine: ["Indian", "Mughlai", "Chinese"],
              priceRange: "₹₹₹",
            }),
          }}
        />
        <OfferBar />
        <Navbar />
        {children}
        <CartDrawer />
        <MobileCartFab />
        <InstallPrompt />
        <ToasterProvider />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('SW registered:', reg.scope);
                  }).catch(function(err) {
                    console.log('SW registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
