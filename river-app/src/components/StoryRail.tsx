import { PlusIcon } from "../lib/icons";
import type { Story } from "../lib/data";

/**
 * Story rail. Re-measured off the export: the ring is 64pt outer with a 4pt
 * gradient stroke (a 56pt photo inside), items sit on a 76pt pitch so the rail
 * is `w-16` items with a 12pt gap, and the label is 12px. "You" swaps the
 * gradient for a dashed ring of the same outer size, gaining the add button.
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
      <div className="relative">
        <div
          className={
            isYou
              ? "rounded-full border-2 border-dashed border-faint p-[3px]"
              : "ring-story rounded-full p-1"
          }
        >
          <img
            src={story.avatar}
            alt={story.label}
            className="rounded-full object-cover"
            style={{ width: isYou ? 54 : 56, height: isYou ? 54 : 56 }}
          />
        </div>

        {isYou && (
          <span className="absolute right-0 bottom-0 grid size-[17px] place-items-center rounded-full border-2 border-cream bg-info text-white">
            <PlusIcon size={11} strokeWidth={3} />
          </span>
        )}

        {isLive && (
          <span className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 rounded-full bg-brand px-[8px] py-[3px] text-[10px] leading-none font-extrabold tracking-[0.02em] text-white">
            LIVE
          </span>
        )}
      </div>

      <span className="w-full truncate text-center text-[12px] font-semibold text-ink">
        {story.label}
      </span>
    </button>
  );
}
