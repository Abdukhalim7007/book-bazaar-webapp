import styles from './WishlistPage.module.scss'

export function WishlistPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Wishlist</h1>
      <p className={styles.placeholder}>Your wishlist is empty.</p>
    </div>
  )
}
