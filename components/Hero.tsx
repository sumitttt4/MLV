"use client";

import { motion } from "framer-motion";

const heroImages = [
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1542528180-1c8b8f6f9dd0?auto=format&fit=crop&w=500&q=80"
];

export function Hero() {
  return (
    <section className="bg-hero-texture text-brand-cream">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">
            Welcome to Hotel MLV Grand
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-brand-cream md:text-5xl">
            Welcome to Hotel MLV Grand
          </h1>
          <p className="text-lg text-brand-gold">
            A Multicuisine Restaurant
          </p>
          <p className="max-w-xl text-base text-brand-cream/80">
            Step into a heritage dining room where every dish is a warm embrace
            and every moment feels celebrated.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-full bg-brand-maroon px-6 py-3 text-sm font-semibold text-brand-cream transition hover:bg-brand-gold hover:text-brand-maroon">
              Order Online
            </button>
            <button className="rounded-full border border-brand-gold px-6 py-3 text-sm font-semibold text-brand-gold transition hover:bg-brand-gold hover:text-brand-maroon">
              View Menu
            </button>
          </div>
        </motion.div>
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4">
            {heroImages.map((src, index) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-28 w-28 overflow-hidden rounded-full border border-brand-gold/60 shadow-lg md:h-36 md:w-36"
              >
                <img
                  src={src}
                  alt="Signature dish"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
