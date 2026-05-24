import { useState } from 'react'
import { Link } from 'react-router-dom'
import { newArrivals } from '@/mock/home'
import type { Book } from '@/types'
import styles from './NewArrivalsSection.module.scss'

const FILTERS = [
  { slug: 'all', name: 'Barchasi' },
  { slug: 'fiction', name: 'Badiiy' },
  { slug: 'non-fiction', name: 'Ilmiy' },
  { slug: 'kids', name: 'Bolalar' },
]

function NewArrivalItem({ book }: { book: Book }) {
  const cover = book.coverImageUrl ?? 'https://placehold.co/120x160/e5e7eb/6b7280?text=Cover'
  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(book.price)

  return (
    <article className={styles.item}>
      <Link to={`/books/${book.id}`} className={styles.itemLink}>
        <div className={styles.coverWrap}>
          <img
            src={cover}
            alt={`Cover of ${book.title}`}
            className={styles.cover}
            width={120}
            height={160}
            loading="lazy"
          />
        </div>
        <div className={styles.details}>
          <h3 className={styles.itemTitle}>{book.title}</h3>
          <p className={styles.price}>{priceFormatted}</p>
          {book.rating != null && (
            <p className={styles.rating}>
              <span className={styles.star} aria-hidden>★</span> {book.rating.toFixed(1)}
            </p>
          )}
        </div>
      </Link>
      <div className={styles.actions}>
        <button type="button" className={styles.iconBtn} aria-label="Add to wishlist">
          <span aria-hidden>♥</span>
        </button>
        <button type="button" className={styles.iconBtn} aria-label="Add to cart">
          <span className={styles.plus} aria-hidden>+</span>
        </button>
      </div>
    </article>
  )
}

export function NewArrivalsSection() {
  const [activeFilter, setActiveFilter] = useState('all')

  return (
    <section className={styles.section} aria-label="New arrivals">
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Yangi kelganlar</h2>
        <Link to="/books" className={styles.viewAll}>
          Barchasi
        </Link>
      </div>
      <div className={styles.filters} role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f.slug}
            type="button"
            role="tab"
            aria-selected={activeFilter === f.slug}
            className={`${styles.filterBtn} ${activeFilter === f.slug ? styles.active : ''}`}
            onClick={() => setActiveFilter(f.slug)}
          >
            {f.name}
          </button>
        ))}
      </div>
      <ul className={styles.list}>
        {newArrivals.map((book) => (
          <li key={book.id}>
            <NewArrivalItem book={book} />
          </li>
        ))}
      </ul>
    </section>
  )
}
