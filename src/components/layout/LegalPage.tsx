import type { ReactNode } from 'react'
import { Section } from '@/components/ui/Section'

/**
 * Hukuki metinlerin ortak iskeleti. İki sayfa da aynı görünsün diye ayrı
 * bileşen; başlık bandı menü ve hakkımızda sayfalarıyla aynı düzeni kullanır.
 */
export function LegalPage({
  eyebrow,
  title,
  intro,
  updatedAt,
  children,
}: {
  eyebrow: string
  title: string
  intro: string
  updatedAt: string
  children: ReactNode
}) {
  return (
    <>
      <header className="border-b border-line bg-cream-100">
        <div className="container-page py-10 md:py-14">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-olive-600">{eyebrow}</p>
          <h1 className="max-w-3xl text-[2rem] leading-tight md:text-[2.75rem]">{title}</h1>
          <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-muted">{intro}</p>
          <p className="mt-4 text-xs text-muted">Son güncelleme: {updatedAt}</p>
        </div>
      </header>

      <Section>
        <div className="container-page">
          <div className="max-w-3xl space-y-8 text-[0.96rem] leading-relaxed text-muted">{children}</div>
        </div>
      </Section>
    </>
  )
}

export function LegalBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-[1.15rem] leading-snug text-cocoa-800 md:text-[1.3rem]">{title}</h2>
      {children}
    </section>
  )
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2 pl-5">
      {items.map((item, index) => (
        <li key={index} className="list-disc marker:text-olive-500">
          {item}
        </li>
      ))}
    </ul>
  )
}
