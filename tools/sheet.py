#!/usr/bin/env python3
"""Render a labelled contact sheet of every crop, for eyeball verification.

Each crop is letterboxed into a fixed cell so crops of wildly different aspect
ratios stay comparable side by side.
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw

IMG_DIR = Path("/home/student/Downloads/banani-ui-export/loops-app/public/img")
OUT = Path("/home/student/Downloads/banani-ui-export/tools/_contact_sheet.png")

CELL_W, CELL_H = 210, 230
IMG_H = 190
COLS = 5
PAD = 8
BG = (28, 28, 30)
LABEL = (235, 235, 235)


def main() -> int:
    files = sorted(IMG_DIR.glob("*.jpg"))
    if not files:
        print("no crops found", file=sys.stderr)
        return 1

    rows = (len(files) + COLS - 1) // COLS
    W = COLS * (CELL_W + PAD) + PAD
    H = rows * (CELL_H + PAD) + PAD
    sheet = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(sheet)

    for i, path in enumerate(files):
        r, c = divmod(i, COLS)
        x = PAD + c * (CELL_W + PAD)
        y = PAD + r * (CELL_H + PAD)

        im = Image.open(path).convert("RGB")
        scale = min(CELL_W / im.width, IMG_H / im.height)
        thumb = im.resize(
            (max(1, int(im.width * scale)), max(1, int(im.height * scale))),
            Image.LANCZOS,
        )
        # centre the thumb inside the cell
        sheet.paste(
            thumb,
            (x + (CELL_W - thumb.width) // 2, y + (IMG_H - thumb.height) // 2),
        )
        draw.text((x + 2, y + IMG_H + 8), path.stem, fill=LABEL)

    sheet.save(OUT)
    print(f"{len(files)} crops -> {OUT} ({W}x{H})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
