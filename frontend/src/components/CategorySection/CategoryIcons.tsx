// Pastel background class per category (icon color slightly darker than bg)
const PASTEL_CLASSES: Record<string, string> = {
  fantastika: 'pastelPurple',
  romantika: 'pastelPink',
  detektiv: 'pastelSage',
  ilmiy: 'pastelBlue',
  rivojlantirish: 'pastelPeach',
  tarix: 'pastelWarm',
}

export function getPastelClass(slug: string): string {
  return PASTEL_CLASSES[slug] ?? 'pastelSage'
}

// Icons: magic/star, heart, magnifier, graduation cap, lightbulb, clock
export function CategoryIcon({ slug }: { slug: string }) {
  const size = 22
  const stroke = 1.8
  const common = { width: size, height: size, strokeWidth: stroke, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' as const }

  switch (slug) {
    case 'fantastika':
      return (
        <svg {...common} viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
        </svg>
      )
    case 'romantika':
      return (
        <svg {...common} viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )
    case 'detektiv':
      return (
        <svg {...common} viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      )
    case 'ilmiy':
      return (
        <svg {...common} viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      )
    case 'rivojlantirish':
      return (
        <svg {...common} viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
        </svg>
      )
    case 'tarix':
      return (
        <svg {...common} viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      )
    default:
      return (
        <svg {...common} viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
  }
}
