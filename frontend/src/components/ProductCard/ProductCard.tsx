import { Link } from 'react-router-dom'
import type { Book } from '@/types'
import styles from './ProductCard.module.scss'

type ProductCardProps = {
  book: Pick<Book, 'id' | 'title' | 'author' | 'price' | 'coverImageUrl' | 'rating' | 'sale'>
}

const DEFAULT_COVER = 'https://placehold.co/400x400/e5e7eb/6b7280?text=Cover'

export function ProductCard({ book }: ProductCardProps) {
  const cover = book.coverImageUrl ?? DEFAULT_COVER
  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(book.price)
  const originalPriceFormatted =
    book.sale &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(book.price / 0.8)

  return (
    <Link
      to={`/books/${book.id}`}
      className={styles.card}
      aria-label={`View ${book.title} by ${book.author}`}
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
          className={styles.wishlistBtn}
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
        >
          <span className={styles.heart} aria-hidden>♥</span>
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
          <span className={styles.price}>{priceFormatted}</span>
          {originalPriceFormatted && (
            <span className={styles.originalPrice}>{originalPriceFormatted}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
