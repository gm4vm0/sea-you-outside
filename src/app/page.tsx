import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // Who is signed in?
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/auth/login");

  // Profile row is created at sign-up by the database trigger.
  // A new player hasn't answered yet: ask what works for them first.
  const { data: profile } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", user.sub)
    .single();

  // Saving or skipping always stores a "needs" key, even if the column defaults to {}.
  const prefs = profile?.preferences;
  const answered = prefs && typeof prefs === "object" && "needs" in prefs;
  redirect(answered ? "/dares" : "/settings?welcome=1");
}
