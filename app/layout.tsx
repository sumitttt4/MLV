import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { ToasterProvider } from "@/components/ToasterProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hotel MLV Grand",
  description: "Luxury dining and ordering experience",
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
import { InstallPrompt } from "@/components/layout/InstallPrompt";
import { MobileCartFab } from "@/components/layout/MobileCartFab";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
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
              telephone: "+919876543210",
              address: {
                "@type": "PostalAddress",
                streetAddress: "123 Culinary Avenue, Food District",
                addressLocality: "Mumbai",
                postalCode: "400001",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 19.076,
                longitude: 72.8777,
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
        <Navbar />
        {children}
        <CartDrawer />
        <MobileCartFab />
        <InstallPrompt />
        <ToasterProvider />
      </body>
    </html>
  );
}
