#!/usr/bin/env python3
"""Locate photo regions (avatars, post media) inside the mockups.

Two detectors, because the two questions are different:

  sat  - per-row fraction of *saturated* pixels. Finds the colourful core of a
         photo. Good for wide media bands.
  ink  - per-row fraction of pixels that are not the cream page background or
         white card. Finds the true bounds of an image *element* (including a
         photo's white polaroid frame) and of avatars, since text rows only
         cover a small fraction of a band while photo rows cover most of it.

Pure-Pillow so it runs on the stock system Python.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

SRC = Path("/home/student/Downloads/banani-ui-export")

SAT_MIN = 25  # max(rgb) - min(rgb) above this counts as "coloured"
# distance from the cream page background (251, 249, 245)
CREAM = (251, 249, 245)
INK_MIN = 100

MIN_RUN = 40  # ignore slivers

# label, file, x0, x1, y0, y1, axis, mode, frac
REGIONS: list[tuple[str, str, int, int, int, int, str, str, float]] = [
    # --- vertical profiles: locate avatar / media bands (axis="y") --------
    ("feed post avatars", "LoopsHomeFeed.png", 80, 220, 950, 2500, "y", "ink", 0.30),
    ("chat avatars", "LoopsChats.png", 40, 175, 1200, 2320, "y", "ink", 0.30),
    ("conv header avatar", "LoopsConversation.png", 180, 330, 40, 220, "y", "ink", 0.30),
    ("conv msg avatars", "LoopsConversation.png", 0, 190, 880, 2900, "y", "ink", 0.10),
    ("feed photobooth", "LoopsHomeFeed.png", 240, 1070, 1150, 1800, "y", "ink", 0.60),
    ("feed rooftop", "LoopsHomeFeed.png", 240, 1070, 2480, 3220, "y", "ink", 0.60),
    ("profile market", "LoopsProfile.png", 255, 1020, 1750, 2350, "y", "ink", 0.60),
    ("profile cover", "LoopsProfile.png", 0, 1125, 0, 700, "y", "ink", 0.60),
    ("conv band photo", "LoopsConversation.png", 320, 1030, 1850, 2500, "y", "ink", 0.60),
    ("conv shared loop", "LoopsConversation.png", 55, 1070, 200, 900, "y", "ink", 0.60),
    # --- horizontal profiles: locate exact left/right edges (axis="x") ----
    # y ranges come from the vertical pass above.
    ("story avatars x", "LoopsHomeFeed.png", 0, 1125, 300, 370, "x", "ink", 0.30),
    ("feed avatar x", "LoopsHomeFeed.png", 0, 400, 990, 1090, "x", "ink", 0.30),
    ("photobooth x", "LoopsHomeFeed.png", 0, 1125, 1300, 1650, "x", "ink", 0.60),
    ("rooftop x", "LoopsHomeFeed.png", 0, 1125, 2620, 3020, "x", "ink", 0.60),
    ("chat avatar x", "LoopsChats.png", 0, 400, 1280, 1370, "x", "ink", 0.30),
    ("profile market x", "LoopsProfile.png", 0, 1125, 1830, 2220, "x", "ink", 0.60),
    ("conv header avatar x", "LoopsConversation.png", 0, 500, 80, 160, "x", "ink", 0.30),
    ("conv msg avatar x", "LoopsConversation.png", 0, 300, 960, 1030, "x", "ink", 0.30),
    ("conv band photo x", "LoopsConversation.png", 0, 1125, 2000, 2400, "x", "ink", 0.60),
    ("conv shared loop x", "LoopsConversation.png", 0, 1125, 300, 700, "x", "ink", 0.60),
    # --- last unknowns ----------------------------------------------------
    ("story avatars y", "LoopsHomeFeed.png", 60, 240, 180, 560, "y", "ink", 0.30),
    ("profile avatar y", "LoopsProfile.png", 60, 250, 560, 900, "y", "ink", 0.30),
    ("profile avatar x", "LoopsProfile.png", 0, 500, 640, 750, "x", "ink", 0.30),
    ("explore cols", "LoopsExplore.png", 0, 1125, 800, 1000, "x", "ink", 0.50),
    ("explore L col y", "LoopsExplore.png", 60, 540, 600, 2750, "y", "ink", 0.50),
    ("explore R col y", "LoopsExplore.png", 600, 1070, 600, 2750, "y", "ink", 0.50),
    # profile avatar: the gradient ring is saturated, the photo is not, so a
    # sat pass gives the ring's outer bounds and an ink pass the photo's.
    ("prof avatar ring x", "LoopsProfile.png", 0, 420, 560, 700, "x", "sat", 0.10),
    ("prof avatar ring y", "LoopsProfile.png", 60, 280, 490, 780, "y", "sat", 0.10),
    ("prof avatar ink x", "LoopsProfile.png", 0, 420, 560, 700, "x", "ink", 0.10),
    ("prof avatar ink y", "LoopsProfile.png", 60, 280, 490, 780, "y", "ink", 0.10),
    # below the cover (y>640) only the ring arcs and the photo exist, so a sat
    # pass splits into left-arc / gap / right-arc
    ("prof ring x low", "LoopsProfile.png", 0, 420, 645, 730, "x", "sat", 0.10),
    ("prof ink x low", "LoopsProfile.png", 0, 420, 645, 730, "x", "ink", 0.10),
]


def _hit(r: int, g: int, b: int, mode: str) -> bool:
    if mode == "sat":
        mx = r if r > g else g
        if b > mx:
            mx = b
        mn = r if r < g else g
        if b < mn:
            mn = b
        return mx - mn > SAT_MIN
    cr, cg, cb = CREAM
    return abs(r - cr) + abs(g - cg) + abs(b - cb) > INK_MIN


def line_scores(band: Image.Image, mode: str, axis: str) -> list[float]:
    """Fraction of pixels that register, per row (axis="y") or column ("x")."""
    w, h = band.size
    raw = band.tobytes()
    stride = w * 3

    if axis == "y":
        return [
            sum(
                1
                for i in range(y * stride, (y + 1) * stride, 3)
                if _hit(raw[i], raw[i + 1], raw[i + 2], mode)
            )
            / w
            for y in range(h)
        ]

    return [
        sum(
            1
            for y in range(h)
            if _hit(raw[y * stride + x * 3], raw[y * stride + x * 3 + 1],
                    raw[y * stride + x * 3 + 2], mode)
        )
        / h
        for x in range(w)
    ]


def find_runs(mask: list[bool]) -> list[tuple[int, int]]:
    """Contiguous True runs as inclusive (start, end) index pairs."""
    runs: list[tuple[int, int]] = []
    start: int | None = None
    for i, on in enumerate(mask):
        if on and start is None:
            start = i
        elif not on and start is not None:
            runs.append((start, i - 1))
            start = None
    if start is not None:
        runs.append((start, len(mask) - 1))
    return runs


def main() -> int:
    cache: dict[str, Image.Image] = {}

    for label, fname, x0, x1, y0, y1, axis, mode, frac_thr in REGIONS:
        if fname not in cache:
            cache[fname] = Image.open(SRC / fname).convert("RGB")
        band = cache[fname].crop((x0, y0, x1, y1))
        scores = line_scores(band, mode, axis)
        origin = x0 if axis == "x" else y0
        runs = [
            (a, b)
            for a, b in find_runs([s > frac_thr for s in scores])
            if b - a + 1 >= MIN_RUN
        ]

        print(f"\n{label}  [{fname} x{x0}-{x1} y{y0}-{y1}] {mode} axis={axis}")
        if not runs:
            print("    (nothing detected)")
        for a, b in runs:
            lo, hi = origin + a, origin + b
            print(
                f"    {axis} {lo:5d} .. {hi:5d}   len={hi - lo + 1:4d}   "
                f"centre={axis}{(lo + hi) // 2:5d}"
            )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
