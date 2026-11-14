"""Görselleri aynı yükseklikte yan yana koyar. Kullanım: python3 yan-yana.py cikti.jpg yukseklik g1 g2 ..."""
import sys
from PIL import Image, ImageDraw
out, H = sys.argv[1], int(sys.argv[2])
ims = []
for p in sys.argv[3:]:
    im = Image.open(p).convert('RGB'); im = im.resize((round(im.width * H / im.height), H)); ims.append((p, im))
W = Image.new('RGB', (sum(i.width for _, i in ims) + 10 * (len(ims) - 1), H + 22), 'white'); d = ImageDraw.Draw(W); x = 0
for p, im in ims:
    W.paste(im, (x, 22)); d.text((x + 4, 4), p.split('/')[-1], fill='black'); x += im.width + 10
W.save(out, quality=88)
