import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import type { CartItem } from '@/types'
import { multiply, sum } from '@/lib/money'
import { readStorage, writeStorage } from '@/lib/storage'
import { track } from '@/lib/analytics'

const STORAGE_KEY = 'cart'

type CartAction =
  | { type: 'add'; item: CartItem }
  | { type: 'remove'; key: string }
  | { type: 'setQuantity'; key: string; quantity: number }
  | { type: 'clear' }
  | { type: 'hydrate'; items: CartItem[] }

function reducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'hydrate':
      return action.items
    case 'add': {
      const existing = state.find((i) => i.key === action.item.key)
      if (existing) {
        return state.map((i) =>
          i.key === action.item.key ? { ...i, quantity: i.quantity + action.item.quantity } : i,
        )
      }
      return [...state, action.item]
    }
    case 'remove':
      return state.filter((i) => i.key !== action.key)
    case 'setQuantity':
      if (action.quantity <= 0) return state.filter((i) => i.key !== action.key)
      return state.map((i) => (i.key === action.key ? { ...i, quantity: action.quantity } : i))
    case 'clear':
      return []
  }
}

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: CartItem) => void
  removeItem: (key: string) => void
  setQuantity: (key: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, [], () => readStorage<CartItem[]>(STORAGE_KEY, []))
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    writeStorage(STORAGE_KEY, items)
  }, [items])

  /* Sepet açıkken arka plan kaymasın */
  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: 'add', item })
    track('add_to_cart', { productId: item.productId, value: item.unitPrice * item.quantity })
  }, [])

  const removeItem = useCallback((key: string) => {
    dispatch({ type: 'remove', key })
    track('remove_from_cart', { key })
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((acc, i) => acc + i.quantity, 0)
    const subtotal = sum(...items.map((i) => multiply(i.unitPrice, i.quantity)))
    return {
      items,
      itemCount,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      setQuantity: (key, quantity) => dispatch({ type: 'setQuantity', key, quantity }),
      clearCart: () => dispatch({ type: 'clear' }),
    }
  }, [items, isOpen, addItem, removeItem])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart, CartProvider içinde kullanılmalıdır.')
  return ctx
}
