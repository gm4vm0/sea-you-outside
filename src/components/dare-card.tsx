import type { Dare } from "@/lib/types";

export default function DareCard({ dare }: { dare: Dare }) {
  return (
    <article>
      <p>
        <strong>
          {dare.depth.toUpperCase()} · {dare.points} points
        </strong>
      </p>
      <h2>{dare.title}</h2>
      {/* <p>{dare.instructions}</p>
      {dare.alternatives.length > 0 && (
        <>
          <p>
            <strong>Other ways to do it (same points):</strong>
          </p>
          <ul>
            {dare.alternatives.map((alt) => (
              <li key={alt.text}>{alt.text}</li>
            ))}
          </ul>
        </>
      )} */}
      <button type="button" disabled>
        Submit photo (coming soon)
      </button>
    </article>
  );
}
