"""Ürün paylaşım görsellerini üretir: public/images/og/<slug>.jpg (1200x630).

Link WhatsApp'ta ya da Instagram'da paylaşılınca önizlemede bu görsel çıkar
(bkz. scripts/prerender.mjs). Önizleme botları webp'yi her zaman göstermediği
için JPEG. Kare ürün fotoğrafı ortada durur, yanları aynı fotoğrafın
bulanıklaştırılmış hâliyle dolar.

Yeni ürün ya da yeni fotoğraf eklenince (depo kökünden):
    python3 scripts/og-gorselleri.py
"""
from pathlib import Path

from PIL import Image, ImageFilter

KOK = Path(__file__).resolve().parents[1]
URUNLER = KOK / 'public/images/products'
CIKTI = KOK / 'public/images/og'
W, H = 1200, 630

CIKTI.mkdir(parents=True, exist_ok=True)
for kaynak in sorted(URUNLER.glob('*.webp')):
    if kaynak.stem.endswith('-kavanoz'):
        continue
    foto = Image.open(kaynak).convert('RGB')
    # Kabın bulunduğu bant (kare görselin dikey %21-%91'i) 630 yüksekliğe büyür
    bant = foto.crop((0, 230, 1100, 1000))
    on = bant.resize((round(1100 * H / 770), H), Image.LANCZOS)
    x0 = (W - on.width) // 2
    # Yanlar: fotoğrafın kenardaki 24 px'lik şeridi yatay uzatılıp bulanıklaştırılır;
    # duvar ve mermer yatay bantlar olduğu için ufuk çizgisi kesintisiz sürer
    tuval = Image.new('RGB', (W, H))
    sol = on.crop((0, 0, 24, H)).resize((x0 + 40, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(10))
    sag = on.crop((on.width - 24, 0, on.width, H)).resize((W - x0 - on.width + 40, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(10))
    tuval.paste(sol, (0, 0))
    tuval.paste(sag, (W - sag.width, 0))
    maske = Image.linear_gradient('L').rotate(90, expand=True).resize((40, H))  # soldan sağa 255 -> 0
    tam = Image.new('L', on.size, 255)
    tam.paste(maske.transpose(Image.FLIP_LEFT_RIGHT), (0, 0))
    tam.paste(maske, (on.width - 40, 0))
    tuval.paste(on, (x0, 0), tam)
    tuval.save(CIKTI / f'{kaynak.stem}.jpg', quality=86, optimize=True, progressive=True)
    print(kaynak.stem)
