import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '@/components/ProductCard'
import { featuredBooks } from '@/mock/home'
import styles from './FeaturedProductsCarousel.module.scss'

const SCROLL_AMOUNT = 260
const DOT_COUNT = 3

export function FeaturedProductsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const scrollLeft = el.scrollLeft
      const maxScroll = el.scrollWidth - el.clientWidth
      if (maxScroll <= 0) {
        setActiveIndex(0)
        return
      }
      const index = Math.round((scrollLeft / maxScroll) * (DOT_COUNT - 1))
      setActiveIndex(Math.min(index, DOT_COUNT - 1))
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT, behavior: 'smooth' })
  }

  return (
    <section className={styles.section} aria-label="Featured products">
      <div className={styles.header}>
        <h2 className={styles.title}>Tanlangan mahsulotlar</h2>
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
        {featuredBooks.map((book) => (
          <div key={book.id} className={styles.slide} role="listitem">
            <ProductCard book={book} />
          </div>
        ))}
      </div>
      <div className={styles.dots} role="tablist" aria-label="Carousel pages">
        {Array.from({ length: DOT_COUNT }, (_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Page ${i + 1}`}
            className={`${styles.dot} ${i === activeIndex ? styles.active : ''}`}
            onClick={() => {
              const el = scrollRef.current
              if (el) {
                const maxScroll = el.scrollWidth - el.clientWidth
                el.scrollTo({ left: (maxScroll * i) / (DOT_COUNT - 1), behavior: 'smooth' })
              }
            }}
          />
        ))}
      </div>
    </section>
  )
}
