"""Build Alexa's static card/QR/social preview without an external QR service.

Requires Pillow and ReportLab. Optional independent verification: zxing-cpp.
Fonts are local OFL-licensed files under assets/card/fonts. No network calls.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from xml.sax.saxutils import escape

from PIL import Image, ImageDraw, ImageFont
from reportlab.graphics.barcode import qr

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "card"
FONTS = OUT / "fonts"
CARD_URL = "https://ozzy-barbosa.github.io/alexa-lara/tarjeta.html"
PORTFOLIO_URL = "https://ozzy-barbosa.github.io/alexa-lara/"
INSTAGRAM_URL = "https://www.instagram.com/aleroblesfotografia/"
PHOTO = ROOT / "assets" / "instagram" / "6c7e0558e37a9d13-800.webp"
SOCIAL_FILE = "alexa-lara-social-v7.jpg"
WINE = "#65283d"
DARK = "#20151b"
IVORY = "#f5f0e8"
MUTED = "#735e62"
LINE = "#d8c7ca"


def font(size: int, serif: bool = False, medium: bool = False):
    name = "CormorantGaramond-SemiBold.ttf" if serif else "DMSans-Medium.ttf" if medium else "DMSans-Regular.ttf"
    return ImageFont.truetype(str(FONTS / name), size)


def label(draw, text, xy, size=18, spacing=4, fill=MUTED):
    x, y = xy
    face = font(size, medium=True)
    for character in text:
        draw.text((x, y), character, font=face, fill=fill)
        x += draw.textlength(character, font=face) + spacing


def get_matrix():
    widget = qr.QrCodeWidget(CARD_URL, barLevel="M")
    widget.qr.make()
    return widget.qr.modules


def qr_bitmap(matrix, scale: int):
    quiet = 4
    size = (len(matrix) + quiet * 2) * scale
    result = Image.new("RGB", (size, size), "white")
    draw = ImageDraw.Draw(result)
    for row, values in enumerate(matrix):
        for col, dark in enumerate(values):
            if dark:
                x = (col + quiet) * scale
                y = (row + quiet) * scale
                draw.rectangle((x, y, x + scale - 1, y + scale - 1), fill=DARK)
    return result


def save_qr(matrix):
    dimension = len(matrix) + 8
    modules = []
    for row, values in enumerate(matrix):
        for col, dark in enumerate(values):
            if dark:
                modules.append(f"M{col + 4} {row + 4}h1v1h-1z")
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="0 0 {dimension} {dimension}" width="656" height="656" '
        'shape-rendering="crispEdges" role="img" aria-labelledby="title desc">'
        '<title id="title">Tarjeta digital de Alexa Lara</title>'
        f'<desc id="desc">Código QR para {escape(CARD_URL)}</desc>'
        f'<rect width="{dimension}" height="{dimension}" fill="#fff"/>'
        f'<path fill="{DARK}" d="{"".join(modules)}"/></svg>\n'
    )
    (OUT / "alexa-lara-qr.svg").write_text(svg, encoding="utf-8")
    qr_bitmap(matrix, 16).save(OUT / "alexa-lara-qr.png", optimize=True)


def card_image(matrix):
    image = Image.new("RGB", (1080, 1350), IVORY)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, 1080, 291), fill=WINE)
    draw.text((67, 53), "Alexa Lara", font=font(126, serif=True), fill=IVORY)
    label(draw, "FOTOGRAFÍA", (75, 222), size=21, spacing=7, fill=IVORY)
    draw.line((73, 326, 1007, 326), fill=LINE, width=1)
    # Preserve the complete square profile photograph; no crop or face changes.
    with Image.open(PHOTO) as original:
        photo = original.convert("RGB").resize((420, 420), Image.Resampling.LANCZOS)
    image.paste(photo, (73, 360))
    label(draw, "LA PAZ & ENSENADA", (542, 372), size=17, spacing=2)
    draw.multiline_text((538, 438), "Historias que\nse sienten.", font=font(65, serif=True), fill=DARK, spacing=0)
    draw.line((544, 634, 988, 634), fill=LINE, width=1)
    draw.text((543, 663), "Retrato · Editorial", font=font(25), fill=MUTED)
    draw.text((543, 706), "Familia · Producto", font=font(25), fill=MUTED)
    draw.line((73, 824, 1007, 824), fill=LINE, width=1)
    label(draw, "HABLEMOS DE TU SESIÓN", (74, 865), size=17, spacing=3)
    draw.text((73, 913), "+52 612 104 4559", font=font(37, medium=True), fill=DARK)
    draw.text((73, 974), "alexalarar17@gmail.com", font=font(28), fill=DARK)
    draw.text((73, 1024), "@aleroblesfotografia", font=font(28), fill=WINE)
    draw.text((73, 1093), "Portafolio y contacto", font=font(23), fill=MUTED)
    code = qr_bitmap(matrix, max(1, 287 // (len(matrix) + 8)))
    qx = 1007 - code.width
    image.paste(code, (qx, 860))
    draw.text((qx + code.width / 2, 1164), "ESCANEA MI TARJETA", font=font(17, medium=True), fill=MUTED, anchor="mt")
    draw.rectangle((0, 1232, 1080, 1350), fill=DARK)
    visible_url = CARD_URL.removeprefix("https://").removeprefix("http://")
    url_size = 25
    while url_size > 12 and draw.textlength(visible_url, font=font(url_size)) > 934:
        url_size -= 1
    if draw.textlength(visible_url, font=font(url_size)) > 934:
        raise ValueError("The card URL is too long for a legible printed card; use a shorter public URL.")
    draw.text((73, 1260), visible_url, font=font(url_size), fill=IVORY)
    draw.text((73, 1302), "GUÁRDALA. COMPÁRTELA. IMAGINEMOS TU SESIÓN.", font=font(15), fill="#d9c9cd")
    image.save(OUT / "alexa-lara-tarjeta.png", optimize=True)


def social_image():
    # Native, editable graphic layout. Keep the unmodified portrait and every
    # word inside the central 600px so a centred square crop retains both.
    image = Image.new("RGB", (1200, 630), "#111314")
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, 18, 629), fill=WINE)
    draw.rectangle((1181, 0, 1199, 629), fill=WINE)
    draw.rectangle((47, 39, 1152, 590), outline="#493038", width=1)
    # Only decorative lines occupy the outer wings of the wide card.
    draw.line((97, 315, 332, 315), fill="#8e4c62", width=2)
    draw.line((868, 315, 1103, 315), fill="#8e4c62", width=2)
    draw.rectangle((384, 14, 815, 433), fill="#111314")
    draw.rectangle((391, 18, 808, 435), outline="#8e4c62", width=2)
    with Image.open(PHOTO) as original:
        photo = original.convert("RGB").resize((400, 400), Image.Resampling.LANCZOS)
    image.paste(photo, (400, 27))
    name_font = font(108, serif=True)
    assert draw.textlength("Alexa Lara", font=name_font) < 570
    draw.text((600, 439), "Alexa Lara", font=name_font, fill=IVORY, anchor="mt")
    draw.text((600, 552), "F O T O G R A F Í A", font=font(23, medium=True), fill="#d6a8b7", anchor="mt")
    draw.rectangle((471, 584, 729, 608), fill="#111314")
    draw.text((600, 587), "La Paz · Ensenada", font=font(21), fill="#e2dcd6", anchor="mt")
    image.save(OUT / SOCIAL_FILE, quality=93, subsampling=0, optimize=True)


def file_entry(name):
    path = OUT / name
    entry = {"bytes": path.stat().st_size, "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}
    if path.suffix in {".jpg", ".png"}:
        with Image.open(path) as image:
            entry["width"], entry["height"] = image.size
    return entry


def contact_file():
    # Only user-confirmed public contact data. No address, title, birthday or photo.
    vcard = [
        "BEGIN:VCARD", "VERSION:3.0", "N:Lara;Alexa;;;", "FN:Alexa Lara",
        "TEL;TYPE=CELL:+526121044559", "EMAIL;TYPE=INTERNET:alexalarar17@gmail.com",
        f"URL:{CARD_URL}", "END:VCARD", "",
    ]
    (OUT / "alexa-lara.vcf").write_bytes("\r\n".join(vcard).encode("utf-8"))


def verify_decode():
    import zxingcpp
    evidence = []
    for name in ["alexa-lara-qr.png", "alexa-lara-tarjeta.png"]:
        with Image.open(OUT / name) as image:
            results = zxingcpp.read_barcodes(image.convert("RGB"))
        values = [result.text for result in results]
        if values != [CARD_URL]:
            raise RuntimeError(f"Independent QR decode failed for {name}: {values!r}")
        evidence.append({"file": name, "decoder": "ZXing-C++", "decoded": values[0]})
    return evidence


def main():
    global CARD_URL, PORTFOLIO_URL
    parser = argparse.ArgumentParser()
    parser.add_argument("--verify", action="store_true", help="Independently decode PNG QR and complete card using zxing-cpp.")
    parser.add_argument("--social-only", action="store_true", help="Update only the share image; preserve the verified QR, card and contact.")
    parser.add_argument("--site-url", default=PORTFOLIO_URL, help="Absolute public site root, including an optional subdirectory.")
    options = parser.parse_args()
    parsed = urlsplit(options.site_url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc or parsed.username or parsed.password or parsed.query or parsed.fragment:
        parser.error("--site-url must be an absolute HTTP(S) public root without credentials, query or fragment.")
    PORTFOLIO_URL = options.site_url.rstrip("/") + "/"
    CARD_URL = urljoin(PORTFOLIO_URL, "tarjeta.html")
    OUT.mkdir(parents=True, exist_ok=True)
    if options.social_only:
        manifest = json.loads((OUT / "manifest.json").read_text(encoding="utf-8"))
        if manifest["cardUrl"] != CARD_URL or manifest["portfolioUrl"] != PORTFOLIO_URL:
            parser.error("A domain change requires a full build, not --social-only.")
        # Retain independent QR evidence only when all underlying bytes match.
        for name in ["alexa-lara-qr.svg", "alexa-lara-qr.png", "alexa-lara-tarjeta.png", "alexa-lara.vcf"]:
            if manifest["files"][name] != file_entry(name):
                parser.error(f"{name} changed; run a full verified build first.")
        social_image()
        manifest["files"].pop("alexa-lara-social.jpg", None)
        manifest["files"][SOCIAL_FILE] = file_entry(SOCIAL_FILE)
        manifest["socialSafeArea"] = {"x": 300, "y": 0, "width": 600, "height": 630, "note": "All text and the complete portrait remain inside a centred square crop."}
        if options.verify:
            manifest["independentDecode"] = verify_decode()
        (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(json.dumps(manifest, indent=2, ensure_ascii=False))
        return
    matrix = get_matrix()
    save_qr(matrix)
    card_image(matrix)
    social_image()
    contact_file()
    manifest = {
        "cardUrl": CARD_URL, "portfolioUrl": PORTFOLIO_URL,
        "instagram": INSTAGRAM_URL, "telephone": "+526121044559",
        "whatsapp": "https://wa.me/5216121044559", "email": "alexalarar17@gmail.com",
        "qr": {"moduleCount": len(matrix), "quietZoneModules": 4, "errorCorrection": "M"},
        "photo": str(PHOTO.relative_to(ROOT)).replace("\\", "/"),
        "photoTreatment": "Complete square, proportionally resized; no crop or color edits.",
        "socialSafeArea": {"x": 300, "y": 0, "width": 600, "height": 630, "note": "All text and the complete portrait remain inside a centred square crop."},
        "files": {},
    }
    for name in ["alexa-lara-qr.svg", "alexa-lara-qr.png", "alexa-lara-tarjeta.png", SOCIAL_FILE, "alexa-lara.vcf"]:
        manifest["files"][name] = file_entry(name)
    if options.verify:
        manifest["independentDecode"] = verify_decode()
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(manifest, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
