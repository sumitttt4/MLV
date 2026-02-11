"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Gift, PartyPopper, Sparkles, Tag, Percent } from "lucide-react";
import Link from "next/link";
import { useOfferBar } from "@/store/useOfferBar";

interface Offer {
  id: string;
  icon: React.ReactNode;
  text: string;
  highlight?: string;
  href?: string;
  code?: string;
}

const offers: Offer[] = [
  {
    id: "launch",
    icon: <Sparkles size={13} className="shrink-0" />,
    text: "Grand Launch Offer —",
    highlight: "Flat 20% Off on orders above ₹499",
    code: "MLVLAUNCH",
    href: "/menu",
  },
  {
    id: "bday",
    icon: <PartyPopper size={13} className="shrink-0" />,
    text: "Birthday Special —",
    highlight: "Free dessert on your birthday!",
    href: "/reservation",
  },
  {
    id: "family",
    icon: <Gift size={13} className="shrink-0" />,
    text: "Family Feast —",
    highlight: "Order for 4+, get a complimentary starter",
    code: "MLVFAMILY",
    href: "/menu",
  },
  {
    id: "first",
    icon: <Tag size={13} className="shrink-0" />,
    text: "First Order —",
    highlight: "15% Off your first order",
    code: "MLVFIRST",
    href: "/menu",
  },
  {
    id: "weekend",
    icon: <Percent size={13} className="shrink-0" />,
    text: "Weekend Brunch —",
    highlight: "Unlimited buffet @ ₹599 per head",
    href: "/reservation",
  },
];

export function OfferBar() {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [direction, setDirection] = useState(1);
  const setBarVisible = useOfferBar((s) => s.setVisible);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % offers.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + offers.length) % offers.length);
  }, []);

  // Auto-rotate every 4s
  useEffect(() => {
    if (dismissed) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [dismissed, next]);

  // Check localStorage for dismissal
  useEffect(() => {
    const d = localStorage.getItem("mlv-offer-bar-dismissed");
    if (d) {
      const ts = parseInt(d, 10);
      // Re-show after 24 hours
      if (Date.now() - ts < 24 * 60 * 60 * 1000) {
        setDismissed(true);
        setBarVisible(false);
      }
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setBarVisible(false);
    localStorage.setItem("mlv-offer-bar-dismissed", Date.now().toString());
  };

  if (dismissed) return null;

  const offer = offers[current];

  const variants = {
    enter: (d: number) => ({ y: d > 0 ? 12 : -12, opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (d: number) => ({ y: d > 0 ? -12 : 12, opacity: 0 }),
  };

  const Content = () => (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
      <span className="text-brand-gold">{offer.icon}</span>
      <span className="text-brand-cream/80 text-[10px] sm:text-xs font-sans font-medium">
        {offer.text}
      </span>
      <span className="text-brand-gold font-bold text-[10px] sm:text-xs font-sans">
        {offer.highlight}
      </span>
      {offer.code && (
        <span className="hidden sm:inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded bg-brand-gold/15 border border-brand-gold/25 text-brand-gold text-[10px] font-bold font-mono tracking-wider">
          {offer.code}
        </span>
      )}
    </div>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-brand-black/95 border-b border-brand-gold/10 backdrop-blur-sm">
      <div className="relative mx-auto max-w-7xl flex items-center justify-center h-8 sm:h-9 px-10 sm:px-14">
        {/* Prev */}
        <button
          onClick={prev}
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 p-1 text-brand-cream/40 hover:text-brand-gold transition-colors"
          aria-label="Previous offer"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Offer content — animated */}
        <div className="overflow-hidden w-full flex items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={offer.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {offer.href ? (
                <Link href={offer.href} className="block hover:opacity-80 transition-opacity">
                  <Content />
                </Link>
              ) : (
                <Content />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next */}
        <button
          onClick={next}
          className="absolute right-7 sm:right-10 top-1/2 -translate-y-1/2 p-1 text-brand-cream/40 hover:text-brand-gold transition-colors"
          aria-label="Next offer"
        >
          <ChevronRight size={14} />
        </button>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 p-1 text-brand-cream/30 hover:text-brand-cream/70 transition-colors"
          aria-label="Dismiss offers"
        >
          <X size={13} />
        </button>

        {/* Progress dots */}
        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-1">
          {offers.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                i === current ? "bg-brand-gold w-3" : "bg-brand-cream/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
