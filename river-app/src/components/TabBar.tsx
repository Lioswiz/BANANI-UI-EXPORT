import {
  ChatIcon,
  CompassIcon,
  HomeIcon,
  PersonIcon,
  PlusIcon,
} from "../lib/icons";

export type TabKey = "home" | "explore" | "chats" | "profile";

const TABS: { key: TabKey; label: string; Icon: typeof HomeIcon }[] = [
  { key: "home", label: "Home", Icon: HomeIcon },
  { key: "explore", label: "Explore", Icon: CompassIcon },
  { key: "chats", label: "Chats", Icon: ChatIcon },
  { key: "profile", label: "Profile", Icon: PersonIcon },
];

/**
 * Bottom bar: home / explore / [+ composer] / chats / profile. The active tab
 * is marked with a pink dot underneath, as in the export. Activity has no tab
 * and is reached from the header heart.
 */
export function TabBar({
  active,
  onChange,
  onCompose,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  onCompose?: () => void;
}) {
  const left = TABS.slice(0, 2);
  const right = TABS.slice(2);

  return (
    <nav className="relative shrink-0 border-t border-hairline bg-cream lg:hidden">
      <div className="flex items-center justify-between px-6 pt-3 pb-5">
        {left.map((t) => (
          <TabButton key={t.key} tab={t} active={active === t.key} onChange={onChange} />
        ))}

        <button
          type="button"
          aria-label="New Chirp"
          onClick={onCompose}
          className="grid size-9 place-items-center rounded-[13px] bg-ink text-white transition active:scale-95"
        >
          <PlusIcon size={20} />
        </button>

        {right.map((t) => (
          <TabButton key={t.key} tab={t} active={active === t.key} onChange={onChange} />
        ))}
      </div>
    </nav>
  );
}

function TabButton({
  tab,
  active,
  onChange,
}: {
  tab: (typeof TABS)[number];
  active: boolean;
  onChange: (tab: TabKey) => void;
}) {
  const { Icon } = tab;
  return (
    <button
      type="button"
      aria-label={tab.label}
      aria-current={active ? "page" : undefined}
      onClick={() => onChange(tab.key)}
      className="relative grid size-8 place-items-center transition active:scale-95"
    >
      <Icon
        size={25}
        strokeWidth={active ? 2.1 : 1.8}
        className={active ? "text-ink" : "text-faint"}
      />
      {active && (
        <span className="absolute -bottom-[7px] size-[5px] rounded-full bg-brand" />
      )}
    </button>
  );
}
