import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-brand-dark px-6 py-16 text-brand-cream lg:py-24">
            <div className="mx-auto grid max-w-7xl gap-12 sm:grid-cols-2 lg:grid-cols-4">
                {/* Brand */}
                <div className="space-y-6">
                    <Link href="/" className="flex flex-col leading-none group">
                        <span className="font-serif text-2xl font-bold text-brand-gold">
                            Hotel MLV
                        </span>
                        <span className="text-xs uppercase tracking-[0.25em] text-brand-cream/60">
                            GRAND
                        </span>
                    </Link>
                    <p className="text-sm leading-relaxed text-brand-cream/60">
                        Experience the finest culinary journey with tastes that linger and ambiance that mesmerizes. A tradition of luxury since 1995.
                    </p>
                    <div className="flex gap-4">
                        {[Facebook, Instagram, Twitter].map((Icon, i) => (
                            <a key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/20 text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-dark">
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="mb-6 font-serif text-lg font-bold text-brand-gold">Quick Links</h3>
                    <ul className="space-y-4 text-sm text-brand-cream/70">
                        <li><Link href="/" className="transition-colors hover:text-brand-gold">Home</Link></li>
                        <li><Link href="/#menu" className="transition-colors hover:text-brand-gold">Menu</Link></li>
                        <li><Link href="/#menu" className="transition-colors hover:text-brand-gold">Order Online</Link></li>
                        <li><Link href="/reservation" className="transition-colors hover:text-brand-gold">Table Reservation</Link></li>
                        <li><Link href="/contact" className="transition-colors hover:text-brand-gold">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="mb-6 font-serif text-lg font-bold text-brand-gold">Contact Us</h3>
                    <ul className="space-y-4 text-sm text-brand-cream/70">
                        <li className="flex gap-3">
                            <MapPin className="shrink-0 text-brand-gold" size={18} />
                            <span>123 Culinary Avenue, Food District, Mumbai, India 400001</span>
                        </li>
                        <li className="flex gap-3">
                            <Phone className="shrink-0 text-brand-gold" size={18} />
                            <span>+91 98765 43210</span>
                        </li>
                        <li className="flex gap-3">
                            <Mail className="shrink-0 text-brand-gold" size={18} />
                            <span>reservations@mlvgrand.com</span>
                        </li>
                    </ul>
                </div>

                {/* Opening Hours */}
                <div>
                    <h3 className="mb-6 font-serif text-lg font-bold text-brand-gold">Opening Hours</h3>
                    <ul className="space-y-4 text-sm text-brand-cream/70">
                        <li className="flex items-start gap-3">
                            <Clock className="mt-1 shrink-0 text-brand-gold" size={18} />
                            <div className="space-y-1">
                                <p><span className="text-white">Mon - Fri:</span> 11:00 AM - 11:00 PM</p>
                                <p><span className="text-white">Sat - Sun:</span> 10:00 AM - 12:00 AM</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-16 border-t border-brand-gold/10 pt-8 text-center text-xs text-brand-cream/40">
                <p>&copy; {new Date().getFullYear()} Hotel MLV Grand. All rights reserved.</p>
            </div>
        </footer>
    );
}
