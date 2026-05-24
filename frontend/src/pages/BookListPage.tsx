import styles from './BookListPage.module.scss'

export function BookListPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Books</h1>
      <p className={styles.placeholder}>Book list will load from API.</p>
    </div>
  )
}
