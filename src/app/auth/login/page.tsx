import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuthForm from "./auth-form";

export default async function LoginPage() {
  // Already signed in? Go straight to your sea.
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect("/");

  return (
    <main className="flex min-h-svh items-center justify-center bg-linear-to-b from-sky-100 via-teal-100 to-blue-900 p-6">
      <AuthForm />
    </main>
  );
}
