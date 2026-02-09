"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <>
      <section className="relative flex w-full flex-col items-center justify-center bg-brand-dark px-6 py-24 text-center pb-12 pt-32 lg:pt-40">
        <h1 className="font-serif text-4xl font-bold text-brand-cream md:text-6xl">
          Hotel MLV <span className="text-brand-gold">Grand</span>
        </h1>
        <p className="mt-4 max-w-lg text-sm uppercase tracking-widest text-brand-cream/60">
          Authentic Multicuisine Experience
        </p>

        <a
          href="#menu"
          className="mt-8 rounded-full bg-brand-gold px-10 py-4 text-sm font-bold uppercase tracking-widest text-brand-dark transition-transform hover:scale-105 active:scale-95"
        >
          Order Now
        </a>
      </section>

      {/* Simple Delivery Strip */}
      <div className="bg-brand-dark/50 border-y border-white/5 py-4">
        <div className="mx-auto flex max-w-7xl justify-center gap-8 px-6 text-center text-xs uppercase tracking-wider text-brand-cream/40">
          <span>Scooter Delivery</span>
          <span>•</span>
          <span>30 Mins</span>
          <span>•</span>
          <span>Live Tracking</span>
        </div>
      </div>
    </>
  );
}
