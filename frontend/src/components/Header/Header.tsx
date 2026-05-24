import { Link } from 'react-router-dom'
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
          <Link to="/profile" className={styles.iconBtn} aria-label="Bildirishnomalar">
            <span className={styles.bellIcon} aria-hidden>🔔</span>
            <span className={styles.notifDot} aria-hidden />
          </Link>
          <Link to="/cart" className={styles.iconBtn} aria-label="Savat">
            <span className={styles.cartIcon} aria-hidden>🛒</span>
            <span className={styles.cartBadge} aria-hidden>2</span>
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
        />
      </div>
    </header>
  )
}
