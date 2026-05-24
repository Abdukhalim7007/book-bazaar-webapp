import type { Book, BooksListResponse } from '@/types'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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

export async function getBook(id: string): Promise<Book> {
  return fetchApi<Book>(`/books/${id}`)
}
