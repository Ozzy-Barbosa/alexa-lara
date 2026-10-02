"""Prepare local Instagram references without altering composition or color.

Usage: python scripts/prepare-images.py <download-folder> [<download-folder> ...]
Requires Pillow. Files must have a stable, unique stem (the browser asset ID).
Generated WebP names are used by the site's portfolio data.
"""

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("sources", nargs="+", type=Path)
    parser.add_argument("--output", type=Path, default=Path("assets/instagram"))
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    records = []
    seen = set()
    for folder in args.sources:
        manifest_path = folder / "manifest.json"
        if manifest_path.exists():
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
            inputs = [Path(asset["path"]) for asset in manifest["assets"] if asset.get("kind") == "image"]
        else:
            inputs = sorted(p for p in folder.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".webp", ".png"})
        for source in inputs:
            if source.stem in seen:
                continue
            seen.add(source.stem)
            with Image.open(source) as original:
                photo = ImageOps.exif_transpose(original).convert("RGB")
                record = {"id": source.stem, "originalWidth": photo.width, "originalHeight": photo.height, "variants": []}
                for max_size in (800, 1600):
                    resized = photo.copy()
                    resized.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                    target = args.output / f"{source.stem}-{max_size}.webp"
                    resized.save(target, "WEBP", quality=84, method=6, icc_profile=original.info.get("icc_profile", b""))
                    record["variants"].append({"file": target.name, "width": resized.width, "height": resized.height, "bytes": target.stat().st_size})
                records.append(record)
    # The sheet is an internal review artifact. Images are contained, never cropped.
    cols, cell_width, cell_height = 4, 340, 300
    rows = (len(records) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cell_width, rows * cell_height), "#f0ece5")
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 18)
    except OSError:
        font = ImageFont.load_default()
    for i, record in enumerate(records):
        left, top = (i % cols) * cell_width, (i // cols) * cell_height
        with Image.open(args.output / record["variants"][0]["file"]) as photo:
            photo.thumbnail((cell_width - 24, cell_height - 46), Image.Resampling.LANCZOS)
            sheet.paste(photo, (left + (cell_width - photo.width) // 2, top + 8 + (cell_height - 46 - photo.height) // 2))
        draw.text((left + 12, top + cell_height - 30), f"{i + 1:02}  {record['id']}", font=font, fill="#25221d")
    sheet_path = args.output / "contact-sheet.jpg"
    sheet.save(sheet_path, quality=90)
    inventory_path = args.output / "inventory.json"
    inventory_path.write_text(json.dumps(records, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"images": len(records), "webpBytes": sum(v["bytes"] for record in records for v in record["variants"]), "contactSheet": str(sheet_path.resolve()), "inventory": str(inventory_path.resolve())}, indent=2))


if __name__ == "__main__":
    main()
