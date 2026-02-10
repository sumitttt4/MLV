"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  LogOut,
  Edit3,
  Save,
  X,
  Plus,
  Package,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
  getCurrentUser,
  updateCustomerProfile,
  getSavedAddresses,
  getOrdersByPhone,
  signOutUser,
} from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import type { CustomerProfile } from "@/types/schema";
import type { Order } from "@/types/schema";

/* ────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────── */

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const inputBase =
  "w-full rounded-xl border border-white/10 bg-black/20 py-3.5 text-brand-cream placeholder-white/25 transition-all focus:border-brand-gold/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-brand-gold/50";

function statusBadgeClasses(status: Order["status"]): string {
  switch (status) {
    case "Received":
      return "bg-blue-500/15 text-blue-400 border-blue-500/25";
    case "Confirmed":
      return "bg-indigo-500/15 text-indigo-400 border-indigo-500/25";
    case "Preparing":
      return "bg-amber-500/15 text-amber-400 border-amber-500/25";
    case "Ready":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "Out for Delivery":
      return "bg-purple-500/15 text-purple-400 border-purple-500/25";
    case "Delivered":
      return "bg-green-500/15 text-green-400 border-green-500/25";
    case "Cancelled":
      return "bg-red-500/15 text-red-400 border-red-500/25";
    default:
      return "bg-white/10 text-brand-cream/70 border-white/10";
  }
}

function orderTypeLabel(type: Order["orderType"]): string {
  switch (type) {
    case "delivery":
      return "Delivery";
    case "pickup":
      return "Pickup";
    case "dine_in":
      return "Dine-in";
    default:
      return type;
  }
}

/* ────────────────────────────────────────────
   Component
   ──────────────────────────────────────────── */

export default function ProfilePage() {
  const router = useRouter();
  const authUser = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);
  const clearUser = useAuth((s) => s.clearUser);

  /* ── Page-level state ── */
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  /* ── Edit profile state ── */
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  /* ── Addresses state ── */
  const [addresses, setAddresses] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState("");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);

  /* ── Orders state ── */
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  /* ── Logout state ── */
  const [loggingOut, setLoggingOut] = useState(false);

  /* ────────────────────────────────────────────
     Fetch user profile on mount
     ──────────────────────────────────────────── */

  const loadProfile = useCallback(async () => {
    setPageLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        // Check if we have a cached auth user (mock mode)
        if (authUser) {
          setProfile(authUser);
          setEditName(authUser.fullName);
          setEditPhone(authUser.phone || "");
          setPageLoading(false);
          return;
        }
        router.push("/auth");
        return;
      }
      setProfile(user);
      setUser(user);
      setEditName(user.fullName);
      setEditPhone(user.phone || "");
    } catch {
      if (authUser) {
        setProfile(authUser);
        setEditName(authUser.fullName);
        setEditPhone(authUser.phone || "");
      } else {
        router.push("/auth");
        return;
      }
    } finally {
      setPageLoading(false);
    }
  }, [authUser, router, setUser]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  /* ── Fetch addresses when profile loads ── */
  useEffect(() => {
    if (!profile) return;
    getSavedAddresses(profile.id)
      .then(setAddresses)
      .catch(() => setAddresses([]));
  }, [profile]);

  /* ── Fetch recent orders when profile loads ── */
  useEffect(() => {
    if (!profile?.phone) return;
    setOrdersLoading(true);
    getOrdersByPhone(profile.phone)
      .then((orders) => setRecentOrders(orders.slice(0, 5)))
      .catch(() => setRecentOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [profile]);

  /* ────────────────────────────────────────────
     Handlers
     ──────────────────────────────────────────── */

  const handleSaveProfile = async () => {
    if (!profile) return;
    if (!editName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setEditSaving(true);
    try {
      await updateCustomerProfile(profile.id, {
        fullName: editName.trim(),
        phone: editPhone.replace(/\s/g, "") || undefined,
        defaultAddress: editAddress.trim() || undefined,
      });

      const updatedProfile: CustomerProfile = {
        ...profile,
        fullName: editName.trim(),
        phone: editPhone.replace(/\s/g, "") || profile.phone,
      };
      setProfile(updatedProfile);
      setUser(updatedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to update profile.";
      toast.error(message);
    } finally {
      setEditSaving(false);
    }
  };

  const handleAddAddress = async () => {
    if (!profile || !newAddress.trim()) return;
    setAddingAddress(true);
    try {
      await updateCustomerProfile(profile.id, {
        defaultAddress: newAddress.trim(),
      });
      setAddresses((prev) => [...prev, newAddress.trim()]);
      setNewAddress("");
      setShowAddAddress(false);
      toast.success("Address saved!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to save address.";
      toast.error(message);
    } finally {
      setAddingAddress(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOutUser();
      clearUser();
      toast.success("Signed out successfully.");
      router.push("/auth");
    } catch {
      toast.error("Unable to sign out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  /* ════════════════════════════════════════════
     Loading State
     ════════════════════════════════════════════ */

  if (pageLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-dark text-brand-cream">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
          <p className="text-sm text-brand-cream/50">Loading profile...</p>
        </motion.div>
      </main>
    );
  }

  if (!profile) return null;

  /* ════════════════════════════════════════════
     Render
     ════════════════════════════════════════════ */

  return (
    <main className="min-h-screen bg-brand-dark pt-24 text-brand-cream">
      {/* Background texture */}
      <div className="pointer-events-none fixed inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

      <div className="relative mx-auto w-full max-w-4xl px-6 pb-24 pt-12">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-gold">
              My Account
            </span>
            <h1 className="mt-2 font-serif text-4xl font-bold md:text-5xl">
              Profile
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-brand-cream/70 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </motion.div>

        <div className="space-y-8">
          {/* ═══════════════════════════════════════════
             PROFILE INFO CARD
             ═══════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-3xl border border-brand-gold/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center justify-between border-b border-brand-gold/10 pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-brand-gold">
                    Personal Information
                  </h2>
                  <p className="text-sm text-brand-cream/50">
                    Member since{" "}
                    {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 rounded-lg border border-brand-gold/20 bg-brand-gold/10 px-4 py-2 text-sm font-semibold text-brand-gold transition-all hover:bg-brand-gold/20"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {isEditing ? (
                /* ── Edit Mode ── */
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5"
                >
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-gold/80">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-cream/30" />
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Your full name"
                        className={`${inputBase} pl-11 pr-4`}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-gold/80">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-cream/30" />
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={editPhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length <= 10) setEditPhone(val);
                        }}
                        placeholder="10-digit mobile number"
                        className={`${inputBase} pl-11 pr-4`}
                      />
                    </div>
                  </div>

                  {/* Default Address */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-gold/80">
                      Default Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 h-4 w-4 text-brand-cream/30" />
                      <textarea
                        rows={2}
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        placeholder="Flat No, Street, Landmark..."
                        className={`${inputBase} pl-11 pr-4`}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={editSaving}
                      whileHover={{ scale: editSaving ? 1 : 1.02 }}
                      whileTap={{ scale: editSaving ? 1 : 0.98 }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-gold py-3 text-sm font-bold uppercase tracking-widest text-brand-dark transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {editSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {editSaving ? "Saving..." : "Save Changes"}
                    </motion.button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditName(profile.fullName);
                        setEditPhone(profile.phone || "");
                        setEditAddress("");
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-brand-cream/70 transition-all hover:border-white/20 hover:text-brand-cream"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ── View Mode ── */
                <motion.div
                  key="view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-4 rounded-xl bg-black/20 px-5 py-4">
                    <User className="h-5 w-5 shrink-0 text-brand-gold/70" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-cream/40">
                        Name
                      </p>
                      <p className="mt-0.5 font-medium">{profile.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-xl bg-black/20 px-5 py-4">
                    <Mail className="h-5 w-5 shrink-0 text-brand-gold/70" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-cream/40">
                        Email
                      </p>
                      <p className="mt-0.5 font-medium">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-xl bg-black/20 px-5 py-4">
                    <Phone className="h-5 w-5 shrink-0 text-brand-gold/70" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-cream/40">
                        Phone
                      </p>
                      <p className="mt-0.5 font-medium">
                        {profile.phone || (
                          <span className="text-brand-cream/30">Not provided</span>
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* ═══════════════════════════════════════════
             SAVED ADDRESSES CARD
             ═══════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="rounded-3xl border border-brand-gold/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center justify-between border-b border-brand-gold/10 pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-brand-gold">
                    Saved Addresses
                  </h2>
                  <p className="text-sm text-brand-cream/50">
                    {addresses.length} address{addresses.length !== 1 ? "es" : ""} saved
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="flex items-center gap-2 rounded-lg border border-brand-gold/20 bg-brand-gold/10 px-4 py-2 text-sm font-semibold text-brand-gold transition-all hover:bg-brand-gold/20"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>

            {/* Add address form */}
            <AnimatePresence>
              {showAddAddress && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="space-y-3 rounded-2xl border border-brand-gold/10 bg-black/20 p-5">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-gold/80">
                      New Address
                    </label>
                    <textarea
                      rows={2}
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="Flat No, Street, Landmark, City, PIN..."
                      className={`${inputBase} px-4`}
                    />
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleAddAddress}
                        disabled={addingAddress || !newAddress.trim()}
                        className="flex items-center gap-2 rounded-lg bg-brand-gold px-5 py-2.5 text-sm font-bold text-brand-dark transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {addingAddress ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {addingAddress ? "Saving..." : "Save Address"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddAddress(false);
                          setNewAddress("");
                        }}
                        className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-brand-cream/60 transition-all hover:border-white/20 hover:text-brand-cream"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Address list */}
            {addresses.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <MapPin className="mb-3 h-8 w-8 text-brand-cream/20" />
                <p className="text-sm text-brand-cream/40">
                  No saved addresses yet. Add one to speed up your orders.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/20 px-5 py-4 transition-all hover:border-brand-gold/10"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold/60" />
                    <p className="text-sm text-brand-cream/80">{addr}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.section>

          {/* ═══════════════════════════════════════════
             RECENT ORDERS CARD
             ═══════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            className="rounded-3xl border border-brand-gold/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center justify-between border-b border-brand-gold/10 pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-brand-gold">
                    Recent Orders
                  </h2>
                  <p className="text-sm text-brand-cream/50">
                    Your last {recentOrders.length} order{recentOrders.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <Link
                href="/profile/orders"
                className="text-sm font-semibold text-brand-gold transition-colors hover:text-brand-gold/80"
              >
                View All
              </Link>
            </div>

            {ordersLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-2xl border border-white/5 bg-white/5"
                  />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Package className="mb-3 h-8 w-8 text-brand-cream/20" />
                <p className="text-sm text-brand-cream/40">
                  No orders yet.{" "}
                  <Link href="/" className="text-brand-gold hover:underline">
                    Browse our menu
                  </Link>{" "}
                  to place your first order.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="overflow-hidden rounded-2xl border border-white/5 bg-black/20 transition-all hover:border-brand-gold/10"
                    >
                      {/* Order header */}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedOrderId(isExpanded ? null : order.id)
                        }
                        className="flex w-full items-center justify-between gap-4 p-5 text-left"
                      >
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="font-serif text-sm font-bold text-brand-gold">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-brand-cream/40">
                              <Clock className="h-3 w-3" />
                              {formatDateTime(order.createdAt)}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${statusBadgeClasses(order.status)}`}
                            >
                              {order.status}
                            </span>
                            <span className="inline-flex items-center rounded-full border border-brand-gold/20 bg-brand-gold/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-gold">
                              {orderTypeLabel(order.orderType)}
                            </span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="text-lg font-bold text-brand-cream">
                            {formatCurrency(order.total)}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-brand-gold/60" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-brand-gold/60" />
                          )}
                        </div>
                      </button>

                      {/* Expanded details */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1, transition: { duration: 0.3 } }}
                            exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-white/5 px-5 pb-5 pt-4">
                              <div className="space-y-2">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2.5 text-sm"
                                  >
                                    <span className="text-brand-cream/80">
                                      <span className="mr-1.5 font-semibold text-brand-gold">
                                        {item.quantity}x
                                      </span>
                                      {item.name}
                                    </span>
                                    <span className="font-medium text-brand-cream/70">
                                      {formatCurrency(item.price * item.quantity)}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {/* Price breakdown */}
                              <div className="mt-4 space-y-1.5 border-t border-white/5 pt-4 text-sm text-brand-cream/50">
                                <div className="flex justify-between">
                                  <span>Subtotal</span>
                                  <span className="text-brand-cream/70">
                                    {formatCurrency(order.subtotal)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>GST</span>
                                  <span className="text-brand-cream/70">
                                    {formatCurrency(order.gst)}
                                  </span>
                                </div>
                                {order.deliveryFee > 0 && (
                                  <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span className="text-brand-cream/70">
                                      {formatCurrency(order.deliveryFee)}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between border-t border-white/5 pt-2 text-base font-bold text-brand-gold">
                                  <span>Total</span>
                                  <span>{formatCurrency(order.total)}</span>
                                </div>
                              </div>

                              {/* Track link */}
                              <div className="mt-4">
                                <Link
                                  href={`/order/${order.id}`}
                                  className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 px-5 py-2 text-sm font-bold uppercase tracking-wider text-brand-gold transition-all hover:bg-brand-gold/10 hover:border-brand-gold/50"
                                >
                                  View Order Details
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </main>
  );
}
