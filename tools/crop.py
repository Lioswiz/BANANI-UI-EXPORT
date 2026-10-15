#!/usr/bin/env python3
"""Crop the photo regions out of the Loops UI mockups.

Source PNGs live in the export directory; crops are written into the app's
public/img folder as JPEGs.

Every rectangle below was measured with tools/detect.py rather than eyeballed.
All mockups are 1125px wide (a 3x render of a 375pt phone screen), so these
coordinates are 3x points.

Three deliberate decisions:

  * Avatar crops come from the Chats/Profile/Conversation screens rather than
    the home-feed story row. The story row bakes "LIVE" pills over its avatars,
    which would collide with the ring and badge the app draws in CSS.
  * Four avatars bake in a green presence dot at the bottom-right. Those are
    repaired by mirroring the bottom-left corner over it (see repair_dot), so
    the app can own presence state instead of inheriting it.
  * Explore tiles are cropped whole, overlays included. The baked-in #tags and
    comment glyphs are rendered at 3x and scale with the tile, so re-drawing
    them in HTML would only produce ghosting. Tile renders its own tag chip
    only for tiles that don't already have one.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

SRC = Path("/home/student/Downloads/banani-ui-export")
DEST = SRC / "river-app" / "public" / "img"

# name -> (source png, (x0, y0, x1, y1))
CROPS: dict[str, tuple[str, tuple[int, int, int, int]]] = {
    # ---- feed post header avatars ----------------------------------------
    "avatar-maya": ("LoopsHomeFeed.png", (90, 982, 202, 1094)),
    "avatar-dario-sm": ("LoopsHomeFeed.png", (90, 1881, 202, 1993)),
    "avatar-kai-sm": ("LoopsHomeFeed.png", (90, 2331, 202, 2443)),
    # ---- feed post media (aligns with the text column, x243-1037) --------
    "post-photobooth": ("LoopsHomeFeed.png", (243, 1274, 1037, 1697)),
    "post-rooftop": ("LoopsHomeFeed.png", (243, 2595, 1037, 3041)),
    # ---- explore tiles (measured grid: cols 48/576, 25px gutters) --------
    "tile-fitcheck": ("LoopsExplore.png", (48, 726, 551, 1649)),
    "tile-morning": ("LoopsExplore.png", (576, 726, 1077, 1175)),
    "tile-loop": ("LoopsExplore.png", (576, 1200, 1077, 1649)),
    "tile-live": ("LoopsExplore.png", (48, 1674, 551, 2123)),
    "tile-food": ("LoopsExplore.png", (48, 2148, 551, 2597)),
    "tile-portrait": ("LoopsExplore.png", (576, 1674, 1077, 2597)),
    # ---- chats list avatars ----------------------------------------------
    "avatar-juno-big": ("LoopsChats.png", (49, 1255, 189, 1395)),
    "avatar-rats": ("LoopsChats.png", (49, 1456, 189, 1596)),
    "avatar-mia-big": ("LoopsChats.png", (49, 1686, 189, 1826)),
    "avatar-sofia-big": ("LoopsChats.png", (49, 1903, 189, 2043)),
    "avatar-kai-big": ("LoopsChats.png", (49, 2119, 189, 2259)),
    # ---- profile ---------------------------------------------------------
    # cover starts below the baked back/settings buttons (y<180)
    # ---- profile ---------------------------------------------------------
    # Cover runs the full width from the very top edge down to y=595 (198.3pt).
    # The back/settings buttons are baked into it and get patched out below.
    "profile-cover": ("LoopsProfile.png", (0, 0, 1125, 595)),
    # cropped inside the baked gradient ring; the ring is drawn in CSS.
    # Ring outer box measures (51, 508)-(271, 728), i.e. 220px centred on
    # (161, 618); a ~17px ring leaves a 186px photo inside it.
    "avatar-sofia": ("LoopsProfile.png", (68, 525, 254, 711)),
    "post-market": ("LoopsProfile.png", (243, 1800, 1037, 2249)),
    # ---- conversation ----------------------------------------------------
    "avatar-juno-head": ("LoopsConversation.png", (193, 63, 311, 181)),
    "shared-loop": ("LoopsConversation.png", (48, 255, 1076, 833)),
    "avatar-juno-msg": ("LoopsConversation.png", (49, 954, 131, 1036)),
    "avatar-juno-msg2": ("LoopsConversation.png", (49, 1593, 131, 1675)),
    "avatar-juno-msg3": ("LoopsConversation.png", (49, 2769, 131, 2851)),
    "msg-band": ("LoopsConversation.png", (359, 1956, 993, 2449)),
}

# Avatars with a baked-in green presence dot at the bottom-right.
DOT_AVATARS = {
    "avatar-juno-big",
    "avatar-mia-big",
    "avatar-sofia-big",
    "avatar-juno-head",
}
DOT_BOX = 42  # px to patch at 3x


def repair_dot(img: Image.Image) -> Image.Image:
    """Mirror the bottom-left corner over the baked-in presence dot.

    These avatars sit on plain card backgrounds, so the mirrored patch is
    seamless and lets the app draw its own presence indicator.
    """
    w, h = img.size
    patch = img.crop((0, h - DOT_BOX, DOT_BOX, h)).transpose(Image.FLIP_LEFT_RIGHT)
    img.paste(patch, (w - DOT_BOX, h - DOT_BOX))
    return img


# The profile cover has the back/settings buttons baked in at these boxes
# (36pt circles inset 16pt from each edge, 20pt down). The app draws real
# buttons on top, so patch the originals out by mirroring the pattern from
# the strip directly beneath each one.
COVER_BUTTONS = [(48, 60, 156, 168), (969, 60, 1077, 168)]


def repair_cover(img: Image.Image) -> Image.Image:
    for x0, y0, x1, y1 in COVER_BUTTONS:
        h = y1 - y0
        patch = img.crop((x0, y1, x1, y1 + h)).transpose(Image.FLIP_TOP_BOTTOM)
        img.paste(patch, (x0, y0))
    return img


def main() -> int:
    DEST.mkdir(parents=True, exist_ok=True)
    cache: dict[str, Image.Image] = {}

    for name, (src_name, box) in CROPS.items():
        if src_name not in cache:
            cache[src_name] = Image.open(SRC / src_name).convert("RGB")
        crop = cache[src_name].crop(box)
        if name in DOT_AVATARS:
            crop = repair_dot(crop)
        if name == "profile-cover":
            crop = repair_cover(crop)
        crop.save(DEST / f"{name}.jpg", "JPEG", quality=90, optimize=True)
        print(f"{name:20s} {crop.width:5d}x{crop.height:<5d}")

    print(f"\n{len(CROPS)} crops written to {DEST}")
    print("run tools/sheet.py to render the verification contact sheet")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
