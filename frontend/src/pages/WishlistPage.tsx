import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTelegram } from '@/contexts/TelegramContext'
import { getWishlist, toggleWishlist } from '@/services/api'
import type { WishlistItem } from '@/types'
import styles from './WishlistPage.module.scss'

const DEFAULT_COVER = 'https://placehold.co/200x280/e5e7eb/6b7280?text=Book'

function formatKRW(price: number): string {
  return `${price.toLocaleString('ko-KR')}₩`
}

function WishlistCard({ item, onRemove }: { item: WishlistItem; onRemove: () => void }) {
  const [removing, setRemoving] = useState(false)
  const { initData } = useTelegram()

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!initData || removing) return
    setRemoving(true)
    try {
      await toggleWishlist(item.book_id, initData)
      onRemove()
    } catch {
      setRemoving(false)
    }
  }

  return (
    <div className={styles.card}>
      <Link to={`/books/${item.book_id}`} className={styles.cardLink}>
        <div className={styles.coverWrap}>
          <img
            src={item.cover_image_url ?? DEFAULT_COVER}
            alt={item.title}
            className={styles.cover}
            width={200}
            height={280}
            loading="lazy"
          />
          <button
            type="button"
            className={`${styles.heartBtn} ${removing ? styles.removing : ''}`}
            onClick={handleRemove}
            aria-label="Sevimlilardan olib tashlash"
            disabled={removing}
          >
            ♥
          </button>
        </div>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={styles.cardAuthor}>{item.author}</p>
        <p className={styles.cardPrice}>{formatKRW(item.price_krw)}</p>
      </Link>
    </div>
  )
}

export function WishlistPage() {
  const { initData } = useTelegram()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initData) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    getWishlist(initData)
      .then((data) => {
        if (!cancelled) setItems(data)
      })
      .catch(() => {
        if (!cancelled) setError(null) // API not ready yet — show empty
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [initData])

  const handleRemove = (bookId: string | number) => {
    setItems((prev) => prev.filter((i) => i.book_id !== bookId))
  }

  if (loading) {
    return (
      <div className={styles.state}>
        <p>Yuklanmoqda...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.state}>
        <p role="alert">{error}</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon} aria-hidden>♡</div>
        <h2 className={styles.emptyTitle}>Sevimlilar bo'sh</h2>
        <p className={styles.emptySubtitle}>Yoqtirgan kitoblaringizni bu yerda saqlang</p>
        <Link to="/books" className={styles.browseBtn}>
          Katalogga o'tish
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Sevimlilar ({items.length})</h1>
      <div className={styles.grid} role="list">
        {items.map((item) => (
          <div key={item.book_id} role="listitem">
            <WishlistCard item={item} onRemove={() => handleRemove(item.book_id)} />
          </div>
        ))}
      </div>
    </div>
  )
}
