/**
 * GitHub Pages SPA fallback.
 *
 * Pages'te sunucu tarafı rewrite yoktur; `/menu` gibi bir adres doğrudan
 * açıldığında 404.html sunulur. Bu dosya, istenen yolu query string'e taşıyıp
 * kök index.html'e yönlendirir; index.html içindeki küçük script de adresi
 * geri yazar. Böylece SEO dostu temiz URL'ler (/menu/lotus-cup) korunur.
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const base = process.env.VITE_BASE_PATH || '/'
/** Alt yolda yayınlanıyorsa (ör. /gonuldentatlar/) korunacak segment sayısı */
const segmentsToKeep = base.split('/').filter(Boolean).length

const html = `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <title>Gönülden Tatlar</title>
    <script>
      (function () {
        var keep = ${segmentsToKeep}
        var l = window.location
        l.replace(
          l.protocol + '//' + l.host +
          l.pathname.split('/').slice(0, 1 + keep).join('/') + '/?/' +
          l.pathname.slice(1).split('/').slice(keep).join('/').replace(/&/g, '~and~') +
          (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
          l.hash
        )
      })()
    </script>
  </head>
  <body></body>
</html>
`

writeFileSync(join(process.cwd(), 'dist/404.html'), html)
console.log(`✓ dist/404.html üretildi (base: ${base})`)
