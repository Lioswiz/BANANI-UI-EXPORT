import { useEffect, useRef, useState, type FormEvent } from "react";

import { AppHeader } from "../components/AppHeader";
import { PostCard } from "../components/PostCard";
import { PillButton } from "../components/primitives";
import { StoryRail } from "../components/StoryRail";
import { BoltIcon } from "../lib/icons";
import { posts, stories, type Story } from "../lib/data";
import { actions, useApp } from "../lib/store";

export function HomeFeed({
  onActivity,
  onMessages,
  onOpenStory,
}: {
  onActivity: () => void;
  onMessages: () => void;
  onOpenStory: (story: Story) => void;
}) {
  const { feed, following, composeToken } = useApp();
  const [scope, setScope] = useState<"for-you" | "following">("for-you");
  const [draft, setDraft] = useState("");
  const composer = useRef<HTMLInputElement>(null);

  // the tab bar's + and the sidebar's "New Chirp" both land the caret here
  useEffect(() => {
    if (composeToken > 0) composer.current?.focus();
  }, [composeToken]);

  const visible =
    scope === "following"
      ? posts.filter((p) => following[p.author.handle])
      : posts;

  function publish(e: FormEvent) {
    e.preventDefault();
    actions.publish(draft);
    setDraft("");
  }

  return (
    <>
      <AppHeader title="river" onActivity={onActivity} onMessages={onMessages} />

      <StoryRail stories={stories} onOpen={onOpenStory} />

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
            aria-pressed={scope === key}
            onClick={() => setScope(key)}
            className={`h-9 flex-1 rounded-full text-[14px] transition ${
              scope === key
                ? "bg-surface font-bold text-ink shadow-[0_1px_3px_rgba(20,18,25,0.08)]"
                : "font-semibold text-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* The export's placeholder paragraph, made editable at the same metrics.
          The field itself is the white bar: no placeholder, so an empty
          composer shows the bolt, the caret and nothing else. */}
      <form
        onSubmit={publish}
        className="mx-4 mb-[11px] flex h-[66px] items-center gap-3 rounded-[20px] border border-hairline bg-surface px-3"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-zest text-ink">
          <BoltIcon size={17} />
        </span>
        <input
          ref={composer}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Share a Chirp"
          className="min-w-0 flex-1 bg-transparent text-[14px] leading-[1.4] font-semibold text-ink caret-brand outline-none"
        />
        <PillButton
          size="md"
          type="submit"
          disabled={!draft.trim()}
          className="!px-[15px] !text-[13px] disabled:opacity-45"
        >
          Post
        </PillButton>
      </form>

      {feed.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {visible.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {scope === "following" && visible.length === 0 && (
        <p className="mx-4 rounded-[22px] border border-dashed border-faint px-6 py-8 text-center text-[13px] leading-[1.5] font-medium text-muted">
          You're not following anyone yet. Follow a few people and their Chirps
          show up here.
        </p>
      )}
    </>
  );
}
