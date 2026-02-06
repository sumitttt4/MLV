import { Hero } from "@/components/Hero";
import { MenuSection } from "@/components/MenuSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-cream text-brand-maroon">
      <Hero />
      <MenuSection />
    </main>
  );
}
