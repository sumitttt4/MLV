"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function FooterCTA() {
  return (
    <section className="relative py-14 sm:py-20 lg:py-32">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

      {/* Decorative glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-72 w-72 rounded-full bg-brand-gold/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-brand-gold/50"
        >
          Don&apos;t just sit there
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.12 }}
          className="text-gold-gradient font-serif text-2xl font-bold sm:text-4xl md:text-5xl lg:text-7xl leading-tight"
        >
          YOUR TABLE IS WAITING.
          <br />
          THE FOOD IS READY.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.24 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-12 sm:flex-row sm:gap-6"
        >
          {/* Solid Gold - Pulse Animation */}
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-brand-dark shadow-lg shadow-brand-gold/20 transition-all hover:scale-105 hover:bg-brand-cream active:scale-95 sm:px-10 sm:py-4 sm:text-sm"
          >
            Order Delivery
          </Link>

          {/* Outline */}
          <Link
            href="/reservation"
            className="inline-flex items-center justify-center rounded-full border border-brand-gold/40 bg-transparent px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-brand-gold transition-all hover:border-brand-gold hover:bg-brand-gold/10 hover:scale-105 active:scale-95 sm:px-10 sm:py-4 sm:text-sm"
          >
            Book a Table
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 space-y-2 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold/60">
            Free Home Delivery
          </p>
          <p className="text-sm text-brand-cream/50">
            <a href="tel:+917795676809" className="transition-colors hover:text-brand-gold inline-flex items-center min-h-[44px] px-2 py-2">77956 76809</a>
            {" / "}
            <a href="tel:+917975161096" className="transition-colors hover:text-brand-gold inline-flex items-center min-h-[44px] px-2 py-2">79751 61096</a>
          </p>
          <p className="text-xs text-brand-cream/30">
            Open daily &mdash; 11 AM to 11 PM &bull; Reservations recommended on weekends
          </p>
        </motion.div>
      </div>
    </section>
  );
}
