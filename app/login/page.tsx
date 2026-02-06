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
    <main className="min-h-screen bg-brand-cream text-brand-maroon">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border border-brand-gold/30 bg-white p-8 shadow-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-gold">
            Admin Access
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-brand-maroon">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-brand-maroon/70">
            Sign in with your admin credentials to continue.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold">
              Email address
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-brand-maroon/20 bg-brand-cream/40 px-4 py-2 text-sm shadow-sm focus:border-brand-maroon/50 focus:outline-none"
                placeholder="you@hotelmlvgrand.com"
              />
            </label>
            <label className="block text-sm font-semibold">
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-brand-maroon/20 bg-brand-cream/40 px-4 py-2 text-sm shadow-sm focus:border-brand-maroon/50 focus:outline-none"
                placeholder="Enter your password"
              />
            </label>

            {error ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-brand-maroon px-6 py-3 text-sm font-semibold text-brand-cream shadow-sm transition hover:bg-brand-maroon/90 disabled:cursor-not-allowed disabled:bg-brand-maroon/40"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
