import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-brand-dark p-6 text-center text-brand-cream">
            <h1 className="mb-4 font-serif text-6xl font-bold text-brand-gold">404</h1>
            <h2 className="mb-6 font-serif text-2xl">Page Not Found</h2>
            <p className="mb-8 max-w-md text-brand-cream/70">
                The page you are looking for does not exist or has been moved.
            </p>
            <Link
                href="/"
                className="rounded-full bg-brand-gold px-8 py-3 font-bold text-brand-dark transition-all hover:bg-white hover:scale-105"
            >
                Return Home
            </Link>
        </div>
    );
}
