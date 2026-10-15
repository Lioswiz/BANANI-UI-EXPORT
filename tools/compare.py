#!/usr/bin/env python3
"""Stack a mockup against a screenshot of the built app for eyeball diffing.

Both are 1125px wide (the export is a 375pt screen rendered at 3x, and the
screenshots are taken at deviceScaleFactor 3), so they line up column-for-column.
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw

SRC = Path("/home/student/Downloads/banani-ui-export")
SHOTS = Path("/tmp/shots")
DEST = Path("/tmp/shots/_compare")

# screen name -> mockup file
PAIRS = {
    "home": "LoopsHomeFeed.png",
    "explore": "LoopsExplore.png",
    "chats": "LoopsChats.png",
    "profile": "LoopsProfile.png",
    "activity": "LoopsNotifications.png",
    "conversation": "LoopsConversation.png",
}

WIDTH = 1125
LABEL_H = 60


def main(argv: list[str]) -> int:
    DEST.mkdir(parents=True, exist_ok=True)
    names = argv[1:] or list(PAIRS)

    for name in names:
        mock = Image.open(SRC / PAIRS[name]).convert("RGB")
        shot = Image.open(SHOTS / f"{name}-full.png").convert("RGB")

        h = max(mock.height, shot.height)
        canvas = Image.new("RGB", (WIDTH * 2 + 40, h + LABEL_H), (30, 28, 34))
        canvas.paste(mock, (0, LABEL_H))
        canvas.paste(shot, (WIDTH + 40, LABEL_H))

        d = ImageDraw.Draw(canvas)
        d.text((16, 20), f"{PAIRS[name]}  (export)", fill=(255, 255, 255))
        d.text((WIDTH + 56, 20), f"{name}-full.png  (app)", fill=(255, 255, 255))
        # a ruler down the seam so drift is measurable
        for y in range(LABEL_H, h + LABEL_H, 300):
            d.line([(WIDTH + 20, y), (WIDTH + 38, y)], fill=(255, 80, 80), width=3)

        canvas.save(DEST / f"{name}-full.png")
        print(f"{name:14s} export {mock.width}x{mock.height}   app {shot.width}x{shot.height}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
