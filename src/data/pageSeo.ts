import type { SeoOptions } from '@/lib/seo'

/**
 * Sayfaların başlık ve açıklamaları tek yerde. Hem sayfalar (useSeo) hem de
 * yayın sırasında çalışan scripts/prerender.mjs buradan okur: önizleme botları
 * ve arama motorları JavaScript çalıştırmadan da doğru başlığı görsün diye her
 * sayfa için hazır HTML üretilir. Metin değişince yalnızca burayı güncellemek
 * yeter.
 */
export const PAGE_SEO = {
  home: {
    title: 'Gönülden Tatlar | Magnolya ve Cup Tatlılar',
    description:
      "Gönülden Tatlar'ın taze meyveli, bisküvili ve çikolatalı magnolya ile cup tatlılarını keşfet. Favorini seç, WhatsApp'tan kolayca sipariş ver.",
    path: '/',
  },
  menu: {
    title: 'Menü | Gönülden Tatlar',
    description:
      'Magnolya ve cup tatlılar: çilekli, muzlu, çikolatalı, bisküvili çeşitler. Gönülden Tatlar menüsünü keşfet.',
    path: '/menu',
  },
  about: {
    title: 'Hakkımızda | Gönülden Tatlar',
    description:
      'Gönülden Tatlar; taze malzeme, günlük hazırlık ve özenli sunumla hazırlanan magnolya ve cup tatlılar.',
    path: '/hakkimizda',
  },
  contact: {
    title: 'İletişim | Gönülden Tatlar',
    description:
      'Gönülden Tatlar adres, telefon, WhatsApp ve çalışma saatleri. Sorularını bize buradan iletebilirsin.',
    path: '/iletisim',
  },
  campaigns: {
    title: 'Kampanyalar | Gönülden Tatlar',
    description: 'Gönülden Tatlar kampanyalarını kaçırma: ikili menüler ve döneme özel fırsatlar.',
    path: '/kampanyalar',
  },
  kvkk: {
    title: 'KVKK Aydınlatma Metni | Gönülden Tatlar',
    description:
      'Gönülden Tatlar kişisel verilerin işlenmesine ilişkin aydınlatma metni: hangi veriler, hangi amaçla işlenir ve haklarınız.',
    path: '/kvkk',
  },
  privacy: {
    title: 'Gizlilik ve Çerez Politikası | Gönülden Tatlar',
    description:
      'Gönülden Tatlar sitesinde hangi bilgiler tarayıcında saklanır, hangi dış hizmetler kullanılır ve bunları nasıl silersin.',
    path: '/gizlilik',
  },
  cart: {
    title: 'Sepetim | Gönülden Tatlar',
    description: 'Sepetindeki tatlıları gözden geçir ve siparişini tamamla.',
    path: '/sepet',
  },
  checkout: {
    title: 'Siparişi Tamamla | Gönülden Tatlar',
    description: 'Teslimat yöntemini seç, bilgilerini gir ve siparişini tamamla.',
    path: '/siparis',
  },
} satisfies Record<string, SeoOptions>
