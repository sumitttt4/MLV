"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-dark text-brand-cream">
        <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
          <h1 className="font-serif text-4xl font-semibold text-brand-gold">Kitchen Overload</h1>
          <p className="mt-3 text-sm text-brand-cream/70">
            Our chefs hit a snag while preparing your request. Please reload to
            try again.
          </p>
          {error?.digest ? (
            <p className="mt-2 text-xs text-brand-cream/50">
              Error code: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-brand-gold px-6 py-3 text-sm font-bold text-brand-dark shadow-sm transition hover:bg-brand-cream hover:scale-105"
          >
            Reload Page
          </button>
        </main>
      </body>
    </html>
  );
}
