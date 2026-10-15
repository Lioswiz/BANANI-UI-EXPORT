import type { Post } from "../lib/data";
import {
  AnalyticsIcon,
  CommentIcon,
  HeartIcon,
  RepostIcon,
  SendIcon,
  VerifiedIcon,
} from "../lib/icons";

/** 37pt avatar sits in a 47pt gutter that the body and media align to. */
const GUTTER = "ml-[47px]";

export function Verified() {
  return <VerifiedIcon size={14} className="shrink-0 text-ink/55" />;
}

export function PostCard({ post }: { post: Post }) {
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
        <Stat icon={<CommentIcon size={19} />} value={post.stats.comments} />
        <Stat icon={<RepostIcon size={19} />} value={post.stats.reposts} />
        <Stat icon={<HeartIcon size={19} />} value={post.stats.likes} />
        <button type="button" aria-label="Analytics" className="transition active:scale-90">
          <AnalyticsIcon size={19} />
        </button>
        <button type="button" aria-label="Share" className="transition active:scale-90">
          <SendIcon size={19} />
        </button>
      </div>
    </article>
  );
}

function Stat({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-[7px] transition active:scale-90"
    >
      {icon}
      <span className="text-[12px] font-semibold">{value}</span>
    </button>
  );
}
