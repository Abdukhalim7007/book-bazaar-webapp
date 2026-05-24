import { Link } from 'react-router-dom'
import styles from './PromoBanner.module.scss'

type PromoBannerProps = {
  variant: 'light' | 'dark' | 'green'
  title: string
  subtitle: string
  eyebrow?: string
  ctaText?: string
  ctaTo?: string
  icon?: React.ReactNode
}

export function PromoBanner({
  variant,
  title,
  subtitle,
  eyebrow,
  ctaText = 'Shop Now',
  ctaTo = '/books',
  icon,
}: PromoBannerProps) {
  return (
    <section
      className={`${styles.section} ${styles[variant]}`}
      aria-label="Promotion"
    >
      <div className={styles.content}>
        <div className={styles.textBlock}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
          <Link to={ctaTo} className={styles.cta}>
            {ctaText}
          </Link>
        </div>
        {icon && <div className={styles.iconWrap}>{icon}</div>}
      </div>
    </section>
  )
}
