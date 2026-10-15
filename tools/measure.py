#!/usr/bin/env python3
"""Measure element bounding boxes in the mockups.

Reads coordinates off the real pixels instead of eyeballing a downscaled
render. Mockups are 1125px wide = 375pt, so divide every result by 3 to get
CSS pixels for a 375px-wide phone frame.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

SRC = Path("/home/student/Downloads/banani-ui-export")
SCALE = 3.0


def is_dark(r: int, g: int, b: int) -> bool:
    return r + g + b < 220


def is_pink(r: int, g: int, b: int) -> bool:
    return r > 190 and g < 110 and 70 < b < 170


def is_sunken(r: int, g: int, b: int) -> bool:
    return abs(r - 241) < 9 and abs(g - 237) < 9 and abs(b - 230) < 9


def bbox(img: Image.Image, box: tuple[int, int, int, int], pred) -> tuple[int, int, int, int] | None:
    x0, y0, x1, y1 = box
    px = img.load()
    minx, miny, maxx, maxy = 10**9, 10**9, -1, -1
    for y in range(y0, y1):
        for x in range(x0, x1):
            if pred(*px[x, y]):
                if x < minx:
                    minx = x
                if y < miny:
                    miny = y
                if x > maxx:
                    maxx = x
                if y > maxy:
                    maxy = y
    if maxx < 0:
        return None
    return minx, miny, maxx, maxy


def show(label: str, got: tuple[int, int, int, int] | None) -> None:
    if got is None:
        print(f"  {label:26s} (none)")
        return
    x0, y0, x1, y1 = got
    w, h = x1 - x0 + 1, y1 - y0 + 1
    print(
        f"  {label:26s} px ({x0:4d},{y0:4d})-({x1:4d},{y1:4d})  "
        f"{w:4d}x{h:<4d} -> {w / SCALE:6.1f} x {h / SCALE:5.1f} pt"
    )


# label, file, search box, predicate
JOBS: list[tuple[str, str, tuple[int, int, int, int], str]] = [
    ("logo mark", "LoopsChats.png", (0, 40, 175, 220), "dark"),
    ("title 'chats'", "LoopsChats.png", (165, 40, 640, 240), "dark"),
    ("header heart button", "LoopsChats.png", (860, 40, 1100, 220), "dark"),
    ("search field", "LoopsChats.png", (20, 180, 1100, 360), "sunken"),
    ("'All' chip", "LoopsChats.png", (20, 350, 320, 480), "dark"),
    ("'Join' button", "LoopsChats.png", (780, 850, 1100, 1020), "pink"),
    ("'beta' chip", "LoopsChats.png", (300, 60, 560, 220), "zest"),
    ("chat avatar (known 140)", "LoopsChats.png", (20, 1230, 220, 1420), "ink"),
    ("composer dark card", "LoopsHomeFeed.png", (20, 730, 1100, 910), "dark"),
    ("'Post' button", "LoopsHomeFeed.png", (780, 740, 1100, 900), "pink"),
    ("tabbar '+' button", "LoopsHomeFeed.png", (400, 3140, 760, 3330), "dark"),
    ("activity icon (pink)", "LoopsNotifications.png", (20, 380, 240, 560), "pink"),
    ("activity 'View' pill", "LoopsNotifications.png", (860, 380, 1100, 540), "ink"),
    ("activity icon (blue)", "LoopsNotifications.png", (20, 780, 240, 960), "blue"),
]


def pred_for(name: str):
    if name == "dark":
        return is_dark
    if name == "pink":
        return is_pink
    if name == "sunken":
        return is_sunken
    if name == "zest":
        return lambda r, g, b: r > 200 and g > 225 and b < 120
    if name == "ink":
        return lambda r, g, b: abs(r - 250) + abs(g - 248) + abs(b - 245) > 100
    if name == "blue":
        return lambda r, g, b: b > 200 and r < 110 and g > 120
    raise ValueError(name)


def main() -> int:
    cache: dict[str, Image.Image] = {}
    current = None
    for label, fname, box, pred_name in JOBS:
        if fname not in cache:
            cache[fname] = Image.open(SRC / fname).convert("RGB")
        if fname != current:
            print(f"\n{fname}")
            current = fname
        show(label, bbox(cache[fname], box, pred_for(pred_name)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
