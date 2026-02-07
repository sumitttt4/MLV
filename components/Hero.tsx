"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const heroImages = [
  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80", // Biryani/Rice
  "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80", // Curry 
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=80", // Naan/Curry
  "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=500&q=80", // Chicken
];

export function Hero() {
  return (
    <>
      <section className="bg-brand-dark bg-hero-texture relative min-h-screen overflow-hidden pt-24 lg:pt-0 lg:flex lg:items-center">
        {/* Dark Red Overlay for Richness */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-brand-dark pointer-events-none z-10" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 z-20">

          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left pt-24 lg:pt-0"
          >
            <span className="mb-4 font-serif text-lg italic tracking-wide text-brand-gold/90">
              Welcome to
            </span>
            <h1 className="mb-6 font-serif text-5xl font-medium leading-[1.05] text-brand-cream md:text-7xl lg:text-8xl shadow-black drop-shadow-xl">
              Hotel MLV <br />
              <span className="text-brand-gold">Grand</span>
            </h1>

            <div className="mb-10 flex items-center gap-6 opacity-90">
              <div className="h-[1px] w-8 bg-brand-gold/50 lg:w-12" />
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-cream/80 lg:text-xs lg:tracking-[0.3em]">
                A Multicuisine Restaurant
              </p>
              <div className="h-[1px] w-8 bg-brand-gold/50 lg:w-12" />
            </div>

            <div className="flex flex-col w-full gap-4 px-8 sm:flex-row sm:w-auto sm:px-0 sm:gap-5 lg:justify-start">
              <a
                href="#menu"
                className="relative overflow-hidden rounded-full bg-brand-maroon px-8 py-4 text-center text-sm font-bold uppercase tracking-widest text-brand-cream shadow-xl transition-transform hover:scale-105 hover:bg-red-900 border border-brand-gold/20 active:scale-95"
              >
                Order Online
              </a>
              <a
                href="#menu"
                className="rounded-full bg-brand-cream px-8 py-4 text-center text-sm font-bold uppercase tracking-widest text-brand-dark shadow-xl transition-transform hover:scale-105 hover:bg-white active:scale-95"
              >
                View Menu
              </a>
            </div>
          </motion.div>

          {/* Right Image Scatter Collage */}
          <div className="relative mx-auto mt-12 h-[400px] w-full max-w-[400px] lg:mt-0 lg:h-[800px] lg:max-w-[600px]">
            {/* Main Central Dish */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute left-[20%] top-[20%] z-20 h-56 w-56 lg:top-[30%] lg:h-80 lg:w-80 rounded-full border-[6px] border-brand-dark shadow-2xl"
            >
              <Image src={heroImages[0]} alt="Main Dish" fill className="object-cover rounded-full" priority />
            </motion.div>

            {/* Top Right Dish */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="absolute right-[5%] top-[5%] z-10 h-32 w-32 lg:top-[10%] lg:h-52 lg:w-52 rounded-full border-[4px] border-brand-dark shadow-xl"
            >
              <Image src={heroImages[1]} alt="Side Dish" fill className="object-cover rounded-full" />
            </motion.div>

            {/* Bottom Left Dish */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="absolute left-[5%] bottom-[20%] z-30 h-36 w-36 lg:left-[0%] lg:h-56 lg:w-56 rounded-full border-[4px] border-brand-dark shadow-xl"
            >
              <Image src={heroImages[2]} alt="Breads" fill className="object-cover rounded-full" />
            </motion.div>

            {/* Small Floating Accent - Hidden on very small screens if needed, but keeping for now */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute right-[15%] bottom-[25%] h-20 w-20 lg:right-[20%] lg:bottom-[30%] lg:h-24 lg:w-24 rounded-full border-[3px] border-brand-dark shadow-lg"
            >
              <Image src={heroImages[3]} alt="Small Bowl" fill className="object-cover rounded-full" />
            </motion.div>
          </div>

        </div>
      </section>

      {/* Delivery Strip */}
      <div className="relative z-20 border-y border-white/5 bg-brand-dark/50 py-8 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 lg:flex-row">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold text-brand-dark shrink-0 animate-pulse">
              <span className="text-3xl">🛵</span>
            </div>
            <div>
              <h3 className="font-serif text-xl font-medium text-brand-cream">
                Free Home Delivery
              </h3>
              <p className="text-sm text-brand-cream/60">Fast delivery within 30 mins | Best Prices Direct</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            {/* Third Party Apps - Secondary/Ghost look */}
            <div className="flex gap-3">
              {[
                { name: "Swiggy", color: "bg-[#FC8019]", text: "text-[#FC8019]" },
                { name: "Zomato", color: "bg-[#CB202D]", text: "text-[#CB202D]" }
              ].map(partner => (
                <button
                  key={partner.name}
                  className="group flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
                  title={`Order on ${partner.name}`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider text-brand-cream/50 mb-0.5`}>On</span>
                  <span className={`text-sm font-bold uppercase tracking-wider ${partner.text}`}>
                    {partner.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

            {/* Main CTA - Prominent */}
            <a
              href="#menu"
              className="group relative flex items-center gap-4 rounded-full bg-gradient-to-r from-brand-gold to-yellow-500 px-8 py-4 shadow-lg shadow-brand-gold/20 transition-all hover:scale-105 hover:shadow-brand-gold/40 active:scale-95"
            >
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/80">
                  Best Value
                </span>
                <span className="text-lg font-bold uppercase tracking-wider text-brand-dark">
                  Order Direct
                </span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-dark text-brand-gold transition-transform group-hover:translate-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
