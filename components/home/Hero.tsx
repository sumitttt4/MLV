"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Truck, ShoppingBag, UtensilsCrossed } from "lucide-react";

/* ── Slideshow images (royalty-free Pexels — premium dark-mood Indian cuisine) ── */
const heroImages = [
  {
    src: "https://images.pexels.com/photos/28674690/pexels-photo-28674690.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    alt: "Rich Indian Lamb Curry in Traditional Metal Bowl",
  },
  {
    src: "https://images.pexels.com/photos/29685054/pexels-photo-29685054.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    alt: "Creamy Butter Chicken in Copper Pan",
  },
  {
    src: "https://images.pexels.com/photos/32825916/pexels-photo-32825916.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    alt: "Authentic Biryani with Spiced Lamb and Fresh Vegetables",
  },
  {
    src: "https://images.pexels.com/photos/10508207/pexels-photo-10508207.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    alt: "Vibrant Indian Curries on Dark Rustic Table",
  },
  {
    src: "https://images.pexels.com/photos/35158690/pexels-photo-35158690.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    alt: "Butter Chicken Curry in Brass Bowl",
  },
  {
    src: "https://images.pexels.com/photos/28674557/pexels-photo-28674557.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    alt: "Rich Dal Makhani in Traditional Brass Pan",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.8, ease: "easeOut" },
  }),
};

const serviceOptions = [
  {
    label: "Delivery",
    icon: Truck,
    href: "/menu",
    description: "At your doorstep",
  },
  {
    label: "Pickup",
    icon: ShoppingBag,
    href: "/menu?mode=pickup",
    description: "Ready when you are",
  },
  {
    label: "Dine In",
    icon: UtensilsCrossed,
    href: "/reservation",
    description: "Reserve a table",
  },
];

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const router = useRouter();

  // Auto-rotate every 3 seconds
  const nextImage = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextImage, 3000);
    return () => clearInterval(interval);
  }, [nextImage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Rotating background images — all stacked, opacity crossfade */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
            style={{ opacity: i === currentImage ? 1 : 0 }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
              unoptimized
            />
          </div>
        ))}
        {/* Subtle Ken Burns zoom on active slide */}
        <style jsx>{`
          @keyframes kenburns {
            0% { transform: scale(1); }
            100% { transform: scale(1.08); }
          }
        `}</style>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            animation: "kenburns 6s ease-in-out infinite alternate",
          }}
        />
        {/* Dark gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/80 via-brand-dark/70 to-brand-black/90 z-[1]" />
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2 sm:bottom-6">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentImage(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === currentImage
                ? "w-6 bg-brand-gold"
                : "w-2 bg-brand-cream/30 hover:bg-brand-cream/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Centered content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center pt-28 pb-24 sm:px-6 sm:pt-32 sm:pb-28 lg:pt-36 lg:pb-32">
        {/* Eyebrow */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-brand-gold/80"
        >
          Est. 2018 &mdash; Bengaluru
        </motion.p>

        {/* Brand name */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-gold-gradient font-serif text-4xl font-bold leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
        >
          Hotel MLV
          <br />
          Grand
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mt-5 text-sm leading-relaxed tracking-wide text-brand-cream/60 sm:text-base md:text-lg max-w-lg mx-auto"
        >
          Forgotten recipes from the Royal Kitchens, slow-cooked for modern
          Bengaluru.
        </motion.p>

        {/* Service tabs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mt-8 flex items-center justify-center gap-3 sm:mt-10 sm:gap-5 lg:gap-6"
        >
          {serviceOptions.map((service) => (
            <Link
              key={service.label}
              href={service.href}
              className="group flex flex-col items-center gap-1.5 rounded-2xl border border-brand-gold/15 bg-brand-dark/50 px-4 py-4 backdrop-blur-md transition-all duration-300 hover:border-brand-gold/50 hover:bg-brand-dark/70 hover:scale-105 sm:gap-2 sm:px-7 sm:py-5 lg:px-8 lg:py-6 min-w-[90px] sm:min-w-[120px] lg:min-w-[140px]"
            >
              <service.icon className="h-5 w-5 text-brand-gold transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-cream sm:text-xs lg:text-sm">
                {service.label}
              </span>
              <span className="hidden text-[10px] text-brand-cream/50 sm:block">
                {service.description}
              </span>
            </Link>
          ))}
        </motion.div>

        {/* Search bar */}
        <motion.form
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          onSubmit={handleSearch}
          className="mt-6 mx-auto max-w-xl sm:mt-8"
        >
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gold/50 transition-colors group-focus-within:text-brand-gold sm:left-5 sm:h-5 sm:w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for biryani, kebabs, paneer..."
              className="w-full rounded-xl border border-brand-gold/15 bg-brand-dark/50 py-3.5 pl-11 pr-4 text-brand-cream placeholder:text-brand-cream/35 backdrop-blur-md transition-all duration-300 focus:border-brand-gold/40 focus:outline-none focus:ring-1 focus:ring-brand-gold/30 text-sm font-sans sm:py-4 sm:pl-14 sm:pr-5 sm:text-base"
            />
          </div>
        </motion.form>
      </div>

      {/* Bottom gold divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent z-10" />

      {/* Free Delivery pill */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-4 right-3 z-10 flex items-center gap-2 rounded-full border border-brand-gold/20 bg-brand-dark/80 px-3.5 py-2 backdrop-blur-md sm:bottom-6 sm:right-6 sm:gap-3 sm:px-5 sm:py-2.5 lg:bottom-10 lg:right-16"
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-brand-cream/80">
          Free Home Delivery
        </span>
        <span className="text-xs text-brand-cream/40">|</span>
        <a
          href="tel:+917795676809"
          className="text-xs text-brand-gold transition-colors hover:text-white py-2 px-1 min-h-[44px] flex items-center"
        >
          77956 76809
        </a>
      </motion.div>

    </section>
  );
}
