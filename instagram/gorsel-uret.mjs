#!/usr/bin/env node
// OpenAI ile görsel düzenleme. İlk görsel temel alınır (kap ve katman düzeni korunur),
// sonraki görseller tarz referansıdır. Anahtar .env.local içindeki OPENAI_API_KEY'den okunur
// ve hiçbir yere yazdırılmaz.
//
//   node instagram/gorsel-uret.mjs --prompt-file komut.txt --out yeni-gorseller/deneme/cilekli temel.png stil.png
//   node instagram/gorsel-uret.mjs --models
import { existsSync, mkdirSync, openAsBlob, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function apiKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY.trim()
  const file = resolve(root, '.env.local')
  if (existsSync(file)) {
    const line = readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .find((l) => /^\s*OPENAI_API_KEY\s*=/.test(l))
    if (line) return line.slice(line.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, '')
  }
  throw new Error('OPENAI_API_KEY bulunamadı: proje klasöründeki .env.local dosyasına OPENAI_API_KEY=... satırını ekle.')
}

async function call(path, init, attempt = 1) {
  const res = await fetch(`https://api.openai.com/v1/${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${apiKey()}`, ...(init?.headers ?? {}) },
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = body?.error?.message ?? res.statusText
    // Proje model izni yeni açıldığında OpenAI bir süre aralıklı 403 dönebiliyor; bekleyip yeniden dene
    if (res.status === 403 && /does not have access to model/i.test(message) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 20000))
      return call(path, init, attempt + 1)
    }
    throw new Error(`OpenAI ${res.status}: ${message}`)
  }
  return body
}

const { values: opt, positionals: images } = parseArgs({
  allowPositionals: true,
  options: {
    models: { type: 'boolean', default: false },
    prompt: { type: 'string' },
    'prompt-file': { type: 'string' },
    out: { type: 'string' },
    mask: { type: 'string' },
    n: { type: 'string', default: '2' },
    model: { type: 'string', default: 'gpt-image-1.5' },
    quality: { type: 'string', default: 'medium' },
    size: { type: 'string', default: '1024x1024' },
    fidelity: { type: 'string', default: 'high' },
  },
})

if (opt.models) {
  const { data } = await call('models')
  const ids = data.map((m) => m.id).filter((id) => /image|dall-e/i.test(id)).sort()
  console.log(ids.join('\n') || 'Görsel modeli bulunamadı.')
  process.exit(0)
}

const prompt = opt.prompt ?? (opt['prompt-file'] && readFileSync(opt['prompt-file'], 'utf8').trim())
if (!prompt || !opt.out || images.length === 0) {
  console.error('Kullanım: --prompt-file komut.txt --out cikti/onek temel.png [stil.png ...] [--mask maske.png] [--n 2]')
  process.exit(1)
}

async function edit(withFidelity) {
  const form = new FormData()
  form.append('model', opt.model)
  form.append('prompt', prompt)
  form.append('n', opt.n)
  form.append('size', opt.size)
  form.append('quality', opt.quality)
  if (withFidelity) form.append('input_fidelity', opt.fidelity)
  for (const img of images) form.append('image[]', await openAsBlob(img, { type: 'image/png' }), basename(img))
  if (opt.mask) form.append('mask', await openAsBlob(opt.mask, { type: 'image/png' }), basename(opt.mask))
  return call('images/edits', { method: 'POST', body: form })
}

const started = Date.now()
let result
try {
  result = await edit(opt.fidelity !== 'none')
} catch (err) {
  // Her model input_fidelity desteklemiyor; desteklemeyende parametresiz tekrar dene
  if (opt.fidelity === 'none' || !/input_fidelity/i.test(err.message)) throw err
  result = await edit(false)
}
mkdirSync(dirname(opt.out), { recursive: true })
result.data.forEach((item, i) => {
  const file = `${opt.out}-${i + 1}.png`
  writeFileSync(file, Buffer.from(item.b64_json, 'base64'))
  console.log(file)
})
if (result.usage) console.log(`kullanım: ${JSON.stringify(result.usage)}`)
console.log(`süre: ${Math.round((Date.now() - started) / 1000)} sn`)
