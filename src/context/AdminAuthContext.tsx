import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { readStorage, removeStorage, writeStorage } from '@/lib/storage'

/**
 * Yalnızca geliştirme sunucusundaki yönetim paneli için basit bir kilit.
 *
 * Statik sitede tarayıcıya inen hiçbir şifre gizli değildir; bu yüzden panel
 * üretim paketine hiç girmiyor (bkz. App.tsx) ve gömülü varsayılan şifre yok.
 * Şifre .env.local içindeki VITE_ADMIN_PASSWORD ile verilir; tanımlı değilse
 * giriş yapılamaz. Gerçek bir yönetim ihtiyacı doğarsa sunucu tarafı oturum
 * (JWT / httpOnly cookie) gerekir.
 */

const STORAGE_KEY = 'admin-session'

interface AdminAuthContextValue {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => readStorage(STORAGE_KEY, false))

  const login = useCallback((password: string) => {
    const expected = import.meta.env.VITE_ADMIN_PASSWORD
    if (!expected || password !== expected) return false
    writeStorage(STORAGE_KEY, true)
    setIsAuthenticated(true)
    return true
  }, [])

  const logout = useCallback(() => {
    removeStorage(STORAGE_KEY)
    setIsAuthenticated(false)
  }, [])

  const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated, login, logout])

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth, AdminAuthProvider içinde kullanılmalıdır.')
  return ctx
}
