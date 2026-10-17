import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function FishData() {
  const supabase = await createClient();
  const { data: fish, error } = await supabase.from("fish").select().order("sort_order");
  if (error) return <p>Error loading fish: {error.message}</p>;
  return <pre>{JSON.stringify(fish, null, 2)}</pre>;
}

export default function FishPage() {
  return (
    <Suspense fallback={<div>Loading fish...</div>}>
      <FishData />
    </Suspense>
  );
}
