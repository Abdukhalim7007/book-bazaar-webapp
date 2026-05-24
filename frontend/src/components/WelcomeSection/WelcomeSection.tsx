import styles from './WelcomeSection.module.scss'

export function WelcomeSection() {
  return (
    <section className={styles.section} aria-label="Xush kelibsiz">
      <h1 className={styles.title}>Salom, Mehmon</h1>
      <p className={styles.subtitle}>
        Keyingi sevimli kitobingizni barmoq uchingizda toping.
      </p>
    </section>
  )
}
