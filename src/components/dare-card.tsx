import ProofUpload from "./proof-upload";
import type { Dare } from "@/lib/types";

export default function DareCard({ dare }: { dare: Dare }) {
  return (
    <article className="border-[#ccc] border-1px border-solid p-4 mb-4 ">
      <h2>{dare.title}</h2>
      <p>{dare.instructions}</p>
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
      )}
      <ProofUpload dareId={dare.id} />
    </article>
  );
}
