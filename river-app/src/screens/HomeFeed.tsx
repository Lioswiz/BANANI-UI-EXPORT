import { useState } from "react";

import { AppHeader } from "../components/AppHeader";
import { PostCard } from "../components/PostCard";
import { PillButton } from "../components/primitives";
import { StoryRail } from "../components/StoryRail";
import { BoltIcon } from "../lib/icons";
import { posts, stories } from "../lib/data";

export function HomeFeed({
  onActivity,
  onMessages,
  onOpenStory,
}: {
  onActivity: () => void;
  onMessages: () => void;
  onOpenStory: () => void;
}) {
  const [feed, setFeed] = useState<"for-you" | "following">("for-you");

  return (
    <>
      <AppHeader title="river" onActivity={onActivity} onMessages={onMessages} />

      <StoryRail
        stories={stories}
        onOpen={() => onOpenStory()}
      />

      {/* segmented feed switch: 44pt sunken track with a 36pt white thumb */}
      <div className="mx-4 mb-3 flex h-11 items-center rounded-full bg-sunken p-1">
        {(
          [
            ["for-you", "For you"],
            ["following", "Following"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFeed(key)}
            className={`h-9 flex-1 rounded-full text-[14px] transition ${
              feed === key
                ? "bg-surface font-bold text-ink shadow-[0_1px_3px_rgba(20,18,25,0.08)]"
                : "font-semibold text-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mx-4 mb-[11px] flex h-[66px] items-center gap-3 rounded-[20px] bg-ink px-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-zest text-ink">
          <BoltIcon size={17} />
        </span>
        <p className="min-w-0 flex-1 text-[14px] leading-[1.4] font-semibold text-white">
          Share a Chirp — text, photo or 30s Loop
        </p>
        <PillButton size="md" className="!px-[15px] !text-[13px]">
          Post
        </PillButton>
      </div>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
}
