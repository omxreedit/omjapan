#!/usr/bin/env python3
"""Copy the owner-supplied OMJAPAN logo into generated Android/WebView assets.

The source is a 1254x1254 JPEG supplied at /storage/emulated/0/Download/logo/logo.png.
It is stored in the repo as branding/logo.jpg. Android supports JPEG drawables,
so no lossy re-encode is performed.
"""
from __future__ import annotations

import hashlib
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "branding" / "logo.jpg"
LAUNCHER = ROOT / "android" / "res" / "drawable" / "ic_launcher.jpg"
IN_APP = ROOT / "android" / "assets" / "www" / "img" / "logo.jpg"
NOTICE = ROOT / "tools" / "BRAND_NOTICE.txt"


def jpeg_size(data: bytes):
    if not data.startswith(b"\xff\xd8"):
        raise ValueError("Source is not a JPEG image")
    i = 2
    while i < len(data) - 9:
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        i += 2
        if marker in (0xD8, 0xD9) or 0xD0 <= marker <= 0xD7:
            continue
        length = int.from_bytes(data[i:i + 2], "big")
        if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
                      0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
            height = int.from_bytes(data[i + 3:i + 5], "big")
            width = int.from_bytes(data[i + 5:i + 7], "big")
            return width, height
        i += length
    raise ValueError("Could not read JPEG dimensions")


def write_copy(destination: Path, data: bytes) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(data)


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Missing official logo: {SOURCE}")
    data = SOURCE.read_bytes()
    width, height = jpeg_size(data)
    if width != height:
        print(f"Warning: logo is {width}x{height}; a square image is recommended")
    digest = hashlib.sha256(data).hexdigest()
    write_copy(LAUNCHER, data)
    write_copy(IN_APP, data)
    NOTICE.write_text(
        "OMJAPAN official logo applied.\n"
        f"Source: branding/logo.jpg\n"
        f"SHA-256: {digest}\n"
        f"Dimensions: {width}x{height}\n"
        "Generated launcher: android/res/drawable/ic_launcher.jpg\n"
        "Generated in-app asset: android/assets/www/img/logo.jpg\n",
        encoding="utf-8",
    )
    print(f"official logo applied ({width}x{height}, {len(data)} bytes)")


if __name__ == "__main__":
    main()
