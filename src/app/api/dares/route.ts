import { generateDares } from "@/lib/dares/generate";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

// In UTC
function getWeekStart() {
  const d = new Date();
  const daysSinceMonday = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - daysSinceMonday);
  return d.toISOString().slice(0, 10);
}

// Mark each dare with whether the user has an approved submission for it.
async function withStatus<T extends { id: string }>(
  supabase: Awaited<ReturnType<typeof createClient>>,
  dares: T[],
) {
  const { data } = await supabase
    .from("submissions")
    .select("dare_id")
    .in(
      "dare_id",
      dares.map((d) => d.id),
    )
    .eq("status", "approved");
  const done = new Set((data ?? []).map((s) => s.dare_id));
  return dares.map((d) => ({ ...d, completed: done.has(d.id) }));
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims.sub;
  if (!userId)
    return Response.json({ error: "Not signed in" }, { status: 401 });

  const weekStart = getWeekStart();
  const regenerate = request.nextUrl.searchParams.get("regenerate") === "1";

  // Use existing dares and only regenerate if requested.
  if (regenerate) {
    await supabaseAdmin
      .from("dares")
      .delete()
      .eq("user_id", userId)
      .eq("week_start", weekStart);
  } else {
    const { data: existing } = await supabase
      .from("dares")
      .select()
      .eq("week_start", weekStart)
      .order("points");
    if (existing && existing.length > 0) {
      return Response.json({
        dares: await withStatus(supabase, existing),
        source: "saved",
      });
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("area, preferences")
    .eq("id", userId)
    .single();

  // Save to Supabase.
  const { dares, source } = await generateDares(profile ?? {});
  const rows = dares.map((d) => ({
    ...d,
    user_id: userId,
    week_start: weekStart,
  }));
  const { data: inserted, error } = await supabaseAdmin
    .from("dares")
    .insert(rows)
    .select();
  if (error) return Response.json({ error: error.message }, { status: 500 });

  inserted.sort((a, b) => a.points - b.points);
  // Freshly generated dares can't have submissions yet.
  return Response.json({
    dares: inserted.map((d) => ({ ...d, completed: false })),
    source,
  });
}
