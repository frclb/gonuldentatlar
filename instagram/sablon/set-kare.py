"""public/images/genel/<ad>.webp geniş görselinden <ad>-kare.webp (1000x1000) üretir.
Geniş görsel 1000 genişliğe küçültülüp dikeyde ortalanır; üst boşluk duvarın üst şeridi uzatılıp yumuşatılarak,
alt boşluk mermerin en alt 70 satırı ileri-geri yansıtılıp giderek bulanıklaştırılarak doldurulur.
Kullanım: python3 instagram/sablon/set-kare.py ad ..."""
import sys
import numpy as np
from PIL import Image, ImageFilter
N = 1000
for ad in sys.argv[1:]:
    g = Image.open(f'public/images/genel/{ad}.webp').convert('RGB')
    h = round(N * g.height / g.width); g = g.resize((N, h), Image.LANCZOS)
    ust = (N - h) // 2; alt = N - h - ust
    tuval = Image.new('RGB', (N, N)); tuval.paste(g, (0, ust))
    serit = g.crop((0, 0, N, 30)).resize((N, ust + 30), Image.BICUBIC).filter(ImageFilter.GaussianBlur(4))
    tuval.paste(serit.crop((0, 0, N, ust)), (0, 0))
    taban = np.asarray(g.crop((0, h - 70, N, h))).astype(np.float32)
    sira = []
    i, yon = 69, -1
    for _ in range(alt):  # ileri-geri yansıt
        sira.append(i); i += yon
        if i < 0 or i > 69: yon = -yon; i += 2 * yon
    dolgu = taban[sira]
    a = Image.fromarray(dolgu.clip(0, 255).astype(np.uint8))
    b = np.asarray(a.filter(ImageFilter.GaussianBlur(8))).astype(np.float32)
    t = np.linspace(0.3, 1, alt)[:, None, None]
    tuval.paste(Image.fromarray((dolgu * (1 - t) + b * t).clip(0, 255).astype(np.uint8)), (0, ust + h))
    arr = np.asarray(tuval).astype(np.float32); bl = np.asarray(tuval.filter(ImageFilter.GaussianBlur(3))).astype(np.float32)
    for y0 in (ust, ust + h):
        for dy in range(-6, 7):
            y = y0 + dy
            if 0 <= y < N:
                w = 1 - abs(dy) / 7; arr[y] = arr[y] * (1 - w) + bl[y] * w
    Image.fromarray(arr.clip(0, 255).astype(np.uint8)).save(f'public/images/genel/{ad}-kare.webp', 'WEBP', quality=86, method=6)
    print(ad + '-kare', ust, alt)
