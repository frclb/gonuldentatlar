import { Download, RotateCcw, Save, Upload } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Field'
import { useCatalog } from '@/context/CatalogContext'
import { useToast } from '@/context/ToastContext'
import type { BusinessHour } from '@/types'
import { AdminCard, AdminHeader, Toggle } from './components'

export function AdminSettings() {
  const { settings, updateSettings, resetCatalog, exportCatalog, importCatalog } = useCatalog()
  const { notify } = useToast()
  const [draft, setDraft] = useState(settings)
  const fileInput = useRef<HTMLInputElement>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    updateSettings(draft)
    notify('İşletme ayarları kaydedildi')
  }

  const updateHour = (day: number, patch: Partial<BusinessHour>) => {
    setDraft((prev) => ({
      ...prev,
      hours: prev.hours.map((hour) => (hour.day === day ? { ...hour, ...patch } : hour)),
    }))
  }

  /** Katalogu JSON dosyası olarak indirir. */
  const handleExport = () => {
    const blob = new Blob([exportCatalog()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const stamp = new Date().toISOString().slice(0, 10)
    link.href = url
    link.download = `gonulden-tatlar-${stamp}.json`
    link.click()
    URL.revokeObjectURL(url)
    notify('Yedek indirildi')
  }

  const handleImport = async (file: File) => {
    const ok = importCatalog(await file.text())
    notify(ok ? 'Veriler geri yüklendi' : 'Dosya okunamadı — geçerli bir yedek mi?', ok ? 'success' : 'error')
    if (ok) setDraft((prev) => ({ ...prev }))
  }

  const handleReset = () => {
    if (!window.confirm('Tüm ürün, kategori, kampanya ve sipariş verileri başlangıç haline döndürülecek. Devam edilsin mi?')) {
      return
    }
    resetCatalog()
    notify('Veriler sıfırlandı', 'info')
  }

  return (
    <form onSubmit={handleSubmit}>
      <AdminHeader
        title="İşletme Ayarları"
        description="Bu ayarlar site genelinde kullanılır."
        action={
          <Button type="submit">
            <Save className="size-4" /> Kaydet
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminCard className="p-6">
          <h2 className="text-lg">İletişim</h2>
          <div className="mt-5 space-y-5">
            <Input
              label="İşletme adı"
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            />
            <Input
              label="Slogan"
              value={draft.slogan}
              onChange={(event) => setDraft({ ...draft, slogan: event.target.value })}
            />
            <Input
              label="Telefon"
              value={draft.phone}
              onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
            />
            <Input
              label="WhatsApp numarası"
              value={draft.whatsapp}
              onChange={(event) => setDraft({ ...draft, whatsapp: event.target.value })}
              hint="Ülke kodu ile, sadece rakam. Örn: 905321234567"
            />
            <Input
              label="Instagram adresi"
              value={draft.instagram}
              onChange={(event) => setDraft({ ...draft, instagram: event.target.value })}
            />
            <Input
              label="Instagram kullanıcı adı"
              value={draft.instagramHandle}
              onChange={(event) => setDraft({ ...draft, instagramHandle: event.target.value })}
            />
            <Input
              label="Adres"
              value={draft.address}
              onChange={(event) => setDraft({ ...draft, address: event.target.value })}
            />
            <Input
              label="Harita bağlantısı"
              value={draft.mapsUrl}
              onChange={(event) => setDraft({ ...draft, mapsUrl: event.target.value })}
            />
          </div>
        </AdminCard>

        <div className="space-y-5">
          <AdminCard className="p-6">
            <h2 className="text-lg">Sipariş</h2>
            <div className="mt-5 space-y-5">
              <div className="flex items-center justify-between rounded-lg bg-cream-100 p-4">
                <div>
                  <p className="text-sm font-semibold text-cocoa-700">Mağaza açık</p>
                  <p className="text-[0.78rem] text-muted">Kapalıyken sitede bilgilendirme gösterilir.</p>
                </div>
                <Toggle
                  checked={draft.isOpen}
                  label="Mağaza açık"
                  onChange={(next) => setDraft({ ...draft, isOpen: next })}
                />
              </div>
              <Input
                label="Minimum sipariş tutarı (₺)"
                type="number"
                min={0}
                value={draft.minOrderTotal}
                onChange={(event) => setDraft({ ...draft, minOrderTotal: Number(event.target.value) })}
              />
              <Input
                label="Teslimat ücreti (₺)"
                type="number"
                min={0}
                value={draft.deliveryFee}
                onChange={(event) => setDraft({ ...draft, deliveryFee: Number(event.target.value) })}
              />
              <Input
                label="Ücretsiz teslimat limiti (₺)"
                type="number"
                min={0}
                value={draft.freeDeliveryOver}
                onChange={(event) => setDraft({ ...draft, freeDeliveryOver: Number(event.target.value) })}
              />
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h2 className="text-lg">Çalışma saatleri</h2>
            <ul className="mt-4 space-y-2.5">
              {draft.hours.map((hour) => (
                <li key={hour.day} className="flex flex-wrap items-center gap-3">
                  <span className="w-24 shrink-0 text-sm font-medium text-cocoa-700">{hour.label}</span>
                  <input
                    type="time"
                    value={hour.open}
                    disabled={hour.isClosed}
                    aria-label={`${hour.label} açılış`}
                    onChange={(event) => updateHour(hour.day, { open: event.target.value })}
                    className="h-10 rounded-md border border-line bg-surface px-3 text-sm disabled:opacity-40"
                  />
                  <span className="text-muted">–</span>
                  <input
                    type="time"
                    value={hour.close}
                    disabled={hour.isClosed}
                    aria-label={`${hour.label} kapanış`}
                    onChange={(event) => updateHour(hour.day, { close: event.target.value })}
                    className="h-10 rounded-md border border-line bg-surface px-3 text-sm disabled:opacity-40"
                  />
                  <label className="ml-auto flex items-center gap-2 text-[0.8rem] text-muted">
                    Kapalı
                    <input
                      type="checkbox"
                      checked={hour.isClosed}
                      onChange={(event) => updateHour(hour.day, { isClosed: event.target.checked })}
                      className="size-4 accent-[var(--color-cocoa-600)]"
                    />
                  </label>
                </li>
              ))}
            </ul>
          </AdminCard>

          <AdminCard className="p-6">
            <h2 className="text-lg">Veri</h2>
            <p className="mt-2 text-sm text-muted">
              Site statik olarak yayınlandığı için ürün, kategori, kampanya ve siparişler yalnızca bu tarayıcıda
              saklanır. Değişikliklerini yedekle, siteye kalıcı olarak işlenmesi için yedek dosyasını geliştiriciye
              ilet.
            </p>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <Button type="button" variant="outline" onClick={handleExport}>
                <Download className="size-4" /> Yedek indir
              </Button>
              <Button type="button" variant="outline" onClick={() => fileInput.current?.click()}>
                <Upload className="size-4" /> Yedekten yükle
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                <RotateCcw className="size-4" /> Sıfırla
              </Button>
            </div>

            <input
              ref={fileInput}
              type="file"
              accept="application/json"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) void handleImport(file)
                event.target.value = ''
              }}
            />
          </AdminCard>
        </div>
      </div>
    </form>
  )
}
