import { useState } from "react";
import { resizeImage } from "@/lib/utils";

export default function ProofUpload({
  dareId,
  dareTitle,
  completed,
  onComplete,
}: {
  dareId: string;
  dareTitle: string;
  completed: boolean;
  onComplete: () => void;
}) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    setBusy(true);
    setStatus("Checking photo...");

    try {
      const form = new FormData();
      form.append("dareId", dareId);
      form.append("photo", await resizeImage(file));

      const res = await fetch("/api/proof", { method: "POST", body: form });
      const text = await res.text();
      const body = text ? JSON.parse(text) : {};
      if (!res.ok) {
        if (res.status === 409) onComplete();
        return setStatus(
          body.error ?? "Something went wrong, please try again",
        );
      }
      if (body.status === "approved") {
        onComplete();
        setStatus(
          `Approved! +${body.pointsAwarded} points (balance: ${body.balance})`,
        );
      } else {
        setStatus(`Not approved: ${body.reason}`);
      }
    } catch {
      setStatus("Could not upload photo, please try again");
    } finally {
      setBusy(false);
      input.value = ""; // allow re-selecting the same file
    }
  }

  return (
    <div>
      {!completed && (
        // sr-only (not display:none) keeps the input reachable by keyboard
        <label
          className={`flex min-h-11 items-center justify-center rounded-lg px-3 py-2 font-semibold focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sky-700 ${
            busy
              ? "cursor-wait bg-slate-200 text-slate-700"
              : "cursor-pointer bg-sky-700 text-white hover:bg-sky-800"
          }`}
        >
          {busy ? "Checking..." : "Submit photo"}
          <input
            className="sr-only"
            type="file"
            accept="image/*"
            aria-label={`Submit photo for ${dareTitle}`}
            onChange={handleChange}
            disabled={busy}
          />
        </label>
      )}
      <p role="status" className="mt-1 empty:hidden">
        {status}
      </p>
    </div>
  );
}
