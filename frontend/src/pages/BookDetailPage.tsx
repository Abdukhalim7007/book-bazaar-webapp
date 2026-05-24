import { useParams } from 'react-router-dom'
import styles from './BookDetailPage.module.scss'

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Book detail</h1>
      <p className={styles.placeholder}>Book ID: {id}. Data from API coming soon.</p>
    </div>
  )
}
