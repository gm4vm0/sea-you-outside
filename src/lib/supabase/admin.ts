import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { persistSession: false } }
);

// After Gemini approves a photo:
// await supabaseAdmin.rpc("award_points", { p_user: userId, p_points: dare.points });
