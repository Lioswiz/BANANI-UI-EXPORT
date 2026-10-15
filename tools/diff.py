#!/usr/bin/env python3
"""Measure the same features in a mockup and in the app screenshot.

Both are 1125px wide at 3x, so a feature should land on the same pixel in
both. Prints export vs app so drift is obvious.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

SRC = Path("/home/student/Downloads/banani-ui-export")
SHOTS = Path("/tmp/shots")
S = 3.0


def rows_ink(img: Image.Image, box, thresh=70, min_frac=0.06):
    """Per-row fraction of non-background pixels, for finding text bands."""
    px = img.load()
    x0, y0, x1, y1 = box
    x1 = min(x1, img.width)
    y1 = min(y1, img.height)
    out = []
    for y in range(y0, y1):
        n = 0
        for x in range(x0, x1):
            r, g, b = px[x, y]
            if abs(r - 250) + abs(g - 248) + abs(b - 245) > thresh:
                n += 1
        out.append((y, n / (x1 - x0)))
    return out


def bands(img, box, thresh=70, min_frac=0.06, gap=6):
    """Collapse rows_ink into contiguous bands."""
    rs = rows_ink(img, box, thresh, min_frac)
    out, start, last = [], None, None
    for y, f in rs:
        if f >= min_frac:
            if start is None:
                start = y
            last = y
        elif start is not None and y - last > gap:
            out.append((start, last))
            start = None
    if start is not None:
        out.append((start, last))
    return out


def cols_ink(img, box, thresh=70, min_frac=0.04):
    px = img.load()
    x0, y0, x1, y1 = box
    x1 = min(x1, img.width)
    y1 = min(y1, img.height)
    out = []
    for x in range(x0, x1):
        n = 0
        for y in range(y0, y1):
            r, g, b = px[x, y]
            if abs(r - 250) + abs(g - 248) + abs(b - 245) > thresh:
                n += 1
        out.append((x, n / (y1 - y0)))
    return out


def col_bands(img, box, thresh=70, min_frac=0.04, gap=6):
    cs = cols_ink(img, box, thresh, min_frac)
    out, start, last = [], None, None
    for x, f in cs:
        if f >= min_frac:
            if start is None:
                start = x
            last = x
        elif start is not None and x - last > gap:
            out.append((start, last))
            start = None
    if start is not None:
        out.append((start, last))
    return out


def report(label, export_img, app_img, fn):
    e = fn(export_img)
    a = fn(app_img)
    print(f"\n{label}")
    print(f"  export {e}")
    print(f"  app    {a}")


def load(name):
    return Image.open(SHOTS / f"{name}-full.png").convert("RGB")


def mock(name):
    return Image.open(SRC / name).convert("RGB")


# --------------------------------------------------------------- activity
def activity_rows(img):
    """Icon circles are 40pt and sit at x=48..168; find their y bands."""
    return bands(img, (48, 300, 168, 1500), thresh=90, min_frac=0.3)


def activity_title(img):
    """Columns of the first row's title text, to compare wrap width."""
    return col_bands(img, (200, 400, 1125, 470), thresh=90, min_frac=0.02)[-6:]


# ---------------------------------------------------------------- profile
def profile_cover(img):
    """The cover is the only highly-saturated block at the top."""
    px = img.load()
    rows = []
    for y in range(0, 900):
        n = 0
        for x in range(0, 1125, 6):
            r, g, b = px[x, y]
            mx, mn = max(r, g, b), min(r, g, b)
            if mx > 60 and (mx - mn) > 60:
                n += 1
        rows.append((y, n))
    top = next(y for y, n in rows if n > 60)
    bot = max(y for y, n in rows if n > 20)
    return f"cover y {top}..{bot}  ({(bot - top + 1) / S:.1f}pt tall, top {top / S:.1f}pt)"


def profile_ring(img):
    """The story ring around the avatar is pink/purple, unlike the cover."""
    px = img.load()
    ys, xs = [], []
    for y in range(150, 700):
        for x in range(0, 500):
            r, g, b = px[x, y]
            if r > 190 and g < 110 and 70 < b < 170:
                ys.append(y)
                xs.append(x)
    if not xs:
        return "no ring found"
    return (
        f"ring x {min(xs)}..{max(xs)} y {min(ys)}..{max(ys)}  "
        f"size {(max(xs) - min(xs) + 1) / S:.1f}pt  top {min(ys) / S:.1f}pt"
    )


def profile_banner(img):
    """The lime channel banner."""
    px = img.load()
    ys, xs = [], []
    for y in range(300, 1400):
        for x in range(0, 1125):
            r, g, b = px[x, y]
            if r > 200 and g > 225 and b < 130:
                ys.append(y)
                xs.append(x)
    if not xs:
        return "no banner found"
    return (
        f"banner x {min(xs)}..{max(xs)} y {min(ys)}..{max(ys)}  "
        f"h {(max(ys) - min(ys) + 1) / S:.1f}pt  top {min(ys) / S:.1f}pt"
    )


# ------------------------------------------------------------- home feed
def home_banner(img):
    """The dark composer card."""
    px = img.load()
    ys, xs = [], []
    for y in range(500, 1100):
        for x in range(0, 1125, 3):
            r, g, b = px[x, y]
            if r + g + b < 200:
                ys.append(y)
                xs.append(x)
    if not xs:
        return "no banner"
    return (
        f"dark card y {min(ys)}..{max(ys)} h {(max(ys) - min(ys) + 1) / S:.1f}pt  "
        f"x {min(xs)}..{max(xs)}"
    )


def home_avatar(img):
    """Maya's 37pt avatar in the first post card."""
    px = img.load()
    xs, ys = [], []
    for y in range(1100, 1400):
        for x in range(60, 300):
            r, g, b = px[x, y]
            if abs(r - 250) + abs(g - 248) + abs(b - 245) > 90:
                xs.append(x)
                ys.append(y)
    if not xs:
        return "no avatar"
    return f"avatar x {min(xs)}..{max(xs)} y {min(ys)}..{max(ys)} size {(max(xs) - min(xs) + 1) / S:.1f}pt"


JOBS = [
    ("activity rows (icon circles)", "LoopsNotifications.png", "activity", activity_rows),
    ("activity title cols", "LoopsNotifications.png", "activity", activity_title),
    ("profile cover", "LoopsProfile.png", "profile", profile_cover),
    ("profile avatar ring", "LoopsProfile.png", "profile", profile_ring),
    ("profile lime banner", "LoopsProfile.png", "profile", profile_banner),
    ("home dark composer", "LoopsHomeFeed.png", "home", home_banner),
    ("home post avatar", "LoopsHomeFeed.png", "home", home_avatar),
]


def main() -> int:
    for label, mockup, app, fn in JOBS:
        report(label, mock(mockup), load(app), fn)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
