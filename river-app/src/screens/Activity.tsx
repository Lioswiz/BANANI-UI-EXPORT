import { useState } from "react";

import { AppHeader } from "../components/AppHeader";
import { Chip, GhostButton, Rail } from "../components/primitives";
import type { TabKey } from "../components/TabBar";
import {
  HeartIcon,
  MegaphoneIcon,
  RepostIcon,
  UserPlusIcon,
} from "../lib/icons";
import { activity, activityFilters, type ActivityItem } from "../lib/data";

/** Icon circle fills read from the export: 120px = 40pt. */
const TONES: Record<ActivityItem["tone"], string> = {
  brand: "bg-brand text-white",
  zest: "bg-zest text-ink",
  info: "bg-info text-white",
  ink: "bg-ink text-white",
};

const GLYPHS = {
  heart: HeartIcon,
  repost: RepostIcon,
  userplus: UserPlusIcon,
  megaphone: MegaphoneIcon,
};

/** Where a row's "View" lands: the Chirp, the profile, or the channel list. */
const TARGETS: Record<ActivityItem["icon"], TabKey> = {
  heart: "home",
  repost: "home",
  userplus: "profile",
  megaphone: "chats",
};

/** The export ships one "All" list; the other chips split it by row kind. */
const MATCHES: Record<string, ActivityItem["icon"][]> = {
  Likes: ["heart"],
  Replies: ["repost", "userplus"],
  Channels: ["megaphone"],
};

/**
 * Activity lives behind the header heart — the export gives it no tab of its
 * own. Rows are full-bleed with hairline dividers between them.
 */
export function Activity({
  onActivity,
  onMessages,
  onNavigate,
}: {
  onActivity: () => void;
  onMessages: () => void;
  onNavigate: (tab: TabKey) => void;
}) {
  const [filter, setFilter] = useState(activityFilters[0]);

  const kinds = MATCHES[filter];
  const rows = kinds ? activity.filter((a) => kinds.includes(a.icon)) : activity;

  return (
    <>
      <AppHeader title="activity" onActivity={onActivity} onMessages={onMessages} />

      <Rail className="px-4 pt-1 pb-2">
        {activityFilters.map((f) => (
          <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
      </Rail>

      <div className="divide-y divide-hairline">
        {rows.map((item) => {
          const Glyph = GLYPHS[item.icon];
          return (
            <div key={item.id} className="flex items-center gap-4 px-4 py-3.5">
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-full ${TONES[item.tone]}`}
              >
                <Glyph size={20} strokeWidth={item.icon === "repost" ? 2.6 : 1.9} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[14px] leading-[1.25] font-extrabold tracking-[-0.01em]">
                  {item.title}
                </p>
                <p className="mt-[3px] truncate text-[13px] font-medium text-muted">
                  {item.meta}
                </p>
              </div>

              <GhostButton onClick={() => onNavigate(TARGETS[item.icon])}>
                View
              </GhostButton>
            </div>
          );
        })}
      </div>

      {rows.length === 0 && (
        <p className="px-4 py-10 text-center text-[13px] leading-[1.5] font-medium text-muted">
          Nothing here yet.
        </p>
      )}
    </>
  );
}
