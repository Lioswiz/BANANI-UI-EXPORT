#!/usr/bin/env python3
"""Extract the dominant colours of each mockup, to derive the design tokens.

Quantising to a small adaptive palette and ranking by pixel share surfaces the
cream page background, white cards, near-black pills, and the accent colours
without having to guess at sample coordinates.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

SRC = Path("/home/student/Downloads/banani-ui-export")

# Colours that only ever appear in small areas (accents, badges) get their own
# pass with a finer palette, since a 16-colour quantisation averages them away.
FINE_COLORS = 32


def report(path: Path, colors: int) -> None:
    im = Image.open(path).convert("RGB")
    im.thumbnail((400, 4000))
    q = im.quantize(colors=colors, method=Image.MEDIANCUT)
    palette = q.getpalette()
    entries = sorted(q.getcolors(), reverse=True)
    total = sum(n for n, _ in entries)

    print(f"\n{path.name}  ({im.width}x{im.height}, {colors} colours)")
    for n, idx in entries[:14]:
        r, g, b = palette[idx * 3 : idx * 3 + 3]
        print(f"    #{r:02X}{g:02X}{b:02X}   {n / total * 100:5.2f}%")


def main() -> int:
    for f in sorted(SRC.glob("Loops*.png")):
        report(f, FINE_COLORS)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
