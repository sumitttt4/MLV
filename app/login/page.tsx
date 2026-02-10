"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password
        });

      if (authError || !data.user) {
        throw new Error(authError?.message ?? "Unable to sign in.");
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError || profile?.role !== "admin") {
        await supabase.auth.signOut();
        throw new Error("You do not have admin access.");
      }

      router.push("/admin/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to sign in."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-dark to-brand-black text-brand-cream">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-brand-cocoa p-8 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-gold">
            Admin Access
          </p>
          <h1 className="mt-3 text-3xl font-serif font-semibold text-brand-cream">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-brand-cream/70">
            Sign in with your admin credentials to continue.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-brand-cream/80">
              Email address
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-brand-cream placeholder-white/25 transition-all focus:border-brand-gold/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-brand-gold/50"
                placeholder="you@hotelmlvgrand.com"
              />
            </label>
            <label className="block text-sm font-medium text-brand-cream/80">
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-brand-cream placeholder-white/25 transition-all focus:border-brand-gold/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-brand-gold/50"
                placeholder="Enter your password"
              />
            </label>

            {error ? (
              <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-brand-gold px-6 py-3.5 text-sm font-bold text-brand-buttonText shadow-lg transition hover:bg-brand-gold/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
