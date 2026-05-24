import { useRef } from 'react'
import { BookCard } from '@/components/BookCard'
import { featuredBooks } from '@/mock/home'
import styles from './FeaturedBooksCarousel.module.scss'

const SCROLL_AMOUNT = 280

export default function FeaturedBooksCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <section className={styles.section} aria-label="Featured books">
      <div className={styles.header}>
        <h2 className={styles.title}>Featured books</h2>
        <div className={styles.controls} aria-hidden>
          <button
            type="button"
            className={styles.btn}
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className={styles.track}
        role="list"
      >
        {featuredBooks.map((book) => (
          <div key={book.id} className={styles.slide} role="listitem">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  )
}
