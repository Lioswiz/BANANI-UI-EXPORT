import { useState } from "react";

import { AppHeader } from "../components/AppHeader";
import { Chip, PillButton, Rail, SearchField } from "../components/primitives";
import { CloseIcon, TrendUpIcon } from "../lib/icons";
import { exploreFilters, tiles, type Tile } from "../lib/data";
import { actions, copy, useApp } from "../lib/store";

/**
 * The export's masonry is two fixed columns, each holding one tall tile
 * (503x923) and two short ones (501x449) — the tall tile is exactly two short
 * rows plus the 8.3pt gap, so the columns balance by construction. CSS grid
 * auto-placement can't reproduce it (it would put both tall tiles in column
 * one), hence two flex columns keyed off `tile.col`.
 */
const ASPECT = {
  short: "501 / 449",
  tall: "503 / 923",
} as const;

export function Explore({
  onActivity,
  onMessages,
}: {
  onActivity: () => void;
  onMessages: () => void;
}) {
  const { joined } = useApp();
  const [filter, setFilter] = useState(exploreFilters[0]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Tile | null>(null);

  const q = query.trim().toLowerCase();
  const visible = q ? tiles.filter((t) => t.tag.toLowerCase().includes(q)) : tiles;

  return (
    <>
      <AppHeader title="explore" onActivity={onActivity} onMessages={onMessages} />

      <div className="px-4">
        <SearchField
          placeholder="Search tags, sounds, places"
          value={query}
          onChange={setQuery}
        />
      </div>

      <Rail className="px-4 pt-3 pb-3">
        {exploreFilters.map((f) => (
          <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
      </Rail>

      <div className="mx-4 mb-3 flex items-center gap-3 rounded-[20px] bg-ink px-4 py-[13px]">
        <TrendUpIcon size={22} className="shrink-0 text-zest" />
        <p className="min-w-0 flex-1 text-[14px] leading-[1.3] font-bold text-white">
          #rooftopset · 48k Chirps in the last hour
        </p>
        <PillButton
          tone="zest"
          onClick={() => actions.toggleJoin("rooftopset")}
        >
          {joined.rooftopset ? "Joined" : "Join"}
        </PillButton>
      </div>

      <div className="flex gap-2 px-4">
        {[0, 1].map((col) => (
          <div key={col} className="flex flex-1 flex-col gap-2">
            {visible
              .filter((t) => t.col === col)
              .map((tile) => (
                <TileFigure key={tile.id} tile={tile} onOpen={() => setOpen(tile)} />
              ))}
          </div>
        ))}
      </div>

      {q && visible.length === 0 && (
        <p className="px-4 py-10 text-center text-[13px] leading-[1.5] font-medium text-muted">
          No tags match “{query.trim()}”.
        </p>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.tag}
          className="fixed inset-0 z-50 flex flex-col bg-ink/92 p-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 pt-2">
            <p className="min-w-0 flex-1 truncate text-[17px] font-extrabold text-white">
              {open.tag}
            </p>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(null)}
              className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
            >
              <CloseIcon size={19} />
            </button>
          </div>

          <div className="grid min-h-0 flex-1 place-items-center py-4">
            <img
              src={open.image}
              alt={open.tag}
              className="max-h-full w-full max-w-[560px] rounded-[20px] object-contain"
            />
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              type="button"
              onClick={() => copy(`river.app/tag/${open.tag.replace("#", "")}`, "Tag link copied")}
              className="h-11 flex-1 rounded-full bg-white/10 text-[14px] font-bold text-white transition hover:bg-white/20 active:scale-[0.98]"
            >
              Share tag
            </button>
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="h-11 flex-1 rounded-full bg-white text-[14px] font-bold text-ink transition active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function TileFigure({ tile, onOpen }: { tile: Tile; onOpen: () => void }) {
  return (
    <button
      type="button"
      aria-label={tile.tag}
      onClick={onOpen}
      className="relative w-full overflow-hidden rounded-[18px] bg-sunken transition active:scale-[0.98]"
      style={{ aspectRatio: tile.tall ? ASPECT.tall : ASPECT.short }}
    >
      <img
        src={tile.image}
        alt={tile.tag}
        loading="lazy"
        className="size-full object-cover"
      />
      {/* the export bakes its tags into the tile art; only draw a chip for
          tiles that don't already carry one */}
      {!tile.tagged && (
        <span className="absolute bottom-2.5 left-2.5 rounded-full bg-ink/70 px-[10px] py-[5px] text-[12px] font-bold text-white backdrop-blur-sm">
          {tile.tag}
        </span>
      )}
    </button>
  );
}
