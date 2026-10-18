// Access needs a player can pick, also used to tag dare alternatives.
export const ACCESS_TAGS = [
  "step-free",
  "seated-ok",
  "quiet",
  "near-home",
  "no-water",
  "group",
] as const;
export type AccessTag = (typeof ACCESS_TAGS)[number];

export const ACCESS_LABELS: Record<
  AccessTag,
  { label: string; icon: string; need: string }
> = {
  "step-free": {
    label: "Wheelchair-friendly",
    icon: "♿",
    need: "I use a wheelchair or need step-free routes",
  },
  "seated-ok": {
    label: "Can be done seated",
    icon: "🪑",
    need: "I need to sit or rest often",
  },
  quiet: {
    label: "Quiet / low-sensory",
    icon: "🤫",
    need: "I prefer quiet, low-crowd places",
  },
  "near-home": {
    label: "From home or nearby",
    icon: "🏠",
    need: "I can't go far from home",
  },
  "no-water": {
    label: "No water needed",
    icon: "🌳",
    need: "I don't live near water",
  },
  group: {
    label: "Good with others",
    icon: "👥",
    need: "I like doing things with others",
  },
};

export type Preferences = { needs: AccessTag[] };

export function isAccessTag(tag: unknown): tag is AccessTag {
  return ACCESS_TAGS.includes(tag as AccessTag);
}

// Accepts anything stored in profiles.preferences; unknown tags are dropped.
export function parsePreferences(raw: unknown): Preferences {
  const needs =
    raw && typeof raw === "object" && "needs" in raw ? raw.needs : [];
  return {
    needs: Array.isArray(needs) ? [...new Set(needs.filter(isAccessTag))] : [],
  };
}
