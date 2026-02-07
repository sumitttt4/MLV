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
        <section className="bg-brand-cream py-20 lg:py-32">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <span className="font-serif text-lg italic text-brand-maroon/70">Why Choose Us</span>
                    <h2 className="mt-2 font-serif text-4xl font-bold text-brand-dark md:text-5xl">
                        We Serve Passion
                    </h2>
                </div>

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 sm:grid sm:pb-0 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4 scrollbar-hide">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group min-w-[280px] snap-center rounded-3xl bg-white p-8 text-center shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl hover:bg-brand-maroon"
                        >
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-cream text-brand-maroon transition-colors group-hover:bg-brand-gold group-hover:text-brand-dark">
                                <feature.icon size={32} />
                            </div>
                            <h3 className="mb-3 font-serif text-xl font-bold text-brand-dark transition-colors group-hover:text-white">
                                {feature.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-600 transition-colors group-hover:text-brand-cream/80">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
