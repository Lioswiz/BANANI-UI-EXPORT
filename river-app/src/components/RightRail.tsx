import { ChevronRightIcon, MegaphoneIcon, TrendUpIcon } from "../lib/icons";
import { channels, chatRows, tiles } from "../lib/data";
import { actions, useApp } from "../lib/store";
import { Avatar, PillButton } from "./primitives";

/**
 * Right-hand rail for very wide screens (xl and up). The export has no
 * equivalent — it's a 375pt phone screen — so this reuses the export's own
 * vocabulary (sunken cards, hairlines, the lime trend mark, brand pills) rather
 * than inventing a new style.
 */
export function RightRail({ onOpenChannel }: { onOpenChannel: () => void }) {
  const { joined, replies } = useApp();

  const trends = tiles.slice(0, 4).map((tile, i) => ({
    tag: tile.tag,
    count: [48, 31, 22, 17][i],
    image: tile.image,
  }));

  const suggestions = chatRows.slice(0, 3);

  return (
    <aside className="hidden w-[320px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-hairline px-4 py-6 xl:flex">
      <section className="rounded-[20px] bg-sunken p-4">
        <h2 className="flex items-center gap-2 text-[15px] leading-none font-extrabold tracking-[-0.01em]">
          <TrendUpIcon size={18} className="text-brand" />
          Trending now
        </h2>
        <ul className="mt-3 flex flex-col gap-3">
          {trends.map((t) => (
            <li key={t.tag} className="flex items-center gap-3">
              <img
                src={t.image}
                alt=""
                className="size-10 shrink-0 rounded-[12px] object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] leading-tight font-bold">{t.tag}</p>
                <p className="text-[12px] font-medium text-muted">
                  {t.count}k Chirps
                </p>
              </div>
              <ChevronRightIcon size={16} className="shrink-0 text-faint" />
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[20px] border border-hairline p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] leading-none font-extrabold tracking-[-0.01em]">
            Channels
          </h2>
          <button
            type="button"
            onClick={onOpenChannel}
            className="text-[13px] font-bold text-brand"
          >
            See all
          </button>
        </div>
        <ul className="mt-3 flex flex-col gap-3">
          {channels.map((c) => (
            <li key={c.id} className="flex items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-[13px] bg-ink text-white">
                <MegaphoneIcon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] leading-tight font-bold">{c.name}</p>
                <p className="truncate text-[12px] font-medium text-muted">
                  {c.members}
                </p>
              </div>
              <PillButton
                size="sm"
                tone={joined[c.id] ? "ink" : "brand"}
                onClick={() => actions.toggleJoin(c.id)}
              >
                {joined[c.id] ? "Joined" : "Join"}
              </PillButton>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[20px] border border-hairline p-4">
        <h2 className="text-[15px] leading-none font-extrabold tracking-[-0.01em]">
          Replies to you
        </h2>
        {Object.keys(replies).length === 0 ? (
          <p className="mt-2 text-[13px] leading-[1.45] font-medium text-muted">
            When someone replies to a Chirp you'll see it here.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {Object.entries(replies)
              .flatMap(([postId, bodies]) =>
                bodies.map((body, i) => ({ id: `${postId}-${i}`, body })),
              )
              .slice(-3)
              .map((r) => (
                <li
                  key={r.id}
                  className="rounded-[14px] bg-sunken px-3 py-2 text-[13px] leading-[1.4] font-medium"
                >
                  {r.body}
                </li>
              ))}
          </ul>
        )}
      </section>

      <section className="rounded-[20px] border border-hairline p-4">
        <h2 className="text-[15px] leading-none font-extrabold tracking-[-0.01em]">
          Who to follow
        </h2>
        <ul className="mt-3 flex flex-col gap-3">
          {suggestions.map((row) => (
            <li key={row.id} className="flex items-center gap-3">
              <Avatar
                src={row.person.avatar}
                alt={row.person.name}
                size={40}
                online={row.online}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] leading-tight font-bold">
                  {row.person.name}
                </p>
                <p className="truncate text-[12px] font-medium text-muted">
                  {row.person.handle}
                </p>
              </div>
              <FollowButton handle={row.person.handle} name={row.person.name} />
            </li>
          ))}
        </ul>
      </section>

      <p className="px-1 text-[12px] leading-[1.6] font-medium text-faint">
        river · a design replica built from a UI export
      </p>
    </aside>
  );
}

function FollowButton({ handle, name }: { handle: string; name: string }) {
  const { following } = useApp();
  const isFollowing = !!following[handle];
  return (
    <PillButton
      size="sm"
      tone={isFollowing ? "ink" : "brand"}
      onClick={() => actions.toggleFollow(handle, name)}
    >
      {isFollowing ? "Following" : "Follow"}
    </PillButton>
  );
}
