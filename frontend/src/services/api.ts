import type { Book, BooksListResponse, WishlistItem } from '@/types'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export async function fetchApi<T>(
  path: string,
  options?: RequestInit,
  initData?: string
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(initData ? { Authorization: `tma ${initData}` } : {}),
      ...options?.headers,
    },
  })
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function getBooks(limit = 12, offset = 0): Promise<BooksListResponse> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) })
  return fetchApi<BooksListResponse>(`/books?${params}`)
}

export async function getBook(id: string | number): Promise<Book> {
  return fetchApi<Book>(`/books/${id}`)
}

export async function getWishlist(initData: string): Promise<WishlistItem[]> {
  return fetchApi<WishlistItem[]>('/api/wishlist', {}, initData)
}

export async function toggleWishlist(
  bookId: string | number,
  initData: string
): Promise<{ wishlisted: boolean }> {
  return fetchApi<{ wishlisted: boolean }>(
    '/api/wishlist/toggle',
    { method: 'POST', body: JSON.stringify({ book_id: bookId }) },
    initData
  )
}
