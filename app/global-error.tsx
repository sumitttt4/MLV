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
      <body className="min-h-screen bg-brand-cream text-brand-maroon">
        <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl font-semibold">Kitchen Overload</h1>
          <p className="mt-3 text-sm text-brand-maroon/70">
            Our chefs hit a snag while preparing your request. Please reload to
            try again.
          </p>
          {error?.digest ? (
            <p className="mt-2 text-xs text-brand-maroon/50">
              Error code: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full bg-brand-maroon px-6 py-3 text-sm font-semibold text-brand-cream shadow-sm transition hover:bg-brand-maroon/90"
          >
            Reload Page
          </button>
        </main>
      </body>
    </html>
  );
}
