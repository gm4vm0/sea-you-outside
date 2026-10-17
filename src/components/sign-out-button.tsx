"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={signOut}
      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600">
      Sign out
    </button>
  );
}
