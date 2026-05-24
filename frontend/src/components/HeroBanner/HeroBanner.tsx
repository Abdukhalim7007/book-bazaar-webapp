import { useState, useEffect } from 'react'
import styles from './HeroBanner.module.scss'

// Cozy bookstore-style image; in production replace with your asset or AI-generated image
const SLIDES = [
  'https://placehold.co/800x400/C4A77D/5c4a2a?text=Cozy+Bookstore',
  'https://placehold.co/800x400/8B7355/fff?text=Kitoblar',
  'https://placehold.co/800x400/2F6B4F/fff?text=Yangi+kelganlar',
]
const AUTO_SLIDE_MS = 5000

export function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % SLIDES.length)
    }, AUTO_SLIDE_MS)
    return () => clearInterval(t)
  }, [])

  return (
    <section className={styles.hero} aria-label="Asosiy banner">
      <div className={styles.slides}>
        {SLIDES.map((src, i) => (
          <div
            key={src}
            className={`${styles.slide} ${i === activeIndex ? styles.active : ''}`}
            aria-hidden={i !== activeIndex}
          >
            <img src={src} alt="" className={styles.image} width={800} height={400} loading={i === 0 ? 'eager' : 'lazy'} />
            <div className={styles.overlay} aria-hidden />
          </div>
        ))}
      </div>
      <div className={styles.caption}>
        <h2 className={styles.captionTitle}>Yangi kelganlar</h2>
      </div>
      <div className={styles.dots} role="tablist" aria-label="Banner sahifalari">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Sahifa ${i + 1}`}
            className={`${styles.dot} ${i === activeIndex ? styles.active : ''}`}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>
    </section>
  )
}
