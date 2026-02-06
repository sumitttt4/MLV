"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/api";

const links = [
  { href: "/admin/dashboard", label: "Morning View" },
  { href: "/admin/orders", label: "Live Orders" },
  { href: "/admin/menu", label: "Menu Manager" },
  { href: "/admin/analytics", label: "Analytics" }
];

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-maroon md:grid md:grid-cols-[260px_1fr]">
      <aside className="border-b border-brand-gold/30 bg-brand-maroon text-brand-cream md:min-h-screen md:border-b-0 md:border-r">
        <div className="flex h-full flex-col">
          <div className="px-6 py-6">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-gold">
              Admin Command Center
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Hotel MLV Grand</h1>
          </div>
          <nav className="flex flex-1 flex-col gap-2 px-4 pb-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-transparent px-4 py-3 text-sm font-semibold transition hover:border-brand-gold/60 hover:bg-brand-cream/10"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="px-4 pb-6">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl border border-brand-gold/40 px-4 py-3 text-sm font-semibold text-brand-cream transition hover:bg-brand-cream/10"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
