import { Suspense, useState, type ReactNode } from 'react'
import { MagnolyaStage, preloadMagnolyaStage } from '@/components/product/LazyMagnolyaStage'
import { MagnolyaCard } from '@/components/product/MagnolyaCard'
import { isStageEntryOnTop, pushStageEntry } from '@/lib/stageHistory'
import type { Product } from '@/types'

/**
 * Katmanlı magnolya kartlarının ortak durumu: hangi kartın katmanları açık,
 * sahne, sunum (Cup / Kavanoz). Ana sayfa vitrini, en çok sipariş edilenler,
 * menü, kampanyalar ve benzer ürünler aynı davranışı buradan alır.
 *
 * `renderCard` katman haritası olan ürün için katmanlı kart, olmayan için
 * undefined döner (ProductGrid o durumda düz ProductCard basar).
 * `stage` listenin yanına bir kez yerleştirilir.
 */
export function useMagnolyaCards(
  products: Product[],
  { variant = 'grid', reveal = true }: { variant?: 'strip' | 'grid'; reveal?: boolean } = {},
) {
  const [hovered, setHovered] = useState<string | null>(null)
  // opener: sahneyi kart dışından açan öğe (ör. Hero görseli); kapanınca oraya döner
  const [stage, setStage] = useState<{ id: string; from: DOMRect | null; opener?: Element } | null>(null)
  const [jar, setJar] = useState(false)
  // Kavanoz görselleri sunum ilk değiştiğinde (ya da değiştirmeye niyetlenince) iner
  const [jarMounted, setJarMounted] = useState(false)

  const changeServing = (value: boolean) => {
    setJarMounted(true)
    setJar(value)
  }

  const open = (id: string, from: DOMRect, opener?: Element) => {
    // Kapanışta görsel karta döndüğünde kart düz hâlinde olsun
    setHovered(null)
    setStage({ id, from, opener })
    // Geri tuşu sahneyi kapatsın, sayfadan çıkarmasın. Efekt değil
    // tıklama anı: geliştirmede StrictMode efektleri iki kez çalıştırıyor
    pushStageEntry()
  }

  const renderCard = (product: Product, index: number): ReactNode | undefined =>
    product.serving ? (
      <MagnolyaCard
        key={product.id}
        variant={variant}
        reveal={reveal}
        product={product}
        index={index}
        jarMode={jar}
        mountJar={jarMounted}
        active={hovered === product.id}
        onActive={(value) => setHovered(value ? product.id : null)}
        onOpen={(rect) => open(product.id, rect)}
      />
    ) : undefined

  const stageElement = stage ? (
    <Suspense fallback={null}>
      <MagnolyaStage
        // ← / → bu listedeki ürünler arasında gezer
        products={products.filter((product) => product.serving)}
        activeId={stage.id}
        fromRect={stage.from}
        returnTo={stage.opener ? { id: stage.id, el: stage.opener } : undefined}
        jar={jar}
        onJarChange={changeServing}
        onNavigate={(id) => setStage((current) => (current ? { ...current, id } : current))}
        onClose={() => {
          setStage(null)
          // X, Esc ya da zeminle kapandıysa sahnenin geçmiş kaydını geri al;
          // geri tuşuyla kapandıysa kayıt zaten gitti
          if (isStageEntryOnTop()) window.history.back()
        }}
      />
    </Suspense>
  ) : null

  return {
    renderCard,
    stage: stageElement,
    isOpen: stage !== null,
    /** Kart dışındaki bir öğeden (Hero görseli, haftanın favorisi) sahneyi aç */
    openStage: (productId: string, opener: Element) => open(productId, opener.getBoundingClientRect(), opener),
    jar,
    changeServing,
    /** Kavanoz'a niyetlenildi (fare üzerinde): görseller tıklamadan önce insin */
    prefetchJar: () => setJarMounted(true),
    /** Kartların kapsayıcısına yayılır: üzerine gelinince sahne parçası önceden iner */
    preload: { onPointerEnter: preloadMagnolyaStage, onTouchStart: preloadMagnolyaStage },
  }
}
