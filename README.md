# Gönülden Tatlar

Cup tatlılar, waffle, milkshake ve dondurma satan **Gönülden Tatlar** için mobil öncelikli,
satış odaklı web sitesi ve yönetim paneli.

React + TypeScript + Vite + Tailwind CSS v4 ile geliştirildi. Sipariş akışı WhatsApp üzerinden
tamamlanır; mimari ileride online ödeme ve gerçek backend eklenebilecek şekilde kurgulandı.

## Kurulum

```bash
npm install
cp .env.example .env   # değerleri doldur
npm run dev
```

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu (http://localhost:5173) |
| `npm run build` | TypeScript kontrolü + production build |
| `npm run preview` | Build çıktısını yerelde çalıştır |
| `npm run lint` | ESLint |
| `npm run typecheck` | Sadece tip kontrolü |
| `python3 scripts/optimize_photos.py <klasör>` | Ürün fotoğraflarını WebP'ye optimize et |

## Environment değişkenleri

`.env` dosyası (`.env.example` üzerinden kopyalanır):

```
VITE_WHATSAPP_NUMBER=905321234567   # ülke kodu ile, sadece rakam
VITE_GOOGLE_MAPS_API_KEY=           # opsiyonel
VITE_API_URL=                       # ileride backend bağlanınca
VITE_ADMIN_PASSWORD=gonulden2026    # demo admin şifresi
```

WhatsApp numarası koda gömülü değildir; `.env` üzerinden yönetilir ve yönetim panelinden de
güncellenebilir.

## Sayfalar

| Yol | Sayfa |
| --- | --- |
| `/` | Ana sayfa |
| `/menu` | Menü (`?kategori=` ve `?kampanya=` filtreleri) |
| `/menu/:slug` | Ürün detayı ve özelleştirme |
| `/kampanyalar` | Kampanyalar |
| `/hakkimizda` | Hakkımızda |
| `/iletisim` | İletişim |
| `/sepet` | Sepet |
| `/siparis` | Sipariş bilgileri / checkout |
| `/admin` | Yönetim paneli (şifre korumalı) |

## Yönetim paneli

`/admin` adresinden `VITE_ADMIN_PASSWORD` ile girilir. Dashboard, ürün / kategori / kampanya
CRUD'u, sipariş yönetimi, müşteri listesi ve işletme ayarları içerir.

> **Not:** Bu demo authentication yalnızca geliştirme içindir. Canlıya çıkarken gerçek bir
> kimlik doğrulama servisi (JWT / httpOnly cookie) ile değiştirilmelidir.

## Veri

Ürün, kategori, kampanya ve ayarlar `src/data/catalog.ts` içindeki mock data ile başlar;
yönetim panelindeki değişiklikler ve siparişler tarayıcının `localStorage`'ında saklanır.
`İşletme Ayarları → Verileri sıfırla` ile başlangıç durumuna dönülür.

Gerçek backend bağlandığında yalnızca `src/context/CatalogContext.tsx` içindeki veri
kaynağının API çağrılarıyla değiştirilmesi yeterlidir; bileşenler değişmez.

## Görseller

Ürün fotoğrafları `public/images/products/<slug>.webp` altında durur (1100px, ~70 KB).

Yeni fotoğraf eklemek için:

1. Yüksek çözünürlüklü kare fotoğrafı bir klasöre koyun.
2. `scripts/optimize_photos.py` içindeki `SLUGS` sözlüğüne `dosya adı → slug` satırı ekleyin.
3. Çalıştırın:

```bash
python3 scripts/optimize_photos.py ~/Desktop/menuresimler
```

Script fotoğrafı kare kırpar, 1100px'e küçültür, WebP'ye çevirir ve paylaşım görselini
(`hero/og-cover.jpg`) yeniden üretir. Ardından `src/data/catalog.ts` içinde ürünün `image`
alanını güncellemek yeterlidir.

Kategori görselleri, marka hikayesi ve Instagram bölümü de aynı ürün fotoğraflarını kullanır —
ayrı dosya tutulmaz.

## Design system

Tüm renk, tipografi, spacing, radius ve gölge token'ları `src/index.css` içindeki `@theme`
bloğunda tanımlıdır. Bileşenler kendi rengini üretmez; hepsi bu token'lardan beslenir.

Palet, markanın referans görselinden türetildi ve açık tonlara kaydırıldı:
krem kağıt zemin, sıcak kakao (primary), zeytin yeşili (secondary), blush pembe (accent).

## Menü

Menüde 23 ürün var: 20 magnolya çeşidi ve 3 cup. Kategoriler ürünlerin bisküvi/çeşni
ailesine göre ayrılır — Klasik Magnolya, Kakaolu Bisküvili, Oreolu, Lotuslu, Cevizli, Cup.

> **Fiyatlar geçicidir.** `src/data/catalog.ts` içindeki `price` alanları işletmeden
> alınacak güncel liste ile değiştirilmelidir.

Ürünlerde varsayılan olarak seçenek (boyut/ekstra) tanımlı değildir; çeşitler ayrı ürün
olarak listelenir. İhtiyaç olursa yönetim panelinden ürüne "Boyut" veya "Boyut + ekstra"
seti iliştirilebilir.

## Deploy — GitHub Pages

Site tamamen statiktir: backend, veritabanı ve ödeme entegrasyonu yoktur.
Siparişler WhatsApp üzerinden iletilir.

### 1. Depoyu GitHub'a gönder

```bash
git init && git add -A && git commit -m "Gönülden Tatlar web sitesi"
```

Ardından GitHub'da boş bir repo açıp `git remote add origin ...` + `git push -u origin main`.

### 2. Pages'i aç

Repo → **Settings → Pages → Source: GitHub Actions**.
`.github/workflows/deploy.yml` her `main` push'unda otomatik build alıp yayınlar.

### 3. Değişkenleri tanımla

Repo → **Settings → Secrets and variables → Actions**

| Ad | Tür | Değer |
| --- | --- | --- |
| `VITE_WHATSAPP_NUMBER` | Variable | `905321234567` (ülke kodu, sadece rakam) |
| `VITE_BASE_PATH` | Variable | Proje sayfasında `/repo-adi/`, kendi domaininde **tanımlama** |
| `VITE_ADMIN_PASSWORD` | Secret | Panel şifresi |

> `VITE_` ile başlayan tüm değerler derlenen JavaScript'e gömülür ve tarayıcıdan
> okunabilir. `VITE_ADMIN_PASSWORD` gerçek bir güvenlik katmanı değil, yalnızca
> paneli kazara açılmaktan koruyan bir kilittir. Gizli kalması gereken hiçbir
> bilgiyi buraya koymayın.

### 4. Kendi domainin

Asıl (canonical) domain **gonuldentatlar.com**. `public/CNAME` dosyası bu adresi
içerir ve build çıktısına kopyalanır — GitHub Actions ile deploy ederken custom
domain ayarının sıfırlanmaması için gereklidir. Asıl domaini değiştirirsen bu
dosyayı da güncelle.

Custom domain kullanırken `VITE_BASE_PATH` **tanımlanmamalıdır** (site kökte yayınlanır).

#### DNS kayıtları (gonuldentatlar.com)

```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
AAAA  @    2606:50c0:8000::153
AAAA  @    2606:50c0:8001::153
AAAA  @    2606:50c0:8002::153
AAAA  @    2606:50c0:8003::153
CNAME www  <kullanici-adi>.github.io
```

Sıra önemli: önce DNS kayıtlarını gir, yayılmasını bekle, **sonra** Settings →
Pages → Custom domain alanını doldur. Sertifika üretilince "Enforce HTTPS"
kutusu aktifleşir.

> DNS'i Cloudflare üzerinden yönetiyorsan bu kayıtlar **DNS only (gri bulut)**
> olmalı. Proxy (turuncu bulut) açıkken GitHub sertifikayı üretemez.

#### İkinci domain (gonuldentatlar.com.tr)

GitHub Pages bir siteye yalnızca **tek** custom domain bağlar. İkinci domain,
asıl domaine 301 ile yönlendirilir — kayıt firmasının "web yönlendirme"
özelliğiyle veya Cloudflare'de bir Redirect Rule ile. Ayrıntı: README'nin
"İki domaini bağlama" bölümü.

### İki domaini bağlama

| Domain | Rol | Nasıl |
| --- | --- | --- |
| `gonuldentatlar.com` | Asıl site | GitHub Pages custom domain + yukarıdaki DNS |
| `www.gonuldentatlar.com` | Otomatik | `CNAME www` kaydı; GitHub apex'e yönlendirir |
| `gonuldentatlar.com.tr` | Yönlendirme | 301 → `https://gonuldentatlar.com` |
| `www.gonuldentatlar.com.tr` | Yönlendirme | 301 → `https://gonuldentatlar.com` |

Aynı içeriği iki domainden birden yayınlama — arama motorları bunu yinelenen
içerik sayar. Tek asıl domain, diğeri 301.

### SPA yönlendirmesi

GitHub Pages'te sunucu tarafı rewrite yoktur; `/menu/lotus-cup` gibi bir adres
doğrudan açıldığında 404 döner. `scripts/make-404.mjs` build sonrası bir
`dist/404.html` üretir: bu dosya istenen yolu query string'e taşıyıp köke
yönlendirir, `index.html` içindeki küçük script de adresi geri yazar.
Sonuç: temiz, SEO dostu URL'ler korunur. Ek ayar gerekmez.

### Yerelde production çıktısını denemek

```bash
npm run build && npm run preview
```

## Statik yayında admin paneli

Backend olmadığı için panel değişiklikleri **yalnızca o tarayıcıda** geçerlidir;
müşterilerin gördüğü menüyü değiştirmez. Panelde bu uyarı sürekli görünür.

Menü kalıcı olarak nasıl güncellenir:

1. Panelden değişiklikleri yap → **İşletme Ayarları → Veri → Yedek indir**
2. JSON dosyasını geliştiriciye ilet (veya kendin `src/data/catalog.ts` içine işle)
3. `git push` → GitHub Actions 1–2 dakikada yayınlar

**Yedekten yükle** ile aynı dosyayı başka bir cihazda geri açabilirsin.
