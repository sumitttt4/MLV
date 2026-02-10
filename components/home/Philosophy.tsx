"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const steps = [
  {
    id: "marination",
    title: "THE MARINATION",
    description: "24 hours in hung curd and secret spice blends.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "fire",
    title: "THE FIRE",
    description: "Clay ovens at 400°C. Charred to perfection.",
    image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "plating",
    title: "THE PLATING",
    description: "Served with the respect royalty deserves.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
  },
];

export function Philosophy() {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  return (
    <section className="relative py-16 lg:py-40 bg-brand-dark overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none">
          <svg className="h-full w-full">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-16 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="text-center mb-16"
        >
          <span className="font-serif text-sm italic text-brand-gold/70">Our Process</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-cream mt-2">
            The Method Behind <br className="sm:hidden"/> <span className="text-gold-gradient">The Magic.</span>
          </h2>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 h-auto md:h-[600px]">
          {steps.map((step) => {
            const isHovered = hoveredStep === step.id;
            const isDimmed = hoveredStep !== null && !isHovered;

            return (
              <motion.div
                key={step.id}
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
                onClick={() => setHoveredStep(hoveredStep === step.id ? null : step.id)}
                className={`relative flex-1 cursor-pointer overflow-hidden rounded-2xl border border-white/5 transition-all duration-700 ease-out group min-h-[220px] md:min-h-0 ${
                    isDimmed ? "opacity-40 grayscale" : "opacity-100"
                }`}
                style={{
                    flexGrow: isHovered ? 3 : 1
                }}
              >
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                    style={{ backgroundImage: `url('${step.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-tamarind/80 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-70" />

                <div className="absolute inset-0 flex flex-col justify-end p-8 text-center md:text-left transition-all duration-700">
                  <div className={`transition-all duration-500 transform ${isHovered ? "translate-y-0" : "translate-y-4"}`}>
                    <h3 className="font-serif text-2xl font-bold text-brand-gold mb-3">{step.title}</h3>
                    <p className={`text-sm leading-relaxed text-brand-cream/80 transition-all duration-700 delay-100 hidden md:block ${
                      isHovered ? "opacity-100 max-h-20" : "opacity-0 max-h-0"
                    }`}>
                      {step.description}
                    </p>
                    <p className="text-sm leading-relaxed text-brand-cream/80 md:hidden block">
                         {step.description}
                    </p>
                  </div>
                  
                  <div className={`h-0.5 bg-brand-gold mt-6 transition-all duration-700 ease-out hidden md:block ${
                      isHovered ? "w-full" : "w-12"
                  }`} />
                  <div className="h-0.5 bg-brand-gold mt-6 w-12 md:hidden block" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
