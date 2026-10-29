"""Kabı kısaltır: verilen satırdan başlayan şeridi (düz krema bandı gibi) çıkarır, altını yukarı kaydırır,
en alttaki masa satırlarını yansıtarak tamamlar. Görsel boyutu değişmez.

Kullanım: python3 kap-kisalt.py girdi.png cikti.png baslangic_satiri satir_sayisi
"""
import sys
import numpy as np
from PIL import Image

src, out, y0, n = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
a = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
h = a.shape[0]
fade = 6  # dikiş yerinde yumuşak geçiş
top = a[:y0]
rest = a[y0 + n:]
# dikişte üstteki son satırlarla alttaki ilk satırları karıştır
w = np.linspace(0, 1, fade)[:, None, None]
seam = top[-fade:] * (1 - w) + rest[:fade] * w
merged = np.concatenate([top[:-fade], seam, rest[fade:]], 0)
# eksilen satırları en alttaki masa satırlarını aynalayarak tamamla
missing = h - len(merged)
merged = np.concatenate([merged, merged[-missing:][::-1]], 0)
Image.fromarray(np.clip(merged, 0, 255).astype(np.uint8)).save(out)
