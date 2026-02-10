"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Phone, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { signIn, signUp } from "@/lib/api";
import { useAuth } from "@/store/useAuth";

/* ────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────── */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputBase =
  "w-full rounded-xl border border-white/10 bg-black/20 py-3.5 text-brand-cream placeholder-white/25 transition-all focus:border-brand-gold/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-brand-gold/50";

const tabVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2, ease: "easeIn" } },
};

/* ────────────────────────────────────────────
   Component
   ──────────────────────────────────────────── */

export default function AuthPage() {
  const router = useRouter();
  const setUser = useAuth((s) => s.setUser);

  /* ── Tab state ── */
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  /* ── Login state ── */
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  /* ── Sign up state ── */
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupShowPassword, setSignupShowPassword] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSubmitting, setSignupSubmitting] = useState(false);

  /* ── Field-level touched state for inline validation ── */
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  /* ────────────────────────────────────────────
     Login handler
     ──────────────────────────────────────────── */

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);

    if (!EMAIL_REGEX.test(loginEmail)) {
      setLoginError("Please enter a valid email address.");
      return;
    }

    if (loginPassword.length < 6) {
      setLoginError("Password must be at least 6 characters.");
      return;
    }

    setLoginSubmitting(true);

    try {
      const { profile } = await signIn(loginEmail, loginPassword);
      if (profile) {
        setUser(profile);
      }
      toast.success("Welcome back!");
      router.push("/profile");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to sign in. Please try again.";
      setLoginError(message);
    } finally {
      setLoginSubmitting(false);
    }
  };

  /* ────────────────────────────────────────────
     Sign-up handler
     ──────────────────────────────────────────── */

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignupError(null);

    if (!signupName.trim()) {
      setSignupError("Full name is required.");
      return;
    }

    if (!EMAIL_REGEX.test(signupEmail)) {
      setSignupError("Please enter a valid email address.");
      return;
    }

    if (signupPhone && !/^\d{10}$/.test(signupPhone.replace(/\s/g, ""))) {
      setSignupError("Phone number must be 10 digits.");
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters.");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }

    setSignupSubmitting(true);

    try {
      const cleanPhone = signupPhone.replace(/\s/g, "") || undefined;
      await signUp(signupEmail, signupPassword, signupName.trim(), cleanPhone);

      // Auto sign-in after successful signup
      const { profile } = await signIn(signupEmail, signupPassword);
      if (profile) {
        setUser(profile);
      }

      toast.success("Account created successfully!");
      router.push("/profile");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to create account. Please try again.";
      setSignupError(message);
    } finally {
      setSignupSubmitting(false);
    }
  };

  /* ── Inline validation helpers ── */
  const loginEmailInvalid = touched.loginEmail && loginEmail.length > 0 && !EMAIL_REGEX.test(loginEmail);
  const loginPasswordInvalid = touched.loginPassword && loginPassword.length > 0 && loginPassword.length < 6;

  const signupNameInvalid = touched.signupName && signupName.trim().length === 0;
  const signupEmailInvalid = touched.signupEmail && signupEmail.length > 0 && !EMAIL_REGEX.test(signupEmail);
  const signupPhoneInvalid = touched.signupPhone && signupPhone.length > 0 && !/^\d{10}$/.test(signupPhone.replace(/\s/g, ""));
  const signupPasswordInvalid = touched.signupPassword && signupPassword.length > 0 && signupPassword.length < 6;
  const signupConfirmInvalid = touched.signupConfirmPassword && signupConfirmPassword.length > 0 && signupPassword !== signupConfirmPassword;

  /* ════════════════════════════════════════════
     Render
     ════════════════════════════════════════════ */

  return (
    <main className="min-h-screen bg-brand-dark pt-24 text-brand-cream">
      {/* Background texture overlay */}
      <div className="pointer-events-none fixed inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-lg items-start justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full rounded-3xl border border-brand-gold/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl md:p-10"
        >
          {/* ── Header ── */}
          <div className="mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-gold">
              MLV Grand
            </span>
            <h1 className="mt-3 font-serif text-3xl font-bold md:text-4xl">
              {activeTab === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="mt-2 text-sm text-brand-cream/50">
              {activeTab === "login"
                ? "Sign in to access your profile and orders"
                : "Join us for a delightful dining experience"}
            </p>
          </div>

          {/* ── Tab Toggle ── */}
          <div className="mb-8 flex rounded-xl border border-white/10 bg-black/20 p-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setSignupError(null);
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                activeTab === "login"
                  ? "bg-brand-gold/15 text-brand-gold shadow-sm"
                  : "text-brand-cream/50 hover:text-brand-cream/80"
              }`}
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                setLoginError(null);
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                activeTab === "signup"
                  ? "bg-brand-gold/15 text-brand-gold shadow-sm"
                  : "text-brand-cream/50 hover:text-brand-cream/80"
              }`}
            >
              <UserPlus className="h-4 w-4" />
              Sign Up
            </button>
          </div>

          {/* ── Tab Content ── */}
          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              /* ═══════════════ LOGIN FORM ═══════════════ */
              <motion.form
                key="login"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleLogin}
                className="space-y-5"
              >
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-gold/80">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-cream/30" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      onBlur={() => markTouched("loginEmail")}
                      className={`${inputBase} pl-11 pr-4 ${
                        loginEmailInvalid
                          ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/30"
                          : ""
                      }`}
                    />
                  </div>
                  {loginEmailInvalid && (
                    <p className="text-xs text-red-400">Please enter a valid email address.</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-gold/80">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-cream/30" />
                    <input
                      type={loginShowPassword ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      onBlur={() => markTouched("loginPassword")}
                      className={`${inputBase} pl-11 pr-12 ${
                        loginPasswordInvalid
                          ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/30"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setLoginShowPassword(!loginShowPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-cream/30 transition-colors hover:text-brand-cream/60"
                    >
                      {loginShowPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {loginPasswordInvalid && (
                    <p className="text-xs text-red-400">Password must be at least 6 characters.</p>
                  )}
                </div>

                {/* Error */}
                <AnimatePresence>
                  {loginError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                    >
                      {loginError}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loginSubmitting}
                  whileHover={{ scale: loginSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: loginSubmitting ? 1 : 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gold py-3.5 text-sm font-bold uppercase tracking-widest text-brand-dark shadow-lg transition-colors hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loginSubmitting ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In <LogIn className="h-4 w-4" />
                    </>
                  )}
                </motion.button>

                {/* Switch tab prompt */}
                <p className="text-center text-sm text-brand-cream/40">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("signup");
                      setLoginError(null);
                    }}
                    className="font-semibold text-brand-gold transition-colors hover:text-brand-gold/80"
                  >
                    Sign up
                  </button>
                </p>
              </motion.form>
            ) : (
              /* ═══════════════ SIGNUP FORM ═══════════════ */
              <motion.form
                key="signup"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSignup}
                className="space-y-5"
              >
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-gold/80">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-cream/30" />
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      onBlur={() => markTouched("signupName")}
                      className={`${inputBase} pl-11 pr-4 ${
                        signupNameInvalid
                          ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/30"
                          : ""
                      }`}
                    />
                  </div>
                  {signupNameInvalid && (
                    <p className="text-xs text-red-400">Full name is required.</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-gold/80">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-cream/30" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      onBlur={() => markTouched("signupEmail")}
                      className={`${inputBase} pl-11 pr-4 ${
                        signupEmailInvalid
                          ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/30"
                          : ""
                      }`}
                    />
                  </div>
                  {signupEmailInvalid && (
                    <p className="text-xs text-red-400">Please enter a valid email address.</p>
                  )}
                </div>

                {/* Phone (optional) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-gold/80">
                    Phone{" "}
                    <span className="normal-case tracking-normal text-brand-cream/40">
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-cream/30" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      value={signupPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 10) setSignupPhone(val);
                      }}
                      onBlur={() => markTouched("signupPhone")}
                      className={`${inputBase} pl-11 pr-4 ${
                        signupPhoneInvalid
                          ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/30"
                          : ""
                      }`}
                    />
                  </div>
                  {signupPhoneInvalid && (
                    <p className="text-xs text-red-400">Phone number must be 10 digits.</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-gold/80">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-cream/30" />
                    <input
                      type={signupShowPassword ? "text" : "password"}
                      required
                      placeholder="Min. 6 characters"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      onBlur={() => markTouched("signupPassword")}
                      className={`${inputBase} pl-11 pr-12 ${
                        signupPasswordInvalid
                          ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/30"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setSignupShowPassword(!signupShowPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-cream/30 transition-colors hover:text-brand-cream/60"
                    >
                      {signupShowPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {signupPasswordInvalid && (
                    <p className="text-xs text-red-400">Password must be at least 6 characters.</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-gold/80">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-cream/30" />
                    <input
                      type={signupShowPassword ? "text" : "password"}
                      required
                      placeholder="Re-enter your password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      onBlur={() => markTouched("signupConfirmPassword")}
                      className={`${inputBase} pl-11 pr-4 ${
                        signupConfirmInvalid
                          ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/30"
                          : ""
                      }`}
                    />
                  </div>
                  {signupConfirmInvalid && (
                    <p className="text-xs text-red-400">Passwords do not match.</p>
                  )}
                </div>

                {/* Error */}
                <AnimatePresence>
                  {signupError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                    >
                      {signupError}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={signupSubmitting}
                  whileHover={{ scale: signupSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: signupSubmitting ? 1 : 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gold py-3.5 text-sm font-bold uppercase tracking-widest text-brand-dark shadow-lg transition-colors hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {signupSubmitting ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account <UserPlus className="h-4 w-4" />
                    </>
                  )}
                </motion.button>

                {/* Switch tab prompt */}
                <p className="text-center text-sm text-brand-cream/40">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("login");
                      setSignupError(null);
                    }}
                    className="font-semibold text-brand-gold transition-colors hover:text-brand-gold/80"
                  >
                    Sign in
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
