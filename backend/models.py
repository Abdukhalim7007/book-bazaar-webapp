from typing import List, Optional

from pydantic import BaseModel


class BookResponse(BaseModel):
    id: str
    title: str
    author: str
    price: int  # KRW integer
    description: str = ""
    genre: str = ""
    cover_image_url: Optional[str] = None  # DB stores Telegram file_id, not a URL


class BooksListResponse(BaseModel):
    items: List[BookResponse]
    total: int


class CategoryResponse(BaseModel):
    genre: str
    count: int


class CartItemResponse(BaseModel):
    book_id: str
    title: str
    author: str
    price_krw: int
    quantity: int
    cover_image_url: Optional[str] = None
    line_total: int


class WishlistItemResponse(BaseModel):
    book_id: str
    title: str
    author: str
    price_krw: int
    cover_image_url: Optional[str] = None


class OrderItemResponse(BaseModel):
    book_id: str
    title: str
    quantity: int
    price: int


class OrderResponse(BaseModel):
    id: int
    status: str
    total_price: int
    points_earned: int
    promo_code: Optional[str] = None
    promo_discount: int = 0
    created_at: str
    items: List[OrderItemResponse] = []


class UserResponse(BaseModel):
    user_id: int
    first_name: str
    last_name: str
    username: str
    points: int
    tier: str  # Bronze | Silver | Gold
    total_orders: int
    total_spent: int
    created_at: str
