import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  /** Marks the card as the animated body of an overlay section. */
  panel?: boolean
}

/**
 * Glassmorphism card: `.glass` is bg-white/10 + border-white/20 + backdrop blur on
 * the dark theme, with ivory/ink variants through CSS variables. Cards re-enable
 * pointer events because the overlay root is `pointer-events: none`.
 */
export function GlassCard({ children, className = '', panel = false }: GlassCardProps) {
  return (
    <div data-card={panel ? '' : undefined} className={`glass pointer-events-auto rounded-3xl p-6 md:p-10 ${className}`}>
      {children}
    </div>
  )
}
