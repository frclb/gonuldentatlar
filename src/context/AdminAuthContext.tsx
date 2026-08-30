import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { readStorage, removeStorage, writeStorage } from '@/lib/storage'

/**
 * Basit demo authentication.
 * Gerçek kurulumda bu provider bir backend oturumuyla (JWT / httpOnly cookie)
 * değiştirilmelidir — şifre asla frontend'de tutulmamalıdır.
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
    const expected = import.meta.env.VITE_ADMIN_PASSWORD ?? 'gonulden2026'
    if (password !== expected) return false
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
