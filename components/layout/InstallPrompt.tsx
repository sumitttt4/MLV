"use client";

import { useEffect, useState } from "react";
import { X, Download, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function isIOS() {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function isInStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [showIOSGuide, setShowIOSGuide] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (isInStandaloneMode()) return;

        // Check if user already dismissed
        const dismissed = localStorage.getItem("mlv-pwa-dismissed");
        if (dismissed) {
            const dismissedAt = parseInt(dismissed, 10);
            // Show again after 7 days
            if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return;
        }

        // Android/Chrome: listen for install prompt
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setTimeout(() => setIsVisible(true), 3000);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        // iOS: show manual guide after delay
        if (isIOS()) {
            setTimeout(() => {
                setShowIOSGuide(true);
                setIsVisible(true);
            }, 4000);
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === "accepted") {
                setDeferredPrompt(null);
            }
        }
        setIsVisible(false);
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem("mlv-pwa-dismissed", Date.now().toString());
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="fixed bottom-0 left-0 right-0 z-[100]"
                >
                    <div className="rounded-t-3xl border-t border-brand-gold/20 bg-brand-dark/95 p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:mx-auto sm:mb-4 sm:max-w-md sm:rounded-2xl sm:border">
                        {/* Header */}
                        <div className="mb-2 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-maroon shadow-lg ring-2 ring-brand-gold/20">
                                    <span className="font-serif text-xl font-bold text-brand-gold">M</span>
                                </div>
                                <div>
                                    <h3 className="font-serif text-base font-bold text-brand-gold">
                                        Hotel MLV Grand
                                    </h3>
                                    <p className="text-[11px] text-brand-cream/60">
                                        {showIOSGuide
                                            ? "Add to your home screen for quick access"
                                            : "Install our app for faster ordering"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleDismiss}
                                className="rounded-full bg-white/5 p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                                aria-label="Dismiss install prompt"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* iOS Guide */}
                        {showIOSGuide ? (
                            <div className="mt-4 space-y-3">
                                <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold/10">
                                        <Share2 size={16} className="text-brand-gold" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-brand-cream">
                                            Step 1: Tap <Share2 size={14} className="inline mb-0.5" /> Share
                                        </p>
                                        <p className="text-[11px] text-brand-cream/50">
                                            At the bottom of Safari
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold/10">
                                        <Download size={16} className="text-brand-gold" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-brand-cream">
                                            Step 2: &quot;Add to Home Screen&quot;
                                        </p>
                                        <p className="text-[11px] text-brand-cream/50">
                                            Scroll down and tap it
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={handleInstallClick}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-gold px-4 py-3 text-sm font-bold uppercase tracking-wider text-brand-dark shadow-lg transition-transform active:scale-95"
                                >
                                    <Download size={16} />
                                    Install App
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
