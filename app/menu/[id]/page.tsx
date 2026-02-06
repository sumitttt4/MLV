import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { menuItems } from "@/lib/dummyData";

interface MenuPageProps {
  params: { id: string };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(value);
}

export function generateMetadata({ params }: MenuPageProps): Metadata {
  const item = menuItems.find((menuItem) => menuItem.id === params.id);

  if (!item) {
    return {
      title: "Menu Item | Hotel MLV Grand",
      description: "Explore our premium dining menu."
    };
  }

  return {
    title: `Order ${item.name} | Hotel MLV Grand`,
    description: item.description,
    openGraph: {
      title: `Order ${item.name} | Hotel MLV Grand`,
      description: item.description,
      images: item.image
        ? [
            {
              url: item.image,
              alt: item.name
            }
          ]
        : undefined
    }
  };
}

export default function MenuItemPage({ params }: MenuPageProps) {
  const item = menuItems.find((menuItem) => menuItem.id === params.id);

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-brand-cream text-brand-maroon">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12 lg:flex-row">
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-sm">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-80 w-full object-cover"
            />
          ) : null}
        </div>
        <div className="flex-1 space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-gold">
            {item.category}
          </p>
          <h1 className="text-3xl font-semibold">{item.name}</h1>
          <p className="text-sm text-brand-maroon/70">{item.description}</p>
          <p className="text-2xl font-semibold text-brand-gold">
            {formatCurrency(item.price)}
          </p>
          <p className="text-xs text-brand-maroon/60">
            Spice Level: {item.spiceLevel} • {item.isVeg ? "Vegetarian" : "Non-Veg"}
          </p>
        </div>
      </div>
    </main>
  );
}
