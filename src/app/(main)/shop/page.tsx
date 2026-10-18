import Shop from "@/components/shop";
import { getFishCatalog } from "@/lib/fish/catalog";
import { createClient } from "@/lib/supabase/server";

export default async function ShopPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;

  const [{ data: profile }, fish] = await Promise.all([
    supabase
      .from("profiles")
      .select("points_balance")
      .eq("id", userId)
      .single(),
    getFishCatalog(),
  ]);
  const balance: number = profile?.points_balance ?? 0;

  return (
    <main className="max-w-3xl self-center">
      <h1 className="text-4xl p-4 text-center font-semibold">Fish shop</h1>
      <p className="text-right px-4 font-bold text-lg text-sky-900">
        Your points: {balance}
      </p>
      <Shop fish={fish} balance={balance} />
    </main>
  );
}
