import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Price } from '@/components/ui/Price'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/cn'
import type { Campaign } from '@/types'
import { assetUrl } from '@/lib/assets'

const tones: Record<Campaign['tone'], string> = {
  cocoa: 'bg-cocoa-100',
  olive: 'bg-olive-100',
  blush: 'bg-blush-100',
}

export function CampaignCard({ campaign, size = 'md' }: { campaign: Campaign; size?: 'md' | 'lg' }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl shadow-soft transition-shadow duration-300 hover:shadow-card',
        tones[campaign.tone],
        size === 'lg' && 'md:flex-row',
      )}
    >
      <div className={cn('relative overflow-hidden', size === 'lg' ? 'md:w-1/2' : '')}>
        <img
          src={assetUrl(campaign.image)}
          alt=""
          width={1200}
          height={800}
          loading="lazy"
          decoding="async"
          className={cn(
            'w-full object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.04]',
            size === 'lg' ? 'aspect-[4/3] md:h-full' : 'aspect-[3/2]',
          )}
        />
        {campaign.discountPercentage ? (
          <Badge tone="dark" className="absolute left-3 top-3">
            %{campaign.discountPercentage} indirim
          </Badge>
        ) : null}
      </div>

      <div className={cn('flex flex-1 flex-col p-5', size === 'lg' && 'md:justify-center md:p-8')}>
        <h3 className={cn('leading-snug', size === 'lg' ? 'text-2xl' : 'text-[1.15rem]')}>{campaign.title}</h3>
        <p className="mt-2 text-[0.88rem] leading-relaxed text-cocoa-700/75">{campaign.description}</p>

        <p className="mt-3 text-[0.72rem] font-medium text-cocoa-700/60">
          {formatDate(campaign.startsAt)} – {formatDate(campaign.endsAt)}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4">
          {campaign.price !== undefined && <Price value={campaign.price} oldValue={campaign.oldPrice} size="lg" />}
          <Link
            to={`/menu?kampanya=${campaign.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-cocoa-700 shadow-soft transition-transform duration-200 group-hover:translate-x-0.5"
          >
            {campaign.ctaLabel ?? 'Ürünleri Gör'}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
