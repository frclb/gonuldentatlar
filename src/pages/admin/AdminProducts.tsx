import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Field'
import { Modal } from '@/components/ui/Modal'
import { useCatalog } from '@/context/CatalogContext'
import { useToast } from '@/context/ToastContext'
import { sizeAndExtras, sizeOnly } from '@/data/options'
import { formatPrice, slugify } from '@/lib/format'
import type { Product, ProductOption } from '@/types'
import { AdminHeader, Td, TableWrap, Th, Toggle } from './components'
import { assetUrl } from '@/lib/assets'

/** Seçenek setleri hazır preset olarak sunulur — tam seçenek editörü MVP dışı. */
const optionPresets: { id: string; label: string; options: ProductOption[] }[] = [
  { id: 'none', label: 'Seçeneksiz', options: [] },
  { id: 'size', label: 'Boyut seçimi', options: sizeOnly },
  { id: 'size-extras', label: 'Boyut + ekstra', options: sizeAndExtras },
]

const emptyProduct = (order: number): Product => ({
  id: '',
  slug: '',
  name: '',
  description: '',
  categoryId: '',
  price: 0,
  image: '/images/products/cilekli-magnolya.webp',
  isActive: true,
  isFeatured: false,
  order,
})

export function AdminProducts() {
  const { products, categories, upsertProduct, deleteProduct } = useCatalog()
  const { notify } = useToast()
  const [editing, setEditing] = useState<Product | null>(null)
  const [presetId, setPresetId] = useState('none')
  const [search, setSearch] = useState('')

  const sorted = useMemo(
    () =>
      [...products]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .filter((product) =>
          search ? product.name.toLocaleLowerCase('tr-TR').includes(search.toLocaleLowerCase('tr-TR')) : true,
        ),
    [products, search],
  )

  const openNew = () => {
    setPresetId('none')
    setEditing(emptyProduct(products.length + 1))
  }

  const openEdit = (product: Product) => {
    const matched = optionPresets.find((preset) => preset.options === product.options)
    setPresetId(matched?.id ?? (product.options?.length ? 'custom' : 'none'))
    setEditing(product)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!editing) return

    const slug = editing.slug || slugify(editing.name)
    const preset = optionPresets.find((entry) => entry.id === presetId)

    upsertProduct({
      ...editing,
      id: editing.id || slug,
      slug,
      options: presetId === 'custom' ? editing.options : preset?.options,
      gallery: editing.gallery ?? [editing.image],
    })
    notify(editing.id ? 'Ürün güncellendi' : 'Ürün eklendi')
    setEditing(null)
  }

  const handleDelete = (product: Product) => {
    if (!window.confirm(`"${product.name}" ürünü silinsin mi?`)) return
    deleteProduct(product.id)
    notify('Ürün silindi', 'info')
  }

  return (
    <div>
      <AdminHeader
        title="Ürünler"
        description={`${products.length} ürün`}
        action={
          <Button onClick={openNew}>
            <Plus className="size-4" /> Yeni ürün
          </Button>
        }
      />

      <div className="mb-4 max-w-xs">
        <Input
          type="search"
          placeholder="Ürün ara…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Ürün ara"
        />
      </div>

      <TableWrap>
        <table className="w-full min-w-[54rem]">
          <thead className="border-b border-line bg-cream-100">
            <tr>
              <Th>Ürün</Th>
              <Th>Kategori</Th>
              <Th>Fiyat</Th>
              <Th>Rozetler</Th>
              <Th>Aktif</Th>
              <Th className="text-right">İşlem</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {sorted.map((product) => (
              <tr key={product.id} className="hover:bg-cream-50">
                <Td>
                  <div className="flex items-center gap-3">
                    <img
                      src={assetUrl(product.image)}
                      alt=""
                      width={80}
                      height={80}
                      loading="lazy"
                      className="size-11 shrink-0 rounded-md bg-cream-100 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-cocoa-800">{product.name}</p>
                      <p className="truncate text-[0.75rem] text-muted">/{product.slug}</p>
                    </div>
                  </div>
                </Td>
                <Td>{categories.find((category) => category.id === product.categoryId)?.name ?? '—'}</Td>
                <Td>
                  <span className="font-semibold text-cocoa-800">{formatPrice(product.price)}</span>
                  {product.oldPrice ? (
                    <span className="ml-2 text-[0.75rem] text-muted line-through">{formatPrice(product.oldPrice)}</span>
                  ) : null}
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {product.isFeatured && <Badge tone="olive">Öne çıkan</Badge>}
                    {product.isNew && <Badge tone="new">Yeni</Badge>}
                    {product.isPopular && <Badge tone="soft">Popüler</Badge>}
                  </div>
                </Td>
                <Td>
                  <Toggle
                    checked={product.isActive}
                    label={`${product.name} aktif`}
                    onChange={(next) => upsertProduct({ ...product, isActive: next })}
                  />
                </Td>
                <Td className="text-right">
                  <div className="inline-flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      aria-label={`${product.name} düzenle`}
                      className="grid size-9 place-items-center rounded-full text-cocoa-600 hover:bg-cream-200"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      aria-label={`${product.name} sil`}
                      className="grid size-9 place-items-center rounded-full text-muted hover:bg-blush-50 hover:text-[var(--color-error)]"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Ürünü düzenle' : 'Yeni ürün'}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditing(null)}>
              Vazgeç
            </Button>
            <Button type="submit" form="product-form">
              Kaydet
            </Button>
          </div>
        }
      >
        {editing && (
          <form id="product-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Ürün adı"
                required
                value={editing.name}
                onChange={(event) => setEditing({ ...editing, name: event.target.value })}
              />
              <Input
                label="Slug"
                placeholder="otomatik"
                value={editing.slug}
                onChange={(event) => setEditing({ ...editing, slug: event.target.value })}
                hint="Boş bırakılırsa isimden üretilir."
              />
            </div>

            <Textarea
              label="Açıklama"
              required
              value={editing.description}
              onChange={(event) => setEditing({ ...editing, description: event.target.value })}
            />

            <div className="grid gap-5 sm:grid-cols-3">
              <Select
                label="Kategori"
                required
                value={editing.categoryId}
                onChange={(event) => setEditing({ ...editing, categoryId: event.target.value })}
              >
                <option value="">Seçiniz</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              <Input
                label="Fiyat (₺)"
                type="number"
                min={0}
                step={5}
                required
                value={editing.price}
                onChange={(event) => setEditing({ ...editing, price: Number(event.target.value) })}
              />
              <Input
                label="Eski fiyat (₺)"
                type="number"
                min={0}
                step={5}
                value={editing.oldPrice ?? ''}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    oldPrice: event.target.value ? Number(event.target.value) : undefined,
                  })
                }
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Görsel yolu"
                required
                value={editing.image}
                onChange={(event) => setEditing({ ...editing, image: event.target.value, gallery: undefined })}
                hint="public/images/products/ altındaki dosya"
              />
              <Select label="Seçenek seti" value={presetId} onChange={(event) => setPresetId(event.target.value)}>
                {optionPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
                {presetId === 'custom' && <option value="custom">Özel (mevcut korunur)</option>}
              </Select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="İndirim oranı (%)"
                type="number"
                min={0}
                max={90}
                value={editing.discountPercentage ?? ''}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    discountPercentage: event.target.value ? Number(event.target.value) : undefined,
                  })
                }
              />
              <Input
                label="Sıralama"
                type="number"
                min={0}
                value={editing.order ?? 0}
                onChange={(event) => setEditing({ ...editing, order: Number(event.target.value) })}
              />
            </div>

            <div className="space-y-3 rounded-lg bg-cream-100 p-4">
              {(
                [
                  ['isActive', 'Aktif'],
                  ['isFeatured', 'Öne çıkan'],
                  ['isNew', 'Yeni rozeti'],
                  ['isPopular', 'Popüler'],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-cocoa-700">{label}</span>
                  <Toggle
                    checked={Boolean(editing[key])}
                    label={label}
                    onChange={(next) => setEditing({ ...editing, [key]: next })}
                  />
                </div>
              ))}
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
