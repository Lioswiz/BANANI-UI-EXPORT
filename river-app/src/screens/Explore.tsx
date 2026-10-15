import { useState } from "react";

import { AppHeader } from "../components/AppHeader";
import { Chip, PillButton, Rail, SearchField } from "../components/primitives";
import { TrendUpIcon } from "../lib/icons";
import { exploreFilters, tiles, type Tile } from "../lib/data";

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
  const [filter, setFilter] = useState(exploreFilters[0]);

  return (
    <>
      <AppHeader title="explore" onActivity={onActivity} onMessages={onMessages} />

      <div className="px-4">
        <SearchField placeholder="Search tags, sounds, places" />
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
        <PillButton tone="zest">Join</PillButton>
      </div>

      <div className="flex gap-2 px-4">
        {[0, 1].map((col) => (
          <div key={col} className="flex flex-1 flex-col gap-2">
            {tiles
              .filter((t) => t.col === col)
              .map((tile) => (
                <TileFigure key={tile.id} tile={tile} />
              ))}
          </div>
        ))}
      </div>
    </>
  );
}

function TileFigure({ tile }: { tile: Tile }) {
  return (
    <figure
      className="relative w-full overflow-hidden rounded-[18px] bg-sunken"
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
        <figcaption className="absolute bottom-2.5 left-2.5 rounded-full bg-ink/70 px-[10px] py-[5px] text-[12px] font-bold text-white backdrop-blur-sm">
          {tile.tag}
        </figcaption>
      )}
    </figure>
  );
}
