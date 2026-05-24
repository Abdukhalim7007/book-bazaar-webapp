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

export interface CartItem {
  book_id: string | number
  title: string
  price_krw: number
  quantity: number
  cover_image_url?: string
}

export interface WishlistItem {
  book_id: string | number
  title: string
  author: string
  price_krw: number
  cover_image_url?: string
}

export interface OrderItem {
  book_id: string | number
  title: string
  quantity: number
  price_krw: number
}

export interface Order {
  id: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total_price: number
  points_earned: number
  created_at: string
  items: OrderItem[]
}

export interface UserProfile {
  user_id: number
  first_name: string
  last_name: string
  username: string
  points: number
  total_orders: number
  total_spent: number
  created_at: string
}
