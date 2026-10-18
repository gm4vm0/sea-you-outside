"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === "signup";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const supabase = createClient();

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Saved on the profile by the sign-up trigger in schema.sql
          data: { display_name: name },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });
      setLoading(false);
      if (error) return setError(error.message);
      // If "Confirm email" is on in Supabase, there is no session yet.
      if (!data.session) return setMessage("Check your email for a link to finish signing up.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setError(error.message);
    }

    // New players pick their access needs first; returning players go to their sea.
    router.push(isSignUp ? "/settings?welcome=1" : "/");
    router.refresh();
  }

  function switchMode() {
    setMode(isSignUp ? "signin" : "signup");
    setError(null);
    setMessage(null);
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600";

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white/95 p-8 shadow-xl">
      <h1 className="text-2xl font-bold text-slate-900">
        {isSignUp ? "Dive in" : "Welcome back"}
      </h1>
      <p className="mt-1 text-slate-600">
        {isSignUp ? "Create an account to start your sea." : "Sign in to see your sea."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {isSignUp && (
          <div>
            <label htmlFor="name" className="mb-1 block font-medium text-slate-800">Name</label>
            <input id="name" type="text" autoComplete="nickname" required
              value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-1 block font-medium text-slate-800">Email</label>
          <input id="email" type="email" autoComplete="email" required
            value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block font-medium text-slate-800">Password</label>
          <input id="password" type="password" required minLength={6}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            aria-describedby={isSignUp ? "password-hint" : undefined}
            value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          {isSignUp && (
            <p id="password-hint" className="mt-1 text-sm text-slate-600">At least 6 characters.</p>
          )}
        </div>

        {/* Screen readers announce errors and messages as they appear */}
        <div aria-live="polite" className="min-h-6">
          {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
          {message && <p className="text-sm font-medium text-teal-800">{message}</p>}
        </div>

        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-teal-700 px-4 py-2.5 font-semibold text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:opacity-60">
          {loading ? "One moment..." : isSignUp ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-slate-700">
        {isSignUp ? "Already have an account?" : "New here?"}{" "}
        <button type="button" onClick={switchMode}
          className="font-semibold text-teal-800 underline underline-offset-2 hover:text-teal-900">
          {isSignUp ? "Sign in" : "Create an account"}
        </button>
      </p>
    </div>
  );
}
