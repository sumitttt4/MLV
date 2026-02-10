import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-brand-dark p-6 text-center text-brand-cream pt-24">
            <h1 className="mb-4 font-serif text-8xl font-bold text-brand-gold opacity-20">404</h1>
            <h2 className="mb-6 font-serif text-3xl font-bold -mt-10">Page Not Found</h2>
            <p className="mb-8 max-w-md text-brand-cream/70">
                The dish you are looking for is not on our menu.
            </p>
            <Link
                href="/"
                className="rounded-full bg-brand-gold px-8 py-3 text-sm font-bold uppercase tracking-widest text-brand-dark transition-all hover:bg-brand-cream hover:scale-105"
            >
                Return Home
            </Link>
        </div>
    );
}
