"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function AboutSection() {
    return (
        <section className="relative overflow-hidden bg-brand-dark py-20 lg:py-32">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('/noise.png')" }}></div>

            <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
                {/* Image Grid */}
                <div className="relative mx-auto h-[400px] w-full max-w-md lg:h-[500px]">
                    <div className="absolute left-0 top-0 h-4/5 w-4/5 overflow-hidden rounded-tr-[4rem] rounded-bl-[4rem] border-2 border-brand-gold/20">
                        <Image
                            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                            alt="Restaurant Interior"
                            fill
                            className="object-cover opacity-80"
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 h-3/5 w-3/5 overflow-hidden rounded-tl-[3rem] rounded-br-[3rem] border-4 border-brand-dark shadow-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80"
                            alt="Chef Plating"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center lg:text-left"
                >
                    <span className="font-serif text-lg italic text-brand-gold">Our Story</span>
                    <h2 className="mt-2 font-serif text-4xl font-bold leading-tight text-brand-cream md:text-5xl">
                        A Legacy of <br />
                        <span className="text-brand-gold">Exquisite Flavors</span>
                    </h2>
                    <p className="mt-6 text-brand-cream/70 leading-relaxed">
                        Founded in 1995, Hotel MLV Grand has been a sanctuary for food lovers. We believe that dining is not just about food, but an experience that engages all senses. From our locally sourced ingredients to our master chefs&apos; innovative techniques, every dish tells a story of passion and heritage.
                    </p>
                    <p className="mt-4 text-brand-cream/70 leading-relaxed">
                        Whether you are here for a quick bite or a grand celebration, our commitment to quality and service remains improving.
                    </p>

                    <div className="mt-10 flex flex-wrap justify-center gap-8 lg:justify-start">
                        <div className="text-center">
                            <h4 className="font-serif text-3xl font-bold text-brand-gold">25+</h4>
                            <p className="text-xs uppercase tracking-wider text-brand-cream/60">Years of Service</p>
                        </div>
                        <div className="text-center">
                            <h4 className="font-serif text-3xl font-bold text-brand-gold">50+</h4>
                            <p className="text-xs uppercase tracking-wider text-brand-cream/60">Expert Chefs</p>
                        </div>
                        <div className="text-center">
                            <h4 className="font-serif text-3xl font-bold text-brand-gold">200+</h4>
                            <p className="text-xs uppercase tracking-wider text-brand-cream/60">Dishes</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
