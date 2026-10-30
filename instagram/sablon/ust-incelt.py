"""Üst bisküvi katmanını inceltir, altındaki krema bandını uzatır; kap ve diğer katmanlar yerinde kalır.
[a, b) satırları (düz bisküvi) çıkarılır, [b, c) satırları (bisküvi-krema sınırı) yukarı kayar,
[c, d) satırları (düz krema) boşalan yeri dolduracak kadar dikey gerilir. d'nin altı hiç değişmez.

Kenarlardaki meyveler kremanın içine daha yukarıdan başlıyorsa, o sütunlar için gerilecek krema satırları
ayrıca verilir: x0:x1:c2:d2 (d2 <= c olmalı; [c2, d2) satırları [c - kesik, d) aralığını doldurur).

Kullanım: python3 ust-incelt.py girdi cikti a b c d [x0:x1:c2:d2 ...]
"""
import sys
import numpy as np
from PIL import Image

src = Image.open(sys.argv[1]).convert('RGB')
a, b, c, d = (int(v) for v in sys.argv[3:7])
arr = np.asarray(src).astype(np.float32)
h, w = arr.shape[:2]
cut = b - a


def resample(c, d):
    y = np.arange(h, dtype=np.float32)
    sy = y.copy()
    sy[a:c - cut] = y[a:c - cut] + cut
    span = np.arange(c - cut, d, dtype=np.float32)
    sy[c - cut:d] = c + (span - (c - cut)) * (d - c) / (d - (c - cut))
    y0 = np.floor(sy).astype(int).clip(0, h - 1)
    y1 = (y0 + 1).clip(0, h - 1)
    t = (sy - y0)[:, None, None]
    return arr[y0] * (1 - t) + arr[y1] * t


out = resample(c, d)
for spec in sys.argv[7:]:
    x0, x1, c2, d2 = (int(v) for v in spec.split(':'))
    # yalnızca gerilen krema bandı değişir; sütun sınırında 12 piksellik yumuşak geçiş
    yy = np.arange(c - cut, d, dtype=np.float32)
    sy = c2 + (yy - (c - cut)) * (d2 - c2) / (d - (c - cut))
    y0 = np.floor(sy).astype(int); t = (sy - y0)[:, None, None]
    band = arr[y0] * (1 - t) + arr[(y0 + 1).clip(0, h - 1)] * t
    xs = np.arange(w)
    m = np.clip(np.minimum(xs - x0, x1 - xs) / 12 + 0.5, 0, 1)[None, :, None]
    out[c - cut:d] = out[c - cut:d] * (1 - m) + band * m
# kesik yerinde bisküvi taneleri birbirine geçsin diye birkaç satır yumuşak geçiş
for i in range(-3, 4):
    w = (i + 4) / 8
    out[a + i] = arr[a + i] * (1 - w) + arr[a + i + cut] * w
Image.fromarray(out.round().clip(0, 255).astype(np.uint8)).save(sys.argv[2], quality=95)
