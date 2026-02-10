"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dateInput, setDateInput] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  /* --- ui state --- */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);

  // Derive ISO date string for submission
  const date = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

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
    if (!selectedDate) {
      toast.error("Please select a date.");
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
                <CalendarIcon size={16} className="shrink-0 text-brand-gold" />
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
              className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-8 py-3 text-sm font-bold uppercase tracking-widest text-brand-dark transition-all hover:scale-105 hover:bg-brand-cream"
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
    <main className="min-h-screen bg-brand-dark text-brand-cream">
      {/* ── Hero Banner ── */}
      <div className="relative h-[40vh] min-h-[280px] sm:h-[45vh] sm:min-h-[320px] lg:h-[50vh] lg:min-h-[380px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-scroll md:bg-fixed"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-brand-black/60" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 font-serif text-lg italic text-brand-gold/80 sm:text-xl"
          >
            Reservations
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl font-bold uppercase tracking-wide text-brand-cream sm:text-4xl lg:text-5xl"
          >
            Book a Table
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 h-[3px] w-16 rounded-full bg-brand-gold"
          />
        </div>
      </div>

      {/* ── Form Card (overlapping hero) ── */}
      <div className="relative z-20 mx-auto -mt-16 max-w-4xl px-4 pb-16 sm:-mt-20 sm:px-6 lg:-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="rounded-2xl border border-brand-gold/15 bg-brand-cocoa/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:rounded-3xl sm:p-10 lg:p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Row 1: Name, Email, Phone */}
            <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
              <div className="space-y-2">
                <label htmlFor="res-name" className="text-[10px] font-bold uppercase tracking-widest text-brand-gold/70 sm:text-xs">
                  Your Name
                </label>
                <input
                  id="res-name"
                  type="text"
                  required
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-brand-gold/20 bg-transparent pb-3 text-sm text-brand-cream placeholder-brand-cream/30 transition-colors focus:border-brand-gold focus:outline-none sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="res-email" className="text-[10px] font-bold uppercase tracking-widest text-brand-gold/70 sm:text-xs">
                  Email <span className="normal-case tracking-normal text-brand-cream/30">(optional)</span>
                </label>
                <input
                  id="res-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-brand-gold/20 bg-transparent pb-3 text-sm text-brand-cream placeholder-brand-cream/30 transition-colors focus:border-brand-gold focus:outline-none sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="res-phone" className="text-[10px] font-bold uppercase tracking-widest text-brand-gold/70 sm:text-xs">
                  Contact Number
                </label>
                <input
                  id="res-phone"
                  type="tel"
                  required
                  placeholder="10-digit mobile"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 10) setPhone(val);
                  }}
                  className="w-full border-b border-brand-gold/20 bg-transparent pb-3 text-sm text-brand-cream placeholder-brand-cream/30 transition-colors focus:border-brand-gold focus:outline-none sm:text-base"
                />
                {phone.length > 0 && phone.length < 10 && (
                  <p className="text-[10px] text-red-400">Enter 10 digits</p>
                )}
              </div>
            </div>

            {/* Row 2: Date, Time, Guests */}
            <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold/70 sm:text-xs">
                  Date
                </label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <div className="flex w-full items-center gap-2 border-b border-brand-gold/20 pb-3 transition-colors hover:border-brand-gold/40 focus-within:border-brand-gold">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="DD/MM/YYYY"
                        maxLength={10}
                        value={selectedDate ? format(selectedDate, "dd/MM/yyyy") : dateInput}
                        onChange={(e) => {
                          let val = e.target.value.replace(/[^\d/]/g, "");
                          // Auto-insert slashes
                          const digits = val.replace(/\//g, "");
                          if (digits.length >= 4) {
                            val = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
                          } else if (digits.length >= 2) {
                            val = `${digits.slice(0, 2)}/${digits.slice(2)}`;
                          }
                          setDateInput(val);
                          setSelectedDate(undefined);
                          // Parse complete date
                          if (val.length === 10) {
                            const [dd, mm, yyyy] = val.split("/").map(Number);
                            const parsed = new Date(yyyy, mm - 1, dd);
                            if (!isNaN(parsed.getTime()) && parsed >= new Date(new Date().setHours(0, 0, 0, 0))) {
                              setSelectedDate(parsed);
                            }
                          }
                        }}
                        className="flex-1 bg-transparent text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none sm:text-base"
                      />
                      <button type="button" className="shrink-0 p-1 text-brand-cream/40 hover:text-brand-gold transition-colors">
                        <CalendarIcon size={16} />
                      </button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(day) => {
                        setSelectedDate(day);
                        setDateInput("");
                        setCalendarOpen(false);
                      }}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold/70 sm:text-xs">
                  Time
                </label>
                <Popover open={timeOpen} onOpenChange={setTimeOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between border-b border-brand-gold/20 bg-transparent pb-3 text-sm text-brand-cream transition-colors hover:border-brand-gold/40 focus:border-brand-gold focus:outline-none sm:text-base"
                    >
                      <span className={time ? "text-brand-cream" : "text-brand-cream/30"}>
                        {time ? formatTimeDisplay(time) : "Select time"}
                      </span>
                      <Clock size={16} className="text-brand-cream/40" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] max-h-[280px] overflow-y-auto p-2" align="start">
                    <div className="grid grid-cols-3 gap-1">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot.value}
                          type="button"
                          onClick={() => { setTime(slot.value); setTimeOpen(false); }}
                          className={`rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                            time === slot.value
                              ? "bg-brand-gold text-brand-dark font-bold"
                              : "text-brand-cream/70 hover:bg-brand-gold/15 hover:text-brand-gold"
                          }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gold/70 sm:text-xs">
                  Guests
                </label>
                <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between border-b border-brand-gold/20 bg-transparent pb-3 text-sm text-brand-cream transition-colors hover:border-brand-gold/40 focus:border-brand-gold focus:outline-none sm:text-base"
                    >
                      <span className="text-brand-cream">
                        {guests} {Number(guests) === 1 ? "Person" : "Persons"}
                      </span>
                      <Users size={16} className="text-brand-cream/40" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[240px] p-3" align="start">
                    <div className="grid grid-cols-5 gap-1.5">
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => { setGuests(String(n)); setGuestsOpen(false); }}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            guests === String(n)
                              ? "bg-brand-gold text-brand-dark font-bold"
                              : "text-brand-cream/70 hover:bg-brand-gold/15 hover:text-brand-gold"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <label htmlFor="res-requests" className="text-[10px] font-bold uppercase tracking-widest text-brand-gold/70 sm:text-xs">
                Message <span className="normal-case tracking-normal text-brand-cream/30">(optional)</span>
              </label>
              <textarea
                id="res-requests"
                rows={3}
                placeholder="Anniversary, birthday, dietary needs, seating preferences..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full border-b border-brand-gold/20 bg-transparent pb-3 text-sm text-brand-cream placeholder-brand-cream/30 transition-colors focus:border-brand-gold focus:outline-none resize-none sm:text-base"
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gold py-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-dark shadow-lg shadow-brand-gold/20 transition-all hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              {isSubmitting ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Reserving...
                </>
              ) : (
                <>Book Now</>
              )}
            </motion.button>
          </form>

          {/* Contact info strip below form */}
          <div className="mt-8 flex flex-col items-center gap-4 border-t border-brand-gold/10 pt-8 text-center sm:flex-row sm:justify-center sm:gap-8">
            <div className="flex items-center gap-2 text-xs text-brand-cream/50 sm:text-sm">
              <Phone size={14} className="text-brand-gold/60" />
              <a href="tel:+917795676809" className="transition-colors hover:text-brand-gold">+91 77956 76809</a>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-cream/50 sm:text-sm">
              <Clock size={14} className="text-brand-gold/60" />
              <span>Open daily 11 AM – 11 PM</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
