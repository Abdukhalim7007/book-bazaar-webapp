from typing import List, Optional

from fastapi import APIRouter, Depends, Header, HTTPException, Query
from pydantic import BaseModel

from auth import validate_telegram_init_data
from db import get_db
from models import (
    BookResponse,
    BooksListResponse,
    CartItemResponse,
    CategoryResponse,
    OrderItemResponse,
    OrderResponse,
    UserResponse,
    WishlistItemResponse,
)

router = APIRouter()


# ── Helpers ───────────────────────────────────────────────────────────────

async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")
    if not authorization.startswith("tma "):
        raise HTTPException(status_code=401, detail="Expected 'Authorization: tma {initData}'")
    return validate_telegram_init_data(authorization[4:])


def _get_tier(points: int) -> str:
    if points >= 1000:
        return "Gold"
    if points >= 300:
        return "Silver"
    return "Bronze"


def _row_to_book(row) -> BookResponse:
    return BookResponse(
        id=row["id"],
        title=row["title"],
        author=row["author"],
        price=row["price"],
        description=row["description"] or "",
        genre=row["genre"] or "",
        cover_image_url=None,  # Telegram file_id can't be used as HTTP URL directly
    )


def _row_to_cart_item(row) -> CartItemResponse:
    return CartItemResponse(
        book_id=row["book_id"],
        title=row["title"],
        author=row["author"],
        price_krw=row["price"],
        quantity=row["quantity"],
        cover_image_url=None,
        line_total=row["price"] * row["quantity"],
    )


# ── Health ────────────────────────────────────────────────────────────────

@router.get("/health")
async def health() -> dict:
    return {"status": "ok"}


# ── Auth / User upsert ────────────────────────────────────────────────────

@router.post("/api/auth/me", response_model=UserResponse)
async def auth_me(current_user: dict = Depends(get_current_user)) -> UserResponse:
    """Upsert the Telegram user in the DB, then return their full profile."""
    user_id = int(current_user["id"])
    async with get_db() as db:
        await db.execute(
            """
            INSERT INTO users (user_id, username, first_name, last_name)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                username    = excluded.username,
                first_name  = excluded.first_name,
                last_name   = excluded.last_name,
                updated_at  = CURRENT_TIMESTAMP
            """,
            (user_id, current_user["username"], current_user["first_name"], current_user["last_name"]),
        )
        await db.execute(
            "INSERT OR IGNORE INTO user_points (user_id, balance) VALUES (?, 0)",
            (user_id,),
        )
        await db.commit()

        cur = await db.execute(
            """
            SELECT u.user_id, u.first_name, u.last_name, u.username, u.created_at,
                   COALESCE(up.balance, 0) AS points
            FROM users u
            LEFT JOIN user_points up ON u.user_id = up.user_id
            WHERE u.user_id = ?
            """,
            (user_id,),
        )
        user_row = await cur.fetchone()

        stats_cur = await db.execute(
            "SELECT COUNT(*) AS cnt, COALESCE(SUM(total_price), 0) AS spent "
            "FROM orders WHERE user_id = ? AND status != 'cancelled'",
            (user_id,),
        )
        stats = await stats_cur.fetchone()

    points = user_row["points"]
    return UserResponse(
        user_id=user_row["user_id"],
        first_name=user_row["first_name"] or "",
        last_name=user_row["last_name"] or "",
        username=user_row["username"] or "",
        points=points,
        tier=_get_tier(points),
        total_orders=stats["cnt"],
        total_spent=stats["spent"],
        created_at=user_row["created_at"],
    )


# ── Books ─────────────────────────────────────────────────────────────────

@router.get("/api/books", response_model=BooksListResponse)
async def list_books(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    genre: Optional[str] = None,
    search: Optional[str] = None,
    featured: Optional[bool] = None,   # no DB column — accepted, not filtered
    bestseller: Optional[bool] = None,  # no DB column — accepted, not filtered
) -> BooksListResponse:
    conditions = ["status = 'active'"]
    filter_params: list = []

    if genre:
        conditions.append("genre = ?")
        filter_params.append(genre)
    if search:
        conditions.append("(title LIKE ? OR author LIKE ?)")
        filter_params += [f"%{search}%", f"%{search}%"]

    where = " AND ".join(conditions)

    async with get_db() as db:
        count_cur = await db.execute(
            f"SELECT COUNT(*) AS cnt FROM books WHERE {where}", filter_params
        )
        total = (await count_cur.fetchone())["cnt"]

        cur = await db.execute(
            f"SELECT * FROM books WHERE {where} ORDER BY created_at DESC LIMIT ? OFFSET ?",
            filter_params + [limit, offset],
        )
        rows = await cur.fetchall()

    return BooksListResponse(items=[_row_to_book(r) for r in rows], total=total)


# NOTE: /api/books/search must be registered BEFORE /api/books/{book_id}
# so FastAPI matches the literal segment "search" first.
@router.get("/api/books/search", response_model=List[BookResponse])
async def search_books(q: str = Query(..., min_length=1)) -> List[BookResponse]:
    async with get_db() as db:
        cur = await db.execute(
            "SELECT * FROM books WHERE status = 'active' AND (title LIKE ? OR author LIKE ?) "
            "ORDER BY created_at DESC LIMIT 50",
            (f"%{q}%", f"%{q}%"),
        )
        rows = await cur.fetchall()
    return [_row_to_book(r) for r in rows]


@router.get("/api/books/{book_id}", response_model=BookResponse)
async def get_book(book_id: str) -> BookResponse:
    async with get_db() as db:
        cur = await db.execute("SELECT * FROM books WHERE id = ?", (book_id,))
        row = await cur.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Book not found")
    return _row_to_book(row)


@router.get("/api/categories", response_model=List[CategoryResponse])
async def list_categories() -> List[CategoryResponse]:
    async with get_db() as db:
        cur = await db.execute(
            "SELECT genre, COUNT(*) AS count FROM books WHERE status = 'active' "
            "GROUP BY genre ORDER BY count DESC"
        )
        rows = await cur.fetchall()
    return [CategoryResponse(genre=r["genre"], count=r["count"]) for r in rows]


# ── Cart ──────────────────────────────────────────────────────────────────

@router.get("/api/cart", response_model=List[CartItemResponse])
async def get_cart(current_user: dict = Depends(get_current_user)) -> List[CartItemResponse]:
    user_id = int(current_user["id"])
    async with get_db() as db:
        cur = await db.execute(
            """
            SELECT ci.book_id, ci.quantity, b.title, b.author, b.price
            FROM cart_items ci
            JOIN books b ON ci.book_id = b.id
            WHERE ci.user_id = ?
            ORDER BY ci.created_at DESC
            """,
            (user_id,),
        )
        rows = await cur.fetchall()
    return [_row_to_cart_item(r) for r in rows]


class AddToCartBody(BaseModel):
    book_id: str
    quantity: int = 1


@router.post("/api/cart/add", response_model=List[CartItemResponse])
async def add_to_cart(
    body: AddToCartBody,
    current_user: dict = Depends(get_current_user),
) -> List[CartItemResponse]:
    user_id = int(current_user["id"])
    async with get_db() as db:
        cur = await db.execute(
            "SELECT id FROM books WHERE id = ? AND status = 'active'", (body.book_id,)
        )
        if not await cur.fetchone():
            raise HTTPException(status_code=404, detail="Book not found")

        await db.execute(
            """
            INSERT INTO cart_items (user_id, book_id, quantity)
            VALUES (?, ?, ?)
            ON CONFLICT(user_id, book_id) DO UPDATE SET quantity = quantity + excluded.quantity
            """,
            (user_id, body.book_id, body.quantity),
        )
        await db.commit()

        cur = await db.execute(
            """
            SELECT ci.book_id, ci.quantity, b.title, b.author, b.price
            FROM cart_items ci
            JOIN books b ON ci.book_id = b.id
            WHERE ci.user_id = ?
            ORDER BY ci.created_at DESC
            """,
            (user_id,),
        )
        rows = await cur.fetchall()
    return [_row_to_cart_item(r) for r in rows]


@router.delete("/api/cart/remove/{book_id}")
async def remove_from_cart(
    book_id: str,
    current_user: dict = Depends(get_current_user),
) -> dict:
    user_id = int(current_user["id"])
    async with get_db() as db:
        await db.execute(
            "DELETE FROM cart_items WHERE user_id = ? AND book_id = ?",
            (user_id, book_id),
        )
        await db.commit()
    return {"success": True}


# ── Wishlist ──────────────────────────────────────────────────────────────

@router.get("/api/wishlist", response_model=List[WishlistItemResponse])
async def get_wishlist(current_user: dict = Depends(get_current_user)) -> List[WishlistItemResponse]:
    user_id = int(current_user["id"])
    async with get_db() as db:
        cur = await db.execute(
            """
            SELECT wi.book_id, b.title, b.author, b.price
            FROM wishlist_items wi
            JOIN books b ON wi.book_id = b.id
            WHERE wi.user_id = ?
            ORDER BY wi.created_at DESC
            """,
            (user_id,),
        )
        rows = await cur.fetchall()
    return [
        WishlistItemResponse(
            book_id=r["book_id"],
            title=r["title"],
            author=r["author"],
            price_krw=r["price"],
            cover_image_url=None,
        )
        for r in rows
    ]


@router.post("/api/wishlist/toggle/{book_id}")
async def toggle_wishlist(
    book_id: str,
    current_user: dict = Depends(get_current_user),
) -> dict:
    user_id = int(current_user["id"])
    async with get_db() as db:
        cur = await db.execute(
            "SELECT id FROM wishlist_items WHERE user_id = ? AND book_id = ?",
            (user_id, book_id),
        )
        existing = await cur.fetchone()
        if existing:
            await db.execute(
                "DELETE FROM wishlist_items WHERE user_id = ? AND book_id = ?",
                (user_id, book_id),
            )
            await db.commit()
            return {"wishlisted": False}
        else:
            await db.execute(
                "INSERT INTO wishlist_items (user_id, book_id) VALUES (?, ?)",
                (user_id, book_id),
            )
            await db.commit()
            return {"wishlisted": True}


# ── Orders ────────────────────────────────────────────────────────────────

@router.get("/api/orders", response_model=List[OrderResponse])
async def get_orders(current_user: dict = Depends(get_current_user)) -> List[OrderResponse]:
    user_id = int(current_user["id"])
    async with get_db() as db:
        cur = await db.execute(
            """
            SELECT id, status, total_price, points_earned, promo_code, promo_discount, created_at
            FROM orders
            WHERE user_id = ?
            ORDER BY created_at DESC
            """,
            (user_id,),
        )
        order_rows = await cur.fetchall()
        if not order_rows:
            return []

        order_ids = [r["id"] for r in order_rows]
        placeholders = ",".join("?" * len(order_ids))
        items_cur = await db.execute(
            f"""
            SELECT oi.order_id, oi.book_id, oi.quantity, oi.price,
                   COALESCE(b.title, oi.book_id) AS title
            FROM order_items oi
            LEFT JOIN books b ON oi.book_id = b.id
            WHERE oi.order_id IN ({placeholders})
            """,
            order_ids,
        )
        item_rows = await items_cur.fetchall()

    items_by_order: dict = {}
    for item in item_rows:
        oid = item["order_id"]
        items_by_order.setdefault(oid, []).append(
            OrderItemResponse(
                book_id=item["book_id"],
                title=item["title"],
                quantity=item["quantity"],
                price=item["price"],
            )
        )

    return [
        OrderResponse(
            id=r["id"],
            status=r["status"],
            total_price=r["total_price"],
            points_earned=r["points_earned"],
            promo_code=r["promo_code"],
            promo_discount=r["promo_discount"] or 0,
            created_at=r["created_at"],
            items=items_by_order.get(r["id"], []),
        )
        for r in order_rows
    ]


# ── User profile ──────────────────────────────────────────────────────────

@router.get("/api/users/me", response_model=UserResponse)
async def get_user_me(current_user: dict = Depends(get_current_user)) -> UserResponse:
    user_id = int(current_user["id"])
    async with get_db() as db:
        cur = await db.execute(
            """
            SELECT u.user_id, u.first_name, u.last_name, u.username, u.created_at,
                   COALESCE(up.balance, 0) AS points
            FROM users u
            LEFT JOIN user_points up ON u.user_id = up.user_id
            WHERE u.user_id = ?
            """,
            (user_id,),
        )
        user_row = await cur.fetchone()
        if not user_row:
            raise HTTPException(
                status_code=404, detail="User not found — call POST /api/auth/me first"
            )

        stats_cur = await db.execute(
            "SELECT COUNT(*) AS cnt, COALESCE(SUM(total_price), 0) AS spent "
            "FROM orders WHERE user_id = ? AND status != 'cancelled'",
            (user_id,),
        )
        stats = await stats_cur.fetchone()

    points = user_row["points"]
    return UserResponse(
        user_id=user_row["user_id"],
        first_name=user_row["first_name"] or "",
        last_name=user_row["last_name"] or "",
        username=user_row["username"] or "",
        points=points,
        tier=_get_tier(points),
        total_orders=stats["cnt"],
        total_spent=stats["spent"],
        created_at=user_row["created_at"],
    )
