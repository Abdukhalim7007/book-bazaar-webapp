import styles from './SearchPage.module.scss'

export function SearchPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Search</h1>
      <p className={styles.placeholder}>Search for books — coming soon.</p>
    </div>
  )
}
