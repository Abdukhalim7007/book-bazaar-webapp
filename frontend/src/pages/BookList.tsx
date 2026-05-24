import { useEffect, useState } from 'react'
import { BookCard } from '@/components/BookCard'
import { getBooks } from '@/services/api'
import type { Book } from '@/types'
import styles from './BookList.module.scss'

const PAGE_SIZE = 12

export default function BookList() {
  const [items, setItems] = useState<Book[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    const offset = (page - 1) * PAGE_SIZE

    getBooks(PAGE_SIZE, offset)
      .then((res) => {
        if (!cancelled) {
          setItems(res.items)
          setTotal(res.total)
        }
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load books.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [page])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const hasPrev = page > 1
  const hasNext = page < totalPages

  if (loading && items.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Books</h1>
        <p className={styles.state}>Loading...</p>
      </div>
    )
  }

  if (error && items.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Books</h1>
        <p className={styles.state} role="alert">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Books</h1>
      <div className={styles.grid} role="list">
        {items.map((book) => (
          <div key={book.id} className={styles.cardWrap} role="listitem">
            <BookCard
              book={{
                id: book.id,
                title: book.title,
                author: book.author,
                price: book.price,
                coverImageUrl: book.coverImageUrl,
              }}
            />
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Books pagination">
          <button
            type="button"
            className={styles.btn}
            disabled={!hasPrev}
            onClick={() => setPage((p) => p - 1)}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className={styles.pageInfo} aria-live="polite">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className={styles.btn}
            disabled={!hasNext}
            onClick={() => setPage((p) => p + 1)}
            aria-label="Next page"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  )
}
