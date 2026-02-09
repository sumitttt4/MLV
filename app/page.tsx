import { Hero } from "@/components/Hero";
import { MenuSection } from "@/components/MenuSection";
import { AboutSection } from "@/components/AboutSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";
import { PartySection } from "@/components/PartySection";
import { ReviewsSection } from "@/components/ReviewsSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-dark text-brand-cream overflow-x-hidden">
      <Hero />
      <FeaturesSection /> {/* Keeping features as Why Choose Us */}
      <MenuSection />
      <PartySection />
      <ReviewsSection />
      <Footer />
    </main>
  );
}
