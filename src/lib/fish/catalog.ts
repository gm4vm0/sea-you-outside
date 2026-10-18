import { createClient } from "@/lib/supabase/server";
import type { Depth } from "@/lib/types";

export type Fish = {
  id: string;
  name: string;
  emoji: string;
  depth: Depth;
  price: number;
  fact: string;
  description: string;
};

export type OwnedFish = Fish & { ownedId: string; boughtAt: string };

const FISH_COLUMNS = "id, name, emoji, depth, price, fact, description";

export async function getFishCatalog(): Promise<Fish[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fish")
    .select(FISH_COLUMNS)
    .order("sort_order");
  if (error) throw new Error(`Couldn't load fish: ${error.message}`);
  return data as Fish[];
}

export async function getOwnedFish(): Promise<OwnedFish[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("owned_fish")
    .select(`id, bought_at, fish (${FISH_COLUMNS})`)
    .order("bought_at");
  if (error) throw new Error(`Couldn't load your fish: ${error.message}`);

  return (data ?? []).map((row) => ({
    ...(row.fish as unknown as Fish),
    ownedId: row.id as string,
    boughtAt: row.bought_at as string,
  }));
}
