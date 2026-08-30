import { motion } from 'framer-motion'
import { ChevronRight, Heart, ShoppingBag } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductOptions } from '@/components/product/ProductOptions'
import { ProductCard } from '@/components/product/ProductCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Field'
import { Price } from '@/components/ui/Price'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { useCart } from '@/context/CartContext'
import { useCatalog } from '@/context/CatalogContext'
import { useFavorites } from '@/context/FavoritesContext'
import { useToast } from '@/context/ToastContext'
import { track } from '@/lib/analytics'
import { buildCartItem, computeUnitPrice, defaultSelections, validateSelections, type Selections } from '@/lib/cart'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import { multiply } from '@/lib/money'
import { useSeo } from '@/lib/seo'
import NotFound from './NotFound'

export default function ProductDetail() {
  const { slug = '' } = useParams()
  const { getProduct, getCategory, activeProducts, settings } = useCatalog()
  const { addItem, openCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { notify } = useToast()
  const navigate = useNavigate()

  const product = getProduct(slug)
  const [selections, setSelections] = useState<Selections>(() => (product ? defaultSelections(product) : {}))
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  /* Ürün değişince seçimleri sıfırla */
  useEffect(() => {
    if (!product) return
    setSelections(defaultSelections(product))
    setQuantity(1)
    setNote('')
    setError(null)
    track('view_product', { productId: product.id })
  }, [product])

  const category = product ? getCategory(product.categoryId) : undefined

  const unitPrice = useMemo(
    () => (product ? computeUnitPrice(product, selections) : 0),
    [product, selections],
  )

  /** Aynı kategoriden öneriler; kategoride yeterli ürün yoksa diğer favorilerle tamamlanır. */
  const related = useMemo(() => {
    if (!product) return []
    const others = activeProducts.filter((p) => p.id !== product.id)
    const sameCategory = others.filter((p) => p.categoryId === product.categoryId)
    if (sameCategory.length >= 4) return sameCategory.slice(0, 4)

    const fillers = others
      .filter((p) => p.categoryId !== product.categoryId)
      .sort((a, b) => Number(b.isPopular ?? false) - Number(a.isPopular ?? false))
    return [...sameCategory, ...fillers].slice(0, 4)
  }, [activeProducts, product])

  useSeo({
    title: product ? `${product.name} | Gönülden Tatlar` : 'Ürün bulunamadı',
    description: product?.description ?? 'Gönülden Tatlar menüsü',
    path: `/menu/${slug}`,
    image: product?.image,
  })

  if (!product) return <NotFound />

  const total = multiply(unitPrice, quantity)
  const favorite = isFavorite(product.id)

  const handleAdd = (goToCheckout = false) => {
    const validationError = validateSelections(product, selections)
    if (validationError) {
      setError(validationError)
      notify(validationError, 'error')
      return
    }
    setError(null)
    addItem(buildCartItem(product, { selections, quantity, note }))
    notify('Ürün sepete eklendi')
    if (goToCheckout) navigate('/siparis')
    else openCart()
  }

  return (
    <>
      <div className="container-page pb-28 pt-6 md:pt-8 lg:pb-16">
        <nav aria-label="Konum" className="flex items-center gap-1 text-[0.8rem] text-muted">
          <Link to="/" className="hover:text-cocoa-700">
            Ana Sayfa
          </Link>
          <ChevronRight className="size-3.5" />
          <Link to="/menu" className="hover:text-cocoa-700">
            Menü
          </Link>
          {category && (
            <>
              <ChevronRight className="size-3.5" />
              <Link to={`/menu?kategori=${category.slug}`} className="hover:text-cocoa-700">
                {category.name}
              </Link>
            </>
          )}
        </nav>

        <div className="mt-6 grid gap-8 md:mt-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <ProductGallery images={product.gallery ?? [product.image]} alt={product.name} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              {category && <Badge tone="olive">{category.name}</Badge>}
              {product.badge && <Badge tone={product.badge.tone ?? 'dark'}>{product.badge.label}</Badge>}
              {product.isNew && <Badge tone="new">Yeni</Badge>}
              {product.discountPercentage ? (
                <Badge tone="discount">%{product.discountPercentage} indirim</Badge>
              ) : null}
            </div>

            <div className="mt-3 flex items-start justify-between gap-4">
              <h1 className="text-[1.9rem] leading-tight md:text-[2.4rem]">{product.name}</h1>
              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                aria-label={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                aria-pressed={favorite}
                className="mt-1 grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface text-cocoa-600 transition-colors hover:border-blush-300"
              >
                <Heart className={cn('size-5 transition-all', favorite && 'fill-blush-400 text-blush-400')} />
              </button>
            </div>

            <p className="mt-3 max-w-lg text-[0.98rem] leading-relaxed text-muted">{product.description}</p>

            <div className="mt-5 flex items-center gap-3">
              <Price value={product.price} oldValue={product.oldPrice} size="lg" />
              {product.tags?.map((tag) => (
                <Badge key={tag} tone="soft">
                  {tag}
                </Badge>
              ))}
            </div>

            <hr className="my-7 border-line" />

            <ProductOptions product={product} selections={selections} onChange={setSelections} />

            <div className="mt-7">
              <Textarea
                label="Sipariş notu"
                placeholder="Örn: az şekerli olsun, fındık koymayın…"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                maxLength={200}
                hint="İsteğe bağlı — mutfağa iletiriz."
              />
            </div>

            {error && (
              <p className="mt-4 rounded-md bg-blush-50 px-4 py-3 text-sm font-medium text-[var(--color-error)]">
                {error}
              </p>
            )}

            {/* desktop aksiyonlar */}
            <div className="mt-8 hidden items-center gap-3 lg:flex">
              <QuantityStepper value={quantity} onChange={setQuantity} />
              <Button size="lg" className="flex-1" onClick={() => handleAdd()}>
                <ShoppingBag className="size-[1.15rem]" />
                {settings.showPrices ? `Sepete Ekle · ${formatPrice(total)}` : 'Sepete Ekle'}
              </Button>
            </div>

            <p className="mt-4 hidden text-[0.8rem] text-muted lg:block">
              Gönülden hazırladık. Afiyetle.
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16 md:mt-24">
            <h2 className="text-[1.5rem] md:text-[1.85rem]">Bunlar da hoşuna gidebilir</h2>
            <div className="mt-6 grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* mobil sticky aksiyon */}
      <motion.div
        initial={{ y: 90 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-background/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur-xl lg:hidden"
      >
        <div className="flex items-center gap-3">
          <QuantityStepper value={quantity} onChange={setQuantity} size="sm" />
          <Button size="lg" className="h-12 flex-1" onClick={() => handleAdd()}>
            {settings.showPrices ? `Sepete Ekle · ${formatPrice(total)}` : 'Sepete Ekle'}
          </Button>
        </div>
      </motion.div>
    </>
  )
}
