import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-brand-tamarind px-4 py-12 text-brand-cream sm:px-6 sm:py-16 lg:py-24 border-t border-brand-gold/10">
            <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">
                {/* Brand */}
                <div className="space-y-6">
                    <Link href="/" className="flex flex-col leading-none group">
                        <span className="font-serif text-2xl font-bold text-brand-gold">
                            Hotel MLV
                        </span>
                        <span className="text-xs uppercase tracking-[0.25em] text-brand-cream/60 font-sans">
                            GRAND
                        </span>
                    </Link>
                    <p className="text-sm leading-relaxed text-brand-cream/60">
                        Experience the finest culinary journey with tastes that linger and ambiance that mesmerizes. A tradition of luxury since 2019.
                    </p>
                    <div className="flex gap-3">
                        {([{Icon: Facebook, label: "Facebook"}, {Icon: Instagram, label: "Instagram"}, {Icon: Twitter, label: "Twitter"}]).map(({Icon, label}) => (
                            <a key={label} href="#" aria-label={label} className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/20 text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-dark">
                                <Icon size={20} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="mb-6 font-serif text-lg font-bold text-brand-gold">Quick Links</h3>
                    <ul className="space-y-1 text-sm text-brand-cream/70">
                        <li><Link href="/" className="transition-colors hover:text-brand-gold block py-2">Home</Link></li>
                        <li><Link href="/#menu" className="transition-colors hover:text-brand-gold block py-2">Menu</Link></li>
                        <li><Link href="/#menu" className="transition-colors hover:text-brand-gold block py-2">Order Online</Link></li>
                        <li><Link href="/reservation" className="transition-colors hover:text-brand-gold block py-2">Table Reservation</Link></li>
                        <li><Link href="/contact" className="transition-colors hover:text-brand-gold block py-2">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="mb-6 font-serif text-lg font-bold text-brand-gold">Contact Us</h3>
                    <ul className="space-y-4 text-sm text-brand-cream/70">
                        <li className="flex gap-3">
                            <MapPin className="shrink-0 text-brand-gold" size={18} />
                            <span># 174/3, Hotel MLV Grand, Opp. Ferra, Mandur Post, Budigere Main Road, Near Baldwin School, Bengaluru, Karnataka-560049</span>
                        </li>
                        <li className="flex gap-3">
                            <Phone className="shrink-0 text-brand-gold" size={18} />
                            <div className="flex flex-col gap-1">
                                <a href="tel:+917795676809" className="transition-colors hover:text-brand-gold py-1.5 inline-block">+91 77956 76809</a>
                                <a href="tel:+917975161096" className="transition-colors hover:text-brand-gold py-1.5 inline-block">+91 79751 61096</a>
                            </div>
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
                                <p><span className="text-brand-cream">Mon - Fri:</span> 11:00 AM - 11:00 PM</p>
                                <p><span className="text-brand-cream">Sat - Sun:</span> 10:00 AM - 12:00 AM</p>
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
