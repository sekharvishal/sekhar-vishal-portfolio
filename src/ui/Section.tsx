import type { ReactNode } from 'react'
import { GlassCard } from './GlassCard'

interface SectionProps {
  id: string
  eyebrow: string
  title: string
  children: ReactNode
  wide?: boolean
}

/** Tall overlay section: provides scroll length, holds one animated glass card. */
export function Section({ id, eyebrow, title, children, wide = false }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      data-panel=""
      className="relative flex min-h-[75vh] items-center justify-center px-5 py-16 md:px-10"
    >
      <GlassCard panel className={`w-full ${wide ? 'max-w-6xl' : 'max-w-4xl'}`}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${id}-title`} className="mt-2 text-4xl md:text-5xl">
          {title}
        </h2>
        <div className="mt-6">{children}</div>
      </GlassCard>
    </section>
  )
}
