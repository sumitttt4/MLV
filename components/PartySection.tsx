"use client";

import Image from "next/image";

const events = [
    {
        title: "Birthday Party",
        subtitle: "Celebrate your special day with us",
        image: "https://images.unsplash.com/photo-1530103862676-de3c9a59af38?auto=format&fit=crop&w=500&q=80",
        action: "Book Now"
    },
    {
        title: "Family Gatherings",
        subtitle: "Perfect ambiance for your loved ones",
        image: "https://images.unsplash.com/photo-1511632765486-a01980978fc9?auto=format&fit=crop&w=500&q=80",
        action: "Book Table"
    },
    {
        title: "Corporate Lunch",
        subtitle: "Impress clients with premium dining",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=500&q=80",
        action: "Contact Us"
    },
];

export function PartySection() {
    return (
        <section className="bg-brand-dark py-24 pb-32">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-16 text-center">
                    <span className="font-serif text-lg italic text-brand-gold">Occasions</span>
                    <h2 className="mt-2 font-serif text-4xl font-bold text-brand-cream md:text-5xl">Book Your Parties & Events</h2>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map((event, i) => (
                        <div key={i} className="group relative overflow-hidden rounded-3xl border border-brand-gold/10 bg-white/5 transition-all hover:-translate-y-2 hover:border-brand-gold/30 hover:shadow-2xl">
                            {/* Image */}
                            <div className="relative h-64 w-full overflow-hidden">
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-80"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent opacity-90" />
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                                <h3 className="mb-2 font-serif text-2xl font-bold text-brand-gold">{event.title}</h3>
                                <p className="mb-6 text-sm text-brand-cream/70">{event.subtitle}</p>
                                <button className="min-w-[140px] rounded-full border border-brand-gold/30 bg-black/40 px-6 py-2 text-xs font-bold uppercase tracking-widest text-brand-cream backdrop-blur-sm transition-colors hover:border-brand-gold hover:bg-brand-gold hover:text-brand-dark">
                                    {event.action}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
