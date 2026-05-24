import { Link } from 'react-router-dom'
import { categories } from '@/mock/home'
import type { Category } from '@/types'
import { CategoryIcon, getPastelClass } from './CategoryIcons'
import styles from './CategorySection.module.scss'

function CategoryCard({ category }: { category: Category }) {
  const pastelClass = getPastelClass(category.slug)
  return (
    <Link
      to={`/books?category=${category.slug}`}
      className={styles.card}
      aria-label={`${category.name} bo'limi`}
    >
      <div className={`${styles.iconWrap} ${styles[pastelClass]}`}>
        <CategoryIcon slug={category.slug} />
      </div>
      <span className={styles.name}>{category.name}</span>
    </Link>
  )
}

export function CategorySection() {
  return (
    <section className={styles.section} aria-label="Janrlar">
      <div className={styles.header}>
        <h2 className={styles.title}>Janrlar</h2>
        <Link to="/books" className={styles.viewAll}>
          Barchasi
        </Link>
      </div>
      <div className={styles.grid} role="list">
        {categories.map((cat) => (
          <div key={cat.id} role="listitem">
            <CategoryCard category={cat} />
          </div>
        ))}
      </div>
    </section>
  )
}
