export type Depth = "shallows" | "reef" | "twilight" | "abyss";

export type Fish = {
  id: string;
  name: string;
  emoji: string;
  depth: Depth;
  price: number;
  fact: string;
  description: string;
};

export type Dare = {
  id: string;
  title: string;
  depth: Depth;
  points: number;
  instructions: string;
  alternatives: { text: string; tags: string[] }[];
  tags: string[];
  proof: string;
  completed?: boolean;
};
