from fastapi import APIRouter, HTTPException, Query

from data import BOOKS
from models import BookResponse

router = APIRouter()


@router.get("/health")
def health() -> dict:
    return {"status": "ok"}


@router.get("/books", response_model=dict)
def list_books(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> dict:
    total = len(BOOKS)
    items = BOOKS[offset : offset + limit]
    return {"items": items, "total": total}


@router.get("/books/{id}", response_model=BookResponse)
def get_book(id: int) -> BookResponse:
    for book in BOOKS:
        if book.id == id:
            return book
    raise HTTPException(status_code=404, detail="Book not found")
