import * as z from "zod";
import { ACCESS_TAGS } from "../access";

export const DEPTHS = ["shallows", "reef", "twilight", "abyss"] as const;
export type Depth = (typeof DEPTHS)[number];

export const POINTS = {
  shallows: 10,
  reef: 25,
  twilight: 50,
  abyss: 100,
} as const;
export const DEPTH_COUNTS = {
  shallows: 4,
  reef: 3,
  twilight: 2,
  abyss: 1,
} as const;

export const DareSchema = z.object({
  title: z.string().min(1),
  depth: z.enum(DEPTHS),
  instructions: z.string().min(1),
  alternatives: z
    .array(
      z.object({
        text: z.string(),
        tags: z.array(z.enum(ACCESS_TAGS)),
      }),
    )
    .min(1),
  tags: z.array(z.string()),
  proof: z.string().min(1), // what the photo should show, e.g. "A photo of a dog"
});

export const DareSetSchema = z
  .array(DareSchema)
  .length(10)
  .refine(
    (dares) =>
      DEPTHS.every(
        (d) => dares.filter((x) => x.depth === d).length === DEPTH_COUNTS[d],
      ),
    { message: "Need exactly 4 shallows, 3 reef, 2 twilight and 1 abyss dare" },
  );

export type Dare = z.infer<typeof DareSchema>;
