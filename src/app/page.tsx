import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/sign-out-button";

export default async function Home() {
  const supabase = await createClient();

  // Who is signed in?
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/login");

  // Look up their profile row (created at sign-up by the database trigger)
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.sub)
    .single();

  return (
    <main>
      <h1>Hello, {profile?.display_name ?? user.email}</h1>
      <SignOutButton />
    </main>
  );
}
