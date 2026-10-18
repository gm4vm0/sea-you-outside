import { useEffect, useId, useRef, useState } from "react";
import type { Fish } from "@/lib/types";

interface FishModalProps {
  fish: Fish | null;
  userPoints: number;
  onClose: () => void;
  onBuy: (fish: Fish) => Promise<string | null>;
}

export const FishModal: React.FC<FishModalProps> = ({
  fish,
  userPoints,
  onClose,
  onBuy,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!fish) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    document.body.style.overflow = "hidden";

    const panel = panelRef.current;

    const getFocusableElements = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          "button:not([disabled]), a[href], input:not([disabled]), " +
            "select:not([disabled]), textarea:not([disabled]), " +
            '[tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter(
        (element) =>
          element.getClientRects().length > 0 && !element.closest("[inert]"),
      );

    (getFocusableElements()[0] ?? panel)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const elements = getFocusableElements();
      const first = elements[0];
      const last = elements[elements.length - 1];

      if (!first || !last) {
        event.preventDefault();
        panel?.focus();
        return;
      }

      const activeElement = document.activeElement;

      if (event.shiftKey) {
        if (
          activeElement === first ||
          activeElement === panel ||
          !panel?.contains(activeElement)
        ) {
          event.preventDefault();
          last.focus();
        }
      } else if (activeElement === last || !panel?.contains(activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      if (previousFocus?.isConnected) {
        previousFocus.focus();
      }
    };
  }, [fish]);

  if (!fish) return null;

  const canAfford = userPoints >= fish.price;

  const handleBuy = async () => {
    if (!canAfford || busy) return;
    setBusy(true);
    setError("");
    const message = await onBuy(fish);
    setBusy(false);
    if (message) return setError(message);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        {/* Top-right dismiss button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-sky-600"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Fish Emoji */}
        <div className="mb-6 flex h-40 items-center justify-center rounded-xl bg-sky-50">
          <span role="img" aria-label={fish.name} className="text-8xl">
            {fish.emoji}
          </span>
        </div>

        {/* Fish Details */}
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id={titleId}
            className="wrap-break-word text-2xl font-bold text-slate-900"
          >
            {fish.name}
          </h2>
          <span className="shrink-0 text-xl font-semibold text-sky-600">
            {fish.price} points
          </span>
        </div>

        <p className="mt-4 whitespace-pre-line wrap-break-word text-sm leading-relaxed text-slate-600">
          {fish.description}
        </p>

        <div className="mt-4 rounded-xl bg-sky-50 p-4">
          <p className="text-sm font-semibold text-sky-800">Fun fact</p>
          <p className="mt-1 wrap-break-word text-sm leading-relaxed text-sky-700">
            {fish.fact}
          </p>
        </div>

        {/* Actions: Buy button shown only if affordable */}
        <div className="mt-6 flex flex-col gap-2">
          {canAfford ? (
            <button
              type="button"
              onClick={handleBuy}
              disabled={busy}
              className="w-full disabled:opacity-60 rounded-xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              {busy ? "Buying..." : `Buy (${fish.price} pts)`}
            </button>
          ) : (
            <div className="w-full rounded-xl border border-dashed border-rose-200 bg-rose-50 p-3 text-center text-sm font-medium text-rose-600">
              Not enough points ({userPoints}/{fish.price})
            </div>
          )}
          {error && (
            <p role="alert" className="text-center text-sm text-rose-600">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
