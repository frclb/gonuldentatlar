"""Kaşık hikâyesinin 1080x1920 videosu. Kavanoz ve duvar baştan sona tek bir keskin fotoğraftan gelir;
üzerinde tek parça kaşık hareket eder (hareket bulanıklığıyla). Kareler üst üste bindirilmediği için görüntü yumuşamaz.

Kullanım: python3 kasik-video.py <kare-klasörü> <yazı-klasörü> <çıktı.mp4> <kaşıksız> <boş-kaşık> <son-kare>
Yazı klasöründe saydam a.png, b.png, c.png, d.png bulunur."""
import subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageOps, ImageFilter

kareler, yazilar, cikti, bos_ad, havada_ad, son_ad = sys.argv[1:]
W, H, FPS, UST, SURE = 1080, 1920, 30, 70, 8.0
PAY = 700  # kaşık katmanı üstte ve sağda bu kadar uzatılır, sapın ucu kadraja girmesin
ALT_KARE, ENSTANTANE = 8, .5  # hareket bulanıklığı: kare başına örnek sayısı, açık kalma oranı

AGIZ = (535, 875, 265, 52)  # kavanoz ağzının elipsi (merkez x, y, yarıçaplar): kaşık ön kenarın altında kırıntılara girer
ILMEK = (495, 960, 110, 125)  # krema şeridi ve kırıntıdaki çukurun bölgesi (son karede var, başta yok)
BOS_BOYUN, DOLU_BOYUN = (815, 570), (830, 640)  # kaşık boynunun karelerdeki yeri (kase ile sapın birleştiği nokta)

# Kaşığın yolu: (saniye, boyun x, boyun y, açı)
INIS = [(.30, 1435, -230, 0), (1.00, 815, 570, 0), (1.65, 640, 960, 2)]
CIKIS = [(1.75, 648, 964, -12), (2.40, 790, 700, -3), (2.95, 830, 640, 0)]
SERIT = (2.45, 2.85)  # krema şeridinin belirdiği aralık
yazi = [('a', 0.1, 0.4), ('b', 2.9, 0.4), ('c', 3.4, 0.35), ('d', 3.7, 0.4)]

yumusak = lambda x: x * x * (3 - 2 * x)


def tuvale(ad):
    im = Image.open(f'{kareler}/{ad}.jpg').convert('RGB').resize((W, 1935), Image.LANCZOS)
    t = Image.new('RGB', (W, H))
    t.paste(im, (0, -UST))
    kalan = H - (1935 - UST)
    t.paste(ImageOps.flip(im.crop((0, 1935 - kalan - 2, W, 1935))).filter(ImageFilter.GaussianBlur(3)), (0, 1935 - UST - 2))
    return np.asarray(t).astype(np.float32)


def bulanik(m, r):
    return np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))).astype(np.float32) / 255


def kasik_maskesi(k, bos, sinir, esik):
    """Kaşıksız kareyle farktan kaşığı çıkarır: sapın kadrajdan çıktığı kenara bağlı en büyük parça, delikleri dolu."""
    d = k - bos
    # Gemini duvarın parlaklığını da hafifçe oynatır. Yavaş değişen fark yalnızca kaşık olmayan yerlerden hesaplanır,
    # yoksa kaşığın çevresine hale biner.
    arka = (np.abs(d).sum(axis=2) < 30).astype(np.float32)
    B = 40

    def yavas_alan(a):
        o = a.reshape(H // B, B, W // B, B).sum(axis=(1, 3))
        o = sum(np.roll(np.roll(o, i, 0), j, 1) for i in (-1, 0, 1) for j in (-1, 0, 1))
        return np.asarray(Image.fromarray(o.astype(np.float32), 'F').resize((W, H), Image.BILINEAR))

    pay = yavas_alan(arka)
    yavas = np.stack([yavas_alan(d[..., c] * arka) / (pay + 1) for c in range(3)], axis=2)
    fark = np.abs(d - yavas).sum(axis=2)
    fark[sinir:] = 0
    m = Image.fromarray(((fark > esik) * 255).astype(np.uint8)).resize((W // 2, H // 2), Image.BILINEAR).point(lambda v: 255 if v > 127 else 0)
    m = m.filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MinFilter(7))
    a = np.asarray(m).copy()
    sap = np.asarray(m.filter(ImageFilter.MaxFilter(21)).filter(ImageFilter.MinFilter(21)))  # sapın parlak çizgisinde açılan yarığı kapat
    a[:600 // 2] = sap[:600 // 2]
    en_iyi, en_buyuk = None, 0
    for y, x in [(0, x) for x in range(a.shape[1])] + [(y, a.shape[1] - 1) for y in range(a.shape[0])]:
        if a[y, x] == 255:
            g = Image.fromarray(a).copy()  # fromarray salt okunurdur, floodfill sessizce vazgeçer
            ImageDraw.floodfill(g, (x, y), 128)
            g = np.asarray(g)
            alan = (g == 128).sum()
            a[g == 128] = 200
            if alan > en_buyuk:
                en_iyi, en_buyuk = g == 128, alan
    if en_iyi is None:
        raise SystemExit('kaşık bulunamadı')
    d = Image.new('L', (a.shape[1] + 2, a.shape[0] + 2), 255)
    d.paste(Image.fromarray((~en_iyi * 255).astype(np.uint8)), (1, 1))
    ImageDraw.floodfill(d, (0, 0), 128)
    dolu = np.asarray(d)[1:-1, 1:-1] != 128
    im = Image.fromarray((dolu * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.3))
    return np.asarray(im).astype(np.float32) / 255


def katman(k, m, boyun, bas_boy):
    """Kaşığı büyütülmüş saydam katmana koyar; sapın kadraj dışındaki küçük payı ucundaki kesitin rengiyle doldurulur."""
    r = np.zeros((H + PAY, W + PAY, 4), np.float32)
    r[PAY:, :W, :3] = k
    r[PAY:, :W, 3] = m * 255
    ys, xs = np.nonzero(m > .5)
    kenar = (xs >= W - 3) | (ys <= 2)
    ex, ey = xs[kenar].mean(), ys[kenar].mean()
    uz = np.hypot(xs - ex, ys - ey)
    uc = (uz > 45) & (uz < 170)  # kadraj kenarının hemen içindeki sap parçası
    c = np.array([xs[uc].mean(), ys[uc].mean()])
    u = np.linalg.svd(np.stack([xs[uc], ys[uc]], 1) - c, full_matrices=False)[2][0]
    if u[0] * (ex - c[0]) + u[1] * (ey - c[1]) < 0:
        u = -u
    n = np.array([-u[1], u[0]])
    o_uc = (xs[uc] - c[0]) * n[0] + (ys[uc] - c[1]) * n[1]
    orta = np.median(o_uc)
    yari = np.percentile(np.abs(o_uc - orta), 90)
    kutu = np.arange(-int(yari) - 2, int(yari) + 3, dtype=np.float32)
    boy = np.arange(-60, 61, 6, dtype=np.float32)
    kx = np.clip(np.round(c[0] + np.outer(boy, np.full_like(kutu, u[0])) + n[0] * (kutu + orta)).astype(int), 0, W - 1)
    ky = np.clip(np.round(c[1] + np.outer(boy, np.full_like(kutu, u[1])) + n[1] * (kutu + orta)).astype(int), 0, H - 1)
    kesit = k[ky, kx].mean(axis=0)
    Y, X = np.mgrid[:H + PAY, :W + PAY]
    t = (X - c[0]) * u[0] + (Y - PAY - c[1]) * u[1]
    o = (X - c[0]) * n[0] + (Y - PAY - c[1]) * n[1] - orta
    sec = ((Y < PAY) | (X >= W)) & (t > 0) & (np.abs(o) < yari + 2)
    for i in range(3):
        r[..., i][sec] = np.interp(o[sec], kutu, kesit[:, i])
    r[..., 3][sec] = np.clip(yari + .5 - np.abs(o[sec]), 0, 1) * 255
    # Baş (kase + boyun) sabit kalır; sap ayrı parça olur ki kaşık derine indikçe boyuna esnesin, kadraj içinde uç görünmesin
    uc_nokta = np.array([ex, ey + PAY], np.float64)
    b = np.array([boyun[0], boyun[1] + PAY], np.float64)
    e = (uc_nokta - b) / np.linalg.norm(uc_nokta - b)
    ek = b + e * bas_boy
    tt = (X - ek[0]) * e[0] + (Y - ek[1]) * e[1]
    w = np.clip(tt / 16 + .5, 0, 1).astype(np.float32)
    bas_r, sap_r = r.copy(), r.copy()
    bas_r[..., 3] *= 1 - w
    sap_r[..., 3] *= w
    pil = lambda a: Image.fromarray(a.clip(0, 255).astype(np.uint8), 'RGBA')
    return dict(bas=pil(bas_r), sap=pil(sap_r), boyun=b, ek=ek, e=e, boy=float(np.linalg.norm(uc_nokta - ek)))


def matris(aci, dy, dx, merkez):
    """Merkez etrafında döndürüp kaydıran dönüşüm (x, y sırasıyla)."""
    c, s = np.cos(np.radians(aci)), np.sin(np.radians(aci))
    mx, my = merkez
    return np.array([[c, -s, mx + dx - c * mx + s * my], [s, c, my + dy - s * mx - c * my], [0, 0, 1]], np.float64)


def yol(noktalar, t):
    """Noktalardan yumuşak geçen eğri (uçlarda ve dönüşte hız sıfıra iner; ilk nokta kadraj dışı olduğundan hızlı başlar)."""
    ts = np.array([p[0] for p in noktalar])
    v = np.array([p[1:] for p in noktalar], np.float64)
    i = int(np.clip(np.searchsorted(ts, t) - 1, 0, len(ts) - 2))
    h = ts[i + 1] - ts[i]
    u = np.clip((t - ts[i]) / h, 0, 1)
    orta = (v[2] - v[0]) / (ts[2] - ts[0])
    bas = (v[1] - v[0]) / (ts[1] - ts[0]) if noktalar is INIS else np.zeros(3)
    egim = [bas, orta, np.zeros(3)]
    a, b = egim[i], egim[i + 1]
    return (2 * u**3 - 3 * u**2 + 1) * v[i] + (u**3 - 2 * u**2 + u) * h * a + (-2 * u**3 + 3 * u**2) * v[i + 1] + (u**3 - u**2) * h * b


def kasik_cevir(kat, n):
    """Kaşığı n = (boyun x, boyun y, açı) konumuna koyar; sap, ucu kadraj dışına ulaşacak kadar boyuna esner."""
    x, y, aci = n
    b = kat['boyun']
    P = matris(aci, y + PAY - b[1], x - b[0], (b[0], b[1]))
    j = P @ np.array([*kat['ek'], 1.0])
    e2 = P[:2, :2] @ kat['e']
    D = []
    if e2[0] > 1e-3:
        D.append((W - j[0]) / e2[0])
    if e2[1] < -1e-3:
        D.append((j[1] - PAY) / -e2[1])
    F = max(1.0, min(D) / kat['boy']) if D else 1.0
    ek = kat['ek']
    E = np.eye(3)
    E[:2, :2] += (F - 1) * np.outer(kat['e'], kat['e'])
    E[:2, 2] = ek - E[:2, :2] @ ek  # esnetme eklem noktası etrafında
    renk, alfa = 0, 0
    for parca, M in ((kat['bas'], P), (kat['sap'], P @ E)):
        T = np.linalg.inv(M)
        r = np.asarray(parca.transform(parca.size, Image.AFFINE, tuple(T[:2].ravel()), Image.BICUBIC).crop((0, PAY, W, H + PAY))).astype(np.float32)
        al = r[..., 3:] / 255
        renk, alfa = renk + r[..., :3] * al, alfa + al
    return renk, np.minimum(alfa, 1)


# ---------- Hazırlık ----------
bos, havada, son = tuvale(bos_ad), tuvale(havada_ad), tuvale(son_ad)
bolge = lambda x: x[1200:1880, 100:980].mean(axis=(0, 1))
bos = bos * (bolge(son) / bolge(bos))
havada = havada * (bolge(son) / bolge(havada))

m_bos = kasik_maskesi(havada, bos, 832, 36)
m_dolu = kasik_maskesi(son, bos, 905, 30)
k_bos, k_dolu = katman(havada, m_bos, BOS_BOYUN, 130), katman(son, m_dolu, DOLU_BOYUN, 110)

Y, X = np.mgrid[:H, :W].astype(np.float32)
# Plaka: son karenin kendisi; yalnızca kaşığın altı ve şerit bölgesi kaşıksız kareden doldurulur
genis = np.asarray(Image.fromarray((m_dolu * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(25))).astype(np.float32) / 255
genis = bulanik(genis, 7)[..., None]
plaka_son = son * (1 - genis) + bos * genis
ilmek = np.clip(1.25 - np.hypot((X - ILMEK[0]) / ILMEK[2], (Y - ILMEK[1]) / ILMEK[3]), 0, .25)[..., None] * 4
plaka_bas = plaka_son * (1 - ilmek) + bos * ilmek

# Kaşık ağzın ön kenarının altında görünmez; kenar düz çizgi olmasın diye kırıntı dokusuyla bozulur
gri = bos.mean(axis=2)
doku = gri - np.asarray(Image.fromarray(gri.clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))).astype(np.float32)
kx = np.clip((X - AGIZ[0]) / AGIZ[2], -1, 1)
agiz_y = AGIZ[1] + AGIZ[3] * np.sqrt(1 - kx * kx)
gorunur = np.clip((agiz_y - 8 + np.clip(doku, -12, 12) * .4 - Y) / 5, 0, 1)[..., None]


def kasik(t):
    """t anındaki kaşığın ön çarpımlı rengi ve saydamlığı."""
    if t < INIS[0][0]:
        return None
    if t <= INIS[-1][0]:
        return kasik_cevir(k_bos, yol(INIS, t))
    if t >= CIKIS[0][0]:
        return kasik_cevir(k_dolu, yol(CIKIS, t))
    # Kırıntıların içinde boş kaşık dolu kaşığa dönüşür: yalnızca sap görünür
    p = yumusak((t - INIS[-1][0]) / (CIKIS[0][0] - INIS[-1][0]))
    a = np.array(INIS[-1][1:]) * (1 - p) + np.array(CIKIS[0][1:]) * p
    c1, a1 = kasik_cevir(k_bos, (a[0], a[1], INIS[-1][3]))
    c2, a2 = kasik_cevir(k_dolu, (a[0], a[1], CIKIS[0][3]))
    return c1 * (1 - p) + c2 * p, a1 * (1 - p) + a2 * p


def kare_yap(t):
    g = yumusak(np.clip((t - SERIT[0]) / (SERIT[1] - SERIT[0]), 0, 1))
    plaka = plaka_bas * (1 - g) + plaka_son * g
    renk, alfa = np.zeros((H, W, 3), np.float32), np.zeros((H, W, 1), np.float32)
    for i in range(ALT_KARE):
        s = kasik(t + (i / ALT_KARE) * ENSTANTANE / FPS)
        if s is not None:
            renk += s[0]
            alfa += s[1]
    renk, alfa = renk / ALT_KARE * gorunur, alfa / ALT_KARE * gorunur
    return plaka * (1 - alfa) + renk


# ---------- Çıktı ----------
katman_yazi = {k: np.asarray(Image.open(f'{yazilar}/{k}.png').convert('RGBA')).astype(np.float32) for k, *_ in yazi}
ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                       '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-shortest',
                       '-vf', 'scale=out_color_matrix=bt709:out_range=tv:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p,setparams=range=tv:colorspace=bt709:color_primaries=bt709:color_trc=bt709',
                       '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
                       '-color_range', 'tv', '-c:a', 'aac', '-movflags', '+faststart', cikti], stdin=subprocess.PIPE)
BITIS = CIKIS[-1][0]
sabit = None
for n in range(int(SURE * FPS)):
    t = n / FPS
    if t >= BITIS:
        if sabit is None:
            m = m_dolu[..., None] * gorunur
            sabit = plaka_son * (1 - m) + son * m
        kare = sabit
    else:
        kare = kare_yap(t)
    gor = kare
    for k, b, s in yazi:
        a = yumusak(min(max((t - b) / s, 0), 1))
        if a > 0:
            al = katman_yazi[k][..., 3:] / 255 * a
            gor = gor * (1 - al) + katman_yazi[k][..., :3] * al
    ff.stdin.write(gor.clip(0, 255).astype(np.uint8).tobytes())
ff.stdin.close()
ff.wait()
print('bitti', cikti)
