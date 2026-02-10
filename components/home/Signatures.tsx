"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Plus } from "lucide-react";
import { VariantSelector as VariantSelectorModal } from "@/components/VariantSelector";
import { useCart } from "@/store/useCart";
import type { MenuItemData } from "@/lib/menuData";
import { toast } from "sonner";

interface SignatureDish extends Partial<MenuItemData> {
  tag?: string;
  tagColor?: string;
}

const signatureDishes: SignatureDish[] = [
  {
    id: "sig-1",
    name: "Hyderabadi Dum Biryani",
    price: 349,
    description: "Best with Mirchi ka Salan",
    isVeg: false,
    tag: "Bestseller",
    tagColor: "bg-nonveg",
    variants: [
        { label: "Chicken", price: 349, isVeg: false },
        { label: "Mutton", price: 449, isVeg: false },
        { label: "Veg", price: 299, isVeg: true }
    ]
  },
  {
    id: "sig-2",
    name: "Lucknowi Galouti Kebab",
    price: 299,
    description: "Best with Ulta Tawa Paratha",
    isVeg: false,
    tag: "MLV Special",
    tagColor: "bg-brand-gold",
    variants: [
        { label: "Full Plate", price: 299, isVeg: false },
        { label: "Half Plate", price: 179, isVeg: false },
    ]
  },
  {
    id: "sig-3",
    name: "Dal Makhani Royale",
    price: 249,
    description: "Best with Garlic Naan",
    isVeg: true,
    tag: "Chef\u2019s Pick",
    tagColor: "bg-veg",
    variants: [
        { label: "Full", price: 249, isVeg: true },
    ]
  },
  {
    id: "sig-4",
    name: "Tandoori Paneer Tikka",
    price: 279,
    description: "Best with Mint Chutney",
    isVeg: true,
    tag: "MLV Special",
    tagColor: "bg-brand-gold",
    variants: [
        { label: "8 Pcs", price: 279, isVeg: true },
        { label: "4 Pcs", price: 169, isVeg: true },
    ]
  },
];

const dishImages = [
  "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export function Signatures() {
  const [selectedItem, setSelectedItem] = useState<MenuItemData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const handleQuickAdd = (dish: any) => {
      const itemData: MenuItemData = {
          id: dish.id,
          name: dish.name,
          isVeg: dish.isVeg,
          price: dish.price,
          variants: dish.variants,
          description: dish.description,
      };
      setSelectedItem(itemData);
      setIsModalOpen(true);
  };

  const handleVariantSelect = (variantIdx: number) => {
    if (!selectedItem || !selectedItem.variants) return;
    const variant = selectedItem.variants[variantIdx];
    const variantId = `${selectedItem.id}-${variantIdx}`;

    addItem({
      id: variantId,
      name: `${selectedItem.name} (${variant.label})`,
      price: variant.price,
      isVeg: variant.isVeg ?? selectedItem.isVeg ?? true,
      imageUrl: null,
      isAvailable: true,
      spiceLevel: "Mild",
      prepTime: 15,
      description: selectedItem.description || "",
      categoryId: "signatures",
      createdAt: new Date().toISOString(),
    });

    toast.success(`Added ${selectedItem.name} to cart`);
    setIsModalOpen(false);
  };

  return (
    <section className="relative py-12 sm:py-20 lg:py-32 bg-brand-black">
       <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           variants={fadeUp}
           className="mb-10 sm:mb-14 lg:mb-16 text-center"
        >
          <span className="font-serif text-sm italic text-brand-gold/70">From the Royal Kitchen</span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-brand-cream sm:text-4xl lg:text-5xl">
            THE CROWN <span className="text-gold-gradient">JEWELS</span>
          </h2>
        </motion.div>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-6 snap-x snap-mandatory px-1 -mx-1 sm:gap-6 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 lg:px-0 lg:mx-0">
          {signatureDishes.map((dish, i) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group relative min-w-[230px] sm:min-w-[260px] flex-shrink-0 overflow-hidden rounded-2xl bg-brand-cocoa/60 border border-brand-gold/10 snap-center flex flex-col"
            >
                {/* Image area */}
                <div className="relative h-[200px] sm:h-[240px] w-full overflow-hidden">
                    <Image
                        src={dishImages[i]}
                        alt={dish.name!}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 via-transparent to-transparent" />

                    {/* Tag badge */}
                    {dish.tag && (
                      <span className={`absolute top-3 left-3 ${dish.tagColor} ${dish.tagColor === "bg-brand-gold" ? "text-brand-dark" : "text-white"} text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg`}>
                        {dish.tag}
                      </span>
                    )}

                    {/* Veg / Non-Veg indicator */}
                    <span className={`absolute top-3 right-3 flex items-center justify-center h-5 w-5 rounded-sm border-2 ${dish.isVeg ? "border-veg" : "border-nonveg"}`}>
                      <span className={`h-2.5 w-2.5 rounded-full ${dish.isVeg ? "bg-veg" : "bg-nonveg"}`} />
                    </span>
                </div>

                {/* Info section */}
                <div className="flex flex-col flex-1 p-4 sm:p-5">
                    <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-brand-gold/60 mb-1">
                      {dish.description}
                    </p>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-cream leading-tight mb-3">
                        {dish.name}
                    </h3>

                    {/* Price + Add button */}
                    <div className="mt-auto flex items-center justify-between">
                        <div>
                          <span className="text-brand-cream/50 text-xs">From</span>
                          <span className="ml-1 text-lg sm:text-xl font-bold text-brand-gold">₹{dish.price}</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleQuickAdd(dish); }}
                          className="flex items-center gap-1.5 rounded-full bg-brand-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-dark shadow-md shadow-brand-gold/20 transition-all hover:scale-105 hover:bg-brand-cream active:scale-95"
                        >
                          <Plus size={14} strokeWidth={3} /> Add
                        </button>
                    </div>
                </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll indicator dots for mobile */}
        <div className="flex justify-center gap-2 mt-6 lg:hidden">
          {signatureDishes.map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-brand-gold/30" />
          ))}
        </div>
      </div>

      {selectedItem && (
        <VariantSelectorModal
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectVariant={handleVariantSelect}
        />
      )}
    </section>
  );
}
