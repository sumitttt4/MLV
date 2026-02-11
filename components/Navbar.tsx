"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, UserCircle, Menu, X, Package } from "lucide-react";
import { useCart } from "@/store/useCart";
import { useAuth } from "@/store/useAuth";
import { useOfferBar } from "@/store/useOfferBar";
import { useEffect, useState } from "react";

export function Navbar() {
    const cartQuantity = useCart((state) => state.items.length);
    const user = useAuth((state) => state.user);
    const offerBarVisible = useOfferBar((s) => s.visible);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [mobileMenuOpen]);

    const baseLinks = [
        { name: "Home", href: "/" },
        { name: "Menu", href: "/menu" },
    ];

    const authLinks = mounted && user
        ? [{ name: "My Orders", href: "/profile/orders" }]
        : [];

    const navLinks = [
        ...baseLinks,
        ...authLinks,
        { name: "Book Table", href: "/reservation" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <motion.header
            className={`fixed left-0 right-0 z-50 px-3 transition-all duration-300 pointer-events-none sm:px-4 lg:px-6 ${offerBarVisible ? 'top-[2.5rem] sm:top-[2.75rem] lg:top-[3rem]' : 'top-3 sm:top-4 lg:top-6'}`}
        >
            <div
                className={`pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 sm:px-6 sm:py-3 ${scrolled || mobileMenuOpen
                    ? "bg-brand-tamarind/95 shadow-lg backdrop-blur-md border border-brand-gold/20"
                    : "bg-brand-tamarind/80 backdrop-blur-sm border border-transparent"
                    }`}
            >
                {/* Logo */}
                <Link href="/" className="z-50 flex flex-col leading-none group shrink-0" onClick={() => setMobileMenuOpen(false)}>
                    <span className="font-serif text-base font-bold text-brand-gold transition-colors group-hover:text-brand-cream sm:text-lg lg:text-xl">
                        Hotel MLV
                    </span>
                    <span className="text-[7px] uppercase tracking-[0.25em] text-brand-cream/60 group-hover:text-brand-gold sm:text-[8px] lg:text-[10px] font-sans">
                        GRAND
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-5 lg:flex xl:gap-8">
                    {navLinks.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="relative text-[11px] font-bold uppercase tracking-widest text-brand-cream/80 transition-colors hover:text-brand-gold group font-sans xl:text-[12px]"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-gold transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* My Orders shortcut — visible only when logged in */}
                    {mounted && user && (
                        <Link
                            href="/profile/orders"
                            className="hidden lg:flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-transparent px-3 py-2 min-h-[44px] transition-all hover:border-brand-gold hover:bg-brand-gold/10 z-50"
                            title="My Orders"
                        >
                            <Package className="h-4 w-4 text-brand-gold" />
                            <span className="text-[11px] font-bold text-brand-gold uppercase tracking-wider font-sans">Orders</span>
                        </Link>
                    )}

                    <Link
                        href={user ? "/profile" : "/auth"}
                        className="flex items-center gap-2 rounded-full border border-brand-gold/30 bg-transparent px-2.5 py-2 min-h-[44px] min-w-[44px] justify-center transition-all hover:border-brand-gold hover:bg-brand-gold/10 z-50 sm:px-3"
                        title={user ? user.fullName : "Sign In"}
                    >
                        <UserCircle className="h-5 w-5 text-brand-gold" />
                        {mounted && user && (
                            <span className="hidden text-xs font-semibold text-brand-gold lg:inline">
                                {user.fullName.split(" ")[0]}
                            </span>
                        )}
                    </Link>

                    <Link
                        href="/checkout"
                        className="group relative flex items-center gap-2 rounded-full border border-brand-gold/30 bg-transparent px-2.5 py-2 min-h-[44px] min-w-[44px] justify-center transition-all hover:border-brand-gold hover:bg-brand-gold/10 z-50 sm:px-3 lg:px-4"
                    >
                        <ShoppingBag className="h-5 w-5 text-brand-gold" />
                        {mounted && cartQuantity > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-maroon text-[10px] font-bold text-white shadow-sm">
                                {cartQuantity}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="z-50 flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full text-brand-gold lg:hidden transition-colors hover:bg-brand-gold/10"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>

                    <Link
                        href="/reservation"
                        className="hidden rounded-full bg-brand-gold px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-brand-dark transition-all hover:scale-105 hover:bg-brand-cream lg:block xl:px-6 xl:text-xs"
                    >
                        Book Table
                    </Link>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="pointer-events-auto absolute left-3 right-3 top-full mt-2 rounded-3xl border border-brand-gold/10 bg-brand-dark/95 p-6 shadow-2xl backdrop-blur-xl sm:left-4 sm:right-4 lg:hidden"
                    >
                        <nav className="flex flex-col gap-1 text-center">
                            {[
                                ...navLinks,
                                { name: user ? "Profile" : "Sign In", href: user ? "/profile" : "/auth" },
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-sm font-bold uppercase tracking-widest text-brand-cream transition-colors hover:text-brand-gold py-3 min-h-[44px] flex items-center justify-center rounded-xl hover:bg-brand-gold/5"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="h-px w-full bg-white/5 my-2" />
                            <Link
                                href="/reservation"
                                onClick={() => setMobileMenuOpen(false)}
                                className="inline-block w-full rounded-full bg-brand-gold px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-brand-dark transition-all hover:bg-brand-cream"
                            >
                                Book Table
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
