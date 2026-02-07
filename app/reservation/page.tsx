"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, ChevronRight, Check } from "lucide-react";
import Link from "next/link";

export default function ReservationPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);
    }

    if (isSuccess) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-brand-dark px-6 text-center text-brand-cream">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-3xl border border-brand-gold/20 bg-white/5 p-12 backdrop-blur-md"
                >
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-gold text-brand-dark">
                        <Check size={40} strokeWidth={3} />
                    </div>
                    <h1 className="mb-4 font-serif text-4xl font-bold text-brand-gold">
                        Table Reserved!
                    </h1>
                    <p className="mt-4 text-brand-cream/60">
                        Join us for an unforgettable dining experience. Whether it&apos;s a romantic dinner, family gathering, or a corporate event, we are ready to serve you.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-8 py-3 text-sm font-bold uppercase tracking-widest text-brand-dark transition-all hover:scale-105 hover:bg-white"
                    >
                        Return Home <ChevronRight size={16} />
                    </Link>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-brand-dark pt-24 text-brand-cream">
            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

            <div className="relative mx-auto max-w-7xl px-6 py-12 lg:flex lg:items-start lg:gap-20">

                {/* Left: Text Content */}
                <div className="mb-12 lg:mb-0 lg:w-1/2 lg:pt-12">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 inline-block font-bold uppercase tracking-[0.2em] text-brand-gold"
                    >
                        Reservations
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8 font-serif text-5xl font-bold leading-tight md:text-7xl"
                    >
                        Book Your <br /> <span className="text-brand-gold italic">Experience</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12 text-lg leading-relaxed text-brand-cream/70 md:max-w-lg"
                    >
                        Immerse yourself in an evening of culinary excellence.
                        Whether it&apos;s a romantic dinner or a family celebration,
                        we ensure every moment is memorable.
                    </motion.p>

                    <div className="space-y-8 border-l border-brand-gold/20 pl-8">
                        <div>
                            <h3 className="mb-2 font-serif text-xl text-brand-gold">Opening Hours</h3>
                            <p className="text-sm text-brand-cream/60">Mon-Sun: 11:00 AM - 11:00 PM</p>
                        </div>
                        <div>
                            <h3 className="mb-2 font-serif text-xl text-brand-gold">Contact</h3>
                            <p className="text-sm text-brand-cream/60">+91 98765 43210</p>
                            <p className="text-sm text-brand-cream/60">reservations@mlvgrand.com</p>
                        </div>
                    </div>
                </div>

                {/* Right: Booking Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative z-10 w-full rounded-3xl border border-brand-gold/10 bg-white/5 p-8 backdrop-blur-xl md:p-10 lg:w-1/2"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-brand-gold/80">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-cream/40" size={18} />
                                    <input
                                        type="date"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-black/20 py-4 pl-12 pr-4 text-brand-cream placeholder-white/20 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-brand-gold/80">Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-cream/40" size={18} />
                                    <input
                                        type="time"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-black/20 py-4 pl-12 pr-4 text-brand-cream placeholder-white/20 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-brand-gold/80">Guests</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-cream/40" size={18} />
                                <select
                                    className="w-full appearance-none rounded-xl border border-white/10 bg-black/20 py-4 pl-12 pr-4 text-brand-cream focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                                >
                                    {[2, 3, 4, 5, 6, 8, 10, "10+"].map(num => (
                                        <option key={num} value={num} className="bg-brand-dark text-brand-cream">{num} People</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-brand-gold/80">Contact Details</label>
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-brand-cream placeholder-white/20 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                required
                                className="mt-4 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-brand-cream placeholder-white/20 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-brand-gold/80">Special Request</label>
                            <textarea
                                rows={3}
                                placeholder="Anniversary, Birthday, dietary...?"
                                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-brand-cream placeholder-white/20 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-4 w-full rounded-xl bg-brand-gold py-4 text-sm font-bold uppercase tracking-widest text-brand-dark shadow-lg transition-all hover:bg-white hover:shadow-brand-gold/20 disabled:opacity-50"
                        >
                            {isSubmitting ? "Bookings..." : "Confirm Reservation"}
                        </button>

                    </form>
                </motion.div>
            </div>
        </main>
    );
}
