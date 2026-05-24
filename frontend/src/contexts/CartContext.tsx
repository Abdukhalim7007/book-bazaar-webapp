import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react'
import type { CartItem } from '@/types'
import { useTelegram } from './TelegramContext'

interface CartState {
  items: CartItem[]
  loading: boolean
}

type CartAction =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string | number }
  | { type: 'UPDATE_QUANTITY'; payload: { book_id: string | number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }

interface CartContextValue {
  items: CartItem[]
  total: number
  itemCount: number
  loading: boolean
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (book_id: string | number) => void
  updateQuantity: (book_id: string | number, quantity: number) => void
  clearCart: () => void
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.book_id === action.payload.book_id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.book_id === action.payload.book_id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.book_id !== action.payload),
      }
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.book_id !== action.payload.book_id),
        }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.book_id === action.payload.book_id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    default:
      return state
  }
}

const CartContext = createContext<CartContextValue | null>(null)

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export function CartProvider({ children }: { children: ReactNode }) {
  const { initData } = useTelegram()
  const [state, dispatch] = useReducer(cartReducer, { items: [], loading: false })

  useEffect(() => {
    if (!initData) return
    dispatch({ type: 'SET_LOADING', payload: true })
    fetch(`${API_BASE}/api/cart`, {
      headers: { Authorization: `tma ${initData}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: CartItem[]) => dispatch({ type: 'SET_ITEMS', payload: data }))
      .catch(() => {
        // Backend cart endpoint not ready yet — start empty
      })
      .finally(() => dispatch({ type: 'SET_LOADING', payload: false }))
  }, [initData])

  const total = state.items.reduce((sum, i) => sum + i.price_krw * i.quantity, 0)
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        total,
        itemCount,
        loading: state.loading,
        addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
        removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
        updateQuantity: (id, qty) =>
          dispatch({ type: 'UPDATE_QUANTITY', payload: { book_id: id, quantity: qty } }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
