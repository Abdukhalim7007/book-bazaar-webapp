import styles from './CartPage.module.scss'

export function CartPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Cart</h1>
      <p className={styles.placeholder}>Your cart is empty.</p>
    </div>
  )
}
