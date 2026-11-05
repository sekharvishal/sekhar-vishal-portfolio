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

gsap.registerPlugin(ScrollTrigger)

interface OverlayCityProps {
  /** Plain layout: no scroll-driven fades, dashboard rendered in flow. */
  staticMode?: boolean
}

function IntroHero() {
  return (
    <section data-panel="" className="relative flex min-h-screen items-center justify-center px-5 py-16 md:px-10">
      <GlassCard panel className="w-full max-w-4xl text-center">
        <p className="eyebrow">The City Drive</p>
        <h1 className="mt-2 text-5xl md:text-6xl">{profile.name}</h1>
        <p className="mt-4 text-lg text-muted">{profile.headline}</p>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-gold">Scroll to drive &darr;</p>
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
 * HTML layer for the City Drive variant. Same mechanism as the statue's
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
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true },
          })
          .fromTo(card, { autoAlpha: 0, y: 80 }, { autoAlpha: 1, y: 0, duration: 0.22 })
          .to(card, { autoAlpha: 1, duration: 0.56 })
          .to(card, { autoAlpha: 0, y: -80, duration: 0.22 })
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
