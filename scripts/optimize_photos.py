#!/usr/bin/env python3
"""
Ürün fotoğraflarını siteye hazırlar.

Kaynak : yüksek çözünürlüklü kare PNG'ler (~2 MB)
Çıktı  : public/images/products/<slug>.webp  (1100px, ~70 KB)
         public/images/hero/og-cover.jpg     (1200x630 paylaşım görseli)

Kullanım:
    python3 scripts/optimize_photos.py ~/Desktop/gonuldentatlar/menuresimler

Yeni fotoğraf eklendiğinde SLUGS sözlüğüne dosya adı → slug eşlemesi ekleyip
komutu yeniden çalıştırmak yeterli.
"""
import sys
from pathlib import Path
from PIL import Image

SIZE = 1100
QUALITY = 84
CREAM = (250, 245, 236)

# Kaynak dosya adı (uzantısız) -> ürün slug'ı
SLUGS = {
    "1.Çilekli Magnolya": "cilekli-magnolya",
    "2.Muzlu Magnolya": "muzlu-magnolya",
    "3.Çilekli Muzlu Magnolya_": "cilekli-muzlu-magnolya",
    "4.Çikolatalı Magnolya": "cikolatali-magnolya",
    "5.Çilekli Çikolatalı Magnolya": "cilekli-cikolatali-magnolya",
    "6.Muzlu Çikolatalı Magnolya": "muzlu-cikolatali-magnolya",
    "7.Çilekli Muzlu Çikolatalı Magnolya": "cilekli-muzlu-cikolatali-magnolya",
    "8.Kakaolu Bisküvili Çilekli Magnolya": "kakaolu-biskuvili-cilekli-magnolya",
    "9.Kakaolu Bisküvili Muzlu Magnolya": "kakaolu-biskuvili-muzlu-magnolya",
    "10.Kakaolu Bisküvili Çilekli Muzlu Magnolya": "kakaolu-biskuvili-cilekli-muzlu-magnolya",
    "11.Kakaolu Bisküvili Çikolatalı Magnolya_": "kakaolu-biskuvili-cikolatali-magnolya",
    "12.Kakaolu Bisküvili Çilekli Çikolatalı Magnolya": "kakaolu-biskuvili-cilekli-cikolatali-magnolya",
    "13.Kakaolu Bisküvili Muzlu Çikolatalı Magnolya": "kakaolu-biskuvili-muzlu-cikolatali-magnolya",
    "14.Kakaolu Bisküvili Çilekli Muzlu Çikolatalı Magnolya": "kakaolu-biskuvili-cilekli-muzlu-cikolatali-magnolya",
    "15.Oreolu Magnolya": "oreolu-magnolya",
    "16.Oreolu Çilekli Magnolya": "oreolu-cilekli-magnolya",
    "17.Oreolu Muzlu Magnolya": "oreolu-muzlu-magnolya",
    "18.Lotuslu Magnolya": "lotuslu-magnolya",
    "19.Cevizli Magnolya_": "cevizli-magnolya",
    "20.Cevizli Çikolatalı Magnolya": "cevizli-cikolatali-magnolya",
    "21.Çilekli Çikolatalı Cup": "cilekli-cikolatali-cup",
    "22.Muzlu Çikolatalı Cup": "muzlu-cikolatali-cup",
    "23.Çilekli Muzlu Çikolatalı Cup": "cilekli-muzlu-cikolatali-cup",
    "24.Balkabaklı Magnolya": "balkabakli-magnolya",
}

# Paylaşım (Open Graph) görselinde kullanılacak ürün
OG_SLUG = "cilekli-cikolatali-cup"

# Kavanoz fotoğrafları alt klasörde ve dosya adları birebir aynı değil
# (bazılarında sondaki "_" farkı var). Bu yüzden baştaki numaraya göre eşleştirilir.
JAR_DIR = "Kavanoz"
JAR_SUFFIX = "-kavanoz"


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 1

    src_dir = Path(sys.argv[1]).expanduser()
    root = Path(__file__).resolve().parent.parent
    out_dir = root / "public/images/products"
    out_dir.mkdir(parents=True, exist_ok=True)

    total = 0
    missing = []
    for stem, slug in SLUGS.items():
        matches = list(src_dir.glob(f"{stem}.*"))
        if not matches:
            missing.append(stem)
            continue

        img = Image.open(matches[0]).convert("RGB")
        # Kare değilse ortadan kare kırp
        if img.width != img.height:
            side = min(img.size)
            left = (img.width - side) // 2
            top = (img.height - side) // 2
            img = img.crop((left, top, left + side, top + side))

        img = img.resize((SIZE, SIZE), Image.LANCZOS)
        target = out_dir / f"{slug}.webp"
        img.save(target, "WEBP", quality=QUALITY, method=6)
        total += target.stat().st_size
        print(f"  ✓ {slug}.webp  ({target.stat().st_size / 1024:.0f} KB)")

    if missing:
        print("\n  ! kaynağı bulunamayan:", ", ".join(missing))

    # --- Kavanoz sürümleri: numaraya göre eşleştir ---
    jar_dir = src_dir / JAR_DIR
    if jar_dir.is_dir():
        by_number = {stem.split(".", 1)[0]: slug for stem, slug in SLUGS.items()}
        jar_total, matched, unmatched = 0, 0, []
        print()
        for path in sorted(jar_dir.iterdir()):
            if path.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
                continue
            number = path.stem.split(".", 1)[0].strip()
            slug = by_number.get(number)
            if not slug:
                unmatched.append(path.name)
                continue

            img = Image.open(path).convert("RGB")
            if img.width != img.height:
                side = min(img.size)
                left, top = (img.width - side) // 2, (img.height - side) // 2
                img = img.crop((left, top, left + side, top + side))
            img = img.resize((SIZE, SIZE), Image.LANCZOS)

            target = out_dir / f"{slug}{JAR_SUFFIX}.webp"
            img.save(target, "WEBP", quality=QUALITY, method=6)
            jar_total += target.stat().st_size
            matched += 1
            print(f"  ✓ {slug}{JAR_SUFFIX}.webp  ({target.stat().st_size / 1024:.0f} KB)")

        if unmatched:
            print("  ! numarası eşleşmeyen:", ", ".join(unmatched))
        print(f"\n✓ {matched} kavanoz fotoğrafı işlendi — {jar_total / 1024 / 1024:.1f} MB")

    # Open Graph görseli: kare fotoğrafı krem zemine ortalanmış 1200x630
    og_src = out_dir / f"{OG_SLUG}.webp"
    if og_src.exists():
        canvas = Image.new("RGB", (1200, 630), CREAM)
        photo = Image.open(og_src).resize((630, 630), Image.LANCZOS)
        canvas.paste(photo, ((1200 - 630) // 2, 0))
        og_path = root / "public/images/hero/og-cover.jpg"
        og_path.parent.mkdir(parents=True, exist_ok=True)
        canvas.save(og_path, "JPEG", quality=88, optimize=True)
        print(f"  ✓ og-cover.jpg  ({og_path.stat().st_size / 1024:.0f} KB)")

    print(f"\n✓ {len(SLUGS) - len(missing)} fotoğraf işlendi — toplam {total / 1024 / 1024:.1f} MB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
