"""Import client-owned local photographs as draft assets; never edits data.js.

Usage: python scripts/import-client-images.py "folder with originals"
Requires Pillow. Originals remain untouched; IDs derive from complete file SHA-256.
Review assets/portfolio/contact-sheet.jpg and curation.json before publishing.
"""

import argparse
import hashlib
import io
import json
from pathlib import Path

from PIL import Image, ImageCms, ImageDraw, ImageFont, ImageOps


def read_json(path, default):
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else default


def clean_photo(path):
    with Image.open(path) as original:
        photo = ImageOps.exif_transpose(original)
        profile = original.info.get("icc_profile")
        if profile:
            # Convert embedded colour profiles to sRGB before stripping metadata.
            photo = ImageCms.profileToProfile(photo, ImageCms.ImageCmsProfile(io.BytesIO(profile)), ImageCms.createProfile("sRGB"), outputMode="RGB")
        else:
            photo = photo.convert("RGB")
        clean = Image.new("RGB", photo.size)
        clean.paste(photo)
        return clean


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("--output", type=Path, default=Path("assets/portfolio"))
    args = parser.parse_args()
    source = args.source.resolve(strict=True)
    output = args.output.resolve()
    if source == output or source in output.parents or output in source.parents:
        raise SystemExit("Source originals and output must be separate, non-nested folders.")
    output.mkdir(parents=True, exist_ok=True)
    inventory_path = output / "inventory.json"
    inventory = read_json(inventory_path, [])
    records = {record["sha256"]: record for record in inventory}
    curation = read_json(output / "curation.json", {})
    source_files = sorted(p for p in source.iterdir() if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"})
    sheet_items = []
    added = 0
    for path in source_files:
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        identifier = "client-" + digest[:16]
        if any(item["id"] == identifier and item["sha256"] != digest for item in inventory):
            raise SystemExit(f"Hash prefix collision for {identifier}; nothing will be overwritten.")
        if digest not in records:
            photo = clean_photo(path)
            record = {"id": identifier, "sha256": digest, "sourceFiles": [], "provenance": "client", "source": "", "category": "unreviewed", "reviewStatus": "draft", "originalWidth": photo.width, "originalHeight": photo.height, "variants": []}
            # Reserve every output name before writing either variant.
            for bound in (800, 1600):
                if (output / f"{identifier}-{bound}.webp").exists():
                    raise SystemExit(f"Untracked output already exists for {identifier}; refusing to overwrite.")
            for bound in (800, 1600):
                resized = photo.copy()
                resized.thumbnail((bound, bound), Image.Resampling.LANCZOS)
                target = output / f"{identifier}-{bound}.webp"
                with target.open("xb") as destination:
                    resized.save(destination, "WEBP", quality=86, method=6)
                record["variants"].append({"file": target.name, "width": resized.width, "height": resized.height, "bytes": target.stat().st_size})
            records[digest] = record
            inventory.append(record)
            added += 1
        record = records[digest]
        if path.name not in record["sourceFiles"]:
            record["sourceFiles"].append(path.name)
        for key in ("category", "title", "alt", "reviewStatus", "duplicateOfInstagram", "notes"):
            if key in curation.get(identifier, {}):
                record[key] = curation[identifier][key]
        for variant in record["variants"]:
            if not (output / variant["file"]).is_file():
                raise SystemExit(f"Missing previously imported file: {variant['file']}")
        sheet_items.append((path.name, record))
    # This generated inventory is append-only for images; preserve unrelated records.
    inventory_path.write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    columns, cell_width, cell_height = 3, 440, 375
    sheet = Image.new("RGB", (columns * cell_width, ((len(sheet_items) + columns - 1) // columns) * cell_height), "#edf0ec")
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 15)
    except OSError:
        font = ImageFont.load_default()
    for index, (filename, record) in enumerate(sheet_items):
        x, y = (index % columns) * cell_width, (index // columns) * cell_height
        with Image.open(output / record["variants"][0]["file"]) as photo:
            photo.thumbnail((cell_width - 28, cell_height - 72), Image.Resampling.LANCZOS)
            sheet.paste(photo, (x + (cell_width - photo.width) // 2, y + 8 + (cell_height - 72 - photo.height) // 2))
        duplicate = " / DUPLICADO SHA" if len(record["sourceFiles"]) > 1 else ""
        draw.text((x + 12, y + cell_height - 59), f"{index + 1:02} {record['id']}{duplicate}", font=font, fill="#17211e")
        draw.text((x + 12, y + cell_height - 39), filename[:48], font=font, fill="#17211e")
        draw.text((x + 12, y + cell_height - 20), f"{record['originalWidth']}x{record['originalHeight']} | {record['category']}", font=font, fill="#53615a")
    sheet.save(output / "contact-sheet.jpg", quality=90)
    print(json.dumps({"inputFiles": len(source_files), "uniqueInputs": len({r["id"] for _, r in sheet_items}), "newAssets": added, "totalInventory": len(inventory), "totalWebpBytes": sum(v["bytes"] for r in inventory for v in r["variants"]), "contactSheet": str(output / "contact-sheet.jpg")}, indent=2))


if __name__ == "__main__":
    main()
