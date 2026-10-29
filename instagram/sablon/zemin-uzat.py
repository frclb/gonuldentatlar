"""Kare ürün görselini 1080x1920 hikâye zeminine yerleştirir; taşan alanları kenar yansıtma + bulanıklıkla doldurur."""
import sys, numpy as np
from PIL import Image, ImageFilter
src, out = sys.argv[1], sys.argv[2]
s, ox, oy = float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5])
strip = float(sys.argv[6]) if len(sys.argv) > 6 else 0.85  # sağ uzantının kopyalanacağı şerit (kabın dışında kalmalı)
im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
N = im.shape[0]
u0, u1 = int(np.floor(-ox / s)), int(np.ceil((1080 - ox) / s))
v0, v1 = int(np.floor(-oy / s)), int(np.ceil((1920 - oy) / s))
u = np.arange(u0, u1); v = np.arange(v0, v1)
def tile(a, lo, hi):
    """Taşan koordinatları [lo, hi] şeridi içinde ileri-geri yansıt."""
    p = hi - lo
    t = np.mod(a - hi, 2 * p)
    return np.where(t < p, hi - t, lo + (t - p))
uu = np.where(u > N - 1, tile(u, int(N * strip), N - 1), np.where(u < 0, tile(-u, 0, int(N * (1 - strip))), u))
vb = N - 1 - (v - (N - 1)) * (55 / max(v1 - N, 1))           # alt: son şeridi gerip yansıt (ön plan ahşap)
vv = np.where(v > N - 1, vb, np.where(v < 0, tile(-v, 0, 60), v))
uu = np.clip(uu, 0, N - 1).astype(int); vv = np.clip(np.round(vv), 0, N - 1).astype(int)
ext = im[vv[:, None], uu[None, :]]
dout = np.maximum.reduce([np.maximum(0, u - (N - 1))[None, :] + 0 * v[:, None], np.maximum(0, -u)[None, :] + 0 * v[:, None],
                          np.maximum(0, -v)[:, None] + 0 * u[None, :], np.maximum(0, v - (N - 1))[:, None] + 0 * u[None, :]]).astype(np.float32)
blurred = np.asarray(Image.fromarray(ext.astype(np.uint8)).filter(ImageFilter.GaussianBlur(16))).astype(np.float32)
t = np.clip(dout / 150, 0, 1); w = (t * t * (3 - 2 * t))[..., None]
mix = ext * (1 - w) + blurred * w
img = Image.fromarray(np.clip(mix, 0, 255).astype(np.uint8))
W2, H2 = round(img.width * s), round(img.height * s)
img = img.resize((W2, H2), Image.LANCZOS)
cx, cy = round(u0 * s + ox), round(v0 * s + oy)
canvas = Image.new('RGB', (1080, 1920))
canvas.paste(img, (cx, cy))
canvas.save(out)
print('ok', img.size, (cx, cy))
