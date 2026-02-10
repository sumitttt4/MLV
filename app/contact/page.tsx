"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createContactSubmission } from "@/lib/api";

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
}

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    function validate(): FormErrors {
        const newErrors: FormErrors = {};

        if (!name.trim()) {
            newErrors.name = "Name is required.";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (phone.trim() && !/^[+\d\s()-]{7,20}$/.test(phone.trim())) {
            newErrors.phone = "Please enter a valid phone number.";
        }

        if (!message.trim()) {
            newErrors.message = "Message is required.";
        } else if (message.trim().length < 10) {
            newErrors.message = "Message must be at least 10 characters.";
        }

        return newErrors;
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setIsSubmitting(true);

        try {
            const fullMessage = subject.trim()
                ? `[Subject: ${subject.trim()}]\n\n${message.trim()}`
                : message.trim();

            await createContactSubmission({
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim() || undefined,
                message: fullMessage,
            });

            toast.success("Message sent successfully! We'll get back to you soon.");

            setName("");
            setEmail("");
            setPhone("");
            setSubject("");
            setMessage("");
            setErrors({});
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    const inputBaseClass =
        "w-full rounded-lg border bg-black/20 p-4 text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:ring-1 transition-colors";
    const inputValidClass = "border-white/10 focus:border-brand-gold focus:ring-brand-gold";
    const inputErrorClass = "border-red-500/60 focus:border-red-500 focus:ring-red-500";

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
                                    No. 123, Brigade Road, Bangalore, <br /> Karnataka 560001
                                </p>
                            </div>

                            <div className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur transition-all hover:border-brand-gold/30">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                                    <Phone size={24} />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-brand-gold">Call Us</h3>
                                <p className="text-sm leading-relaxed text-brand-cream/70">
                                    +91 80 4567 8901 <br />
                                    +91 98765 43210
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
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-brand-cream/60">
                                    Your Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                                    }}
                                    placeholder="John Doe"
                                    className={`${inputBaseClass} ${errors.name ? inputErrorClass : inputValidClass}`}
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-400">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-brand-cream/60">
                                    Email Address <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                                    }}
                                    placeholder="john@example.com"
                                    className={`${inputBaseClass} ${errors.email ? inputErrorClass : inputValidClass}`}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-400">{errors.email}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-brand-cream/60">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value);
                                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                                    }}
                                    placeholder="+91 98765 43210"
                                    className={`${inputBaseClass} ${errors.phone ? inputErrorClass : inputValidClass}`}
                                />
                                {errors.phone && (
                                    <p className="text-xs text-red-400">{errors.phone}</p>
                                )}
                            </div>

                            {/* Subject */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-brand-cream/60">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="How can we help?"
                                    className={`${inputBaseClass} ${inputValidClass}`}
                                />
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-brand-cream/60">
                                    Message <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    rows={5}
                                    value={message}
                                    onChange={(e) => {
                                        setMessage(e.target.value);
                                        if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                                    }}
                                    placeholder="Tell us what you have in mind..."
                                    className={`${inputBaseClass} ${errors.message ? inputErrorClass : inputValidClass}`}
                                ></textarea>
                                {errors.message && (
                                    <p className="text-xs text-red-400">{errors.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-gold py-4 text-sm font-bold uppercase tracking-widest text-brand-dark hover:bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <>
                                        Sending... <Loader2 size={16} className="animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        Send Message <Send size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>

                </div>
            </div>
        </main>
    );
}
