import ProofUpload from "./proof-upload";
import { ACCESS_LABELS, isAccessTag, type AccessTag } from "@/lib/access";
import type { Dare } from "@/lib/types";

export default function DareCard({
  dare,
  needs,
  onComplete,
}: {
  dare: Dare;
  needs: AccessTag[];
  onComplete: () => void;
}) {
  const completed = !!dare.completed;
  const altsId = `alts-${dare.id}`;

  // Alternatives matching more of the player's needs come first.
  const alternatives = dare.alternatives
    .map((alt) => {
      const tags = alt.tags.filter(isAccessTag); // ignore old/unknown tags
      const matches = tags.filter((t) => needs.includes(t)).length;
      return { ...alt, tags, matches };
    })
    .sort((a, b) => b.matches - a.matches);

  return (
    <article
      className={`mt-3 flex flex-col gap-2 rounded-xl p-4 shadow-sm ring-1 ${
        completed ? "bg-green-50 ring-green-300" : "bg-white ring-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`font-bold text-xl ${completed ? "text-green-800" : "text-sky-800"}`}
        >
          {dare.title}
        </h3>
        {completed && (
          <span className="shrink-0 whitespace-nowrap rounded-full bg-green-700 px-2 py-0.5 text-sm font-semibold text-white">
            <span aria-hidden="true">✓ </span>Done
          </span>
        )}
      </div>
      <p>{dare.instructions}</p>
      {alternatives.length > 0 && (
        <>
          <p id={altsId} className="mt-1 font-semibold text-slate-800">
            Other ways to do it — same points
          </p>
          <ul aria-labelledby={altsId} className="flex flex-col gap-2">
            {alternatives.map((alt) => (
              <li
                key={alt.text}
                className={`rounded-lg p-3 ${
                  alt.matches > 0
                    ? "bg-sky-50 ring-2 ring-sky-700"
                    : "bg-slate-50 ring-1 ring-slate-200"
                }`}
              >
                {alt.matches > 0 && (
                  <p className="mb-1 text-sm font-bold text-sky-800">
                    <span aria-hidden="true">★ </span>Fits your needs
                  </p>
                )}
                <p>{alt.text}</p>
                {alt.tags.length > 0 && (
                  <ul
                    aria-label="Suitable for"
                    className="mt-2 flex flex-wrap gap-1.5"
                  >
                    {alt.tags.map((tag) => (
                      <li
                        key={tag}
                        className={`inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-sm ring-1 ${
                          needs.includes(tag)
                            ? "font-semibold text-sky-900 ring-sky-700"
                            : "text-slate-800 ring-slate-300"
                        }`}
                      >
                        <span aria-hidden="true">
                          {ACCESS_LABELS[tag].icon}
                        </span>
                        {ACCESS_LABELS[tag].label}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      <ProofUpload
        dareId={dare.id}
        dareTitle={dare.title}
        completed={completed}
        onComplete={onComplete}
      />
    </article>
  );
}
