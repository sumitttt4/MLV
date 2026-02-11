import { OffersSection } from "@/components/home/OffersSection";

export const metadata = {
  title: "Offers & Deals | Hotel MLV Grand",
  description: "Exclusive discounts, bank offers, and loyalty rewards.",
};

export default function OffersPage() {
  return (
    <main className="min-h-screen pt-20 sm:pt-24 lg:pt-28">
      <OffersSection />
    </main>
  );
}
