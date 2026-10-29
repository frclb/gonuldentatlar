"""Yeni ürün görselini sitedeki eski görselin çerçevesine oturtur (1100x1100 webp).
Eski görselin (u, v) noktası yeni görselde (a*u + bx, a*v + by) noktasına düşer; görselin dışına taşan
kenarlar, kenar sütunları yansıtılıp giderek bulanıklaştırılarak tamamlanır.

Kullanım: python3 site-kare.py girdi cikti.webp a bx by
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

src = Image.open(sys.argv[1]).convert('RGB')
out_path = sys.argv[2]
a, bx, by = (float(v) for v in sys.argv[3:6])
N = 1100
w, h = src.size
x0, x1 = bx, a * N + bx
y0, y1 = by, a * N + by
padl, padr = max(0, int(np.ceil(-x0)) + 2), max(0, int(np.ceil(x1 - w)) + 2)
padt, padb = max(0, int(np.ceil(-y0)) + 2), max(0, int(np.ceil(y1 - h)) + 2)
arr = np.asarray(src).astype(np.float32)
# taşan kenarlar: kenardaki E piksellik şerit yatay/dikey olarak gerilir (duvar ve masa çizgileri yatay olduğu için doğal durur)
E = 90
def stretch(a2, before, after, axis):
    n = a2.shape[axis]
    idx = np.arange(-before, n + after, dtype=np.float32)
    lo = np.where(idx < E, idx * E / (E + before) + 0 if before else idx, idx)
    m = idx.copy()
    if before:
        sel = idx < E
        m[sel] = (idx[sel] + before) * E / (E + before)
    if after:
        sel = idx > n - 1 - E
        m[sel] = (n - 1 - E) + (idx[sel] - (n - 1 - E)) * E / (E + after)
    i0 = np.clip(np.floor(m).astype(int), 0, n - 1); i1 = np.clip(i0 + 1, 0, n - 1); f = m - np.floor(m)
    shape = [1, 1, 1]; shape[axis] = -1; f = f.reshape(shape)
    return np.take(a2, i0, axis=axis) * (1 - f) + np.take(a2, i1, axis=axis) * f
ext = stretch(arr, padl, padr, 1)
ext = stretch(ext, padt, padb, 0)
img = Image.fromarray(ext.clip(0, 255).astype(np.uint8))
box = (x0 + padl, y0 + padt, x1 + padl, y1 + padt)
res = img.transform((N, N), Image.EXTENT, box, Image.BICUBIC)
res.save(out_path, 'WEBP', quality=86, method=6)
res.save(out_path.replace('.webp', '.png'))
print('kenar payı', padl, padr, padt, padb)
