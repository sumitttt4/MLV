import { Hero } from "@/components/home/Hero";
import { Signatures } from "@/components/home/Signatures";
import { Ambiance } from "@/components/home/Ambiance";
import { SocialGrid } from "@/components/home/SocialGrid";
import { FooterCTA } from "@/components/layout/FooterCTA";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Hero />
      <Signatures />
      <Ambiance />
      <SocialGrid />
      <FooterCTA />
      <Footer />
    </main>
  );
}
