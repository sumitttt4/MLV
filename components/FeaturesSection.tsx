"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed, Award, Coffee, Clock } from "lucide-react";

const features = [
    {
        icon: UtensilsCrossed,
        title: "Master Chefs",
        description: "Our kitchen is led by award-winning chefs who bring passion and expertise to every plate."
    },
    {
        icon: Award,
        title: "Quality Food",
        description: "We source only the freshest ingredients to ensure every meal is a healthy and delightful experience."
    },
    {
        icon: Coffee,
        title: "Pristine Ambiance",
        description: "Immerse yourself in a sophisticated atmosphere designed for comfort and luxury."
    },
    {
        icon: Clock,
        title: "Fast Delivery",
        description: "Craving our food at home? We ensure hot and fresh delivery within 30 minutes."
    }
];

export function FeaturesSection() {
    return (
        <section className="py-20 lg:py-32 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-brand-tamarind/10 pointer-events-none" />
            
            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <span className="font-serif text-lg italic text-brand-gold">Why Choose Us</span>
                    <h2 className="mt-2 font-serif text-4xl font-bold text-brand-cream md:text-5xl">
                        We Serve Passion
                    </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group relative overflow-hidden rounded-card bg-brand-cocoa p-8 text-center transition-all hover:-translate-y-1"
                        >
                            <div className="relative z-10">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-tamarind text-brand-gold ring-1 ring-brand-gold/20 transition-all group-hover:bg-brand-gold group-hover:text-brand-dark">
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="mb-3 font-serif text-xl font-bold text-brand-cream">
                                    {feature.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-brand-cream/60">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
