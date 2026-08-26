#!/usr/bin/env python3
"""Prompts for a Google Maps API key (hidden input) and writes it into
booking-example.html, so the key never has to be pasted into chat.

Run: python3 set-maps-key.py
"""
import getpass
import pathlib
import re

TARGET = pathlib.Path(__file__).parent / "liverexectours-site" / "booking-example.html"
PATTERN = re.compile(r'window\.GOOGLE_MAPS_API_KEY\s*=\s*"[^"]*";')


def main():
    if not TARGET.exists():
        print(f"Can't find {TARGET} — run this from the Liverexectours project folder.")
        return

    content = TARGET.read_text(encoding="utf-8")
    if not PATTERN.search(content):
        print("Couldn't find the GOOGLE_MAPS_API_KEY line in booking-example.html.")
        return

    key = getpass.getpass("Paste your Google Maps API key (input hidden), then press Enter: ").strip()
    if not key:
        print("No key entered — nothing changed.")
        return
    if '"' in key:
        print("That doesn't look like a valid key (contains a quote character) — nothing changed.")
        return

    new_content = PATTERN.sub(f'window.GOOGLE_MAPS_API_KEY = "{key}";', content, count=1)
    TARGET.write_text(new_content, encoding="utf-8")
    print(f"Done — key written into {TARGET.relative_to(pathlib.Path(__file__).parent)}")
    print("Reload http://localhost:8844/liverexectours-site/booking-example.html to try it.")


if __name__ == "__main__":
    main()
