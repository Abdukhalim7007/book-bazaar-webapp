import { Link } from 'react-router-dom'
import type { Book } from '@/types'
import styles from './BookCard.module.scss'

type BookCardProps = {
  book: Pick<Book, 'id' | 'title' | 'author' | 'price' | 'coverImageUrl'>
}

const DEFAULT_COVER = 'https://placehold.co/200x280/e5e7eb/6b7280?text=No+Cover'

export function BookCard({ book }: BookCardProps) {
  const cover = book.coverImageUrl ?? DEFAULT_COVER
  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(book.price)

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
          width={200}
          height={280}
          loading="lazy"
        />
      </div>
      <h3 className={styles.title}>{book.title}</h3>
      <p className={styles.author}>{book.author}</p>
      <p className={styles.price}>{priceFormatted}</p>
    </Link>
  )
}
