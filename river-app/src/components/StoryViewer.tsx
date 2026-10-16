import { useEffect } from "react";

import type { Story } from "../lib/data";
import { CloseIcon } from "../lib/icons";

/**
 * The export only shows the story rail, never an opened story, so this is an
 * extrapolation in the export's own language: full-bleed ink, the ring
 * gradient as the progress bar, and the same blinking live dot.
 */
export function StoryViewer({ story, onClose }: { story: Story; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${story.label} story`}
      className="fixed inset-0 z-50 flex flex-col bg-ink"
    >
      <div className="flex gap-1 px-4 pt-[18px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25"
          >
            <span
              className={`block h-full rounded-full ${
                i === 0 ? "ring-story w-full" : "w-0"
              }`}
            />
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 px-4 pt-3">
        <span className="relative block">
          <span className="block overflow-hidden rounded-full">
            <img
              src={story.avatar}
              alt=""
              className={`size-[33px] rounded-full border-2 border-ink object-cover ${
                story.variant === "you" ? "" : "wave-3d"
              }`}
            />
          </span>
          {story.variant === "live" && (
            <span
              aria-hidden
              className="live-dot absolute top-[1px] right-[1px] size-[9px] rounded-full border-2 border-cream"
            />
          )}
        </span>
        <span className="text-[15px] font-extrabold text-white">{story.label}</span>
        <span className="text-[13px] font-medium text-white/50">just now</span>

        <button
          type="button"
          aria-label="Close story"
          onClick={onClose}
          className="ml-auto grid size-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
        >
          <CloseIcon size={19} />
        </button>
      </div>

      <div className="grid min-h-0 flex-1 place-items-center px-6">
        <img
          src={story.avatar}
          alt=""
          className="max-h-[62vh] w-full max-w-[420px] rounded-[28px] object-cover"
        />
      </div>

      <div className="flex items-center gap-3 px-4 pb-6">
        <div className="flex h-11 flex-1 items-center rounded-full bg-white/10 px-4 text-[14px] font-medium text-white/60">
          Send a reply…
        </div>
        <button
          type="button"
          onClick={onClose}
          className="h-11 rounded-full bg-white px-5 text-[14px] font-bold text-ink transition active:scale-95"
        >
          Done
        </button>
      </div>
    </div>
  );
}
