import { Instagram } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { instagramPosts } from '@/data/catalog'
import { useCatalog } from '@/context/CatalogContext'
import { track } from '@/lib/analytics'
import { assetUrl } from '@/lib/assets'

export function InstagramSection() {
  const { settings } = useCatalog()

  return (
    <Section>
      <div className="container-page">
        <SectionHeader
          eyebrow={settings.instagramHandle}
          title="Tatlı Anlarını Paylaş"
          description="Gönülden Tatlar ile güzel anlarını paylaş."
          action={
            <a
              href={settings.instagram}
              target="_blank"
              rel="noreferrer"
              onClick={() => track('click_instagram', { from: 'home' })}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-cocoa-700 transition-colors hover:border-cocoa-300 hover:bg-cream-100"
            >
              <Instagram className="size-4" />
              Instagram'da takip et
            </a>
          }
        />

        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3.5">
          {instagramPosts.map((post) => (
            <li key={post.id}>
              <a
                href={post.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => track('click_instagram', { postId: post.id })}
                className="group relative block overflow-hidden rounded-lg bg-cream-100"
              >
                <img
                  src={assetUrl(post.image)}
                  alt={post.caption}
                  width={640}
                  height={640}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full object-cover transition-transform duration-500 ease-[var(--ease-soft)] group-hover:scale-105"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
