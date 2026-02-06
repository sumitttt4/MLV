import "./globals.css";
import type { Metadata } from "next";
import { ToasterProvider } from "@/components/ToasterProvider";

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

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
