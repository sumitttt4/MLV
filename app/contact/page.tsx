"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-brand-dark pt-24 text-brand-cream">
            <div className="mx-auto max-w-7xl px-6 pb-20">

                <div className="mb-16 text-center">
                    <span className="text-sm font-bold uppercase tracking-[0.3em] text-brand-gold">Get in Touch</span>
                    <h1 className="mt-4 font-serif text-5xl font-bold md:text-7xl">Contact Us</h1>
                </div>

                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Contact Information & Map */}
                    <div className="space-y-12">
                        <div className="grid gap-8 sm:grid-cols-2">
                            <div className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur transition-all hover:border-brand-gold/30">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                                    <MapPin size={24} />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-brand-gold">Visit Us</h3>
                                <p className="text-sm leading-relaxed text-brand-cream/70">
                                    123 Culinary Avenue, Food District <br /> Mumbai, India 400001
                                </p>
                            </div>

                            <div className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur transition-all hover:border-brand-gold/30">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                                    <Phone size={24} />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-brand-gold">Call Us</h3>
                                <p className="text-sm leading-relaxed text-brand-cream/70">
                                    +91 98765 43210 <br />
                                    +91 22 1234 5678
                                </p>
                            </div>

                            <div className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur transition-all hover:border-brand-gold/30">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                                    <Mail size={24} />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-brand-gold">Email Us</h3>
                                <p className="text-sm leading-relaxed text-brand-cream/70">
                                    reservations@mlvgrand.com <br />
                                    info@mlvgrand.com
                                </p>
                            </div>

                            <div className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur transition-all hover:border-brand-gold/30">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                                    <Clock size={24} />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-brand-gold">Hours</h3>
                                <p className="text-sm leading-relaxed text-brand-cream/70">
                                    Mon - Fri: 11am - 11pm <br />
                                    Sat - Sun: 10am - 12am
                                </p>
                            </div>
                        </div>

                        {/* Map Embed */}
                        <div className="h-[300px] w-full overflow-hidden rounded-3xl border border-white/10 grayscale filter hover:grayscale-0 transition-all duration-500">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.812395353066!2d72.8468817!3d19.0760909!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c5b63b5f000b%3A0x6a2c286595a8b5e!2sSantacruz%20East%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl lg:p-12"
                    >
                        <h3 className="mb-6 font-serif text-3xl font-bold text-brand-gold">Send a Message</h3>
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-brand-cream/60">Your Name</label>
                                <input type="text" className="w-full rounded-lg border border-white/10 bg-black/20 p-4 text-brand-cream focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-brand-cream/60">Email Address</label>
                                <input type="email" className="w-full rounded-lg border border-white/10 bg-black/20 p-4 text-brand-cream focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-brand-cream/60">Message</label>
                                <textarea rows={5} className="w-full rounded-lg border border-white/10 bg-black/20 p-4 text-brand-cream focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"></textarea>
                            </div>
                            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-gold py-4 text-sm font-bold uppercase tracking-widest text-brand-dark hover:bg-white transition-colors">
                                Send Message <Send size={16} />
                            </button>
                        </form>
                    </motion.div>

                </div>
            </div>
        </main>
    );
}
