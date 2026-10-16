import { useEffect, useRef, useState, type ReactNode } from "react";

import { PostCard, Verified } from "../components/PostCard";
import { PillButton } from "../components/primitives";
import {
  BackIcon,
  LogoutIcon,
  PencilIcon,
  SettingsIcon,
  ShareIcon,
} from "../lib/icons";
import { profile, profilePost, tiles } from "../lib/data";
import { actions, copy, useApp } from "../lib/store";

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
  const [menu, setMenu] = useState(false);
  const [draft, setDraft] = useState({ name, meta, bio });
  const menuRef = useRef<HTMLDivElement>(null);

  // a popover has to close the ways people expect: a click anywhere else, or Esc
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

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
        {/* Sign out lives up here beside the avatar rather than down in the
            name row, and the gear beside it holds the two profile actions that
            used to sit in that row as their own buttons. */}
        <div ref={menuRef} className="absolute top-5 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={actions.signOut}
            className="flex h-9 items-center gap-[6px] rounded-full bg-surface/95 px-[13px] text-[13px] font-bold text-ink transition active:scale-95"
          >
            <LogoutIcon size={16} />
            Log out
          </button>
          <button
            type="button"
            aria-label="Settings"
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
            className="grid size-[36px] place-items-center rounded-full bg-surface/95 text-ink transition active:scale-95"
          >
            <SettingsIcon size={18} />
          </button>

          {menu && (
            <div className="absolute top-[44px] right-0 w-[196px] rounded-[16px] border border-hairline bg-surface p-1 shadow-[0_12px_32px_-10px_rgba(20,18,25,0.3)]">
              <MenuRow
                icon={<PencilIcon size={17} />}
                onClick={() => {
                  setMenu(false);
                  startEditing();
                }}
              >
                Edit profile
              </MenuRow>
              <MenuRow
                icon={<ShareIcon size={17} />}
                onClick={() => {
                  setMenu(false);
                  copy(
                    `river.app/${profile.person.handle.replace("@", "")}`,
                    "Profile link copied",
                  );
                }}
              >
                Share profile
              </MenuRow>
            </div>
          )}
        </div>

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
        {/* The export's 30pt row height is held even with the buttons gone, so
            everything under the name keeps the place it had. */}
        <div className="flex min-h-[30px] items-center gap-3">
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
          {/* Share and Edit are gone from this row — both now live behind the
              settings gear. Only Save and Cancel appear here, and only while
              the profile is actually being edited. */}
          {editing && (
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="h-[30px] shrink-0 rounded-full border border-hairline px-[13px] text-[13px] font-bold text-ink transition active:scale-95"
              >
                Cancel
              </button>
              <PillButton tone="ink" size="sm" onClick={save}>
                Save
              </PillButton>
            </div>
          )}
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

/** One row of the settings popover. */
function MenuRow({
  icon,
  onClick,
  children,
}: {
  icon: ReactNode;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-[10px] rounded-[11px] px-3 py-[9px] text-left text-[14px] font-bold text-ink transition hover:bg-sunken active:bg-sunken"
    >
      <span className="text-muted">{icon}</span>
      {children}
    </button>
  );
}
