import { WelcomeSection } from '@/components/WelcomeSection'
import { HeroBanner } from '@/components/HeroBanner'
import { CategorySection } from '@/components/CategorySection'
import { PromoBanner } from '@/components/PromoBanner'
import { BestSellersCarousel } from '@/components/BestSellersCarousel'
import { FeaturedProductsCarousel } from '@/components/FeaturedProductsCarousel'
import { NewArrivalsSection } from '@/components/NewArrivalsSection'
import styles from './HomePage.module.scss'

export function HomePage() {
  return (
    <div className={styles.page}>
      <WelcomeSection />
      <HeroBanner />
      <CategorySection />
      <PromoBanner
        variant="green"
        eyebrow="Cheklangan vaqt"
        title="Maxsus Taklif"
        subtitle="Bolalar kitoblariga 30% chegirma"
        ctaText="Xarid qilish"
        ctaTo="/books"
        icon={<span aria-hidden>📚</span>}
      />
      <BestSellersCarousel />
      <FeaturedProductsCarousel />
      <PromoBanner
        variant="light"
        title="Bahor chegirmalari 30% gacha"
        subtitle="Har bir buyurtmada chegirma! Faqat bugun!"
        ctaText="Xarid qilish"
        ctaTo="/books"
      />
      <NewArrivalsSection />
    </div>
  )
}
