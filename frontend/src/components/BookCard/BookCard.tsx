import { Link } from 'react-router-dom'
import type { Book } from '@/types'
import { useCart } from '@/contexts/CartContext'
import styles from './BookCard.module.scss'

type BookCardProps = {
  book: Pick<Book, 'id' | 'title' | 'author' | 'price' | 'coverImageUrl'>
}

const DEFAULT_COVER = 'https://placehold.co/200x280/e5e7eb/6b7280?text=No+Cover'

function formatKRW(price: number): string {
  return `${price.toLocaleString('ko-KR')}₩`
}

export function BookCard({ book }: BookCardProps) {
  const { addItem } = useCart()
  const cover = book.coverImageUrl ?? DEFAULT_COVER

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
            width={200}
            height={280}
            loading="lazy"
          />
        </div>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>{book.author}</p>
        <p className={styles.price}>{formatKRW(book.price)}</p>
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
