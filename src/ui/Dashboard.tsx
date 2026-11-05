import { useLenis } from 'lenis/react'
import { experience, profile, skillGroups, stats } from '../data/content'
import { GlassCard } from './GlassCard'

interface DashboardProps {
  /**
   * `true`: fixed finale overlay revealed by GSAP at progress >= 0.95 and kept visible.
   * `false`: ordinary in-flow section (reduced motion / no WebGL fallback).
   */
  floating: boolean
}

/** Permanent summary of the whole profile, shown when the camera pulls back. */
export function Dashboard({ floating }: DashboardProps) {
  const lenis = useLenis()

  const wrapperClass = floating
    ? 'invisible opacity-0 pointer-events-none fixed inset-0 z-20'
    : 'relative px-5 py-16 md:px-10'
  const scrollClass = floating ? 'pointer-events-auto h-full overflow-y-auto px-5 pb-8 pt-20 md:px-10' : ''

  return (
    <aside id="dashboard" data-dash="" aria-labelledby="dashboard-title" className={wrapperClass}>
      <div data-lenis-prevent={floating ? '' : undefined} className={scrollClass}>
        <div className="mx-auto max-w-7xl">
          <div data-dash-item="">
            <p className="eyebrow">The full picture</p>
            <h2 id="dashboard-title" className="mt-1 text-4xl md:text-5xl">
              Profile at a glance
            </h2>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,22%)_minmax(0,1fr)]">
            {/* Left column */}
            <div className="space-y-5">
              <GlassCard className="!p-5 md:!p-6">
                <div data-dash-item="">
                  <h3 className="text-2xl">Numbers, honestly</h3>
                  <dl className="mt-4 grid grid-cols-2 gap-3">
                    {stats.map((s) => (
                      <div key={s.label} className="rounded-xl border border-line/15 p-3">
                        <dt className="text-xs text-muted">{s.label}</dt>
                        <dd className="font-display text-4xl text-gold">{s.value}</dd>
                        <p className="text-[0.7rem] leading-snug text-muted">{s.note}</p>
                      </div>
                    ))}
                  </dl>
                </div>
              </GlassCard>

              <GlassCard className="!p-5 md:!p-6">
                <div data-dash-item="">
                  <h3 className="text-2xl">Let us talk</h3>
                  <p className="mt-1 text-sm text-muted">Open to full-stack Java roles and engineering conversations.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a className="btn btn-solid !px-4 !py-2" href={`mailto:${profile.email}`}>
                      Email me
                    </a>
                    {profile.links.map((l) => (
                      <a key={l.label} className="btn !px-4 !py-2" href={l.href} target="_blank" rel="noreferrer noopener">
                        {l.label}
                      </a>
                    ))}
                    <a className="btn !px-4 !py-2" href={profile.resumeHref} download>
                      R&eacute;sum&eacute;
                    </a>
                  </div>
                  <button
                    type="button"
                    className="btn mt-3 !px-4 !py-2"
                    onClick={() => (lenis ? lenis.scrollTo(0, { duration: 2.4 }) : window.scrollTo({ top: 0, behavior: 'smooth' }))}
                  >
                    Back to the start &uarr;
                  </button>
                </div>
              </GlassCard>
            </div>

            {/* Centre stays open so the finished statue remains visible. */}
            <div aria-hidden="true" className="hidden lg:block" />

            {/* Right column */}
            <div className="space-y-5">
              <GlassCard className="!p-5 md:!p-6">
                <div data-dash-item="">
                  <h3 className="text-2xl">Skills matrix</h3>
                  <div className="mt-3 space-y-3">
                    {skillGroups.map((g) => (
                      <div key={g.name}>
                        <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-gold">{g.name}</p>
                        <ul className="mt-1 flex flex-wrap gap-1">
                          {g.skills.map((s) => (
                            <li key={s} className="chip !px-2 !py-0.5 !text-[0.65rem]">
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="!p-5 md:!p-6">
                <div data-dash-item="">
                  <h3 className="text-2xl">Experience timeline</h3>
                  <ol className="mt-3 space-y-3 border-l border-gold/40 pl-4">
                    {experience.map((e) => (
                      <li key={`${e.org}-${e.role}`} className="relative">
                        <span aria-hidden="true" className="absolute -left-[1.3rem] top-1.5 h-2 w-2 rounded-full bg-gold" />
                        <p className="text-sm text-fg">
                          {e.role} <span className="text-muted">&middot; {e.org}</span>
                        </p>
                        <p className="text-xs text-muted">{e.period}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
