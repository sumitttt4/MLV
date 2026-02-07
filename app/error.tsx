"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
            <h2 className="mb-4 font-serif text-2xl font-bold text-brand-gold">Something went wrong!</h2>
            <p className="mb-6 text-brand-cream/70">We apologize for the inconvenience.</p>
            <button
                onClick={() => reset()}
                className="rounded-full bg-brand-gold px-6 py-2 font-bold text-brand-dark transition-colors hover:bg-white"
            >
                Try again
            </button>
        </div>
    );
}
