import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTelegram } from '@/contexts/TelegramContext'
import { fetchApi } from '@/services/api'
import type { UserProfile, Order } from '@/types'
import styles from './ProfilePage.module.scss'

function formatKRW(price: number): string {
  return `${price.toLocaleString('ko-KR')}₩`
}

function getTier(points: number): { name: string; color: string; next: number | null } {
  if (points >= 1000) return { name: 'Gold', color: styles.tierGold, next: null }
  if (points >= 300) return { name: 'Silver', color: styles.tierSilver, next: 1000 }
  return { name: 'Bronze', color: styles.tierBronze, next: 300 }
}

function getTierProgress(points: number): number {
  if (points >= 1000) return 100
  if (points >= 300) return Math.round(((points - 300) / 700) * 100)
  return Math.round((points / 300) * 100)
}

function formatOrderStatus(status: Order['status']): string {
  const map: Record<Order['status'], string> = {
    pending: 'Kutilmoqda',
    confirmed: 'Tasdiqlangan',
    shipped: 'Yuborildi',
    delivered: 'Yetkazildi',
    cancelled: 'Bekor qilindi',
  }
  return map[status] ?? status
}

function statusClass(status: Order['status']): string {
  const map: Record<Order['status'], string> = {
    pending: styles.statusPending,
    confirmed: styles.statusConfirmed,
    shipped: styles.statusShipped,
    delivered: styles.statusDelivered,
    cancelled: styles.statusCancelled,
  }
  return map[status] ?? ''
}

const MENU_ITEMS = [
  { to: '/orders', icon: '📦', label: 'Mening buyurtmalarim' },
  { to: '/wishlist', icon: '♥', label: 'Sevimlilar' },
  { to: '/search', icon: '⚙️', label: 'Sozlamalar' },
  { to: '/search', icon: '💬', label: "Qo'llab-quvvatlash" },
]

export function ProfilePage() {
  const { user, initData } = useTelegram()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!initData) return
    fetchApi<UserProfile>('/api/users/me', {}, initData)
      .then(setProfile)
      .catch(() => {/* not available yet */})
    fetchApi<Order[]>('/api/orders', {}, initData)
      .then(setOrders)
      .catch(() => {/* not available yet */})
  }, [initData])

  const points = profile?.points ?? 0
  const tier = getTier(points)
  const progress = getTierProgress(points)
  const avatarLetter = user?.first_name?.[0]?.toUpperCase() ?? '?'

  return (
    <div className={styles.page}>

      {/* ── User header ── */}
      <div className={styles.userHeader}>
        <div className={styles.avatar} aria-hidden>
          {avatarLetter}
        </div>
        <div className={styles.userInfo}>
          <h1 className={styles.userName}>
            {user?.first_name ?? ''} {user?.last_name ?? ''}
          </h1>
          {user?.username && (
            <p className={styles.username}>@{user.username}</p>
          )}
        </div>
      </div>

      {/* ── Loyalty card ── */}
      <div className={`${styles.loyaltyCard} ${tier.color}`}>
        <div className={styles.loyaltyTop}>
          <div>
            <p className={styles.loyaltyLabel}>Ballar</p>
            <p className={styles.loyaltyPoints}>{points.toLocaleString('ko-KR')}</p>
          </div>
          <span className={styles.tierBadge}>{tier.name}</span>
        </div>
        <div className={styles.progressBar} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        {tier.next !== null && (
          <p className={styles.tierNote}>
            {tier.name === 'Bronze'
              ? `Silver uchun yana ${tier.next - points} ball`
              : `Gold uchun yana ${tier.next - points} ball`}
          </p>
        )}
        {tier.next === null && (
          <p className={styles.tierNote}>Siz eng yuqori darajadaSIZ 🏆</p>
        )}
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <p className={styles.statValue}>{profile?.total_orders ?? orders.length}</p>
          <p className={styles.statLabel}>Buyurtmalar</p>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <p className={styles.statValue}>
            {profile ? formatKRW(profile.total_spent) : '—'}
          </p>
          <p className={styles.statLabel}>Jami xarid</p>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <p className={styles.statValue}>{points}</p>
          <p className={styles.statLabel}>Ball</p>
        </div>
      </div>

      {/* ── Recent orders ── */}
      {orders.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>So'nggi buyurtmalar</h2>
          <div className={styles.orderList}>
            {orders.slice(0, 3).map((order) => (
              <Link key={order.id} to={`/orders/${order.id}`} className={styles.orderItem}>
                <div>
                  <p className={styles.orderId}>#{order.id}</p>
                  <p className={styles.orderDate}>
                    {new Date(order.created_at).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
                <div className={styles.orderRight}>
                  <p className={styles.orderTotal}>{formatKRW(order.total_price)}</p>
                  <span className={`${styles.orderStatus} ${statusClass(order.status)}`}>
                    {formatOrderStatus(order.status)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Menu ── */}
      <nav className={styles.menu} aria-label="Profil menu">
        {MENU_ITEMS.map((item) => (
          <Link key={item.label} to={item.to} className={styles.menuItem}>
            <span className={styles.menuIcon} aria-hidden>{item.icon}</span>
            <span className={styles.menuLabel}>{item.label}</span>
            <span className={styles.menuArrow} aria-hidden>›</span>
          </Link>
        ))}
      </nav>

    </div>
  )
}
