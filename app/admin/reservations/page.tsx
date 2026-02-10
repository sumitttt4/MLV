"use client";

import { useState, useEffect } from "react";
import { getReservations, updateReservationStatus } from "@/lib/api";
import type { Reservation, ReservationStatus } from "@/types/schema";
import { Calendar, Users, Clock, Check, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

type DateFilter = "today" | "tomorrow" | "all";

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function formatTime(time24: string): string {
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${hour}:${minuteStr} ${ampm}`;
}

// ─────────────────────────────────────────────
// Status badge config
// ─────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ReservationStatus,
  { label: string; bg: string; text: string; ring: string }
> = {
  pending: {
    label: "Pending",
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    ring: "ring-yellow-600/20",
  },
  confirmed: {
    label: "Confirmed",
    bg: "bg-green-50",
    text: "text-green-800",
    ring: "ring-green-600/20",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-800",
    ring: "ring-red-600/20",
  },
  completed: {
    label: "Completed",
    bg: "bg-gray-50",
    text: "text-gray-800",
    ring: "ring-gray-600/20",
  },
  no_show: {
    label: "No Show",
    bg: "bg-orange-50",
    text: "text-orange-800",
    ring: "ring-orange-600/20",
  },
};

function StatusBadge({ status }: { status: ReservationStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cfg.bg} ${cfg.text} ${cfg.ring}`}
    >
      {cfg.label}
    </span>
  );
}

// ─────────────────────────────────────────────
// Available actions per status
// ─────────────────────────────────────────────

interface ActionDef {
  label: string;
  targetStatus: ReservationStatus;
  icon: React.ReactNode;
  className: string;
}

function getActions(current: ReservationStatus): ActionDef[] {
  switch (current) {
    case "pending":
      return [
        {
          label: "Confirm",
          targetStatus: "confirmed",
          icon: <Check className="h-3.5 w-3.5" />,
          className:
            "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",
        },
        {
          label: "Cancel",
          targetStatus: "cancelled",
          icon: <X className="h-3.5 w-3.5" />,
          className:
            "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
        },
      ];
    case "confirmed":
      return [
        {
          label: "Complete",
          targetStatus: "completed",
          icon: <Check className="h-3.5 w-3.5" />,
          className:
            "bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-500",
        },
        {
          label: "No Show",
          targetStatus: "no_show",
          icon: <AlertTriangle className="h-3.5 w-3.5" />,
          className:
            "bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-400",
        },
        {
          label: "Cancel",
          targetStatus: "cancelled",
          icon: <X className="h-3.5 w-3.5" />,
          className:
            "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
        },
      ];
    default:
      return [];
  }
}

// ─────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>("today");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  // ── Fetch ────────────────────────────────────

  const fetchReservations = async () => {
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (err) {
      console.error("Failed to fetch reservations", err);
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    const interval = setInterval(fetchReservations, 30_000);
    return () => clearInterval(interval);
  }, []);

  // ── Status update handler ────────────────────

  const handleStatusUpdate = async (
    id: string,
    newStatus: ReservationStatus
  ) => {
    setUpdatingIds((prev) => new Set(prev).add(id));

    // Optimistic update
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );

    try {
      await updateReservationStatus(id, newStatus);
      toast.success(
        `Reservation ${STATUS_CONFIG[newStatus].label.toLowerCase()}`
      );
    } catch (err) {
      console.error("Status update failed", err);
      toast.error("Failed to update reservation status");
      // Revert on error
      await fetchReservations();
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // ── Filtering ────────────────────────────────

  const today = toLocalDateString(new Date());
  const tomorrow = toLocalDateString(
    new Date(Date.now() + 24 * 60 * 60 * 1000)
  );

  const filtered = reservations.filter((r) => {
    if (dateFilter === "today") return r.date === today;
    if (dateFilter === "tomorrow") return r.date === tomorrow;
    return true;
  });

  // ── Summary counts ───────────────────────────

  const counts = filtered.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      acc.total += 1;
      acc.guests += r.partySize;
      return acc;
    },
    { total: 0, guests: 0 } as Record<string, number>
  );

  // ── Render ───────────────────────────────────

  return (
    <section className="space-y-6">
      {/* Header */}
      <header>
        <h2 className="text-3xl font-semibold text-brand-maroon">
          Reservations
        </h2>
        <p className="mt-2 max-w-xl text-sm text-brand-maroon/70">
          Manage table reservations, confirm bookings, and track guest arrivals.
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard
          icon={<Calendar className="h-5 w-5 text-brand-gold" />}
          label="Total"
          value={counts.total}
        />
        <SummaryCard
          icon={<Users className="h-5 w-5 text-brand-gold" />}
          label="Guests"
          value={counts.guests}
        />
        <SummaryCard
          icon={<Clock className="h-5 w-5 text-yellow-600" />}
          label="Pending"
          value={counts.pending || 0}
        />
        <SummaryCard
          icon={<Check className="h-5 w-5 text-green-600" />}
          label="Confirmed"
          value={counts.confirmed || 0}
        />
      </div>

      {/* Date Filter */}
      <div className="flex items-center gap-2">
        {(
          [
            { key: "today", label: "Today" },
            { key: "tomorrow", label: "Tomorrow" },
            { key: "all", label: "All Dates" },
          ] as { key: DateFilter; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setDateFilter(key)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              dateFilter === key
                ? "bg-brand-maroon text-white"
                : "border border-brand-gold/40 bg-white text-brand-maroon hover:bg-brand-cream"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-brand-gold/30 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-cream text-brand-maroon">
              <tr>
                <th className="px-4 py-3 font-semibold" />
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Party Size</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-brand-maroon/50"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
                      Loading reservations...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-brand-maroon/50"
                  >
                    No reservations found for the selected date range.
                  </td>
                </tr>
              ) : (
                filtered.map((reservation) => {
                  const isExpanded = expandedId === reservation.id;
                  const actions = getActions(reservation.status);
                  const isUpdating = updatingIds.has(reservation.id);

                  return (
                    <ReservationRow
                      key={reservation.id}
                      reservation={reservation}
                      isExpanded={isExpanded}
                      isUpdating={isUpdating}
                      actions={actions}
                      onToggleExpand={() =>
                        setExpandedId(isExpanded ? null : reservation.id)
                      }
                      onStatusUpdate={handleStatusUpdate}
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Reservation Row (with expandable special requests)
// ─────────────────────────────────────────────

function ReservationRow({
  reservation,
  isExpanded,
  isUpdating,
  actions,
  onToggleExpand,
  onStatusUpdate,
}: {
  reservation: Reservation;
  isExpanded: boolean;
  isUpdating: boolean;
  actions: ActionDef[];
  onToggleExpand: () => void;
  onStatusUpdate: (id: string, status: ReservationStatus) => void;
}) {
  const hasSpecialRequests =
    reservation.specialRequests && reservation.specialRequests.trim().length > 0;

  return (
    <>
      <tr className="border-t border-brand-gold/20 transition hover:bg-brand-cream/40">
        {/* Expand toggle */}
        <td className="px-4 py-4">
          {hasSpecialRequests ? (
            <button
              type="button"
              onClick={onToggleExpand}
              className="flex h-6 w-6 items-center justify-center rounded-md text-brand-maroon/60 transition hover:bg-brand-cream hover:text-brand-maroon"
              title="Toggle special requests"
            >
              <svg
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ) : (
            <span className="inline-block h-6 w-6" />
          )}
        </td>

        {/* Name */}
        <td className="px-4 py-4 font-medium text-brand-maroon">
          {reservation.name}
          {reservation.email && (
            <span className="block text-xs text-brand-maroon/50">
              {reservation.email}
            </span>
          )}
        </td>

        {/* Phone */}
        <td className="px-4 py-4 text-brand-maroon/80">{reservation.phone}</td>

        {/* Date */}
        <td className="px-4 py-4 text-brand-maroon/80">
          {formatDate(reservation.date)}
        </td>

        {/* Time */}
        <td className="px-4 py-4 text-brand-maroon/80">
          {formatTime(reservation.time)}
        </td>

        {/* Party Size */}
        <td className="px-4 py-4">
          <span className="inline-flex items-center gap-1 text-brand-maroon/80">
            <Users className="h-3.5 w-3.5 text-brand-gold" />
            {reservation.partySize}
          </span>
        </td>

        {/* Status */}
        <td className="px-4 py-4">
          <StatusBadge status={reservation.status} />
        </td>

        {/* Actions */}
        <td className="px-4 py-4">
          {actions.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {actions.map((action) => (
                <button
                  key={action.targetStatus}
                  type="button"
                  disabled={isUpdating}
                  onClick={() =>
                    onStatusUpdate(reservation.id, action.targetStatus)
                  }
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 ${action.className}`}
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-xs text-brand-maroon/40">--</span>
          )}
        </td>
      </tr>

      {/* Expandable row: special requests */}
      {isExpanded && hasSpecialRequests && (
        <tr className="border-t border-dashed border-brand-gold/15">
          <td />
          <td colSpan={7} className="px-4 pb-4 pt-2">
            <div className="rounded-lg bg-brand-cream/60 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-maroon/50">
                Special Requests
              </p>
              <p className="mt-1 text-sm text-brand-maroon/80">
                {reservation.specialRequests}
              </p>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// Summary card
// ─────────────────────────────────────────────

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-brand-gold/30 bg-white px-5 py-4">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-maroon/50">
          {label}
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold text-brand-maroon">{value}</p>
    </div>
  );
}
