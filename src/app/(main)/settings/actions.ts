"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parsePreferences } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

export type SaveState = { message: string; error: boolean };

export async function savePreferences(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (!userId) redirect("/auth/login");

  const welcome = formData.get("welcome") === "1";
  const update = {
    preferences: parsePreferences({ needs: formData.getAll("needs") }),
    area: String(formData.get("area") ?? "").trim() || null,
  };

  const { data, error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", userId)
    .select("id");
  if (error) return { message: `Couldn't save: ${error.message}`, error: true };
  // RLS hides rows we can't update, so no error but nothing saved.
  if (!data?.length)
    return {
      message: "Couldn't save your preferences. Please try again later.",
      error: true,
    };

  revalidatePath("/dares");
  if (welcome) redirect("/dares");
  return { message: "Saved! Your dares will use these settings.", error: false };
}
