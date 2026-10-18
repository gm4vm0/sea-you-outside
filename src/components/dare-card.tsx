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
      className={`mt-3 flex flex-col gap-2 rounded-xl p-4 shadow-sm ring-1 ${
        completed ? "bg-green-50 ring-green-300" : "bg-white ring-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h2
          className={`font-bold text-xl ${completed ? "text-green-800" : "text-sky-700"}`}
        >
          {dare.title}
        </h2>
        {completed && (
          <span className="shrink-0 whitespace-nowrap rounded-full bg-green-600 px-2 py-0.5 text-sm font-semibold text-white">
            ✓ Done
          </span>
        )}
      </div>
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
