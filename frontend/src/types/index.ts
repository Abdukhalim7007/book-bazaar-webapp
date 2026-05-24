// Shared types – extend when API is connected
export interface Book {
  id: string | number
  title: string
  author: string
  price: number
  description?: string
  coverImageUrl?: string
  category?: string
  rating?: number
  sale?: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  itemCount: number
  imageUrl: string
}

export interface BooksListResponse {
  items: Book[]
  total: number
}
