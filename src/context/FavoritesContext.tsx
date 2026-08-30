import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { readStorage, writeStorage } from '@/lib/storage'

const STORAGE_KEY = 'favorites'

interface FavoritesContextValue {
  favorites: string[]
  isFavorite: (productId: string) => boolean
  toggleFavorite: (productId: string) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => readStorage<string[]>(STORAGE_KEY, []))

  useEffect(() => {
    writeStorage(STORAGE_KEY, favorites)
  }, [favorites])

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      isFavorite: (productId) => favorites.includes(productId),
      toggleFavorite: (productId) =>
        setFavorites((prev) =>
          prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
        ),
    }),
    [favorites],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites, FavoritesProvider içinde kullanılmalıdır.')
  return ctx
}
