import { PlusIcon } from "../lib/icons";
import type { Story } from "../lib/data";

/**
 * Story rail. The export rings every story in the brand gradient, but that
 * treatment is gone: a story is now just the photo, and the only status mark is
 * a red bead that blinks on the corner of anyone who is live. What survives
 * from the export is the rhythm — `w-16` items on a 76pt pitch with a 12pt gap,
 * so the photos sit exactly where the rings used to and the rail keeps its
 * length. "You" still carries the add button.
 */
export function StoryRail({
  stories,
  onOpen,
}: {
  stories: Story[];
  onOpen?: (story: Story) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pt-[13px] pb-[14px]">
      {stories.map((story) => (
        <StoryItem key={story.id} story={story} onOpen={onOpen} />
      ))}
    </div>
  );
}

function StoryItem({
  story,
  onOpen,
}: {
  story: Story;
  onOpen?: (story: Story) => void;
}) {
  const isYou = story.variant === "you";
  const isLive = story.variant === "live";

  return (
    <button
      type="button"
      onClick={() => onOpen?.(story)}
      className="flex w-16 shrink-0 flex-col items-center gap-[6px] transition active:scale-95"
    >
      {/* The photo keeps the export's 54pt and its 64pt slot. Holding the slot
          matters: the rail's height sets where everything below it starts, so
          dropping the ring without it would lift the whole feed 10pt. */}
      <div className="grid size-16 place-items-center">
        <div className="relative">
          {/* overflow-hidden keeps the wavy photo inside its own circle */}
          <span className="relative block overflow-hidden rounded-full">
            <img
              src={story.avatar}
              alt={story.label}
              className={`rounded-full object-cover ${isYou ? "" : "wave-3d"}`}
              style={{ width: 54, height: 54 }}
            />
          </span>

          {isYou && (
            <span className="absolute right-0 bottom-0 grid size-[17px] place-items-center rounded-full border-2 border-cream bg-info text-white">
              <PlusIcon size={11} strokeWidth={3} />
            </span>
          )}

          {/* live is a red bead on the corner of the photo, and the blink is
              the whole signal — no ring, no badge, no label */}
          {isLive && (
            <span
              aria-hidden
              className="live-dot absolute top-[2px] right-[2px] size-[12px] rounded-full border-2 border-cream"
            />
          )}
        </div>
      </div>

      <span className="w-full truncate text-center text-[12px] font-semibold text-ink">
        {story.label}
      </span>
    </button>
  );
}
