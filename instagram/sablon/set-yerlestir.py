"""Gemini set görselini eski görselin boyutuna getirip public/images/genel/<ad>.webp olarak yazar.
Kullanım: python3 instagram/sablon/set-yerlestir.py ad:deneme-adi ..."""
import sys
from PIL import Image, ImageFilter
for s in sys.argv[1:]:
    ad, dn = s.split(':')
    hedef = f'public/images/genel/{ad}.webp'
    boy = Image.open(hedef).size
    im = Image.open(f'yeni-gorseller/deneme/{dn}.jpg').convert('RGB')
    w, h = im.size; r = boy[0] / boy[1]
    if abs(w / h - r) > 0.01:  # oran farkı varsa ortadan kırp
        if w / h > r: nw = round(h * r); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
        else: nh = round(w / r); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im = im.resize(boy, Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.2, percent=40, threshold=2))
    im.save(hedef, 'WEBP', quality=86, method=6)
    print(ad, boy)
