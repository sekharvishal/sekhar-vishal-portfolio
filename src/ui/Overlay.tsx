import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FINALE_RELEASE, FINALE_THRESHOLD } from '../state/scrollMap'
import { Dashboard } from './Dashboard'
import { About } from './sections/About'
import { Achievements } from './sections/Achievements'
import { Certifications } from './sections/Certifications'
import { Contact } from './sections/Contact'
import { Education } from './sections/Education'
import { Experience } from './sections/Experience'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'
import { JourneyRail, type JourneyStop } from './JourneyRail'

gsap.registerPlugin(ScrollTrigger)

const STATUE_JOURNEY: readonly JourneyStop[] = [
  { id: 'about', number: '01', label: 'Foundation', landmark: 'The Base' },
  { id: 'experience', number: '02', label: 'Craft', landmark: 'The Core' },
  { id: 'projects', number: '03', label: 'Creations', landmark: 'The Ascent' },
  { id: 'contact', number: '04', label: 'Summit', landmark: 'The Crown' },
]

interface OverlayProps {
  /** Plain layout: no scroll-driven fades, dashboard rendered in flow. */
  staticMode?: boolean
}

/**
 * HTML layer on top of the canvas. The root is `pointer-events: none` so the
 * pointer reaches the 3D scene; glass cards, buttons and links opt back in.
 *
 * Nine content panels (~700vh) provide the scroll length. Each card is scrubbed
 * in/out by its own ScrollTrigger, so cards fade as the camera passes the matching
 * segment of the statue. At progress >= 0.95 the dashboard is revealed and stays.
 */
export function Overlay({ staticMode = false }: OverlayProps) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (staticMode) return
    const html = document.documentElement

    const ctx = gsap.context(() => {
      // Progress bar along the top edge.
      gsap.to('[data-progress]', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: true },
      })

      // Per-section fade / translate: in (22%), hold (56%), out (22%).
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

      // Grand Finale: reveal the dashboard and keep it. Reverses when scrolling back up.
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
        onUpdate: (self) => setFinale(self.progress >= (finale ? FINALE_RELEASE : FINALE_THRESHOLD)),
        onRefresh: (self) => setFinale(self.progress >= FINALE_THRESHOLD),
      })
    }, root)

    return () => {
      ctx.revert()
      delete html.dataset.finale
    }
  }, [staticMode])

  return (
    <div ref={root} className="pointer-events-none relative">
      <JourneyRail title="The Monument · ascent" stops={STATUE_JOURNEY} />
      {!staticMode && (
        <div aria-hidden="true" className="fixed inset-x-0 top-0 z-40 h-0.5 bg-transparent">
          <div data-progress="" className="h-full origin-left scale-x-0 bg-gold" />
        </div>
      )}

      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Certifications />
      <Education />
      <Achievements />
      <Contact />

      {/* Runway so the last card fully leaves before the finale zoom-out. */}
      {!staticMode && <div aria-hidden="true" className="h-[130vh]" />}

      <Dashboard floating={!staticMode} />
    </div>
  )
}
