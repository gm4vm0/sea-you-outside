import PreferencesForm from "@/components/preferences-form";
import SignOutButton from "@/components/sign-out-button";
import { parsePreferences } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage({
  searchParams,
}: PageProps<"/settings">) {
  const welcome = (await searchParams).welcome === "1";

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const { data: profile } = await supabase
    .from("profiles")
    .select("area, preferences")
    .eq("id", auth?.claims?.sub)
    .single();
  const { needs } = parsePreferences(profile?.preferences);

  return (
    <main className="mx-auto w-full max-w-xl p-4">
      <h1 className="mb-2 text-3xl font-semibold">
        {welcome ? "Tell us what works for you" : "Your settings"}
      </h1>
      <p className="mb-6 text-slate-700">
        {welcome
          ? "Everyone can play. Every dare has other ways to do it for the same points."
          : "New dares arrive each week and will follow these settings. The labels on this week's dares update straight away."}
      </p>
      <PreferencesForm
        needs={needs}
        area={profile?.area ?? ""}
        welcome={welcome}
      />
      {!welcome && (
        <div className="mt-8">
          <SignOutButton />
        </div>
      )}
    </main>
  );
}
