"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  ChevronRight,
  Check,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { createReservation } from "@/lib/api";
import { toast } from "sonner";

/* ────────────────────────────────────────────
   Time-slot generation: 11:00 AM to 10:30 PM
   every 30 minutes
   ──────────────────────────────────────────── */
function generateTimeSlots(): { label: string; value: string }[] {
  const slots: { label: string; value: string }[] = [];
  for (let hour = 11; hour <= 22; hour++) {
    for (const minute of [0, 30]) {
      if (hour === 22 && minute > 30) break;
      const h24 = String(hour).padStart(2, "0");
      const m = String(minute).padStart(2, "0");
      const value = `${h24}:${m}`;

      const displayHour = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? "PM" : "AM";
      const label = `${displayHour}:${m} ${ampm}`;

      slots.push({ label, value });
    }
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

/* ────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────── */
function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateDisplay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTimeDisplay(value: string): string {
  const slot = TIME_SLOTS.find((s) => s.value === value);
  return slot?.label ?? value;
}

/* ────────────────────────────────────────────
   Shared classes
   ──────────────────────────────────────────── */
const inputBase =
  "w-full rounded-xl border border-white/10 bg-black/20 py-4 text-brand-cream placeholder-white/30 transition-colors focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold";

/* ────────────────────────────────────────────
   Component
   ──────────────────────────────────────────── */
export default function ReservationPage() {
  /* --- form state --- */
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  /* --- ui state --- */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);

  const minDate = useMemo(() => todayISO(), []);

  /* --- validation helpers --- */
  function validatePhone(value: string): boolean {
    return /^\d{10}$/.test(value.replace(/\s/g, ""));
  }

  function validateDate(value: string): boolean {
    if (!value) return false;
    return value >= minDate;
  }

  /* --- submit --- */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Client-side validation
    if (!validateDate(date)) {
      toast.error("Please select today or a future date.");
      return;
    }

    if (!time) {
      toast.error("Please select a preferred time slot.");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    const cleanPhone = phone.replace(/\s/g, "");
    if (!validatePhone(cleanPhone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const id = await createReservation({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: cleanPhone,
        date,
        time,
        partySize: Number(guests),
        specialRequests: specialRequests.trim() || undefined,
      });

      setReservationId(id);
      setIsSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ─────────── Success state ─────────── */
  if (isSuccess) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-brand-dark px-6 text-center text-brand-cream">
        {/* background texture */}
        <div className="pointer-events-none fixed inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative z-10 w-full max-w-lg rounded-3xl border border-brand-gold/20 bg-white/5 p-10 backdrop-blur-md md:p-14"
          >
            {/* check icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-brand-gold text-brand-dark"
            >
              <Check size={40} strokeWidth={3} />
            </motion.div>

            <h1 className="mb-3 font-serif text-4xl font-bold text-brand-gold md:text-5xl">
              Table Reserved!
            </h1>

            {reservationId && (
              <p className="mb-6 text-sm tracking-wide text-brand-cream/50">
                Reservation ID:{" "}
                <span className="font-mono text-brand-gold/80">{reservationId}</span>
              </p>
            )}

            {/* confirmation details */}
            <div className="mb-8 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-6 text-left text-sm">
              <div className="flex items-center gap-3 text-brand-cream/70">
                <Calendar size={16} className="shrink-0 text-brand-gold" />
                <span>{formatDateDisplay(date)}</span>
              </div>
              <div className="flex items-center gap-3 text-brand-cream/70">
                <Clock size={16} className="shrink-0 text-brand-gold" />
                <span>{formatTimeDisplay(time)}</span>
              </div>
              <div className="flex items-center gap-3 text-brand-cream/70">
                <Users size={16} className="shrink-0 text-brand-gold" />
                <span>
                  {guests} {Number(guests) === 1 ? "Guest" : "Guests"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-brand-cream/70">
                <Phone size={16} className="shrink-0 text-brand-gold" />
                <span>{phone}</span>
              </div>
              {email && (
                <div className="flex items-center gap-3 text-brand-cream/70">
                  <Mail size={16} className="shrink-0 text-brand-gold" />
                  <span>{email}</span>
                </div>
              )}
            </div>

            <p className="mb-8 text-brand-cream/60">
              We look forward to welcoming you, {name.split(" ")[0]}. For any changes,
              please call us at{" "}
              <span className="text-brand-gold">7795676809</span>.
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-8 py-3 text-sm font-bold uppercase tracking-widest text-brand-dark transition-all hover:scale-105 hover:bg-white"
            >
              Return Home <ChevronRight size={16} />
            </Link>
          </motion.div>
        </AnimatePresence>
      </main>
    );
  }

  /* ─────────── Form state ─────────── */
  return (
    <main className="min-h-screen bg-brand-dark pt-24 text-brand-cream">
      {/* background texture */}
      <div className="pointer-events-none fixed inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:flex lg:items-start lg:gap-20">
        {/* ──── Left column: info ──── */}
        <div className="mb-14 lg:mb-0 lg:w-1/2 lg:pt-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-block text-sm font-bold uppercase tracking-[0.2em] text-brand-gold"
          >
            Reservations
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 font-serif text-5xl font-bold leading-tight md:text-7xl"
          >
            Book Your <br />
            <span className="italic text-brand-gold">Experience</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 text-lg leading-relaxed text-brand-cream/70 md:max-w-lg"
          >
            Immerse yourself in an evening of culinary excellence. Whether
            it&apos;s a romantic dinner, family celebration, or a corporate
            event, we ensure every moment is memorable.
          </motion.p>

          {/* restaurant details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8 border-l-2 border-brand-gold/20 pl-8"
          >
            {/* opening hours */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Clock size={16} className="text-brand-gold" />
                <h3 className="font-serif text-xl text-brand-gold">
                  Opening Hours
                </h3>
              </div>
              <p className="text-sm text-brand-cream/60">
                Mon &ndash; Sun: 11:00 AM &ndash; 11:00 PM
              </p>
            </div>

            {/* contact */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Phone size={16} className="text-brand-gold" />
                <h3 className="font-serif text-xl text-brand-gold">Contact</h3>
              </div>
              <p className="text-sm text-brand-cream/60">+91 7795676809</p>
              <p className="text-sm text-brand-cream/60">+91 7975161096</p>
            </div>

            {/* location */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <MessageSquare size={16} className="text-brand-gold" />
                <h3 className="font-serif text-xl text-brand-gold">Location</h3>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-brand-cream/60">
                #174/3, Opp. Ferra, Mandur Post, Budigere Main Road, Near
                Baldwin School, Bengaluru &ndash; 560049
              </p>
            </div>
          </motion.div>
        </div>

        {/* ──── Right column: form ──── */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 w-full rounded-3xl border border-brand-gold/10 bg-white/5 p-8 backdrop-blur-xl md:p-10 lg:w-1/2"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ── Date & Time ── */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Date */}
              <div className="space-y-2">
                <label
                  htmlFor="res-date"
                  className="text-xs font-bold uppercase tracking-wider text-brand-gold/80"
                >
                  Date
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-cream/40"
                    size={18}
                  />
                  <input
                    id="res-date"
                    type="date"
                    required
                    min={minDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`${inputBase} pl-12 pr-4`}
                  />
                </div>
              </div>

              {/* Time */}
              <div className="space-y-2">
                <label
                  htmlFor="res-time"
                  className="text-xs font-bold uppercase tracking-wider text-brand-gold/80"
                >
                  Time
                </label>
                <div className="relative">
                  <Clock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-cream/40"
                    size={18}
                  />
                  <select
                    id="res-time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={`${inputBase} appearance-none pl-12 pr-4`}
                  >
                    <option value="" disabled className="bg-brand-dark text-brand-cream">
                      Select time
                    </option>
                    {TIME_SLOTS.map((slot) => (
                      <option
                        key={slot.value}
                        value={slot.value}
                        className="bg-brand-dark text-brand-cream"
                      >
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ── Guests ── */}
            <div className="space-y-2">
              <label
                htmlFor="res-guests"
                className="text-xs font-bold uppercase tracking-wider text-brand-gold/80"
              >
                Guests
              </label>
              <div className="relative">
                <Users
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-cream/40"
                  size={18}
                />
                <select
                  id="res-guests"
                  required
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className={`${inputBase} appearance-none pl-12 pr-4`}
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                    <option
                      key={n}
                      value={n}
                      className="bg-brand-dark text-brand-cream"
                    >
                      {n} {n === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Full Name ── */}
            <div className="space-y-2">
              <label
                htmlFor="res-name"
                className="text-xs font-bold uppercase tracking-wider text-brand-gold/80"
              >
                Full Name
              </label>
              <div className="relative">
                <Users
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-cream/40"
                  size={18}
                />
                <input
                  id="res-name"
                  type="text"
                  required
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${inputBase} pl-12 pr-4`}
                />
              </div>
            </div>

            {/* ── Phone ── */}
            <div className="space-y-2">
              <label
                htmlFor="res-phone"
                className="text-xs font-bold uppercase tracking-wider text-brand-gold/80"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-cream/40"
                  size={18}
                />
                <input
                  id="res-phone"
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 10) setPhone(val);
                  }}
                  className={`${inputBase} pl-12 pr-4`}
                />
              </div>
              {phone.length > 0 && phone.length < 10 && (
                <p className="text-xs text-brand-maroon">
                  Enter a 10-digit phone number
                </p>
              )}
            </div>

            {/* ── Email (optional) ── */}
            <div className="space-y-2">
              <label
                htmlFor="res-email"
                className="text-xs font-bold uppercase tracking-wider text-brand-gold/80"
              >
                Email{" "}
                <span className="normal-case tracking-normal text-brand-cream/40">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-cream/40"
                  size={18}
                />
                <input
                  id="res-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputBase} pl-12 pr-4`}
                />
              </div>
            </div>

            {/* ── Special Requests (optional) ── */}
            <div className="space-y-2">
              <label
                htmlFor="res-requests"
                className="text-xs font-bold uppercase tracking-wider text-brand-gold/80"
              >
                Special Requests{" "}
                <span className="normal-case tracking-normal text-brand-cream/40">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <MessageSquare
                  className="absolute left-4 top-4 text-brand-cream/40"
                  size={18}
                />
                <textarea
                  id="res-requests"
                  rows={3}
                  placeholder="Anniversary, birthday, dietary needs...?"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className={`${inputBase} pl-12 pr-4`}
                />
              </div>
            </div>

            {/* ── Submit ── */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gold py-4 text-sm font-bold uppercase tracking-widest text-brand-dark shadow-lg transition-colors hover:bg-white hover:shadow-brand-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Reserving...
                </>
              ) : (
                <>
                  Confirm Reservation <ChevronRight size={16} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
