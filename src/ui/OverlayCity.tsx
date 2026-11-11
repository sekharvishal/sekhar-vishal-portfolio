import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CITY_FINALE_RELEASE, CITY_FINALE_THRESHOLD, STOPS } from '../state/scrollMapCity'
import { profile } from '../data/content'
import { Dashboard } from './Dashboard'
import { GlassCard } from './GlassCard'
import { About } from './sections/About'
import { Achievements } from './sections/Achievements'
import { Certifications } from './sections/Certifications'
import { Contact } from './sections/Contact'
import { Education } from './sections/Education'
import { Experience } from './sections/Experience'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'
import { JourneyRail, type JourneyStop } from './JourneyRail'

gsap.registerPlugin(ScrollTrigger)

const CITY_JOURNEY: readonly JourneyStop[] = [
  { id: 'experience', number: '01', label: 'Career', landmark: 'SecureW2 Tower' },
  { id: 'skills', number: '02', label: 'Skills', landmark: 'Skills Matrix' },
  { id: 'projects', number: '03', label: 'Projects', landmark: 'Edu Eats Campus' },
  { id: 'contact', number: '04', label: 'Contact', landmark: 'Grand Finale' },
]

interface OverlayCityProps {
  /** Plain layout: no scroll-driven fades, dashboard rendered in flow. */
  staticMode?: boolean
}

function IntroHero() {
  return (
    <section data-panel="" className="relative flex min-h-screen items-center justify-center px-5 py-16 md:px-10">
      <GlassCard panel className="w-full max-w-4xl text-center">
        <p className="eyebrow">Neon Run &middot; The Portfolio Grand Tour</p>
        <h1 className="mt-2 text-5xl md:text-6xl">{profile.name}</h1>
        <p className="mt-4 text-lg text-muted">{profile.headline}</p>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-gold">Scroll to cruise through the portfolio &darr;</p>
        <ol aria-label="Neon Run route stops" className="mt-8 grid grid-cols-2 gap-2 text-left md:grid-cols-4">
          {CITY_JOURNEY.map((stop) => (
            <li key={stop.id} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <span className="block font-mono text-[0.58rem] tracking-[0.16em] text-gold">{stop.number} / {stop.label}</span>
              <span className="mt-1 block text-xs text-muted">{stop.landmark}</span>
            </li>
          ))}
        </ol>
      </GlassCard>
    </section>
  )
}

/** Thin, non-interactive marker announcing which hero building the car is approaching. */
function CityChapter({ index, label }: { index: number; label: string }) {
  return (
    <div aria-hidden="true" className="relative flex h-[18vh] items-center justify-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">
        Stop 0{index} &middot; {label}
      </p>
    </div>
  )
}

/**
 * HTML layer for the Neon Run variant. Same mechanism as the statue's
 * `Overlay.tsx` (pointer-events: none root, per-panel scroll-scrubbed fade,
 * one-shot finale reveal) but content is grouped under the four hero-building
 * stops instead of one continuous flow. Reuses every existing section
 * component and `Dashboard.tsx` unchanged.
 */
export function OverlayCity({ staticMode = false }: OverlayCityProps) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (staticMode) return
    const html = document.documentElement

    const ctx = gsap.context(() => {
      gsap.to('[data-progress]', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: true },
      })

      gsap.utils.toArray<HTMLElement>('[data-panel]').forEach((panel) => {
        const card = panel.querySelector('[data-card]')
        if (!card) return
        const revealItems = card.querySelectorAll<HTMLElement>('[data-reveal-item]')
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true },
          })
          .fromTo(card, { autoAlpha: 0, y: 56 }, { autoAlpha: 1, y: 0, duration: 0.22 }, 0)
          .fromTo(revealItems, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.16, stagger: 0.035 }, 0.12)
          .to(card, { autoAlpha: 1, duration: 0.55 }, 0.22)
          .to(card, { autoAlpha: 0, y: -42, duration: 0.22 }, 0.77)
      })

      const reveal = gsap
        .timeline({ paused: true })
        .to('[data-dash]', { autoAlpha: 1, duration: 0.5, ease: 'power2.out' })
        .from('[data-dash-item]', { autoAlpha: 0, y: 30, duration: 0.6, stagger: 0.12, ease: 'power3.out' }, 0.15)

      let finale = false
      const setFinale = (on: boolean) => {
        if (on === finale) return
        finale = on
        if (on) {
          html.dataset.finale = 'on'
          reveal.timeScale(1).play()
        } else {
          delete html.dataset.finale
          reveal.timeScale(1.6).reverse()
        }
      }
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => setFinale(self.progress >= (finale ? CITY_FINALE_RELEASE : CITY_FINALE_THRESHOLD)),
        onRefresh: (self) => setFinale(self.progress >= CITY_FINALE_THRESHOLD),
      })
    }, root)

    return () => {
      ctx.revert()
      delete html.dataset.finale
    }
  }, [staticMode])

  return (
    <div ref={root} className="pointer-events-none relative">
      <JourneyRail title="Neon Run · route" stops={CITY_JOURNEY} />
      {!staticMode && (
        <div aria-hidden="true" className="fixed inset-x-0 top-0 z-40 h-0.5 bg-transparent">
          <div data-progress="" className="h-full origin-left scale-x-0 bg-gold" />
        </div>
      )}

      <IntroHero />

      <CityChapter index={1} label={STOPS[0].label} />
      <About />
      <Experience />

      <CityChapter index={2} label={STOPS[1].label} />
      <Skills />
      <Certifications />

      <CityChapter index={3} label={STOPS[2].label} />
      <Projects />
      <Education />

      <CityChapter index={4} label={STOPS[3].label} />
      <Achievements />
      <Contact />

      {/* Runway so the last card fully leaves before the finale pull-back. */}
      {!staticMode && <div aria-hidden="true" className="h-[110vh]" />}

      <Dashboard floating={!staticMode} />
    </div>
  )
}
