"use client";

import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const reviews = [
    {
        id: 1,
        name: "Aisha Sharma",
        role: "Food Critic",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        text: "The flavors at MLV Grand are nothing short of a royal experience. The Dal Makhani is arguably the best I've had in Mumbai.",
    },
    {
        id: 2,
        name: "Rajesh Kumar",
        role: "Regular Customer",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        text: "Perfect ambiance for family dinners. The staff is courteous, and the Biryani is authentic Hyderabadi style.",
    },
    {
        id: 3,
        name: "Priya Desai",
        role: "Travel Blogger",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        rating: 4,
        text: "A hidden gem! The interiors transport you to a palace. Highly recommend reserving a table in advance over weekends.",
    },
    {
        id: 4,
        name: "Vikram Singh",
        role: "Chef",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        text: "As a chef myself, I appreciate the attention to detail. The spice blends are balanced perfectly. A culinary delight.",
    },
];

export function ReviewsSection() {
    return (
        <section className="bg-brand-dark py-24 text-brand-cream relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-brand-gold/5 blur-3xl" />
            <div className="absolute left-0 bottom-0 h-64 w-64 rounded-full bg-brand-maroon/10 blur-3xl" />

            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-16 text-center">
                    <span className="font-serif text-lg italic text-band-gold/80 text-brand-gold">Testimonials</span>
                    <h2 className="mt-2 font-serif text-4xl font-bold md:text-5xl">What Our Guests Say</h2>
                    <div className="mt-4 mx-auto h-1 w-20 bg-brand-gold rounded-full opacity-60" />
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur transition-all hover:-translate-y-2 hover:border-brand-gold/30 hover:shadow-xl"
                        >
                            <Quote className="absolute right-6 top-6 text-brand-gold/20 group-hover:text-brand-gold/40 transition-colors" size={40} />

                            <div className="mb-6 flex items-center gap-4">
                                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-brand-gold/20">
                                    <Image src={review.image} alt={review.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-brand-cream">{review.name}</h3>
                                    <p className="text-xs text-brand-gold/80">{review.role}</p>
                                </div>
                            </div>

                            <div className="mb-4 flex gap-1 text-brand-gold">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 2} />
                                ))}
                            </div>

                            {review.text}
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
