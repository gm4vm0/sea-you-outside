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

  const DEPTH_CONFIG = [
    { depth: "shallows", label: "Shallows - 10 points" },
    { depth: "reef", label: "Reef - 25 points" },
    { depth: "twilight", label: "Twilight - 50 points" },
    { depth: "abyss", label: "Abyss - 100 points" },
  ];

  const groupedDares = dares.reduce<Partial<Record<string, Dare[]>>>(
    (acc, dare) => {
      (acc[dare.depth] ??= []).push(dare);
      return acc;
    },
    {},
  );
  return (
    <section>
      {status && <p role="status">{status}</p>}

      {DEPTH_CONFIG.map(({ depth, label }) => {
        const group = groupedDares[depth] || [];
        if (group.length === 0) return null; // Optional: hide empty tiers

        return (
          <div
            className="m-4 p-3 border-2 rounded-2xl border-sky-500"
            key={depth}
          >
            <p className="font-bold text-2xl">{label}</p>
            {group.map((dare: Dare) => (
              <DareCard key={dare.id} dare={dare} />
            ))}
          </div>
        );
      })}
    </section>
  );
}
