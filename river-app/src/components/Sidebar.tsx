import {
  BoltIcon,
  ChatIcon,
  CompassIcon,
  HeartIcon,
  HomeIcon,
  PersonIcon,
} from "../lib/icons";
import { actions } from "../lib/store";
import { profile } from "../lib/data";
import type { TabKey } from "./TabBar";
import { BetaChip, LogoMark } from "./primitives";

const NAV: { key: TabKey; label: string; Icon: typeof HomeIcon }[] = [
  { key: "home", label: "Home", Icon: HomeIcon },
  { key: "explore", label: "Explore", Icon: CompassIcon },
  { key: "chats", label: "Chats", Icon: ChatIcon },
  { key: "profile", label: "Profile", Icon: PersonIcon },
];

/**
 * Wide-screen navigation. Below the `lg` breakpoint the tab bar does this job
 * instead; this only ever renders alongside it, never both at once.
 */
export function Sidebar({
  active,
  onNavigate,
  onActivity,
  unread,
}: {
  active: TabKey;
  onNavigate: (tab: TabKey) => void;
  onActivity: () => void;
  unread: number;
}) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-hairline px-4 py-6 lg:flex xl:w-[264px]">
      <div className="flex items-center gap-2.5 px-2">
        <LogoMark />
        <span className="text-[21px] leading-none font-extrabold tracking-[-0.02em]">
          river
        </span>
        <BetaChip />
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {NAV.map(({ key, label, Icon }) => (
          <SidebarItem
            key={key}
            label={label}
            Icon={Icon}
            active={active === key}
            onClick={() => onNavigate(key)}
          />
        ))}
        <SidebarItem
          label="Activity"
          Icon={HeartIcon}
          active={false}
          badge={unread}
          onClick={onActivity}
        />
      </nav>

      <button
        type="button"
        onClick={() => {
          onNavigate("home");
          actions.requestCompose();
        }}
        className="mt-6 flex h-11 items-center justify-center gap-2 rounded-full bg-ink text-[14px] font-bold text-white transition hover:brightness-110 active:scale-[0.98]"
      >
        <BoltIcon size={17} className="text-zest" />
        New Chirp
      </button>

      <div className="mt-auto flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-sunken">
        <img
          src={profile.person.avatar}
          alt={profile.person.name}
          className="size-9 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-[14px] leading-tight font-extrabold">
            {profile.person.name}
          </p>
          <p className="truncate text-[12px] font-medium text-muted">
            {profile.person.handle}
          </p>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({
  label,
  Icon,
  active,
  badge,
  onClick,
}: {
  label: string;
  Icon: typeof HomeIcon;
  active: boolean;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex h-12 items-center gap-3.5 rounded-2xl px-3 text-left transition ${
        active ? "bg-sunken" : "hover:bg-sunken/60"
      }`}
    >
      <Icon
        size={23}
        strokeWidth={active ? 2.2 : 1.8}
        className={active ? "text-ink" : "text-muted"}
      />
      <span
        className={`text-[15px] ${active ? "font-extrabold" : "font-semibold text-ink/80"}`}
      >
        {label}
      </span>
      {badge ? (
        <span className="ml-auto grid size-[20px] place-items-center rounded-full bg-brand text-[11px] font-bold text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
}
