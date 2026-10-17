import { checkProof } from "@/lib/dares/verify";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims.sub;
  if (!userId)
    return Response.json({ error: "Not signed in" }, { status: 401 });

  const form = await request.formData();
  const dareId = form.get("dareId");
  const photo = form.get("photo");

  // Check data types.
  if (typeof dareId !== "string" || !(photo instanceof File)) {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }
  if (!photo.type.startsWith("image/")) {
    return Response.json({ error: "File is not an image" }, { status: 400 });
  }
  if (photo.size > MAX_BYTES) {
    return Response.json(
      { error: "File is too large (max 4 MB)" },
      { status: 413 },
    );
  }

  const { data: dare } = await supabase
    .from("dares")
    .select("id, title, instructions, alternatives, proof, points")
    .eq("id", dareId)
    .single();
  if (!dare) {
    return Response.json({ error: "Dare not found" }, { status: 404 });
  }

  const { data: done } = await supabase
    .from("submissions")
    .select("id")
    .eq("dare_id", dareId)
    .eq("status", "approved")
    .maybeSingle();
  if (done)
    return Response.json(
      { error: "You already completed this dare" },
      { status: 409 },
    );

  const bytes = Buffer.from(await photo.arrayBuffer());
  const verdict = await checkProof(dare, {
    mimeType: photo.type,
    base64: bytes.toString("base64"),
  });
  if (!verdict) {
    return Response.json(
      { error: "Could not verify photo, please try again" },
      { status: 500 },
    );
  }

  const photoPath = `${userId}/${dareId}-${Date.now()}.jpg`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from("photos")
    .upload(photoPath, bytes, { contentType: photo.type });
  if (uploadError) console.warn("Photo upload failed:", uploadError.message);

  const approved = verdict.verdict === "approved";
  const { error: insertError } = await supabaseAdmin
    .from("submissions")
    .insert({
      dare_id: dareId,
      user_id: userId,
      photo_path: uploadError ? null : photoPath,
      status: verdict.verdict,
      check_reason: verdict.reason,
      points_awarded: approved ? dare.points : 0,
    });

  if (insertError?.code === "23505") {
    return Response.json(
      { error: "You already completed this dare" },
      { status: 409 },
    );
  }
  if (insertError)
    return Response.json({ error: insertError.message }, { status: 500 });

  if (approved) {
    const { error } = await supabaseAdmin.rpc("award_points", {
      p_user: userId,
      p_points: dare.points,
    });
    if (error) return Response.json({ error: error.message }, { status: 500 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("points_balance")
    .eq("id", userId)
    .single();

  return Response.json({
    status: verdict.verdict,
    reason: verdict.reason,
    pointsAwarded: approved ? dare.points : 0,
    balance: profile?.points_balance ?? null,
  });
}
