"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <>
      <section className="relative flex w-full flex-col items-center justify-center pt-32 pb-20 px-4 text-center sm:pt-40 sm:pb-24 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-tamarind/50 to-transparent pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <h1 className="font-serif text-5xl sm:text-7xl font-bold text-brand-cream leading-tight">
            Hotel MLV <span className="text-brand-gold italic">Grand</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base uppercase tracking-[0.2em] text-brand-cream/70 font-medium">
            Authentic South-Indian Hospitality
          </p>

          <div className="pt-8">
            <a
              href="/menu"
              className="inline-block rounded-full bg-brand-gold px-12 py-4 text-sm font-bold uppercase tracking-widest text-brand-dark shadow-lg shadow-brand-gold/20 transition-all hover:scale-105 hover:bg-brand-cream active:scale-95"
            >
              Order Now
            </a>
          </div>
        </div>
      </section>

      {/* Simple Delivery Strip */}
      <div className="border-y border-brand-gold/10 bg-brand-black/20 backdrop-blur-sm py-4">
        <div className="mx-auto flex max-w-7xl justify-center gap-4 sm:gap-12 px-6 text-[10px] sm:text-xs uppercase tracking-widest text-brand-cream/60 font-medium">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
            30 Mins Delivery
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
            Live Tracking
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
            Five Star Service
          </span>
        </div>
      </div>
    </>
  );
}
