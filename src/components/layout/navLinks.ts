export interface NavLink {
  label: string
  to: string
}

export const navLinks: NavLink[] = [
  { label: 'Ana Sayfa', to: '/' },
  { label: 'Menü', to: '/menu' },
  { label: 'Kampanyalar', to: '/kampanyalar' },
  { label: 'Hakkımızda', to: '/hakkimizda' },
  { label: 'İletişim', to: '/iletisim' },
]
