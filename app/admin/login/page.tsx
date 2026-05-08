"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen sunglow" />}>
      <AdminLogin />
    </Suspense>
  );
}

function AdminLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error === "ADMIN_PASSWORD not configured"
          ? "Server is missing ADMIN_PASSWORD env var."
          : "Wrong password.");
        return;
      }
      router.replace(from);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen sunglow grid place-items-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-[var(--color-orange-300)]/40 bg-white/80 backdrop-blur p-8 shadow-[0_20px_60px_-30px_rgba(217,112,26,0.4)]"
      >
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">Admin</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Sign in to edit site content.</p>

        <label className="block mt-6 text-xs font-medium text-[var(--color-ink-soft)]">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="mt-1 w-full rounded-lg border border-[var(--color-orange-300)]/50 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-orange-500)]"
        />

        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-lg bg-[var(--color-orange-500)] hover:bg-[var(--color-orange-600)] disabled:opacity-60 text-white text-sm font-semibold py-2.5 transition"
        >
          {busy ? "..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
