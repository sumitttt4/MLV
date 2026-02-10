"use client";

import { motion } from "framer-motion";
import { Search, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Browse Our Menu",
    description: "Explore 120+ dishes — filter by veg, non-veg, or your favourite category.",
  },
  {
    icon: ShoppingBag,
    step: "02",
    title: "Place Your Order",
    description: "Add items to cart, choose variants, and pay securely online or cash on delivery.",
  },
  {
    icon: Truck,
    step: "03",
    title: "Delivered Fresh",
    description: "Freshly prepared and delivered to your door in 30–45 minutes. Track in real-time.",
  },
];

export function SocialGrid() {
  return (
    <section className="relative py-12 sm:py-20 lg:py-32">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-10 sm:mb-14 lg:mb-16 text-center"
        >
          <span className="mb-3 block text-xs font-bold uppercase tracking-[0.3em] text-brand-gold/60">
            Simple &amp; Quick
          </span>
          <h2 className="font-serif text-2xl font-bold text-brand-cream sm:text-3xl md:text-4xl lg:text-5xl">
            How It <span className="text-gold-gradient">Works</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="group relative flex flex-col items-center rounded-2xl border border-brand-gold/10 bg-brand-cocoa/40 px-6 py-10 text-center transition-all duration-500 hover:border-brand-gold/30 hover:bg-brand-cocoa/60 sm:px-8 sm:py-12"
            >
              {/* Step number */}
              <span className="absolute -top-4 left-6 font-serif text-5xl font-bold text-brand-gold/10 sm:text-6xl lg:text-7xl">
                {item.step}
              </span>

              {/* Icon */}
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/10 transition-colors duration-500 group-hover:bg-brand-gold/20 sm:h-16 sm:w-16">
                <item.icon className="h-6 w-6 text-brand-gold sm:h-7 sm:w-7" />
              </div>

              {/* Title */}
              <h3 className="mb-3 font-serif text-lg font-bold text-brand-cream sm:text-xl">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-brand-cream/50 sm:text-base">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 flex justify-center sm:mt-14"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-brand-dark shadow-lg shadow-brand-gold/20 transition-all hover:scale-105 hover:bg-brand-cream active:scale-95 sm:px-10 sm:py-4 sm:text-sm"
          >
            <ShoppingBag className="h-4 w-4" /> Order Now
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
    </section>
  );
}
