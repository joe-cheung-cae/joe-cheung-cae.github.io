#!/usr/bin/env python3
"""Freeze Maple Mono extra ligature sets into calt.

Maple Mono keeps extra operator ligatures in ss03/ss07-ss11. Enabling those
sets from CSS intercepts equal/exclam in Chromium and un-ligatures == and !=.
The upstream freeze moves those lookups into calt, which stays on by default.

Run:
  python3 -m venv .tmp-fonttools
  .tmp-fonttools/bin/python -m pip install fonttools brotli
  .tmp-fonttools/bin/python tools/freeze-maple-mono-ligatures.py
"""

from __future__ import annotations

from pathlib import Path

from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
FONT_PATH = ROOT / "public" / "fonts" / "MapleMono-NF-CN-Regular.woff2"

MOVING_RULES = ("ss03", "ss07", "ss08", "ss09", "ss10", "ss11")
DISABLE_RULES = ("ss01", "ss02", "ss04")


def freeze_feature(font: TTFont) -> None:
    feature_list = font["GSUB"].table.FeatureList
    feature_record = feature_list.FeatureRecord
    feature_dict = {
        feature.FeatureTag: (i, feature.Feature)
        for i, feature in enumerate(feature_record)
        if feature.FeatureTag != "calt"
    }
    calt_features = [
        feature.Feature for feature in feature_record if feature.FeatureTag == "calt"
    ]
    if not calt_features:
        raise SystemExit("Maple Mono WOFF2 is missing calt")

    for tag in MOVING_RULES:
        if tag not in feature_dict:
            raise SystemExit(f"Maple Mono WOFF2 is missing {tag}")
        _index, target_feature = feature_dict[tag]
        for calt_feature in calt_features:
            existing = set(calt_feature.LookupListIndex)
            for lookup_index in target_feature.LookupListIndex:
                if lookup_index not in existing:
                    calt_feature.LookupListIndex.append(lookup_index)
                    existing.add(lookup_index)
            calt_feature.LookupCount = len(calt_feature.LookupListIndex)

    for tag in DISABLE_RULES:
        if tag not in feature_dict:
            continue
        _index, target_feature = feature_dict[tag]
        target_feature.LookupListIndex = []
        target_feature.LookupCount = 0


def calt_lookup_indices(font: TTFont) -> set[int]:
    indices: set[int] = set()
    for feature in font["GSUB"].table.FeatureList.FeatureRecord:
        if feature.FeatureTag == "calt":
            indices.update(feature.Feature.LookupListIndex)
    return indices


def feature_lookup_indices(font: TTFont, tag: str) -> list[int]:
    for feature in font["GSUB"].table.FeatureList.FeatureRecord:
        if feature.FeatureTag == tag:
            return list(feature.Feature.LookupListIndex)
    return []


def verify(font: TTFont) -> None:
    calt = calt_lookup_indices(font)
    for tag in MOVING_RULES:
        moved = feature_lookup_indices(font, tag)
        missing = [index for index in moved if index not in calt]
        if missing:
            raise SystemExit(f"{tag} lookups not frozen into calt: {missing}")
        if not moved:
            raise SystemExit(f"{tag} has no lookups to freeze")
    for tag in DISABLE_RULES:
        leftover = feature_lookup_indices(font, tag)
        if leftover:
            raise SystemExit(f"{tag} still has lookups {leftover}")


def main() -> None:
    if not FONT_PATH.is_file():
        raise SystemExit(f"missing {FONT_PATH}")

    font = TTFont(FONT_PATH)
    freeze_feature(font)
    verify(font)

    unique = font["name"].getDebugName(3) or ""
    marker = "+ss03;+ss07;+ss08;+ss09;+ss10;+ss11;-ss01;-ss02;-ss04;"
    if marker not in unique:
        font["name"].setName(
            f"{unique}{marker}",
            nameID=3,
            platformID=3,
            platEncID=1,
            langID=0x409,
        )

    font.flavor = "woff2"
    font.save(FONT_PATH)
    font.close()
    print(f"froze {', '.join(MOVING_RULES)} into calt in {FONT_PATH}")


if __name__ == "__main__":
    main()
