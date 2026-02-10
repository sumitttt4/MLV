"use client";

import { motion } from "framer-motion";
import { Leaf, Drumstick, UtensilsCrossed } from "lucide-react";
import { useMenuStore, type DietaryMode } from "@/store/useMenuStore";
import { useRef, useEffect, useState } from "react";

const modes = [
  {
    key: "ALL" as DietaryMode,
    label: "All",
    Icon: UtensilsCrossed,
    color: "#D4AF37",         // brand-gold
    bgActive: "rgba(212, 175, 55, 0.15)",
    glowShadow: "0 0 20px rgba(212, 175, 55, 0.4)",
  },
  {
    key: "VEG" as DietaryMode,
    label: "Veg",
    Icon: Leaf,
    color: "#15803D",         // brand veg
    bgActive: "rgba(21, 128, 61, 0.15)",
    glowShadow: "0 0 20px rgba(21, 128, 61, 0.4)",
  },
  {
    key: "NON_VEG" as DietaryMode,
    label: "Non-Veg",
    Icon: Drumstick,
    color: "#B91C1C",         // brand nonveg
    bgActive: "rgba(185, 28, 28, 0.15)",
    glowShadow: "0 0 20px rgba(185, 28, 28, 0.4)",
  },
] as const;

const springTransition = { type: "spring" as const, stiffness: 300, damping: 30 };

export function DietaryToggle() {
  const { dietaryMode, setDietaryMode } = useMenuStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  const activeMode = modes.find((m) => m.key === dietaryMode)!;

  // Measure the active button and position the sliding pill
  useEffect(() => {
    const activeIdx = modes.findIndex((m) => m.key === dietaryMode);
    const btn = itemRefs.current[activeIdx];
    const container = containerRef.current;
    if (!btn || !container) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    setPillStyle({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
    });
  }, [dietaryMode]);

  return (
    <div className="flex justify-center">
      <div
        ref={containerRef}
        className="relative inline-flex items-center gap-1 rounded-full border border-white/10 bg-brand-dark/60 p-1 backdrop-blur-xl shadow-lg"
        style={{
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), ${activeMode.glowShadow.replace("0.4", "0.1")}`,
        }}
      >
        {/* Sliding Pill */}
        <motion.div
          className="absolute top-1 bottom-1 rounded-full"
          animate={{
            left: pillStyle.left,
            width: pillStyle.width,
            backgroundColor: activeMode.bgActive,
            boxShadow: activeMode.glowShadow,
          }}
          transition={springTransition}
          style={{
            border: `1px solid ${activeMode.color}40`,
          }}
        />

        {/* Buttons */}
        {modes.map((mode, idx) => {
          const isActive = dietaryMode === mode.key;
          const IconComp = mode.Icon;

          return (
            <button
              key={mode.key}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              onClick={() => setDietaryMode(mode.key)}
              className="relative z-10 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors duration-200 min-h-[44px]"
              style={{
                color: isActive ? mode.color : "rgba(243, 229, 216, 0.5)",
              }}
            >
              <motion.span
                animate={{
                  scale: isActive ? 1.15 : 1,
                  filter: isActive
                    ? `drop-shadow(0 0 6px ${mode.color}80)`
                    : "drop-shadow(0 0 0px transparent)",
                }}
                transition={springTransition}
                className="flex items-center"
              >
                <IconComp size={18} strokeWidth={isActive ? 2.5 : 2} />
              </motion.span>
              <span className="hidden sm:inline">{mode.label}</span>
              {/* Mobile-only: show short label */}
              <span className="sm:hidden">{mode.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
