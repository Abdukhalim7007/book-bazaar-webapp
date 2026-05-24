import { Link, useLocation } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import styles from './BottomNav.module.scss'

const ITEMS = [
  { to: '/', label: 'Bosh sahifa', icon: '⌂' },
  { to: '/search', label: 'Qidirish', icon: '⌕' },
  { to: '/cart', label: 'Savat', icon: '🛒' },
  { to: '/wishlist', label: 'Sevimli', icon: '♥' },
  { to: '/profile', label: 'Profil', icon: '👤' },
]

export function BottomNav() {
  const location = useLocation()
  const { itemCount } = useCart()

  return (
    <nav className={styles.nav} aria-label="Bottom navigation">
      {ITEMS.map((item) => {
        const isActive = location.pathname === item.to
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`${styles.item} ${isActive ? styles.active : ''}`}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.label}
          >
            <span className={styles.iconWrap}>
              <span className={styles.icon} aria-hidden>{item.icon}</span>
              {item.to === '/cart' && itemCount > 0 && (
                <span className={styles.badge} aria-label={`${itemCount} ta mahsulot`}>
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
