import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '@/components/ProductCard'
import { bestSellers } from '@/mock/home'
import styles from './BestSellersCarousel.module.scss'

const SCROLL_AMOUNT = 260

export function BestSellersCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT, behavior: 'smooth' })
  }

  return (
    <section className={styles.section} aria-label="Best sellers">
      <div className={styles.header}>
        <h2 className={styles.title}>Eng ko&apos;p sotilgan 📚</h2>
        <Link to="/books" className={styles.viewAll}>
          Barchasi
        </Link>
        <div className={styles.controls} aria-hidden>
          <button type="button" className={styles.btn} onClick={() => scroll('left')} aria-label="Scroll left">
            ‹
          </button>
          <button type="button" className={styles.btn} onClick={() => scroll('right')} aria-label="Scroll right">
            ›
          </button>
        </div>
      </div>
      <div ref={scrollRef} className={styles.track} role="list">
        {bestSellers.map((book) => (
          <div key={book.id} className={styles.slide} role="listitem">
            <ProductCard book={book} />
          </div>
        ))}
      </div>
    </section>
  )
}
