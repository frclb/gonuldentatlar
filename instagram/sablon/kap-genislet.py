"""Gemini kare görselini yatayda %12 genişletir; kap gerçek oranına gelir, görsel yine kare kalır.

Kullanım: python3 kap-genislet.py girdi.png cikti.png [oran]
"""
import sys
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
k = float(sys.argv[3]) if len(sys.argv) > 3 else 1.12
im = Image.open(src).convert('RGB')
w, h = im.size
wide = im.resize((round(w * k), h), Image.LANCZOS)
left = (wide.width - w) // 2
wide.crop((left, 0, left + w, h)).save(out)
