import { PlusIcon } from "../lib/icons";
import type { Story } from "../lib/data";

/**
 * Story rail. The export measures the ring at 164px (54.7pt) outer with a
 * 140px (46.7pt) photo inside, i.e. a 4pt gradient ring. "You" swaps the
 * gradient for a dashed ring and gains the blue add button.
 */
export function StoryRail({
  stories,
  onOpen,
}: {
  stories: Story[];
  onOpen?: (story: Story) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-5 overflow-x-auto px-4 pt-1 pb-2">
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
      className="flex w-[55px] shrink-0 flex-col items-center gap-[7px] transition active:scale-95"
    >
      <div className="relative">
        <div
          className={
            isYou
              ? "rounded-full border-2 border-dashed border-faint p-[5px]"
              : "ring-story rounded-full p-1"
          }
        >
          <img
            src={story.avatar}
            alt={story.label}
            className="size-[47px] rounded-full object-cover"
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

      <span className="w-full truncate text-center text-[13px] font-semibold text-ink">
        {story.label}
      </span>
    </button>
  );
}
