import { PostCard, Verified } from "../components/PostCard";
import { PillButton } from "../components/primitives";
import { BackIcon, SettingsIcon } from "../lib/icons";
import { profile, profilePost } from "../lib/data";

/**
 * Cover and avatar geometry is taken straight from the export: the cover is a
 * full-bleed 375x211pt block, and the avatar ring sits 168.3pt down at 74pt
 * across with a 5.5pt gradient ring, so it straddles the cover's bottom edge.
 * The ring overflows the cover block, so the details below clear it with a
 * 44pt top pad rather than flowing straight off the image.
 */
export function Profile({ onBack }: { onBack: () => void }) {
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
          className="absolute top-5 right-4 grid size-[36px] place-items-center rounded-full bg-surface/95 text-ink transition active:scale-95"
        >
          <SettingsIcon size={18} />
        </button>

        <div className="ring-story absolute top-[168.3px] left-4 size-[74px] rounded-full p-[5.5px]">
          <img
            src={profile.person.avatar}
            alt={profile.person.name}
            className="size-full rounded-full object-cover"
          />
        </div>
      </div>

      <div className="px-4 pt-[44px]">
        <div className="flex items-center gap-3">
          <h1 className="flex items-center gap-[6px] text-[20px] leading-none font-extrabold tracking-[-0.02em]">
            {profile.person.name}
            <Verified />
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <PillButton tone="ink" className="!bg-surface !text-ink border border-hairline" size="sm">
              Share
            </PillButton>
            <PillButton tone="ink" size="sm">
              Edit
            </PillButton>
          </div>
        </div>

        <p className="text-[14px] leading-[17px] font-medium text-muted">{profile.meta}</p>
        <p className="mt-[3px] text-[15px] leading-[1.4] font-medium text-ink">
          {profile.bio}
        </p>

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
        {profile.tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            className={`h-[41px] flex-1 rounded-full text-[14px] font-bold transition ${
              i === 0
                ? "bg-ink text-white"
                : "border border-hairline bg-surface text-ink active:scale-95"
            }`}
          >
            {tab}
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
        <PillButton tone="ink" size="sm">
          Open
        </PillButton>
      </div>

      <div className="pt-3">
        <PostCard post={profilePost} />
      </div>
    </>
  );
}
