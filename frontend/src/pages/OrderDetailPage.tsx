import { useParams } from 'react-router-dom'
import styles from './OrderDetailPage.module.scss'

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Buyurtma #{id}</h1>
      <p className={styles.placeholder}>Order detail — Phase 5 da amalga oshiriladi.</p>
    </div>
  )
}
