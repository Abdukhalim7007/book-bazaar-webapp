import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBook } from '@/services/api'
import type { Book } from '@/types'
import styles from './BookDetail.module.scss'

const DEFAULT_COVER = 'https://placehold.co/400x560/e5e7eb/6b7280?text=No+Cover'

export default function BookDetail() {
  const { id } = useParams<{ id: string }>()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('Book not found.')
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    getBook(id)
      .then((data) => {
        if (!cancelled) {
          setBook(data)
        }
      })
      .catch(() => {
        if (!cancelled) setError('Book not found.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.state}>Loading book...</p>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className={styles.page}>
        <p className={styles.state} role="alert">
          {error ?? 'Book not found.'}
        </p>
      </div>
    )
  }

  const cover = book.coverImageUrl ?? DEFAULT_COVER
  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(book.price)

  return (
    <article className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.coverWrap}>
          <img
            src={cover}
            alt={`Cover of ${book.title} by ${book.author}`}
            className={styles.cover}
            width={400}
            height={560}
          />
        </div>
        <div className={styles.info}>
          <h1 className={styles.title}>{book.title}</h1>
          <p className={styles.author}>{book.author}</p>
          <p className={styles.price}>{priceFormatted}</p>
          {book.description && (
            <div className={styles.description}>
              <p>{book.description}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
