import ProofUpload from "./proof-upload";
import type { Dare } from "@/lib/types";

export default function DareCard({
  dare,
  onComplete,
}: {
  dare: Dare;
  onComplete: () => void;
}) {
  const completed = !!dare.completed;
  return (
    <article
      className={`border border-solid mt-3 gap-1 flex flex-col ${
        completed ? "border-green-500 opacity-60" : "border-[#ccc]"
      }`}
    >
      <h2 className="font-bold text-xl text-sky-700 flex items-center gap-2">
        {dare.title}
        {completed && (
          <span className="text-sm font-semibold text-green-700 bg-green-100 rounded-full px-2 py-0.5">
            ✓ Completed
          </span>
        )}
      </h2>
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
      <ProofUpload
        dareId={dare.id}
        completed={completed}
        onComplete={onComplete}
      />
    </article>
  );
}
