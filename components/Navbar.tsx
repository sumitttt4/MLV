"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, UserCircle } from "lucide-react";
import { useCart } from "@/store/useCart";
import { useAuth } from "@/store/useAuth";
import { useEffect, useState } from "react";

export function Navbar() {
    const cartQuantity = useCart((state) => state.items.length);
    const user = useAuth((state) => state.user);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            className="fixed left-0 right-0 top-2 z-50 px-4 transition-all duration-300 pointer-events-none lg:top-6"
        >
            <div
                className={`pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-full border border-brand-gold/10 px-6 py-3 transition-all duration-300 ${scrolled || mobileMenuOpen
                    ? "bg-brand-dark/95 shadow-2xl backdrop-blur-md"
                    : "bg-brand-dark/50 backdrop-blur-sm"
                    }`}
            >
                {/* Logo */}
                <Link href="/" className="z-50 flex flex-col leading-none group" onClick={() => setMobileMenuOpen(false)}>
                    <span className="font-serif text-lg font-bold text-brand-gold transition-colors group-hover:text-brand-cream md:text-xl">
                        Hotel MLV
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.25em] text-brand-cream/60 group-hover:text-brand-gold md:text-[10px]">
                        GRAND
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    {[
                        { name: "Home", href: "/" },
                        { name: "Menu", href: "/#menu" },
                        { name: "My Orders", href: "/profile/orders" },
                        { name: "Book Table", href: "/reservation" },
                        { name: "Contact", href: "/contact" }
                    ].map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="relative text-xs font-bold uppercase tracking-widest text-brand-cream/80 transition-colors hover:text-brand-gold group"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-gold transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3 md:gap-4">
                    <Link
                        href={user ? "/profile" : "/auth"}
                        className="flex items-center gap-2 rounded-full border border-brand-gold/30 bg-transparent px-3 py-2 transition-all hover:border-brand-gold hover:bg-brand-gold/10 z-50"
                        title={user ? user.fullName : "Sign In"}
                    >
                        <UserCircle className="h-4 w-4 text-brand-gold" />
                        {mounted && user && (
                            <span className="hidden text-xs font-semibold text-brand-gold md:inline">
                                {user.fullName.split(" ")[0]}
                            </span>
                        )}
                    </Link>

                    <Link
                        href="/checkout"
                        className="group relative flex items-center gap-2 rounded-full border border-brand-gold/30 bg-transparent px-3 py-2 transition-all hover:border-brand-gold hover:bg-brand-gold/10 z-50 md:px-4"
                    >
                        <ShoppingBag className="h-4 w-4 text-brand-gold" />
                        {mounted && cartQuantity > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-maroon text-[10px] font-bold text-white shadow-sm">
                                {cartQuantity}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="z-50 block p-2 text-brand-gold md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <div className="h-5 w-5">✕</div> : <div className="h-5 w-5">☰</div>}
                    </button>

                    <Link
                        href="/reservation"
                        className="hidden rounded-full bg-brand-gold px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-brand-dark transition-transform hover:scale-105 hover:bg-white md:block"
                    >
                        Book Table
                    </Link>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="pointer-events-auto absolute left-4 right-4 top-full mt-2 rounded-3xl border border-brand-gold/10 bg-brand-dark/95 p-6 shadow-2xl backdrop-blur-xl md:hidden"
                >
                    <nav className="flex flex-col gap-6 text-center">
                        {[
                            { name: "Home", href: "/" },
                            { name: "Menu", href: "/#menu" },
                            { name: "My Orders", href: "/profile/orders" },
                            { name: user ? "Profile" : "Sign In", href: user ? "/profile" : "/auth" },
                            { name: "Contact", href: "/contact" }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-bold uppercase tracking-widest text-brand-cream transition-colors hover:text-brand-gold"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="h-px w-full bg-white/5" />
                        <Link
                            href="/reservation"
                            onClick={() => setMobileMenuOpen(false)}
                            className="inline-block w-full rounded-full bg-brand-gold px-6 py-3 text-xs font-bold uppercase tracking-widest text-brand-dark"
                        >
                            Book Table
                        </Link>
                    </nav>
                </motion.div>
            )}
        </motion.header>
    );
}
