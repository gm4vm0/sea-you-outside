import ProofUpload from "./proof-upload";
import type { Dare } from "@/lib/types";

export default function DareCard({ dare }: { dare: Dare }) {
  return (
    <article className="border-[#ccc] border-1px border-solid mt-3 gap-1 flex flex-col">
      <h2 className="font-bold text-xl text-sky-700">{dare.title}</h2>
      <p>{dare.instructions}</p>
      {dare.alternatives.length > 0 && (
        <>
          <p className="italic text-sky-600">
            Other ways to do it (same points):
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
