import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Book } from '@/types'
import { useCart } from '@/contexts/CartContext'
import { useTelegram } from '@/contexts/TelegramContext'
import { toggleWishlist } from '@/services/api'
import styles from './ProductCard.module.scss'

type ProductCardProps = {
  book: Pick<Book, 'id' | 'title' | 'author' | 'price' | 'coverImageUrl' | 'rating' | 'sale'>
}

const DEFAULT_COVER = 'https://placehold.co/400x400/e5e7eb/6b7280?text=Cover'

function formatKRW(price: number): string {
  return `${price.toLocaleString('ko-KR')}₩`
}

export function ProductCard({ book }: ProductCardProps) {
  const { addItem } = useCart()
  const { initData } = useTelegram()
  const [wishlisted, setWishlisted] = useState(false)
  const cover = book.coverImageUrl ?? DEFAULT_COVER

  const originalPrice = book.sale ? Math.round(book.price / 0.8) : null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      book_id: book.id,
      title: book.title,
      price_krw: book.price,
      cover_image_url: book.coverImageUrl,
    })
  }

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!initData) {
      setWishlisted((prev) => !prev)
      return
    }
    setWishlisted((prev) => !prev)
    try {
      await toggleWishlist(book.id, initData)
    } catch {
      setWishlisted((prev) => !prev) // revert on error
    }
  }

  return (
    <div className={styles.card}>
      <Link
        to={`/books/${book.id}`}
        className={styles.cardLink}
        aria-label={`${book.title} by ${book.author}`}
      >
        <div className={styles.coverWrap}>
          <img
            src={cover}
            alt={`Cover of ${book.title} by ${book.author}`}
            className={styles.cover}
            width={400}
            height={400}
            loading="lazy"
          />
          {book.sale && <span className={styles.saleBadge}>Sale</span>}
          <button
            type="button"
            className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlisted : ''}`}
            aria-label={wishlisted ? 'Sevimlilardan olib tashlash' : 'Sevimlilarga qo\'shish'}
            onClick={handleWishlist}
          >
            <span className={styles.heart} aria-hidden>
              {wishlisted ? '♥' : '♡'}
            </span>
          </button>
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{book.title}</h3>
          <p className={styles.author}>{book.author}</p>
          {book.rating != null && (
            <div className={styles.ratingRow}>
              <span className={styles.star} aria-hidden>★</span>
              <span>{book.rating.toFixed(1)}</span>
            </div>
          )}
          <div className={styles.priceRow}>
            <span className={styles.price}>{formatKRW(book.price)}</span>
            {originalPrice && (
              <span className={styles.originalPrice}>{formatKRW(originalPrice)}</span>
            )}
          </div>
        </div>
      </Link>
      <button
        type="button"
        className={styles.cartBtn}
        onClick={handleAddToCart}
        aria-label={`${book.title} savatga qo'shish`}
      >
        + Savatga
      </button>
    </div>
  )
}
