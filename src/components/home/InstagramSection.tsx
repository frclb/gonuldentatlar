import { Heart, Instagram } from 'lucide-react'
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
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-cocoa-900/60 via-cocoa-900/0 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-cream-100">
                    <Heart className="size-3.5 fill-current" />
                    {post.likes}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
