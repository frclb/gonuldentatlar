/**
 * Gönülden Tatlar — placeholder görsel üreteci.
 *
 * Gerçek ürün fotoğrafları gelene kadar marka paletiyle uyumlu, tutarlı
 * illüstrasyonlar üretir. Fotoğraflar hazır olduğunda aynı dosya adlarıyla
 * (public/images/products/<slug>.jpg vb.) değiştirilmesi yeterlidir.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = (p) => join(root, 'public/images', p)

const C = {
  cream50: '#fdfaf5',
  cream100: '#faf5ec',
  cream200: '#f4ecdf',
  cream300: '#ece0cd',
  cream400: '#ddcbb1',
  cocoa200: '#dfc4b1',
  cocoa300: '#c8a086',
  cocoa400: '#ac7d60',
  cocoa500: '#8f5f45',
  cocoa600: '#764a34',
  cocoa700: '#5c3826',
  cocoa800: '#40251a',
  olive200: '#d2dab9',
  olive300: '#b5c194',
  olive400: '#99a774',
  olive500: '#7e8d5b',
  blush100: '#fbe5e1',
  blush200: '#f5cbc4',
  blush300: '#eeaba1',
  blush400: '#e28f84',
  blush500: '#cf7367',
  white: '#ffffff',
  vanilla: '#f7ecd6',
  caramel: '#d8a566',
  berry: '#d76a71',
  choco: '#6b4230',
  pistachio: '#a9bd85',
}

/* ----------------------------------------------------------------- helpers */

const defs = (id, bgA, bgB) => `
  <defs>
    <radialGradient id="bg-${id}" cx="42%" cy="30%" r="82%">
      <stop offset="0%" stop-color="${bgA}"/>
      <stop offset="100%" stop-color="${bgB}"/>
    </radialGradient>
    <linearGradient id="glass-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff" stop-opacity=".55"/>
      <stop offset="26%" stop-color="#ffffff" stop-opacity=".12"/>
      <stop offset="72%" stop-color="#ffffff" stop-opacity=".06"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity=".38"/>
    </linearGradient>
    <filter id="soft-${id}" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#40251a" flood-opacity=".16"/>
    </filter>
    <filter id="grain-${id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="7"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>`

const grain = (id, w, h) =>
  `<rect width="${w}" height="${h}" filter="url(#grain-${id})" opacity=".045" style="mix-blend-mode:multiply"/>`

/** Zemin: yumuşak gölge elipsi */
const ground = (cx, cy, rx, ry = rx * 0.22, o = 0.12) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.cocoa800}" opacity="${o}"/>`

/** Dekoratif serpiştirme (kırıntı / meyve noktaları) */
function sprinkles(seedList, color, size = 9) {
  return seedList
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${(r ?? 1) * size}" fill="${color}"/>`)
    .join('')
}

/* -------------------------------------------------------------- dessert art */

/** Şeffaf cup: katmanlı tatlı + krema kubbesi */
function cupArt(id, { base, mid, top, garnish, garnish2 }) {
  return `
  <g filter="url(#soft-${id})">
    <path d="M292 330h316l-34 372a58 58 0 0 1-58 53H384a58 58 0 0 1-58-53z" fill="${C.white}" opacity=".62"/>
    <clipPath id="cupclip-${id}">
      <path d="M292 330h316l-34 372a58 58 0 0 1-58 53H384a58 58 0 0 1-58-53z"/>
    </clipPath>
    <g clip-path="url(#cupclip-${id})">
      <rect x="280" y="590" width="340" height="200" fill="${base}"/>
      <rect x="280" y="486" width="340" height="116" fill="${mid}"/>
      <rect x="280" y="400" width="340" height="96" fill="${top}"/>
      <path d="M280 404c40-22 74 14 116-4s70 16 112-2 76 12 112-6v-46H280z" fill="${C.vanilla}"/>
      ${sprinkles([[330, 640, 1], [368, 700, .8], [420, 660, 1.1], [500, 690, .9], [548, 636, 1], [462, 726, .8]], garnish, 8)}
    </g>
    <path d="M292 330h316l-34 372a58 58 0 0 1-58 53H384a58 58 0 0 1-58-53z" fill="url(#glass-${id})"/>
    <path d="M292 330h316l-34 372a58 58 0 0 1-58 53H384a58 58 0 0 1-58-53z" fill="none" stroke="${C.white}" stroke-opacity=".75" stroke-width="4"/>
  </g>
  <!-- krema kubbesi -->
  <g filter="url(#soft-${id})">
    <path d="M300 336c8-52 44-84 96-92 22-42 84-52 112-18 44-16 84 12 88 56 6 22 2 42-10 54z" fill="${C.white}"/>
    <path d="M330 316c14-26 40-40 72-40" stroke="${C.cream300}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/>
  </g>
  <circle cx="452" cy="252" r="30" fill="${garnish2}"/>
  <path d="M452 224c-10-12-2-26 12-22" stroke="${C.olive500}" stroke-width="7" fill="none" stroke-linecap="round"/>
  ${sprinkles([[356, 296, 1], [546, 306, .9], [500, 268, .7]], garnish, 9)}`
}

/** Yuvarlak waffle: ızgara deseni + sos + meyve */
function waffleArt(id, { dough, grid, sauce, fruit, cream }) {
  const cells = []
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      const x = 262 + i * 64
      const y = 282 + j * 64
      cells.push(`<rect x="${x}" y="${y}" width="48" height="48" rx="11" fill="${grid}" opacity=".5"/>`)
    }
  }
  return `
  <g filter="url(#soft-${id})">
    <circle cx="450" cy="466" r="228" fill="${dough}"/>
    <clipPath id="wclip-${id}"><circle cx="450" cy="466" r="228"/></clipPath>
    <g clip-path="url(#wclip-${id})">
      ${cells.join('')}
      <path d="M222 300c62 40 124 8 178 40s96 4 150 34 96 8 128-16V238H222z" fill="${C.white}" opacity=".1"/>
      <!-- sos: waffle üstünde akan iki şerit -->
      <path d="M246 388c46 30 78-14 122 10s66-6 108 16 74-6 112 16 48 44 28 66"
            stroke="${sauce}" stroke-width="24" fill="none" stroke-linecap="round"/>
      <path d="M268 470c40 22 68-8 104 12s60-4 96 14"
            stroke="${sauce}" stroke-width="14" fill="none" stroke-linecap="round" opacity=".75"/>
    </g>
    <circle cx="450" cy="466" r="228" fill="none" stroke="${C.cocoa700}" stroke-opacity=".13" stroke-width="6"/>
  </g>
  <!-- krema -->
  <g filter="url(#soft-${id})">
    <circle cx="368" cy="352" r="50" fill="${cream}"/>
    <circle cx="412" cy="318" r="34" fill="${cream}"/>
    <circle cx="352" cy="336" r="13" fill="${C.white}" opacity=".55"/>
  </g>
  <!-- meyveler -->
  <g filter="url(#soft-${id})">
    <circle cx="574" cy="376" r="40" fill="${fruit}"/>
    <circle cx="562" cy="364" r="11" fill="${C.white}" opacity=".5"/>
    <circle cx="318" cy="540" r="34" fill="${fruit}"/>
    <circle cx="308" cy="530" r="9" fill="${C.white}" opacity=".45"/>
    <circle cx="546" cy="580" r="28" fill="${fruit}"/>
  </g>
  ${sprinkles([[404, 604, 1], [472, 634, .8], [612, 494, .9], [268, 434, .7]], C.cocoa600, 8)}`
}

/** Uzun bardakta milkshake */
function milkshakeArt(id, { liquid, cream, garnish, straw }) {
  return `
  <g filter="url(#soft-${id})">
    <path d="M334 268h232l-26 452a62 62 0 0 1-62 58h-56a62 62 0 0 1-62-58z" fill="${C.white}" opacity=".6"/>
    <clipPath id="msclip-${id}">
      <path d="M334 268h232l-26 452a62 62 0 0 1-62 58h-56a62 62 0 0 1-62-58z"/>
    </clipPath>
    <g clip-path="url(#msclip-${id})">
      <rect x="320" y="330" width="270" height="460" fill="${liquid}"/>
      <path d="M320 344c34-18 60 12 96-4s62 14 92-2 56 10 82-4v-24H320z" fill="${C.white}" opacity=".35"/>
    </g>
    <path d="M334 268h232l-26 452a62 62 0 0 1-62 58h-56a62 62 0 0 1-62-58z" fill="url(#glass-${id})"/>
    <path d="M334 268h232l-26 452a62 62 0 0 1-62 58h-56a62 62 0 0 1-62-58z" fill="none" stroke="${C.white}" stroke-opacity=".8" stroke-width="4"/>
  </g>
  <rect x="486" y="128" width="26" height="190" rx="13" fill="${straw}" transform="rotate(13 499 223)"/>
  <g filter="url(#soft-${id})">
    <path d="M330 272c4-46 40-72 88-72 16-38 76-46 100-14 40-12 76 16 76 58 0 12-4 22-10 28z" fill="${C.white}"/>
  </g>
  <circle cx="404" cy="212" r="26" fill="${garnish}"/>
  ${sprinkles([[350, 250, 1], [560, 258, .9], [470, 196, .7]], garnish, 8)}`
}

/** Külahta dondurma */
function iceCreamArt(id, { scoopA, scoopB, drip }) {
  return `
  <g filter="url(#soft-${id})">
    <path d="M450 812 336 470h228z" fill="${C.caramel}"/>
    <clipPath id="cclip-${id}"><path d="M450 812 336 470h228z"/></clipPath>
    <g clip-path="url(#cclip-${id})" stroke="${C.cocoa600}" stroke-opacity=".3" stroke-width="6">
      ${Array.from({ length: 7 }, (_, i) => `<path d="M${300 + i * 44} 450 L${370 + i * 44} 830"/>`).join('')}
      ${Array.from({ length: 7 }, (_, i) => `<path d="M${300 + i * 44} 830 L${370 + i * 44} 450"/>`).join('')}
    </g>
  </g>
  <g filter="url(#soft-${id})">
    <circle cx="450" cy="424" r="118" fill="${scoopA}"/>
    <circle cx="384" cy="316" r="82" fill="${scoopB}"/>
    <circle cx="510" cy="308" r="70" fill="${scoopA}"/>
    <circle cx="418" cy="286" r="20" fill="${C.white}" opacity=".35"/>
  </g>
  <path d="M344 486c-2 40 8 56 22 66 14-10 20-30 16-62z" fill="${drip}"/>
  <path d="M552 480c4 36-4 52-18 62-13-12-17-32-12-60z" fill="${drip}"/>
  ${sprinkles([[400, 232, 1], [500, 226, .8], [560, 366, .9]], C.blush400, 8)}`
}

/** Buzlu içecek */
function drinkArt(id, { liquid, garnish, straw }) {
  return `
  <g filter="url(#soft-${id})">
    <path d="M330 250h240v452a72 72 0 0 1-72 72h-96a72 72 0 0 1-72-72z" fill="${C.white}" opacity=".55"/>
    <clipPath id="dclip-${id}">
      <path d="M330 250h240v452a72 72 0 0 1-72 72h-96a72 72 0 0 1-72-72z"/>
    </clipPath>
    <g clip-path="url(#dclip-${id})">
      <rect x="320" y="358" width="272" height="440" fill="${liquid}"/>
      <g fill="${C.white}" opacity=".42">
        <rect x="372" y="398" width="78" height="78" rx="16" transform="rotate(-14 411 437)"/>
        <rect x="466" y="452" width="70" height="70" rx="15" transform="rotate(12 501 487)"/>
        <rect x="386" y="530" width="72" height="72" rx="15" transform="rotate(22 422 566)"/>
      </g>
    </g>
    <path d="M330 250h240v452a72 72 0 0 1-72 72h-96a72 72 0 0 1-72-72z" fill="url(#glass-${id})"/>
    <path d="M330 250h240v452a72 72 0 0 1-72 72h-96a72 72 0 0 1-72-72z" fill="none" stroke="${C.white}" stroke-opacity=".8" stroke-width="4"/>
  </g>
  <rect x="470" y="120" width="24" height="220" rx="12" fill="${straw}" transform="rotate(11 482 230)"/>
  <circle cx="596" cy="286" r="40" fill="${garnish}"/>
  <path d="M596 250c-12-14-2-32 16-26" stroke="${C.olive500}" stroke-width="8" fill="none" stroke-linecap="round"/>`
}

/** Dilim tatlı / brownie */
function browniArt(id, { cakeA, cakeB, sauce, cream }) {
  return `
  <g filter="url(#soft-${id})">
    <rect x="286" y="452" width="330" height="118" rx="22" fill="${cakeA}"/>
    <rect x="286" y="452" width="330" height="34" rx="16" fill="${cakeB}"/>
    <rect x="316" y="336" width="272" height="122" rx="22" fill="${cakeA}" transform="rotate(-4 452 397)"/>
    <rect x="316" y="336" width="272" height="34" rx="16" fill="${cakeB}" transform="rotate(-4 452 353)"/>
  </g>
  <path d="M320 330c48 26 90-10 138 12s84-4 130 16" stroke="${sauce}" stroke-width="24" fill="none" stroke-linecap="round"/>
  <g filter="url(#soft-${id})"><circle cx="586" cy="392" r="62" fill="${cream}"/><circle cx="566" cy="368" r="16" fill="${C.white}" opacity=".45"/></g>
  ${sprinkles([[330, 610, 1], [408, 632, .8], [520, 618, .9], [600, 592, .7]], C.cocoa600, 8)}`
}

const ART = {
  cup: cupArt,
  waffle: waffleArt,
  milkshake: milkshakeArt,
  icecream: iceCreamArt,
  drink: drinkArt,
  brownie: browniArt,
}

/* ------------------------------------------------------------------ builder */

function scene({ id, size = 900, bgA, bgB, type, colors, decor = true }) {
  const art = ART[type](id, colors)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900" width="${size}" height="${size}" role="img">
${defs(id, bgA, bgB)}
  <rect width="900" height="900" fill="url(#bg-${id})"/>
  ${decor ? `<circle cx="716" cy="188" r="132" fill="${C.white}" opacity=".28"/>
  <circle cx="168" cy="742" r="96" fill="${C.white}" opacity=".2"/>
  <path d="M108 214c26-18 52-18 78 0s52 18 78 0" fill="none" stroke="${C.white}" stroke-opacity=".5" stroke-width="9" stroke-linecap="round"/>` : ''}
  ${ground(450, 812, 206)}
  ${art}
  ${grain(id, 900, 900)}
</svg>`
}

function wideScene({ id, w = 1200, h = 800, bgA, bgB, items, ribbon }) {
  const inner = items
    .map((it, i) => {
      const s = it.scale ?? 0.62
      return `<g transform="translate(${it.x} ${it.y}) scale(${s})">${ART[it.type](`${id}-${i}`, it.colors)}</g>`
    })
    .join('')
  const artDefs = items.map((_, i) => defs(`${id}-${i}`, bgA, bgB)).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
${defs(id, bgA, bgB)}${artDefs}
  <rect width="${w}" height="${h}" fill="url(#bg-${id})"/>
  <circle cx="${w * 0.82}" cy="${h * 0.2}" r="${h * 0.3}" fill="${C.white}" opacity=".25"/>
  <circle cx="${w * 0.12}" cy="${h * 0.86}" r="${h * 0.2}" fill="${C.white}" opacity=".18"/>
  ${ribbon ? `<rect x="0" y="${h - 12}" width="${w}" height="12" fill="${ribbon}"/>` : ''}
  ${inner}
  ${grain(id, w, h)}
</svg>`
}

/* -------------------------------------------------------------------- data */

const products = [
  ['lotus-cup', 'cup', C.cream100, C.cocoa200, { base: C.choco, mid: C.vanilla, top: C.caramel, garnish: C.caramel, garnish2: C.caramel }],
  ['cilekli-cup', 'cup', C.blush100, C.blush200, { base: C.berry, mid: C.white, top: C.blush300, garnish: C.berry, garnish2: C.berry }],
  ['oreo-cup', 'cup', C.cream100, C.cream300, { base: '#3a2a26', mid: C.white, top: '#4a3733', garnish: '#2f2320', garnish2: '#3a2a26' }],
  ['kinder-cup', 'cup', C.cream100, C.cocoa200, { base: C.cocoa500, mid: C.vanilla, top: C.cocoa300, garnish: C.cocoa600, garnish2: C.cocoa400 }],
  ['brownie-cup', 'cup', C.cream200, C.cocoa300, { base: '#4a2f22', mid: C.vanilla, top: C.cocoa500, garnish: '#3a241a', garnish2: C.cocoa500 }],
  ['muzlu-cup', 'cup', C.cream100, C.olive200, { base: '#e8cf87', mid: C.white, top: '#f0dda0', garnish: C.caramel, garnish2: '#e8cf87' }],

  ['klasik-waffle', 'waffle', C.cream100, C.cream300, { dough: '#e7c493', grid: '#d3a86f', sauce: C.choco, fruit: C.berry, cream: C.white }],
  ['lotus-waffle', 'waffle', C.cream100, C.cocoa200, { dough: '#e7c493', grid: '#d3a86f', sauce: C.caramel, fruit: C.caramel, cream: C.vanilla }],
  ['kinder-waffle', 'waffle', C.cream200, C.cocoa300, { dough: '#e7c493', grid: '#d3a86f', sauce: C.cocoa500, fruit: C.cocoa400, cream: C.white }],
  ['cilekli-waffle', 'waffle', C.blush100, C.blush200, { dough: '#e7c493', grid: '#d3a86f', sauce: C.berry, fruit: C.berry, cream: C.white }],
  ['oreo-waffle', 'waffle', C.cream100, C.cream400, { dough: '#e7c493', grid: '#d3a86f', sauce: '#3a2a26', fruit: '#3a2a26', cream: C.white }],
  ['fistikli-waffle', 'waffle', C.olive200, C.olive300, { dough: '#e7c493', grid: '#d3a86f', sauce: C.pistachio, fruit: C.pistachio, cream: C.white }],

  ['cikolatali-milkshake', 'milkshake', C.cream200, C.cocoa300, { liquid: '#7a4b34', cream: C.white, garnish: C.choco, straw: C.blush400 }],
  ['cilekli-milkshake', 'milkshake', C.blush100, C.blush200, { liquid: '#e79aa0', cream: C.white, garnish: C.berry, straw: C.olive400 }],
  ['oreo-milkshake', 'milkshake', C.cream100, C.cream400, { liquid: '#5e4a46', cream: C.white, garnish: '#3a2a26', straw: C.blush400 }],
  ['kinder-milkshake', 'milkshake', C.cream100, C.cocoa200, { liquid: '#b98a63', cream: C.white, garnish: C.cocoa500, straw: C.olive400 }],

  ['vanilyali-dondurma', 'icecream', C.cream100, C.cream300, { scoopA: C.vanilla, scoopB: '#f2e2c4', drip: C.vanilla }],
  ['cikolatali-dondurma', 'icecream', C.cream200, C.cocoa300, { scoopA: '#7a4b34', scoopB: '#5c3826', drip: '#7a4b34' }],
  ['cilekli-dondurma', 'icecream', C.blush100, C.blush200, { scoopA: '#eda3a5', scoopB: C.white, drip: '#eda3a5' }],
  ['fistikli-dondurma', 'icecream', C.olive200, C.olive300, { scoopA: C.pistachio, scoopB: C.vanilla, drip: C.pistachio }],

  ['limonata', 'drink', C.olive200, C.olive300, { liquid: '#eddb8f', garnish: '#e8d06a', straw: C.blush400 }],
  ['soguk-kahve', 'drink', C.cream200, C.cocoa300, { liquid: '#6b4230', garnish: C.cocoa300, straw: C.olive400 }],
  ['citir-brownie', 'brownie', C.cream200, C.cocoa300, { cakeA: '#4a2f22', cakeB: '#3a241a', sauce: C.choco, cream: C.vanilla }],
  ['san-sebastian', 'brownie', C.cream100, C.cream400, { cakeA: '#d8b070', cakeB: '#c0904f', sauce: C.caramel, cream: C.white }],
]

const categories = [
  ['cup', 'cup', C.cream100, C.cocoa200, { base: C.choco, mid: C.vanilla, top: C.caramel, garnish: C.caramel, garnish2: C.berry }],
  ['waffle', 'waffle', C.cream100, C.cream300, { dough: '#e7c493', grid: '#d3a86f', sauce: C.choco, fruit: C.berry, cream: C.white }],
  ['cikolata', 'brownie', C.cream200, C.cocoa300, { cakeA: '#4a2f22', cakeB: '#3a241a', sauce: C.choco, cream: C.vanilla }],
  ['dondurma', 'icecream', C.cream100, C.cream300, { scoopA: C.vanilla, scoopB: '#eda3a5', drip: C.vanilla }],
  ['milkshake', 'milkshake', C.cream200, C.cocoa200, { liquid: '#7a4b34', cream: C.white, garnish: C.choco, straw: C.blush400 }],
  ['meyveli', 'cup', C.blush100, C.blush200, { base: C.berry, mid: C.white, top: C.blush300, garnish: C.berry, garnish2: C.berry }],
  ['icecek', 'drink', C.olive200, C.olive300, { liquid: '#eddb8f', garnish: '#e8d06a', straw: C.blush400 }],
]

const campaigns = [
  ['ikili-cup-menu', C.blush100, C.blush200, C.blush400, [
    { type: 'cup', x: 120, y: 60, scale: 0.66, colors: { base: C.berry, mid: C.white, top: C.blush300, garnish: C.berry, garnish2: C.berry } },
    { type: 'cup', x: 520, y: 100, scale: 0.58, colors: { base: C.choco, mid: C.vanilla, top: C.caramel, garnish: C.caramel, garnish2: C.caramel } },
  ]],
  ['hafta-sonu-waffle', C.cream100, C.cream300, C.cocoa400, [
    { type: 'waffle', x: 110, y: 70, scale: 0.68, colors: { dough: '#e7c493', grid: '#d3a86f', sauce: C.choco, fruit: C.berry, cream: C.white } },
    { type: 'milkshake', x: 590, y: 90, scale: 0.6, colors: { liquid: '#7a4b34', cream: C.white, garnish: C.choco, straw: C.blush400 } },
  ]],
  ['ogrenci-menu', C.olive200, C.olive300, C.olive500, [
    { type: 'cup', x: 100, y: 80, scale: 0.6, colors: { base: C.cocoa500, mid: C.vanilla, top: C.cocoa300, garnish: C.cocoa600, garnish2: C.cocoa400 } },
    { type: 'drink', x: 560, y: 70, scale: 0.66, colors: { liquid: '#eddb8f', garnish: '#e8d06a', straw: C.blush400 } },
  ]],
  ['tatli-ikili', C.cream200, C.cocoa200, C.cocoa500, [
    { type: 'icecream', x: 120, y: 60, scale: 0.64, colors: { scoopA: C.vanilla, scoopB: '#eda3a5', drip: C.vanilla } },
    { type: 'brownie', x: 540, y: 110, scale: 0.62, colors: { cakeA: '#4a2f22', cakeB: '#3a241a', sauce: C.choco, cream: C.vanilla } },
  ]],
]

const instagram = [
  ['post-1', 'cup', C.blush100, C.blush200, { base: C.berry, mid: C.white, top: C.blush300, garnish: C.berry, garnish2: C.berry }],
  ['post-2', 'waffle', C.cream100, C.cream300, { dough: '#e7c493', grid: '#d3a86f', sauce: C.choco, fruit: C.berry, cream: C.white }],
  ['post-3', 'milkshake', C.cream200, C.cocoa200, { liquid: '#7a4b34', cream: C.white, garnish: C.choco, straw: C.blush400 }],
  ['post-4', 'icecream', C.olive200, C.olive300, { scoopA: C.pistachio, scoopB: C.vanilla, drip: C.pistachio }],
  ['post-5', 'cup', C.cream100, C.cocoa200, { base: C.choco, mid: C.vanilla, top: C.caramel, garnish: C.caramel, garnish2: C.caramel }],
  ['post-6', 'brownie', C.cream200, C.cocoa300, { cakeA: '#4a2f22', cakeB: '#3a241a', sauce: C.choco, cream: C.vanilla }],
  ['post-7', 'drink', C.olive200, C.olive300, { liquid: '#eddb8f', garnish: '#e8d06a', straw: C.blush400 }],
  ['post-8', 'waffle', C.blush100, C.blush200, { dough: '#e7c493', grid: '#d3a86f', sauce: C.berry, fruit: C.berry, cream: C.white }],
]

/* -------------------------------------------------------------------- write */

const write = (rel, svg) => {
  const file = out(rel)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, svg.replace(/\n\s*\n/g, '\n'))
}

let n = 0
for (const [slug, type, bgA, bgB, colors] of products) {
  write(`products/${slug}.svg`, scene({ id: `p${n++}`, bgA, bgB, type, colors }))
  // galeri için iki alternatif "çekim": farklı zemin tonu ve dekor
  write(`products/${slug}-2.svg`, scene({ id: `p${n++}`, bgA: C.cream50, bgB: bgB, type, colors, decor: false }))
  write(`products/${slug}-3.svg`, scene({ id: `p${n++}`, bgA: bgB, bgB: C.cream200, type, colors }))
}
for (const [slug, type, bgA, bgB, colors] of categories) {
  write(`categories/${slug}.svg`, scene({ id: `c${n++}`, size: 640, bgA, bgB, type, colors, decor: false }))
}
for (const [slug, bgA, bgB, ribbon, items] of campaigns) {
  write(`campaigns/${slug}.svg`, wideScene({ id: `k${n++}`, bgA, bgB, ribbon, items }))
}
for (const [slug, type, bgA, bgB, colors] of instagram) {
  write(`instagram/${slug}.svg`, scene({ id: `i${n++}`, size: 640, bgA, bgB, type, colors, decor: false }))
}

/* Hero — büyük kompozisyon */
write('hero/hero-cup.svg', scene({
  id: 'hero1', size: 1100, bgA: C.cream100, bgB: C.cocoa200,
  type: 'cup',
  colors: { base: C.choco, mid: C.vanilla, top: C.caramel, garnish: C.caramel, garnish2: C.berry },
}))
write('hero/hero-waffle.svg', scene({
  id: 'hero2', size: 900, bgA: C.blush100, bgB: C.blush200,
  type: 'waffle', decor: false,
  colors: { dough: '#e7c493', grid: '#d3a86f', sauce: C.berry, fruit: C.berry, cream: C.white },
}))
write('hero/hero-shake.svg', scene({
  id: 'hero3', size: 900, bgA: C.olive200, bgB: C.olive300,
  type: 'milkshake', decor: false,
  colors: { liquid: '#e79aa0', cream: C.white, garnish: C.berry, straw: C.olive500 },
}))
write('hero/og-cover.svg', wideScene({
  id: 'og', w: 1200, h: 630, bgA: C.cream100, bgB: C.cocoa200, ribbon: C.cocoa600,
  items: [
    { type: 'cup', x: 60, y: 30, scale: 0.58, colors: { base: C.choco, mid: C.vanilla, top: C.caramel, garnish: C.caramel, garnish2: C.berry } },
    { type: 'waffle', x: 420, y: 60, scale: 0.5, colors: { dough: '#e7c493', grid: '#d3a86f', sauce: C.choco, fruit: C.berry, cream: C.white } },
    { type: 'milkshake', x: 760, y: 30, scale: 0.56, colors: { liquid: '#e79aa0', cream: C.white, garnish: C.berry, straw: C.olive400 } },
  ],
}))

/* Marka hikayesi görselleri */
write('hero/story-1.svg', scene({
  id: 's1', size: 800, bgA: C.olive200, bgB: C.olive300, type: 'waffle', decor: false,
  colors: { dough: '#e7c493', grid: '#d3a86f', sauce: C.pistachio, fruit: C.berry, cream: C.white },
}))
write('hero/story-2.svg', scene({
  id: 's2', size: 800, bgA: C.blush100, bgB: C.blush200, type: 'cup', decor: false,
  colors: { base: C.berry, mid: C.white, top: C.blush300, garnish: C.berry, garnish2: C.berry },
}))

console.log(`✓ ${products.length * 3 + categories.length + campaigns.length + instagram.length + 6} görsel üretildi`)
