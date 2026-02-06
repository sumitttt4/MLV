import Link from "next/link";

type OrderTrackingPageProps = {
  params: { id: string };
};

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  return (
    <main className="min-h-screen bg-brand-cream text-brand-maroon">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-16">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-maroon/60">
          Order tracking
        </span>
        <h1 className="text-3xl font-semibold">Thanks for your order!</h1>
        <p className="text-sm text-brand-maroon/70">
          We have received your order and will update you as it moves through
          the kitchen.
        </p>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm uppercase text-brand-maroon/60">Order ID</p>
          <p className="mt-2 text-2xl font-semibold">#{params.id}</p>
        </div>

        <div className="rounded-3xl border border-dashed border-brand-maroon/20 bg-white/70 p-6 text-sm text-brand-maroon/70">
          <p className="font-medium text-brand-maroon">What happens next?</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>We confirm your items with the kitchen team.</li>
            <li>Your order is prepared fresh as soon as possible.</li>
            <li>We will notify you when it is ready for pickup or delivery.</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-brand-maroon px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-maroon/90"
          >
            Back to menu
          </Link>
          <Link
            href="/checkout"
            className="rounded-full border border-brand-maroon/20 bg-white px-6 py-3 text-sm font-semibold text-brand-maroon shadow-sm transition hover:border-brand-maroon/40"
          >
            Start a new order
          </Link>
        </div>
      </div>
    </main>
  );
}
