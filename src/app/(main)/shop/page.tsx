import fish from "@/data/fish.json";
import type { Fish } from "@/lib/types";

export default function ShopPage() {
  return (
    <main>
      <h1>Fish shop</h1>
      <p>Your points: 0</p>
      <ul className="list-none p-0">
        {(fish as Fish[]).map((f) => (
          <li
            key={f.id}
            className="border-1px border-solid border-[#ccc] p-4 mb-4"
          >
            <p style={{ fontSize: "2rem" }} aria-hidden="true">
              {f.emoji}
            </p>
            <h2>{f.name}</h2>
            <p>
              {f.depth} · {f.price} points
            </p>
            <p>{f.fact}</p>
            <button type="button" disabled>
              Buy (coming soon)
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
