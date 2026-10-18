"use client";

import { useState } from "react";
import { resizeImage } from "@/lib/utils";

export default function ProofUpload({ dareId }: { dareId: string }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

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
        if (res.status === 409) setDone(true);
        return setStatus(
          body.error ?? "Something went wrong, please try again",
        );
      }
      if (body.status === "approved") {
        setDone(true);
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
      {!done && (
        <label className="flex flex-col gap-1">
          <span className="px-3 py-2 bg-blue-300 hover:bg-sky-800 italic rounded-lg">
            Submit photo
          </span>
          <input
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={busy}
          />
        </label>
      )}
      {status && <p role="status">{status}</p>}
    </div>
  );
}
