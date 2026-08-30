import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Field'
import { Modal } from '@/components/ui/Modal'
import { useCatalog } from '@/context/CatalogContext'
import { useToast } from '@/context/ToastContext'
import { slugify } from '@/lib/format'
import type { Category } from '@/types'
import { AdminHeader, Td, TableWrap, Th, Toggle } from './components'
import { assetUrl } from '@/lib/assets'

const tones: Category['tone'][] = ['cocoa', 'olive', 'blush', 'cream']

const emptyCategory = (order: number): Category => ({
  id: '',
  slug: '',
  name: '',
  tagline: '',
  image: '/images/products/cilekli-magnolya.webp',
  tone: 'cream',
  order,
  isActive: true,
})

export function AdminCategories() {
  const { categories, upsertCategory, deleteCategory, countByCategory } = useCatalog()
  const { notify } = useToast()
  const [editing, setEditing] = useState<Category | null>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!editing) return
    const slug = editing.slug || slugify(editing.name)
    upsertCategory({ ...editing, id: editing.id || slug, slug })
    notify(editing.id ? 'Kategori güncellendi' : 'Kategori eklendi')
    setEditing(null)
  }

  const handleDelete = (category: Category) => {
    if (!window.confirm(`"${category.name}" kategorisi ve içindeki ürünler silinsin mi?`)) return
    deleteCategory(category.id)
    notify('Kategori silindi', 'info')
  }

  return (
    <div>
      <AdminHeader
        title="Kategoriler"
        description={`${categories.length} kategori`}
        action={
          <Button onClick={() => setEditing(emptyCategory(categories.length + 1))}>
            <Plus className="size-4" /> Yeni kategori
          </Button>
        }
      />

      <TableWrap>
        <table className="w-full min-w-[42rem]">
          <thead className="border-b border-line bg-cream-100">
            <tr>
              <Th>Kategori</Th>
              <Th>Ürün</Th>
              <Th>Sıra</Th>
              <Th>Aktif</Th>
              <Th className="text-right">İşlem</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {[...categories]
              .sort((a, b) => a.order - b.order)
              .map((category) => (
                <tr key={category.id} className="hover:bg-cream-50">
                  <Td>
                    <div className="flex items-center gap-3">
                      <img
                        src={assetUrl(category.image)}
                        alt=""
                        width={80}
                        height={80}
                        loading="lazy"
                        className="size-11 shrink-0 rounded-md bg-cream-100 object-cover"
                      />
                      <div>
                        <p className="font-semibold text-cocoa-800">{category.name}</p>
                        <p className="text-[0.75rem] text-muted">{category.tagline}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>{countByCategory(category.id)} ürün</Td>
                  <Td>{category.order}</Td>
                  <Td>
                    <Toggle
                      checked={category.isActive}
                      label={`${category.name} aktif`}
                      onChange={(next) => upsertCategory({ ...category, isActive: next })}
                    />
                  </Td>
                  <Td className="text-right">
                    <div className="inline-flex gap-1">
                      <button
                        type="button"
                        onClick={() => setEditing(category)}
                        aria-label={`${category.name} düzenle`}
                        className="grid size-9 place-items-center rounded-full text-cocoa-600 hover:bg-cream-200"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
                        aria-label={`${category.name} sil`}
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
        title={editing?.id ? 'Kategoriyi düzenle' : 'Yeni kategori'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditing(null)}>
              Vazgeç
            </Button>
            <Button type="submit" form="category-form">
              Kaydet
            </Button>
          </div>
        }
      >
        {editing && (
          <form id="category-form" onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Kategori adı"
              required
              value={editing.name}
              onChange={(event) => setEditing({ ...editing, name: event.target.value })}
            />
            <Input
              label="Kısa açıklama"
              value={editing.tagline ?? ''}
              onChange={(event) => setEditing({ ...editing, tagline: event.target.value })}
            />
            <Input
              label="Görsel yolu"
              required
              value={editing.image}
              onChange={(event) => setEditing({ ...editing, image: event.target.value })}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Select
                label="Renk tonu"
                value={editing.tone}
                onChange={(event) => setEditing({ ...editing, tone: event.target.value as Category['tone'] })}
              >
                {tones.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </Select>
              <Input
                label="Sıra"
                type="number"
                min={1}
                value={editing.order}
                onChange={(event) => setEditing({ ...editing, order: Number(event.target.value) })}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-cream-100 p-4">
              <span className="text-sm font-medium text-cocoa-700">Aktif</span>
              <Toggle
                checked={editing.isActive}
                label="Aktif"
                onChange={(next) => setEditing({ ...editing, isActive: next })}
              />
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
