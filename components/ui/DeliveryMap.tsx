"use client";

import { motion } from "framer-motion";

export function DeliveryMap() {
    return (
        <div className="relative h-[300px] w-full overflow-hidden rounded-3xl bg-[#e8e4d9] shadow-inner lg:h-[400px]">
            {/* Abstract Map Roads */}
            <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 400 300" preserveAspectRatio="none">
                <path d="M-10 150 C 100 150, 100 50, 200 50 S 300 150, 410 150" fill="none" stroke="white" strokeWidth="20" />
                <path d="M50 310 L 50 -10" fill="none" stroke="white" strokeWidth="15" />
                <path d="M250 310 L 250 -10" fill="none" stroke="white" strokeWidth="15" />
            </svg>

            {/* Restaurant Location */}
            <div className="absolute left-[45%] top-[10%] flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-maroon shadow-lg ring-4 ring-white/50">
                    <span className="text-xl">🏰</span>
                </div>
                <span className="mt-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-brand-dark shadow-sm">Restaurant</span>
            </div>

            {/* Delivery Location Pulse */}
            <div className="absolute bottom-[20%] right-[20%]">
                <div className="relative flex h-8 w-8 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-gold opacity-75"></span>
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-brand-maroon"></span>
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-dark px-2 py-0.5 text-[10px] font-bold text-brand-gold shadow-sm">You</span>
            </div>

            {/* Moving Scooter */}
            <motion.div
                className="absolute top-[16%] left-[50%]"
                animate={{
                    left: ["50%", "60%", "65%", "70%", "80%"],
                    top: ["16%", "30%", "50%", "70%", "80%"]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold text-brand-dark shadow-xl ring-2 ring-white">
                    🛵
                </div>
            </motion.div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-cream/50 to-transparent pointer-events-none" />
        </div>
    );
}
