import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Field'
import { Modal } from '@/components/ui/Modal'
import { useCatalog } from '@/context/CatalogContext'
import { useToast } from '@/context/ToastContext'
import { formatDate, formatPrice, slugify } from '@/lib/format'
import { discountRate } from '@/lib/money'
import type { Campaign } from '@/types'
import { AdminHeader, Td, TableWrap, Th, Toggle } from './components'
import { assetUrl } from '@/lib/assets'

const tones: Campaign['tone'][] = ['cocoa', 'olive', 'blush']

const today = () => new Date().toISOString().slice(0, 10)

const emptyCampaign = (): Campaign => ({
  id: '',
  slug: '',
  title: '',
  description: '',
  image: '/images/products/cilekli-cikolatali-cup.webp',
  startsAt: today(),
  endsAt: today(),
  isActive: true,
  tone: 'blush',
  ctaLabel: 'Ürünleri Gör',
})

export function AdminCampaigns() {
  const { campaigns, upsertCampaign, deleteCampaign } = useCatalog()
  const { notify } = useToast()
  const [editing, setEditing] = useState<Campaign | null>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!editing) return
    const slug = editing.slug || slugify(editing.title)
    const discountPercentage =
      editing.oldPrice && editing.price ? discountRate(editing.oldPrice, editing.price) : editing.discountPercentage
    upsertCampaign({ ...editing, id: editing.id || slug, slug, discountPercentage })
    notify(editing.id ? 'Kampanya güncellendi' : 'Kampanya eklendi')
    setEditing(null)
  }

  const handleDelete = (campaign: Campaign) => {
    if (!window.confirm(`"${campaign.title}" kampanyası silinsin mi?`)) return
    deleteCampaign(campaign.id)
    notify('Kampanya silindi', 'info')
  }

  return (
    <div>
      <AdminHeader
        title="Kampanyalar"
        description={`${campaigns.length} kampanya`}
        action={
          <Button onClick={() => setEditing(emptyCampaign())}>
            <Plus className="size-4" /> Yeni kampanya
          </Button>
        }
      />

      <TableWrap>
        <table className="w-full min-w-[50rem]">
          <thead className="border-b border-line bg-cream-100">
            <tr>
              <Th>Kampanya</Th>
              <Th>Fiyat</Th>
              <Th>Tarih</Th>
              <Th>Aktif</Th>
              <Th className="text-right">İşlem</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-cream-50">
                <Td>
                  <div className="flex items-center gap-3">
                    <img
                      src={assetUrl(campaign.image)}
                      alt=""
                      width={120}
                      height={80}
                      loading="lazy"
                      className="h-11 w-16 shrink-0 rounded-md bg-cream-100 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-cocoa-800">{campaign.title}</p>
                      <p className="line-clamp-1 text-[0.75rem] text-muted">{campaign.description}</p>
                    </div>
                  </div>
                </Td>
                <Td>
                  {campaign.price ? (
                    <>
                      <span className="font-semibold text-cocoa-800">{formatPrice(campaign.price)}</span>
                      {campaign.oldPrice ? (
                        <span className="ml-2 text-[0.75rem] text-muted line-through">
                          {formatPrice(campaign.oldPrice)}
                        </span>
                      ) : null}
                    </>
                  ) : (
                    '—'
                  )}
                </Td>
                <Td className="whitespace-nowrap text-[0.8rem]">
                  {formatDate(campaign.startsAt)} – {formatDate(campaign.endsAt)}
                </Td>
                <Td>
                  <Toggle
                    checked={campaign.isActive}
                    label={`${campaign.title} aktif`}
                    onChange={(next) => upsertCampaign({ ...campaign, isActive: next })}
                  />
                </Td>
                <Td className="text-right">
                  <div className="inline-flex gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing(campaign)}
                      aria-label={`${campaign.title} düzenle`}
                      className="grid size-9 place-items-center rounded-full text-cocoa-600 hover:bg-cream-200"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(campaign)}
                      aria-label={`${campaign.title} sil`}
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
        title={editing?.id ? 'Kampanyayı düzenle' : 'Yeni kampanya'}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditing(null)}>
              Vazgeç
            </Button>
            <Button type="submit" form="campaign-form">
              Kaydet
            </Button>
          </div>
        }
      >
        {editing && (
          <form id="campaign-form" onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Başlık"
              required
              value={editing.title}
              onChange={(event) => setEditing({ ...editing, title: event.target.value })}
            />
            <Textarea
              label="Açıklama"
              required
              value={editing.description}
              onChange={(event) => setEditing({ ...editing, description: event.target.value })}
            />
            <Input
              label="Görsel yolu"
              required
              value={editing.image}
              onChange={(event) => setEditing({ ...editing, image: event.target.value })}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Normal toplam (₺)"
                type="number"
                min={0}
                value={editing.oldPrice ?? ''}
                onChange={(event) =>
                  setEditing({ ...editing, oldPrice: event.target.value ? Number(event.target.value) : undefined })
                }
              />
              <Input
                label="Kampanya fiyatı (₺)"
                type="number"
                min={0}
                value={editing.price ?? ''}
                onChange={(event) =>
                  setEditing({ ...editing, price: event.target.value ? Number(event.target.value) : undefined })
                }
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <Input
                label="Başlangıç"
                type="date"
                required
                value={editing.startsAt}
                onChange={(event) => setEditing({ ...editing, startsAt: event.target.value })}
              />
              <Input
                label="Bitiş"
                type="date"
                required
                value={editing.endsAt}
                onChange={(event) => setEditing({ ...editing, endsAt: event.target.value })}
              />
              <Select
                label="Renk tonu"
                value={editing.tone}
                onChange={(event) => setEditing({ ...editing, tone: event.target.value as Campaign['tone'] })}
              >
                {tones.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </Select>
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
