import { getOwnedFish } from "@/lib/fish/catalog";
import type { Depth } from "@/lib/types";

const DEPTH_RANGES: Record<Depth, { min: number; max: number }> = {
  shallows: { min: 5, max: 40 },
  reef: { min: 43, max: 60 },
  twilight: { min: 63, max: 79 },
  abyss: { min: 83, max: 92 },
};

function getStableOffset(id: string, seed: number = 0): number {
  let hash = seed;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  // Returns a float between 0 and 1
  return Math.abs(hash % 1000) / 1000;
}

function calculateTop(depth: Depth, id: string): string {
  const range = DEPTH_RANGES[depth] ?? DEPTH_RANGES.shallows;
  const ratio = getStableOffset(id, 727); // consistent 0 to 1 float
  const topPercent = range.min + ratio * (range.max - range.min);
  return `${topPercent.toFixed(1)}%`;
}

export default async function SeaPage() {
  const ownedFish = await getOwnedFish();
  const summary =
    ownedFish.length === 0
      ? "Your sea is empty. Complete dares and buy fish in the shop!"
      : `Your sea with ${ownedFish.length} fish: ${ownedFish.map((f) => f.name).join(", ")}`;

  return (
    <main>
      <h1 className="sr-only">Your sea</h1>
      <div
        role="img"
        aria-label={summary}
        className="relative h-[95vh] overflow-hidden bg-linear-to-b from-sky-100 to-blue-900"
      >
        {ownedFish.length === 0 && (
          <p
            aria-hidden="true"
            className="absolute inset-x-0 top-1/3 text-center text-lg text-sky-900"
          >
            Your sea is empty. Complete dares and buy fish in the shop!
          </p>
        )}
        {ownedFish.map((f, i) => {
          // Use the owned id so two of the same fish swim at different depths.
          const topPosition = calculateTop(f.depth, f.ownedId);

          return (
            <span
              key={f.ownedId}
              className="fish absolute select-none text-2xl"
              aria-hidden="true" // the container's label lists every fish
              style={{
                top: topPosition,
                animationDuration: `${14 + (i % 4) * 3}s`,
                animationDelay: `-${(i * 2.5) % 10}s`,
              }}
            >
              {f.emoji || f.name}
            </span>
          );
        })}
      </div>
    </main>
  );
}
