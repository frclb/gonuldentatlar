#!/usr/bin/env python3
"""
Genel (grup) fotoğraflarını siteye hazırlar.

Kaynak : menuresimler/Genel — aynı stüdyoda çekilmiş çoklu ürün kareleri
Çıktı  : public/images/genel/<slug>.webp       (1600px geniş, orijinal en-boy)
         public/images/genel/<slug>-kare.webp  (1000x1000, kare alanlar için)
         public/images/hero/og-cover.jpg       (1200x630 paylaşım görseli)

Kullanım:
    python3 scripts/optimize_general.py ~/Desktop/gonuldentatlar/menuresimler

Kare sürümde fotoğraf kırpılmaz, üst ve alt kenar dışa doğru uzatılır. Bu
karelerde kenarlar düz fon olduğu için ek boşluk dikişsiz görünür; ortadan
kırpsak dizilimdeki dıştaki kavanozlar kadraj dışında kalırdı.
"""
import sys
import unicodedata
from pathlib import Path
from PIL import Image

WIDE = 1600
SQUARE = 1000
QUALITY = 84

# Kaynak dosya adı (uzantısız) -> slug
SLUGS = {
    "1":  "vitrin-tumu",
    "2":  "beyaz-cikolatali-uclu-kavanoz",
    "3":  "beyaz-cikolatali-uclu-cup",
    "4":  "klasik-uclu-kavanoz",
    "5":  "klasik-uclu-cup",
    "6":  "karisik-dortlu-kavanoz",
    "7":  "karisik-dortlu-cup",
    "8":  "kakaolu-uclu-kavanoz",
    "9":  "kakaolu-uclu-cup",
    "10": "kakaolu-dortlu-kavanoz",
    "11": "kakaolu-dortlu-cup",
    "12": "oreolu-uclu-kavanoz",
    "13": "oreolu-uclu-cup",
    "14": "cevizli-ikili-kavanoz",
    "15": "cevizli-ikili-cup",
}

# Kare sürümü de üretilecek olanlar — yalnızca Instagram kutularında kullanılanlar.
# Kategori kutuları 137px olduğu için orada dizilim kareleri okunmuyor, tekli
# ürün fotoğrafı kalmaya devam ediyor.
NEEDS_SQUARE = {
    "vitrin-tumu", "oreolu-uclu-kavanoz", "kakaolu-uclu-kavanoz",
    "cevizli-ikili-kavanoz", "karisik-dortlu-kavanoz", "karisik-dortlu-cup",
}

# Paylaşım görselinde geniş kadrajı dolduran dörtlü diziliş kullanılır
OG_SLUG = "karisik-dortlu-kavanoz"

GENEL_DIR = "genel"


def nfc(text: str) -> str:
    return unicodedata.normalize("NFC", text)


def pad_to_square(img: Image.Image) -> Image.Image:
    """Kırpmadan kareye tamamlar; eksik kalan kenarı dışa doğru uzatır."""
    side = max(img.size)
    canvas = Image.new("RGB", (side, side))

    if img.height < side:
        top = (side - img.height) // 2
        bottom = side - img.height - top
        if top:
            canvas.paste(img.crop((0, 0, img.width, 1)).resize((img.width, top)), (0, 0))
        if bottom:
            edge = img.crop((0, img.height - 1, img.width, img.height))
            canvas.paste(edge.resize((img.width, bottom)), (0, top + img.height))
        canvas.paste(img, (0, top))
    else:
        left = (side - img.width) // 2
        right = side - img.width - left
        if left:
            canvas.paste(img.crop((0, 0, 1, img.height)).resize((left, img.height)), (0, 0))
        if right:
            edge = img.crop((img.width - 1, 0, img.width, img.height))
            canvas.paste(edge.resize((right, img.height)), (left + img.width, 0))
        canvas.paste(img, (left, 0))

    return canvas


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 1

    src_root = Path(sys.argv[1]).expanduser()
    # Klasör adında sondaki boşluk gibi farklar olabiliyor
    src_dir = next(
        (p for p in src_root.iterdir() if p.is_dir() and nfc(p.name).strip().lower() == GENEL_DIR),
        None,
    )
    if src_dir is None:
        print(f"  ! '{GENEL_DIR}' klasörü bulunamadı: {src_root}")
        return 1

    root = Path(__file__).resolve().parent.parent
    out_dir = root / "public/images/genel"
    out_dir.mkdir(parents=True, exist_ok=True)

    by_stem = {
        nfc(p.stem).strip(): p
        for p in src_dir.iterdir()
        if p.is_file() and p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}
    }

    total, missing = 0, []
    for stem, slug in SLUGS.items():
        source = by_stem.get(stem)
        if source is None:
            missing.append(stem)
            continue

        img = Image.open(source).convert("RGB")
        wide = img.resize((WIDE, round(WIDE * img.height / img.width)), Image.LANCZOS)
        target = out_dir / f"{slug}.webp"
        wide.save(target, "WEBP", quality=QUALITY, method=6)
        total += target.stat().st_size
        line = f"  ✓ {slug}.webp  ({target.stat().st_size / 1024:.0f} KB)"

        if slug in NEEDS_SQUARE:
            sq = pad_to_square(img).resize((SQUARE, SQUARE), Image.LANCZOS)
            sq_target = out_dir / f"{slug}-kare.webp"
            sq.save(sq_target, "WEBP", quality=QUALITY, method=6)
            total += sq_target.stat().st_size
            line += f"  + kare ({sq_target.stat().st_size / 1024:.0f} KB)"

        print(line)

    if missing:
        print("\n  ! kaynağı bulunamayan:", ", ".join(missing))

    # Paylaşım görseli: geniş kareyi 1200x630'a ortadan kırp
    og_src = by_stem.get(next(k for k, v in SLUGS.items() if v == OG_SLUG))
    if og_src:
        img = Image.open(og_src).convert("RGB")
        target_h = round(img.width * 630 / 1200)
        top = (img.height - target_h) // 2
        og = img.crop((0, top, img.width, top + target_h)).resize((1200, 630), Image.LANCZOS)
        og_path = root / "public/images/hero/og-cover.jpg"
        og.save(og_path, "JPEG", quality=88, optimize=True)
        print(f"\n  ✓ og-cover.jpg  ({og_path.stat().st_size / 1024:.0f} KB)")

    print(f"\n✓ {len(SLUGS) - len(missing)} genel fotoğraf işlendi — toplam {total / 1024 / 1024:.1f} MB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
