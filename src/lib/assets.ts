/**
 * Görsel yollarını dağıtım tabanına göre çözer.
 *
 * GitHub Pages'te site kökte değil de `/repo-adi/` altında yayınlanabilir.
 * Veri katmanında yollar her zaman `/images/...` şeklinde tutulur; render
 * anında bu yardımcı ile `import.meta.env.BASE_URL` öne eklenir.
 */
export function assetUrl(path: string): string {
  if (!path) return path
  // Dış kaynak veya gömülü veri — dokunma
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
