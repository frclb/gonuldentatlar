"""En son Gemini indirmesini yeni-gorseller/deneme/<ad>.jpg olarak alır.
Kullanım: python3 instagram/sablon/gemini-al.py <ad> [en-fazla-saniye]"""
import glob, os, sys, time, shutil
from PIL import Image
ad = sys.argv[1]; sinir = int(sys.argv[2]) if len(sys.argv) > 2 else 150
t0 = time.time(); son = None
while time.time() - t0 < 40:
    fs = sorted(glob.glob(os.path.expanduser('~/Downloads/Gemini_Generated_Image_*')), key=os.path.getmtime)
    fs = [f for f in fs if not f.endswith('.crdownload')]
    if fs and time.time() - os.path.getmtime(fs[-1]) < sinir:
        son = fs[-1]; break
    time.sleep(2)
assert son, 'yeni indirme yok'
time.sleep(1)
hedef = f'yeni-gorseller/deneme/{ad}.jpg'
im = Image.open(son)
if im.format == 'JPEG': shutil.copy(son, hedef)
else: im.convert('RGB').save(hedef, quality=95)
os.remove(son)
print(ad, Image.open(hedef).size)
