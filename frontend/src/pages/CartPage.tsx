import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import type { CartItem } from '@/types'
import styles from './CartPage.module.scss'

const DEFAULT_COVER = 'https://placehold.co/80x112/e5e7eb/6b7280?text=Book'

function formatKRW(price: number): string {
  return `${price.toLocaleString('ko-KR')}₩`
}

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className={styles.item}>
      <img
        src={item.cover_image_url ?? DEFAULT_COVER}
        alt={item.title}
        className={styles.itemCover}
        width={80}
        height={112}
        loading="lazy"
      />
      <div className={styles.itemInfo}>
        <p className={styles.itemTitle}>{item.title}</p>
        <p className={styles.itemPrice}>{formatKRW(item.price_krw)}</p>
        <div className={styles.qtyRow}>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={() => updateQuantity(item.book_id, item.quantity - 1)}
            aria-label="Kamayitish"
          >
            −
          </button>
          <span className={styles.qty}>{item.quantity}</span>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={() => updateQuantity(item.book_id, item.quantity + 1)}
            aria-label="Ko'paytirish"
          >
            +
          </button>
        </div>
      </div>
      <div className={styles.itemRight}>
        <p className={styles.itemTotal}>{formatKRW(item.price_krw * item.quantity)}</p>
        <button
          type="button"
          className={styles.removeBtn}
          onClick={() => removeItem(item.book_id)}
          aria-label={`${item.title} ni savatdan olib tashlash`}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export function CartPage() {
  const { items, total, itemCount } = useCart()
  const navigate = useNavigate()
  const [promoCode, setPromoCode] = useState('')

  const shipping = items.length === 0 ? 0 : itemCount === 1 ? 4000 : 0
  const grandTotal = total + shipping

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon} aria-hidden>📚</div>
        <h2 className={styles.emptyTitle}>Savat bo'sh</h2>
        <p className={styles.emptySubtitle}>Hali hech narsa qo'shmadingiz</p>
        <Link to="/books" className={styles.browseBtn}>
          Kitoblarni ko'rish
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Savat ({itemCount})</h1>

      <div className={styles.itemList}>
        {items.map((item) => (
          <CartItemRow key={item.book_id} item={item} />
        ))}
      </div>

      <div className={styles.promoWrap}>
        <input
          type="text"
          className={styles.promoInput}
          placeholder="Promo kod kiriting..."
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          aria-label="Promo kod"
        />
        <button type="button" className={styles.promoBtn} disabled={!promoCode.trim()}>
          Qo'llash
        </button>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span>Kitoblar ({itemCount} ta)</span>
          <span>{formatKRW(total)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Yetkazib berish</span>
          <span className={shipping === 0 ? styles.free : undefined}>
            {shipping === 0 ? 'Bepul' : formatKRW(shipping)}
          </span>
        </div>
        {shipping === 0 && items.length > 0 && (
          <p className={styles.freeShippingNote}>
            2 va undan ko'p kitob — yetkazib berish bepul!
          </p>
        )}
        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
          <span>Jami</span>
          <span>{formatKRW(grandTotal)}</span>
        </div>
      </div>

      <button
        type="button"
        className={styles.checkoutBtn}
        onClick={() => navigate('/checkout')}
      >
        Buyurtma berish →
      </button>
    </div>
  )
}
