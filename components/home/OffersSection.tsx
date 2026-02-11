"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  PartyPopper,
  Gift,
  Tag,
  Percent,
  Utensils,
  Crown,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";

// ─── Offers data ───────────────────────────────────────────────────────────────

interface OfferCard {
  id: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  terms: string;
  code?: string;
  cta: string;
  href: string;
  gradient: string;
  borderColor: string;
}

const OFFERS: OfferCard[] = [
  {
    id: "launch",
    icon: <Sparkles size={22} />,
    badge: "Launch",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    title: "Grand Launch — 20% Off",
    description:
      "Celebrate our grand opening with flat 20% off on all orders above ₹499. Valid on dine-in & delivery.",
    terms: "Min. order ₹499 • Not combinable",
    code: "MLVLAUNCH",
    cta: "Order Now",
    href: "/menu",
    gradient: "from-amber-500/10 via-transparent to-transparent",
    borderColor: "border-amber-500/20 hover:border-amber-500/40",
  },
  {
    id: "bday",
    icon: <PartyPopper size={22} />,
    badge: "Birthday",
    badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    title: "Birthday? Free Dessert!",
    description:
      "Celebrate your special day with us. Show your ID and enjoy a complimentary premium dessert on the house.",
    terms: "Valid on birthday ±2 days • Dine-in only",
    cta: "Book a Table",
    href: "/reservation",
    gradient: "from-pink-500/10 via-transparent to-transparent",
    borderColor: "border-pink-500/20 hover:border-pink-500/40",
  },
  {
    id: "family",
    icon: <Gift size={22} />,
    badge: "Family",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    title: "Family Feast Deal",
    description:
      "Order for 4 or more people and get a complimentary starter worth up to ₹299 on us.",
    terms: "4+ guests required • Starter chef's choice",
    code: "MLVFAMILY",
    cta: "Order Now",
    href: "/menu",
    gradient: "from-emerald-500/10 via-transparent to-transparent",
    borderColor: "border-emerald-500/20 hover:border-emerald-500/40",
  },
  {
    id: "first",
    icon: <Tag size={22} />,
    badge: "New User",
    badgeColor: "bg-sky-500/20 text-sky-400 border-sky-500/30",
    title: "First Order — 15% Off",
    description:
      "New to MLV Grand? Get 15% off on your very first order. Welcome to the family!",
    terms: "First order only • Max discount ₹200",
    code: "MLVFIRST",
    cta: "Order Now",
    href: "/menu",
    gradient: "from-sky-500/10 via-transparent to-transparent",
    borderColor: "border-sky-500/20 hover:border-sky-500/40",
  },
  {
    id: "weekend",
    icon: <Utensils size={22} />,
    badge: "Weekend",
    badgeColor: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    title: "Weekend Brunch Buffet",
    description:
      "Every Saturday & Sunday — unlimited brunch buffet with live counters at just ₹599 per person.",
    terms: "Sat–Sun 10 AM to 1 PM • Kids under 5 free",
    cta: "Reserve Now",
    href: "/reservation",
    gradient: "from-violet-500/10 via-transparent to-transparent",
    borderColor: "border-violet-500/20 hover:border-violet-500/40",
  },
  {
    id: "loyalty",
    icon: <Crown size={22} />,
    badge: "Loyalty",
    badgeColor: "bg-brand-gold/20 text-brand-gold border-brand-gold/30",
    title: "MLV Royalty Program",
    description:
      "Earn 1 point for every ₹10 spent. Redeem 100 points for ₹50 off. The more you dine, the more you save.",
    terms: "Points valid for 90 days • Auto-enrolled",
    cta: "Start Earning",
    href: "/menu",
    gradient: "from-brand-gold/10 via-transparent to-transparent",
    borderColor: "border-brand-gold/20 hover:border-brand-gold/40",
  },
];

// ─── Coupon code copy button ─────────────────────────────────────────────────

function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-cream/5 border border-brand-cream/10 hover:border-brand-gold/30 hover:bg-brand-gold/10 transition-all group"
    >
      <span className="font-mono text-xs font-bold tracking-widest text-brand-gold">
        {code}
      </span>
      {copied ? (
        <Check size={12} className="text-emerald-400" />
      ) : (
        <Copy
          size={12}
          className="text-brand-cream/40 group-hover:text-brand-gold transition-colors"
        />
      )}
    </button>
  );
}

// ─── Single Offer Card ──────────────────────────────────────────────────────

function OfferCardComponent({ offer, index }: { offer: OfferCard; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className={`group relative flex flex-col justify-between rounded-2xl border bg-brand-cocoa/60 backdrop-blur-sm p-5 sm:p-6 transition-all duration-300 ${offer.borderColor}`}
    >
      {/* Gradient glow */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${offer.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />

      <div className="relative z-10">
        {/* Top row — Icon + Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-dark/50 text-brand-gold">
            {offer.icon}
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border font-sans ${offer.badgeColor}`}
          >
            {offer.badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg sm:text-xl font-semibold text-brand-cream mb-2 leading-tight">
          {offer.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-brand-cream/60 font-sans leading-relaxed mb-3">
          {offer.description}
        </p>

        {/* Terms */}
        <p className="text-[10px] text-brand-cream/35 font-sans mb-4">{offer.terms}</p>

        {/* Code (if any) */}
        {offer.code && (
          <div className="mb-4">
            <CopyCode code={offer.code} />
          </div>
        )}
      </div>

      {/* CTA */}
      <Link
        href={offer.href}
        className="relative z-10 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-wider font-sans hover:bg-brand-gold/20 transition-all group/btn"
      >
        {offer.cta}
        <ArrowRight
          size={13}
          className="transition-transform group-hover/btn:translate-x-0.5"
        />
      </Link>
    </motion.div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export function OffersSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section id="offers" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8 bg-brand-gold/40" />
            <Percent size={16} className="text-brand-gold" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold font-sans">
              Exclusive Offers
            </span>
            <Percent size={16} className="text-brand-gold" />
            <span className="h-px w-8 bg-brand-gold/40" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-cream mb-3">
            Deals You&apos;ll Love
          </h2>
          <p className="text-sm sm:text-base text-brand-cream/50 font-sans max-w-lg mx-auto">
            Handpicked offers to make every meal at MLV Grand even more special.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {OFFERS.map((offer, i) => (
            <OfferCardComponent key={offer.id} offer={offer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
