"""Set görselinin önce/sonra karşılaştırması: üstte tam görseller, altta yakın kırpım.
Kullanım: python3 set-kiyas.py kaynak.png yeni.jpg cikti.jpg x0 y0 (yakın kırpımın kaynak koordinatı)"""
import sys
from PIL import Image
a = Image.open(sys.argv[1]).convert('RGB'); b = Image.open(sys.argv[2]).convert('RGB').resize(a.size)
x0, y0 = int(sys.argv[4]), int(sys.argv[5])
W = Image.new('RGB', (1610, 540 + 460), 'white')
W.paste(a.resize((800, round(800 * a.height / a.width))), (0, 0)); W.paste(b.resize((800, round(800 * a.height / a.width))), (810, 0))
W.paste(a.crop((x0, y0, x0 + 800, y0 + 450)), (0, 545)); W.paste(b.crop((x0, y0, x0 + 800, y0 + 450)), (810, 545))
W.save(sys.argv[3], quality=88)
