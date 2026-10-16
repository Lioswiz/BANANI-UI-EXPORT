import { useState, type FormEvent, type ReactNode } from "react";

import type { Post } from "../lib/data";
import {
  AnalyticsIcon,
  CommentIcon,
  HeartIcon,
  RepostIcon,
  SendIcon,
  VerifiedIcon,
} from "../lib/icons";
import { actions, bumpStat, copy, toast, useApp } from "../lib/store";

/** 37pt avatar sits in a 47pt gutter that the body and media align to. */
const GUTTER = "ml-[47px]";

export function Verified() {
  return <VerifiedIcon size={14} className="shrink-0 text-ink/55" />;
}

export function PostCard({ post }: { post: Post }) {
  const { liked, reposted, replies } = useApp();
  const [replying, setReplying] = useState(false);
  const [draft, setDraft] = useState("");

  const isLiked = !!liked[post.id];
  const isReposted = !!reposted[post.id];
  const thread = replies[post.id] ?? [];

  function submitReply(e: FormEvent) {
    e.preventDefault();
    actions.addReply(post.id, draft);
    setDraft("");
    setReplying(false);
  }

  return (
    <article className="mx-4 mb-3 rounded-[22px] border border-hairline bg-surface p-3.5">
      <div className="flex items-center gap-[10px]">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          loading="lazy"
          className="size-[37px] shrink-0 rounded-full object-cover"
        />
        <div className="flex min-w-0 items-baseline gap-[6px]">
          <span className="truncate text-[14px] font-extrabold tracking-[-0.01em]">
            {post.author.name}
          </span>
          {post.author.verified && <Verified />}
          <span className="shrink-0 text-[13px] font-medium text-muted">
            {post.author.handle} · {post.time}
          </span>
        </div>
      </div>

      <p className={`${GUTTER} mt-2 text-[14px] leading-[1.36] font-medium text-ink`}>
        {post.body}
      </p>

      {post.image && (
        <img
          src={post.image}
          alt=""
          loading="lazy"
          className={`${GUTTER} mt-2.5 w-[calc(100%-47px)] rounded-[18px] object-cover`}
        />
      )}

      <div
        className={`${GUTTER} mt-3 flex items-center justify-between pr-1 text-muted`}
      >
        <Stat
          icon={<CommentIcon size={19} />}
          value={bumpStat(post.stats.comments, thread.length)}
          label="Reply"
          active={replying}
          onClick={() => setReplying((v) => !v)}
        />
        <Stat
          icon={
            <RepostIcon
              size={19}
              fill={isReposted ? "currentColor" : "none"}
            />
          }
          value={bumpStat(post.stats.reposts, isReposted ? 1 : 0)}
          label={isReposted ? "Undo repost" : "Repost"}
          pressed={isReposted}
          active={isReposted}
          onClick={() => actions.toggleRepost(post.id)}
        />
        <Stat
          icon={<HeartIcon size={19} fill={isLiked ? "currentColor" : "none"} />}
          value={bumpStat(post.stats.likes, isLiked ? 1 : 0)}
          label={isLiked ? "Unlike" : "Like"}
          pressed={isLiked}
          active={isLiked}
          onClick={() => actions.toggleLike(post.id)}
        />
        <button
          type="button"
          aria-label="Analytics"
          onClick={() => toast(`${bumpStat(post.stats.likes, isLiked ? 1 : 0)} likes · ${bumpStat(post.stats.comments, thread.length)} replies`)}
          className="transition active:scale-90"
        >
          <AnalyticsIcon size={19} />
        </button>
        <button
          type="button"
          aria-label="Share"
          onClick={() => copy(`${post.author.name} on river: ${post.body}`, "Link copied")}
          className="transition active:scale-90"
        >
          <SendIcon size={19} />
        </button>
      </div>

      {/* Everything below renders only once there is something to show, so a
          freshly loaded post is still byte-for-byte the export's card. */}

      {thread.length > 0 && (
        <ul className={`${GUTTER} mt-3 flex flex-col gap-2`}>
          {thread.map((body, i) => (
            <li
              key={i}
              className="rounded-[14px] rounded-tl-[6px] bg-sunken px-3 py-2 text-[13px] leading-[1.4] font-medium text-ink"
            >
              {body}
            </li>
          ))}
        </ul>
      )}

      {replying && (
        <form onSubmit={submitReply} className={`${GUTTER} mt-3 flex items-center gap-2`}>
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a reply…"
            aria-label="Write a reply"
            className="h-10 min-w-0 flex-1 rounded-full bg-sunken px-4 text-[13px] font-medium text-ink outline-none placeholder:text-faint focus:ring-2 focus:ring-brand/30"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="h-10 shrink-0 rounded-full bg-ink px-4 text-[13px] font-bold text-white transition active:scale-95 disabled:opacity-40"
          >
            Reply
          </button>
        </form>
      )}
    </article>
  );
}

function Stat({
  icon,
  value,
  label,
  active,
  pressed,
  onClick,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  active?: boolean;
  pressed?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`flex items-center gap-[7px] transition active:scale-90 ${
        active ? "text-brand" : ""
      }`}
    >
      {icon}
      <span className="text-[12px] font-semibold">{value}</span>
    </button>
  );
}
