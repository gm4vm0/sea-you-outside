import fish from "@/data/fish.json";
import type { Fish } from "@/lib/types";

const ownedFish = (fish as Fish[]).slice(0, 7); // fake: first 4 fish

type DepthZone = "shallows" | "twilight" | "midnight" | "abyss";

const DEPTH_RANGES: Record<DepthZone, { min: number; max: number }> = {
  shallows: { min: 5, max: 40 },
  twilight: { min: 43, max: 60 },
  midnight: { min: 63, max: 79 },
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

function calculateTop(depth: DepthZone, id: string): string {
  const range = DEPTH_RANGES[depth] ?? DEPTH_RANGES.shallows;
  const ratio = getStableOffset(id, 727); // consistent 0 to 1 float
  const topPercent = range.min + ratio * (range.max - range.min);
  return `${topPercent.toFixed(1)}%`;
}

export default function SeaPage() {
  return (
    <main>
      <div className="relative h-[95vh] overflow-hidden bg-linear-to-b from-sky-100 to-blue-900">
        {ownedFish.map((f, i) => {
          const topPosition = calculateTop(f.depth as DepthZone, f.id);

          return (
            <span
              key={f.id}
              className="fish absolute select-none text-2xl"
              role="img"
              aria-label={f.name}
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
