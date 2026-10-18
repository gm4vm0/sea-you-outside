"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DareCard from "./dare-card";
import type { AccessTag } from "@/lib/access";
import type { Dare } from "@/lib/types";

type Result = { dares: Dare[]; needs: AccessTag[] } | { error: string };

async function fetchDares(regenerate = false): Promise<Result> {
  try {
    const res = await fetch(`/api/dares${regenerate ? "?regenerate=1" : ""}`, {
      method: "POST",
    });
    const body = await res.json();
    if (!res.ok) return { error: `Error: ${body.error}` };
    return { dares: body.dares, needs: body.needs ?? [] };
  } catch {
    return { error: "Could not load dares, please try again" };
  }
}

export default function DareList() {
  const [dares, setDares] = useState<Dare[]>([]);
  const [needs, setNeeds] = useState<AccessTag[]>([]);
  const [status, setStatus] = useState("Loading dares...");
  const [loading, setLoading] = useState(true);

  function apply(result: Result) {
    if ("error" in result) {
      setStatus(result.error);
    } else {
      setDares(result.dares);
      setNeeds(result.needs);
      setStatus("");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchDares().then(apply);
  }, []);

  function markCompleted(id: string) {
    setDares((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completed: true } : d)),
    );
  }

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
  const completedCount = dares.filter((d) => d.completed).length;

  return (
    <div>
      {status && (
        <p role="status" className="m-4">
          {status}
        </p>
      )}
      {/* Announces progress to screen readers when a dare is completed */}
      <p aria-live="polite" className="m-4 font-semibold">
        {dares.length > 0 &&
          `${completedCount}/${dares.length} dares completed`}
      </p>
      {dares.length > 0 && needs.length === 0 && (
        <p className="m-4 text-slate-700">
          Every dare has other ways to do it.{" "}
          <Link
            href="/settings"
            className="font-semibold text-sky-800 underline underline-offset-2"
          >
            Tell us what works for you
          </Link>{" "}
          and we&apos;ll point out the best fit.
        </p>
      )}

      {DEPTH_CONFIG.map(({ depth, label }) => {
        const group = groupedDares[depth] || [];
        if (group.length === 0) return null; // Optional: hide empty tiers
        const groupDone = group.filter((d) => d.completed).length;

        return (
          <section
            className="m-4 rounded-2xl bg-sky-50 p-3"
            key={depth}
            aria-labelledby={`depth-${depth}`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <h2 id={`depth-${depth}`} className="font-bold text-2xl">
                {label}
              </h2>
              <p className="shrink-0 text-sm font-semibold text-sky-700">
                {groupDone}/{group.length} done
              </p>
            </div>
            {group.map((dare: Dare) => (
              <DareCard
                key={dare.id}
                dare={dare}
                needs={needs}
                onComplete={() => markCompleted(dare.id)}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}
