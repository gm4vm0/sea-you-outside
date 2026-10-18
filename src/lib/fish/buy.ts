import { createClient } from "@/lib/supabase/client";

export async function buyFish(fishId: string): Promise<string | null> {
  const { error } = await createClient().rpc("buy_fish", { p_fish_id: fishId });
  if (!error) return null;
  return error.message.includes("Not enough points")
    ? "Not enough points yet. Complete more dares!"
    : `Couldn't buy: ${error.message}`;
}
