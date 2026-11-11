import { useEffect, useState } from 'react'
import { useAnchorNav } from '../hooks/useAnchorNav'

export interface JourneyStop {
  id: string
  number: string
  label: string
  landmark: string
}

interface JourneyRailProps {
  title: string
  stops: readonly JourneyStop[]
}

export function JourneyRail({ title, stops }: JourneyRailProps) {
  const go = useAnchorNav()
  const [active, setActive] = useState(stops[0]?.id)

  useEffect(() => {
    const sections = stops
      .map((stop) => document.getElementById(stop.id))
      .filter((section): section is HTMLElement => section !== null)
    if (!sections.length || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (current) setActive(current.target.id)
      },
      { rootMargin: '-38% 0px -38% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [stops])

  const stages = stops.map((stop) => {
    const selected = active === stop.id
    return (
      <li key={stop.id}>
        <button
          type="button"
          aria-label={`${stop.number} ${stop.label} — ${stop.landmark}`}
          aria-current={selected ? 'location' : undefined}
          onClick={() => go(stop.id)}
          className={`group flex w-full items-start gap-3 rounded-xl px-2 py-2 text-left transition ${
            selected ? 'bg-gold/10 text-fg' : 'text-muted hover:bg-white/5 hover:text-fg'
          }`}
        >
          <span
            aria-hidden="true"
            className={`mt-0.5 font-mono text-[0.62rem] tracking-wider ${
              selected ? 'text-gold' : 'text-muted/70'
            }`}
          >
            {stop.number}
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-medium">{stop.label}</span>
            <span
              aria-hidden="true"
              className={`mt-0.5 block truncate font-mono text-[0.55rem] ${selected ? 'text-gold/80' : 'text-muted/65'}`}
            >
              {stop.landmark}
            </span>
          </span>
        </button>
      </li>
    )
  })

  return (
    <>
      <nav
        aria-label={title}
        className="pointer-events-auto fixed left-5 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
      >
        <div className="glass w-52 rounded-2xl p-3">
          <p className="px-2 pb-2 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-muted">{title}</p>
          <ol className="space-y-1">{stages}</ol>
        </div>
      </nav>

      <nav
        aria-label={`${title} quick navigation`}
        className="pointer-events-auto fixed inset-x-3 bottom-3 z-30 xl:hidden"
      >
        <ol className="glass grid grid-cols-4 gap-1 rounded-2xl p-1.5">
          {stops.map((stop) => {
            const selected = active === stop.id
            return (
              <li key={stop.id}>
                <button
                  type="button"
                  aria-label={`${stop.number} ${stop.label} — ${stop.landmark}`}
                  aria-current={selected ? 'location' : undefined}
                  onClick={() => go(stop.id)}
                  className={`flex min-h-11 w-full flex-col items-center justify-center rounded-xl px-1 py-1.5 transition ${
                    selected ? 'bg-gold/15 text-fg' : 'text-muted hover:text-fg'
                  }`}
                >
                  <span className={`font-mono text-[0.54rem] ${selected ? 'text-gold' : 'text-muted/70'}`}>
                    {stop.number}
                  </span>
                  <span className="max-w-full truncate text-[0.62rem] font-medium">{stop.label}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
