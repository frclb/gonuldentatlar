/**
 * Her sayfa ve her ürün için hazır HTML üretir; site haritasını yazar.
 *
 * GitHub Pages'te sunucu tarafı yönlendirme yok: /menu/spoonful gibi bir adres
 * doğrudan açılınca 404.html sunuluyordu. Ziyaretçi yine sayfayı görüyordu
 * (404.html adresi köke taşıyıp uygulamayı açar) ama:
 *   - sunucu 404 durum kodu döndüğü için arama motorları sayfayı dizine almıyor,
 *   - WhatsApp / Instagram önizleme botları JavaScript çalıştırmadığından ürün
 *     linki paylaşılınca ürünün adı ve fotoğrafı yerine genel başlık çıkıyordu.
 *
 * Bu betik vite build'den sonra dist/index.html'i şablon alıp her yol için
 * başlığı, açıklamayı, canonical ve paylaşım (OG) etiketlerini doldurulmuş bir
 * kopya yazar: /menu -> dist/menu.html, /menu/spoonful -> dist/menu/spoonful.html.
 * Pages "menu.html"yi "/menu" adresinden 200 ile sunar. Uygulama her sayfada
 * aynı şekilde açılır; useSeo zaten aynı metinleri (src/data/pageSeo.ts) kullanır.
 *
 * Ürün paylaşım görselleri: public/images/og/<slug>.jpg (1200x630).
 * Yeni ürün eklenince: python3 scripts/og-gorselleri.py
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createServer } from 'vite'

const KOK = process.cwd()
const DIST = join(KOK, 'dist')
const base = process.env.VITE_BASE_PATH || '/'
const domain = readFileSync(join(KOK, 'public/CNAME'), 'utf8').trim()
const ORIGIN = `https://${domain}`
const url = (path) => `${ORIGIN}${base.replace(/\/$/, '')}${path === '/' ? '/' : path}`

// Kaynak verisini uygulamanın kendisinden oku (tek kaynak)
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error', mode: 'production' })
const { PAGE_SEO } = await vite.ssrLoadModule('/src/data/pageSeo.ts')
const { products, campaigns } = await vite.ssrLoadModule('/src/data/catalog.ts')
await vite.close()

const sablon = readFileSync(join(DIST, 'index.html'), 'utf8')
const kacis = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Şablondaki tek bir etiketi değiştirir; bulunamazsa yayını durdurur (şablon değişmişse fark edilsin) */
function degistir(html, desen, yeni, ad) {
  const eslesme = html.match(desen)
  if (!eslesme) throw new Error(`prerender: index.html içinde "${ad}" bulunamadı`)
  return html.replace(desen, yeni)
}
const meta = (html, attr, key, deger) =>
  degistir(
    html,
    new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/>`),
    `<meta ${attr}="${key}" content="${kacis(deger)}" />`,
    key,
  )

function sayfa({ title, description, path, image, imageAlt, imageSize, noindex }) {
  const tamBaslik = title.includes('Gönülden Tatlar') ? title : `${title} | Gönülden Tatlar`
  let html = sablon
  html = degistir(html, /<title>[^<]*<\/title>/, `<title>${kacis(tamBaslik)}</title>`, 'title')
  html = meta(html, 'name', 'description', description)
  html = meta(html, 'property', 'og:title', tamBaslik)
  html = meta(html, 'property', 'og:description', description)
  html = meta(html, 'property', 'og:url', url(path))
  html = meta(html, 'name', 'twitter:title', tamBaslik)
  html = meta(html, 'name', 'twitter:description', description)
  html = degistir(html, /<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${url(path)}" />`, 'canonical')
  if (image) {
    html = meta(html, 'property', 'og:image', url(image))
    html = meta(html, 'name', 'twitter:image', url(image))
    html = meta(html, 'property', 'og:image:width', imageSize[0])
    html = meta(html, 'property', 'og:image:height', imageSize[1])
    html = meta(html, 'property', 'og:image:alt', imageAlt)
  }
  if (path !== '/') {
    // Ana sayfanın büyük görselini diğer sayfalarda önceden indirmeye gerek yok
    html = html.replace(/\s*<link rel="preload" as="image"[^>]*>/, '')
  }
  if (noindex) {
    html = html.replace('<meta name="theme-color"', '<meta name="robots" content="noindex" />\n    <meta name="theme-color"')
  }
  // JavaScript'i kapalı ziyaretçi ve botlar için kısa metin
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"></div>\n    <noscript><h1>${kacis(tamBaslik)}</h1><p>${kacis(description)}</p><p><a href="${url('/menu')}">Menüyü gör</a></p></noscript>`,
  )
  return html
}

function yaz(dosya, html) {
  const tam = join(DIST, dosya)
  mkdirSync(dirname(tam), { recursive: true })
  writeFileSync(tam, html)
}

// Sabit sayfalar. Sepet ve sipariş kişiye özel: açılsın ama dizine girmesin
const sabit = [
  ['menu', PAGE_SEO.menu],
  ['hakkimizda', PAGE_SEO.about],
  ['iletisim', PAGE_SEO.contact],
  ['kampanyalar', PAGE_SEO.campaigns],
  ['kvkk', PAGE_SEO.kvkk],
  ['gizlilik', PAGE_SEO.privacy],
  ['sepet', { ...PAGE_SEO.cart, noindex: true }],
  ['siparis', { ...PAGE_SEO.checkout, noindex: true }],
]
for (const [ad, seo] of sabit) yaz(`${ad}.html`, sayfa(seo))
// /menu altında ürün klasörü de olduğu için Pages "/menu/" adresine yönlendirirse diye
yaz('menu/index.html', sayfa(PAGE_SEO.menu))

const etkin = products.filter((p) => p.isActive)
let ogEksik = 0
for (const p of etkin) {
  const og = `/images/og/${p.slug}.jpg`
  const ogVar = existsSync(join(KOK, 'public', og))
  if (!ogVar) ogEksik++
  yaz(
    `menu/${p.slug}.html`,
    sayfa({
      title: `${p.name} | Gönülden Tatlar`,
      description: p.description,
      path: `/menu/${p.slug}`,
      image: ogVar ? og : undefined,
      imageAlt: p.name,
      imageSize: [1200, 630],
    }),
  )
}

// Site haritası: dizine girmesi istenen sayfalar
const harita = [
  ['/', '1.0'],
  ['/menu', '0.9'],
  ...etkin.map((p) => [`/menu/${p.slug}`, '0.8']),
  ...(campaigns.some((c) => c.isActive) ? [['/kampanyalar', '0.6']] : []),
  ['/hakkimizda', '0.6'],
  ['/iletisim', '0.6'],
  ['/kvkk', '0.3'],
  ['/gizlilik', '0.3'],
]
writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${harita
    .map(([yol, oncelik]) => `  <url><loc>${url(yol)}</loc><priority>${oncelik}</priority></url>`)
    .join('\n')}\n</urlset>\n`,
)

console.log(`✓ prerender: ${sabit.length} sayfa + ${etkin.length} ürün, sitemap ${harita.length} adres`)
if (ogEksik) console.warn(`! ${ogEksik} ürünün paylaşım görseli yok (python3 scripts/og-gorselleri.py); genel görsel kullanıldı`)
