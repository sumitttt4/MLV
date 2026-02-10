"use client";

import { motion } from "framer-motion";
import { Star, Users, Clock, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

const stats = [
  { icon: Clock, value: "7+", label: "Years Serving" },
  { icon: UtensilsCrossed, value: "120+", label: "Dishes on Menu" },
  { icon: Users, value: "50K+", label: "Happy Guests" },
  { icon: Star, value: "4.5", label: "Google Rating" },
];

export function Ambiance() {
  return (
    <section className="relative h-auto min-h-[500px] overflow-hidden">
      {/* Fixed background image */}
      <div
        className="absolute inset-0 bg-cover bg-scroll md:bg-fixed bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80')",
        }}
      />

      {/* Warm dark overlay */}
      <div className="absolute inset-0 backdrop-blur-[2px] bg-brand-black/75" />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-24 lg:py-32">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-brand-gold/60 sm:mb-4"
        >
          Why Bengaluru Loves Us
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="max-w-3xl font-serif text-2xl font-bold leading-snug text-white sm:text-3xl md:text-4xl lg:text-5xl"
        >
          Where Every Meal Feels Like{" "}
          <span className="text-gold-gradient italic">Coming Home</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-4 max-w-xl text-sm leading-relaxed text-brand-cream/60 sm:text-base"
        >
          From family dinners to celebrations, Hotel MLV Grand has been Bengaluru&apos;s trusted destination for authentic flavours and warm hospitality.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-10 grid grid-cols-2 gap-6 sm:mt-14 sm:grid-cols-4 sm:gap-10"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <stat.icon className="h-5 w-5 text-brand-gold/70 sm:h-6 sm:w-6" />
              <span className="font-serif text-2xl font-bold text-brand-gold sm:text-3xl lg:text-4xl">
                {stat.value}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-brand-cream/50 sm:text-xs">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-10 sm:mt-14"
        >
          <Link
            href="/reservation"
            className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-brand-dark shadow-lg shadow-brand-gold/20 transition-all hover:scale-105 hover:bg-brand-cream active:scale-95 sm:px-10 sm:py-4 sm:text-sm"
          >
            Reserve Your Table
          </Link>
        </motion.div>
      </div>

      {/* Edge vignette */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_60px_80px_-20px_rgba(42,13,11,0.8),inset_0_-60px_80px_-20px_rgba(42,13,11,0.8)]" />
    </section>
  );
}
