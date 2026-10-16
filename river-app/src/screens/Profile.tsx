import { useState } from "react";

import { PostCard, Verified } from "../components/PostCard";
import { PillButton } from "../components/primitives";
import { BackIcon, SettingsIcon } from "../lib/icons";
import { profile, profilePost, tiles } from "../lib/data";
import { actions, copy, toast, useApp } from "../lib/store";

/**
 * Cover and avatar geometry is taken straight from the export: the cover is a
 * full-bleed 375x211pt block, and the avatar ring sits 168.3pt down at 74pt
 * across with a 5.5pt gradient ring, so it straddles the cover's bottom edge.
 * The ring overflows the cover block, so the details below clear it with a
 * 44pt top pad rather than flowing straight off the image.
 */
export function Profile({
  onBack,
  onOpenChats,
}: {
  onBack: () => void;
  onOpenChats: () => void;
}) {
  const { name, meta, bio } = useApp();
  const [tab, setTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name, meta, bio });

  function startEditing() {
    setDraft({ name, meta, bio });
    setEditing(true);
  }

  function save() {
    actions.setProfile({
      name: draft.name.trim() || name,
      meta: draft.meta.trim(),
      bio: draft.bio.trim(),
    });
    setEditing(false);
  }

  const media = tab === 1 ? tiles : tab === 2 ? tiles.filter((t) => t.tall) : [];

  return (
    <>
      <div className="relative">
        <img
          src="/img/profile-cover.jpg"
          alt=""
          className="h-[211px] w-full object-cover"
        />

        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="absolute top-5 left-4 grid size-[36px] place-items-center rounded-full bg-surface/95 text-ink transition active:scale-95"
        >
          <BackIcon size={20} />
        </button>
        <button
          type="button"
          aria-label="Settings"
          onClick={() => toast("Settings")}
          className="absolute top-5 right-4 grid size-[36px] place-items-center rounded-full bg-surface/95 text-ink transition active:scale-95"
        >
          <SettingsIcon size={18} />
        </button>

        {/* The export rings this photo in the brand gradient. The ring is gone,
            but the 74pt slot is kept so the photo holds its exact place
            straddling the cover edge — the details below still clear it with a
            44pt top pad. */}
        <div className="absolute top-[168.3px] left-4 grid size-[74px] place-items-center">
          <span className="relative block size-[60px] overflow-hidden rounded-full">
            <img
              src={profile.person.avatar}
              alt={name}
              className="wave-3d size-full rounded-full object-cover"
            />
          </span>
        </div>
      </div>

      <div className="px-4 pt-[44px]">
        <div className="flex items-center gap-3">
          {editing ? (
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              aria-label="Display name"
              className="min-w-0 flex-1 rounded-[12px] bg-sunken px-3 py-1.5 text-[20px] leading-none font-extrabold tracking-[-0.02em] outline-none focus:ring-2 focus:ring-brand/30"
            />
          ) : (
            <h1 className="flex items-center gap-[6px] text-[20px] leading-none font-extrabold tracking-[-0.02em]">
              {name}
              <Verified />
            </h1>
          )}
          <div className="ml-auto flex items-center gap-2">
            <PillButton
              tone="ink"
              className="!bg-surface !text-ink border border-hairline"
              size="sm"
              onClick={() =>
                copy(`river.app/${profile.person.handle.replace("@", "")}`, "Profile link copied")
              }
            >
              Share
            </PillButton>
            <PillButton tone="ink" size="sm" onClick={editing ? save : startEditing}>
              {editing ? "Save" : "Edit"}
            </PillButton>
          </div>
        </div>

        {editing ? (
          <>
            <input
              value={draft.meta}
              onChange={(e) => setDraft({ ...draft, meta: e.target.value })}
              aria-label="Meta line"
              className="mt-2 w-full rounded-[12px] bg-sunken px-3 py-2 text-[14px] leading-[17px] font-medium text-muted outline-none focus:ring-2 focus:ring-brand/30"
            />
            <textarea
              value={draft.bio}
              onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
              aria-label="Bio"
              rows={2}
              className="mt-2 w-full resize-none rounded-[14px] bg-sunken px-3 py-2 text-[15px] leading-[1.4] font-medium text-ink outline-none focus:ring-2 focus:ring-brand/30"
            />
          </>
        ) : (
          <>
            <p className="text-[14px] leading-[17px] font-medium text-muted">{meta}</p>
            <p className="mt-[3px] text-[15px] leading-[1.4] font-medium text-ink">
              {bio}
            </p>
          </>
        )}

        <div className="mt-3 flex items-center gap-4">
          {profile.stats.map((stat) => (
            <p key={stat.label} className="text-[14px]">
              <span className="font-extrabold text-ink">{stat.value}</span>{" "}
              <span className="font-medium text-muted">{stat.label}</span>
            </p>
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-4 pt-[11px]">
        {profile.tabs.map((label, i) => (
          <button
            key={label}
            type="button"
            aria-pressed={tab === i}
            onClick={() => setTab(i)}
            className={`h-[41px] flex-1 rounded-full text-[14px] font-bold transition ${
              tab === i
                ? "bg-ink text-white"
                : "border border-hairline bg-surface text-ink active:scale-95"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mx-4 mt-4 flex items-center gap-3 rounded-[20px] bg-zest py-[11px] pr-4 pl-[38px]">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-extrabold text-ink">
            {profile.channel.title}
          </p>
          <p className="truncate text-[12px] font-medium text-ink/70">
            {profile.channel.subtitle}
          </p>
        </div>
        <PillButton tone="ink" size="sm" onClick={onOpenChats}>
          Open
        </PillButton>
      </div>

      {tab === 0 ? (
        <div className="pt-3">
          <PostCard post={profilePost} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 px-4 pt-4">
          {media.map((tile) => (
            <img
              key={tile.id}
              src={tile.image}
              alt={tile.tag}
              loading="lazy"
              className={`w-full rounded-[18px] object-cover ${
                tile.tall ? "h-[190px]" : "h-[140px]"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
