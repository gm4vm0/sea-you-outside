"use client";

import { useActionState } from "react";
import { savePreferences, type SaveState } from "@/app/(main)/settings/actions";
import { ACCESS_LABELS, ACCESS_TAGS, type AccessTag } from "@/lib/access";

const initialState: SaveState = { message: "", error: false };

export default function PreferencesForm({
  needs,
  area,
  welcome,
}: {
  needs: AccessTag[];
  area: string;
  welcome: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    savePreferences,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {welcome && <input type="hidden" name="welcome" value="1" />}

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-lg font-semibold text-slate-900">
          What works for you?
        </legend>
        <p className="mb-1 text-slate-700">
          Pick any that apply. We&apos;ll suggest dares and alternatives that
          fit. You can change these any time.
        </p>
        {ACCESS_TAGS.map((tag) => (
          <label
            key={tag}
            className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-300 has-checked:bg-sky-50 has-checked:ring-2 has-checked:ring-sky-700 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sky-700"
          >
            <input
              type="checkbox"
              name="needs"
              value={tag}
              defaultChecked={needs.includes(tag)}
              className="size-5 accent-sky-700"
            />
            <span aria-hidden="true" className="text-xl">
              {ACCESS_LABELS[tag].icon}
            </span>
            <span className="text-slate-900">{ACCESS_LABELS[tag].need}</span>
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-1">
        <label htmlFor="area" className="font-semibold text-slate-900">
          Your town or city <span className="font-normal">(optional)</span>
        </label>
        <input
          id="area"
          name="area"
          type="text"
          autoComplete="address-level2"
          defaultValue={area}
          aria-describedby="area-hint"
          className="w-full rounded-lg border border-slate-400 px-3 py-2 text-slate-900 focus:outline-2 focus:outline-sky-700"
        />
        <p id="area-hint" className="text-sm text-slate-700">
          Helps us suggest places near you.
        </p>
      </div>

      <div aria-live="polite" className="min-h-6">
        {state.message && (
          <p
            className={`font-medium ${state.error ? "text-red-700" : "text-green-800"}`}
          >
            {state.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 rounded-xl bg-sky-700 px-4 py-2 font-semibold text-white hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:opacity-60"
        >
          {pending ? "Saving..." : welcome ? "Save and see my dares" : "Save"}
        </button>
        {welcome && (
          <button
            type="submit"
            name="skip"
            value="1"
            disabled={pending}
            className="min-h-11 rounded-xl px-4 py-2 font-semibold text-sky-800 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-sky-700"
          >
            Skip for now
          </button>
        )}
      </div>
    </form>
  );
}
