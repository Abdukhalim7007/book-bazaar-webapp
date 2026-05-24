import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import styles from './Header.module.scss'

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
    </svg>
  )
}

export function Header() {
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className={styles.header} role="banner">
      <div className={styles.topRow}>
        <Link to="/" className={styles.leftBlock} aria-label="BookBazaar bosh sahifa">
          <span className={styles.logoCircle} aria-hidden>
            <BookIcon />
          </span>
          <span className={styles.deliveryText}>Yetkazib berish — Toshkent, UZ</span>
        </Link>
        <div className={styles.icons}>
          <Link to="/orders" className={styles.iconBtn} aria-label="Buyurtmalar">
            <span className={styles.bellIcon} aria-hidden>🔔</span>
          </Link>
          <Link to="/cart" className={styles.iconBtn} aria-label="Savat">
            <span className={styles.cartIcon} aria-hidden>🛒</span>
            {itemCount > 0 && (
              <span className={styles.cartBadge} aria-label={`${itemCount} ta mahsulot savatda`}>
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon} aria-hidden>⌕</span>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Kitob qidirish..."
          aria-label="Kitob qidirish"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
    </header>
  )
}
