import { useMemo } from 'react'
import { useCatalog } from '@/context/CatalogContext'

export interface NavLink {
  label: string
  to: string
}

const allLinks: NavLink[] = [
  { label: 'Ana Sayfa', to: '/' },
  { label: 'Menü', to: '/menu' },
  { label: 'Kampanyalar', to: '/kampanyalar' },
  { label: 'Hakkımızda', to: '/hakkimizda' },
  { label: 'İletişim', to: '/iletisim' },
]

/** Aktif kampanya yokken "Kampanyalar" bağlantısı gizlenir — boş sayfaya link olmasın. */
export function useNavLinks(): NavLink[] {
  const { activeCampaigns } = useCatalog()
  return useMemo(
    () => allLinks.filter((link) => link.to !== '/kampanyalar' || activeCampaigns.length > 0),
    [activeCampaigns],
  )
}
