import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import { AppHeader } from "../components/AppHeader";
import { PostCard } from "../components/PostCard";
import { PillButton } from "../components/primitives";
import { StoryRail } from "../components/StoryRail";
import { BoltIcon } from "../lib/icons";
import { posts, stories, type Story } from "../lib/data";
import { actions, useApp } from "../lib/store";

/** Past this the canvas stops growing and scrolls, so a long post can't push
    the feed off the screen. */
const MAX_CANVAS = 240;

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
  const [grown, setGrown] = useState(false);
  const composer = useRef<HTMLTextAreaElement>(null);

  // the tab bar's + and the sidebar's "New Chirp" both land the caret here
  useEffect(() => {
    if (composeToken > 0) composer.current?.focus();
  }, [composeToken]);

  /* The canvas. The bar is one line tall until the text needs a second, then it
     grows a line at a time and scrolls once it hits the cap. Measuring has to
     happen after the DOM holds the new value and before the browser paints, or
     the bar lurches by a line on every keystroke. */
  useLayoutEffect(() => {
    const el = composer.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, MAX_CANVAS);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > MAX_CANVAS ? "auto" : "hidden";
    // one line measures 36px; past that there is a real Chirp taking shape
    setGrown(next > 44);
  }, [draft]);

  const visible =
    scope === "following"
      ? posts.filter((p) => following[p.author.handle])
      : posts;

  function submitDraft() {
    if (!draft.trim()) return;
    actions.publish(draft);
    setDraft("");
  }

  function publish(e: FormEvent) {
    e.preventDefault();
    submitDraft();
  }

  /* A textarea would otherwise swallow Enter. Keeping Enter as "post" holds on
     to what the single-line bar did, and Shift+Enter is the way to a new line. */
  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitDraft();
    }
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

      {/* The export's placeholder paragraph, made editable at its own metrics —
          same 66pt bar, same lime bolt, same 20pt corners — but the field is a
          canvas rather than a line. No placeholder, so an empty composer shows
          the bolt, the caret and nothing else. */}
      <form
        onSubmit={publish}
        className={`mx-4 mb-[11px] flex items-end gap-3 border border-hairline bg-surface px-3 py-[14px] transition-[border-radius,box-shadow] duration-200 ${
          grown
            ? "rounded-[24px] shadow-[0_12px_30px_-16px_rgba(20,18,25,0.35)]"
            : "rounded-[20px]"
        }`}
      >
        <span className="grid size-9 shrink-0 self-start place-items-center rounded-full bg-zest text-ink">
          <BoltIcon size={17} />
        </span>

        <textarea
          ref={composer}
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          maxLength={280}
          aria-label="Share a Chirp"
          className="min-w-0 flex-1 resize-none bg-transparent py-[8px] text-[14px] leading-[1.4] font-semibold text-ink caret-brand outline-none"
        />

        {/* The count rides in the Post button's own column, which the wider of
            the two already sizes — so it turns up without nudging the field's
            width or the card's height. */}
        <div className="flex shrink-0 flex-col items-end gap-1">
          {grown && (
            <span
              className={`text-[11px] leading-none font-semibold tabular-nums ${
                draft.length >= 280 ? "text-brand" : "text-faint"
              }`}
            >
              {draft.length}/280
            </span>
          )}
          <PillButton
            tone="ink"
            size="md"
            type="submit"
            disabled={!draft.trim()}
            className="!px-[15px] !text-[13px] disabled:opacity-45"
          >
            Post
          </PillButton>
        </div>
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
