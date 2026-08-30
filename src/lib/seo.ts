import { useEffect } from 'react'

const SITE_NAME = 'Gönülden Tatlar'
/** Tarayıcı yoksa (build/test) kullanılacak adres */
const FALLBACK_ORIGIN = 'https://gonuldentatlar.com'

/**
 * Mutlak adres üretir. Site alt yolda (frclb.github.io/gonuldentatlar/) ya da
 * kendi domaininde yayınlansın, canonical ve OG etiketleri doğru çıkar.
 */
function siteUrl(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const origin = typeof window === 'undefined' ? FALLBACK_ORIGIN : window.location.origin
  const suffix = path && path !== '/' ? (path.startsWith('/') ? path : `/${path}`) : '/'
  return `${origin}${base}${suffix}`
}

export interface SeoOptions {
  title: string
  description: string
  /** Site köküne göre yol: "/menu" */
  path?: string
  image?: string
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = href
}

/** Sayfa başına title / description / OG etiketlerini günceller. */
export function useSeo({ title, description, path = '', image = '/images/hero/og-cover.jpg' }: SeoOptions) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
    document.title = fullTitle

    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', siteUrl(path))
    setMeta('meta[property="og:image"]', 'property', 'og:image', siteUrl(image))
    setCanonical(siteUrl(path))
  }, [title, description, path, image])
}
