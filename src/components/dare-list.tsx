"use client";

import { useEffect, useState } from "react";
import DareCard from "./dare-card";
import type { Dare } from "@/lib/types";

type Result = { dares: Dare[] } | { error: string };

async function fetchDares(regenerate = false): Promise<Result> {
  try {
    const res = await fetch(`/api/dares${regenerate ? "?regenerate=1" : ""}`, {
      method: "POST",
    });
    const body = await res.json();
    if (!res.ok) return { error: `Error: ${body.error}` };
    return { dares: body.dares };
  } catch {
    return { error: "Could not load dares, please try again" };
  }
}

export default function DareList() {
  const [dares, setDares] = useState<Dare[]>([]);
  const [status, setStatus] = useState("Loading dares...");
  const [loading, setLoading] = useState(true);

  function apply(result: Result) {
    if ("error" in result) {
      setStatus(result.error);
    } else {
      setDares(result.dares);
      setStatus("");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchDares().then(apply);
  }, []);

  function regenerate() {
    setLoading(true);
    setStatus("Generating new dares...");
    fetchDares(true).then(apply);
  }

  return (
    <section>
      {/*<button type="button" onClick={regenerate} disabled={loading}>
        Regenerate
      </button>*/}
      {status && <p role="status">{status}</p>}
      {dares.map((dare) => (
        <DareCard key={dare.id} dare={dare} />
      ))}
    </section>
  );
}
