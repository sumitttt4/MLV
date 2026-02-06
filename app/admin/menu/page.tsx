"use client";

import { useState } from "react";

interface MenuItemCard {
  id: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  image: string;
}

const initialMenu: MenuItemCard[] = [
  {
    id: "starter-1",
    name: "Royal Paneer Tikka",
    description: "Char grilled cottage cheese with saffron smoke and mint glaze.",
    price: 420,
    isAvailable: true,
    image:
      "https://images.unsplash.com/photo-1604908813066-3f1b4f9d0a42?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "main-2",
    name: "Awadhi Mutton Curry",
    description: "Tender lamb in a rich onion gravy with warm royal spices.",
    price: 780,
    isAvailable: true,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "biryani-1",
    name: "Royal Chicken Biryani",
    description: "Fragrant basmati rice with tender chicken and saffron.",
    price: 620,
    isAvailable: false,
    image:
      "https://images.unsplash.com/photo-1631515243342-5d28335a4d1e?auto=format&fit=crop&w=600&q=80"
  }
];

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItemCard[]>(initialMenu);

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-3xl font-semibold text-brand-maroon">
          Menu Manager
        </h2>
        <p className="mt-2 max-w-xl text-sm text-brand-maroon/70">
          Keep every dish available and priced with care.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {menuItems.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-2xl border border-brand-gold/30 bg-white shadow-sm"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-36 w-full object-cover"
            />
            <div className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-brand-maroon">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-brand-maroon/70">
                    {item.description}
                  </p>
                </div>
                <span className="text-base font-semibold text-brand-gold">
                  ₹{item.price}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <button className="rounded-full border border-brand-maroon px-4 py-2 text-sm font-semibold text-brand-maroon transition hover:bg-brand-maroon hover:text-brand-cream">
                  Edit
                </button>
                <label className="flex items-center gap-3 text-sm font-semibold text-brand-maroon">
                  <span>Out of Stock</span>
                  <button
                    type="button"
                    onClick={() =>
                      setMenuItems((prev) =>
                        prev.map((entry) =>
                          entry.id === item.id
                            ? { ...entry, isAvailable: !entry.isAvailable }
                            : entry
                        )
                      )
                    }
                    className={`relative h-6 w-11 rounded-full border transition ${
                      item.isAvailable
                        ? "border-brand-gold bg-brand-cream"
                        : "border-brand-maroon bg-brand-maroon/80"
                    }`}
                  >
                    <span
                      className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition ${
                        item.isAvailable
                          ? "left-1 bg-brand-gold"
                          : "left-6 bg-brand-cream"
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
