import { Lock } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { LogoMark } from '@/components/brand/Logo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Field'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { useSeo } from '@/lib/seo'

export function AdminLogin() {
  const { login } = useAdminAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useSeo({ title: 'Yönetim Girişi | Gönülden Tatlar', description: 'Gönülden Tatlar yönetim paneli.', path: '/admin' })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!login(password)) {
      setError('Şifre hatalı. Lütfen tekrar deneyin.')
      setPassword('')
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-cream-100 px-5 py-16">
      <div className="w-full max-w-sm rounded-xl bg-surface p-8 shadow-card">
        <div className="flex flex-col items-center text-center">
          <LogoMark className="size-12" />
          <h1 className="mt-4 text-[1.5rem]">Yönetim Paneli</h1>
          <p className="mt-1.5 text-sm text-muted">Devam etmek için şifreni gir.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <Input
            label="Şifre"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            value={password}
            error={error ?? undefined}
            onChange={(event) => {
              setPassword(event.target.value)
              setError(null)
            }}
          />
          <Button type="submit" fullWidth size="lg">
            <Lock className="size-4" /> Giriş Yap
          </Button>
        </form>

        <p className="mt-6 rounded-md bg-cream-100 px-3.5 py-2.5 text-center text-[0.75rem] leading-relaxed text-muted">
          Demo şifresi <code className="font-semibold text-cocoa-700">.env</code> içindeki
          <code className="ml-1 font-semibold text-cocoa-700">VITE_ADMIN_PASSWORD</code> değeridir. Canlıda gerçek
          bir kimlik doğrulama servisi ile değiştirin.
        </p>
      </div>
    </div>
  )
}
