import sampleDares from "@/data/sample-dares.json";
import { DareSetSchema, POINTS, type Dare, type Depth } from "./schema";

const FALLBACK: Dare[] = DareSetSchema.parse(sampleDares);

export function getFallbackDares() {
  return FALLBACK.map((d) => ({ ...d, points: POINTS[d.depth] }));
}

export function getFallbackDare(depth: Depth, n = 0) {
  const options = FALLBACK.filter((d) => d.depth === depth);
  const dare = options[n % options.length];
  return { ...dare, points: POINTS[dare.depth] };
}
