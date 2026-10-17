import DareCard from "@/components/dare-card";
import dares from "@/data/sample-dares.json";
import type { Dare } from "@/lib/types";

export default function DaresPage() {
  return (
    <main>
      <h1>This week&apos;s dares</h1>
      {(dares as Dare[]).map((dare) => (
        <DareCard key={dare.id} dare={dare} />
      ))}
    </main>
  );
}
