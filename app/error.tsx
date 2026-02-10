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
        // Error is already captured by Next.js error boundary
    }, [error]);

    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center bg-brand-dark p-8 text-center text-brand-cream">
            <h2 className="mb-4 font-serif text-2xl font-bold text-brand-gold">Something went wrong!</h2>
            <p className="mb-6 text-brand-cream/70">We apologize for the inconvenience.</p>
            <button
                type="button"
                onClick={() => reset()}
                className="rounded-full bg-brand-gold px-6 py-2 font-bold text-brand-dark transition-colors hover:bg-brand-cream"
            >
                Try again
            </button>
        </div>
    );
}
