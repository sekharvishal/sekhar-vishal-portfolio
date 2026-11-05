import { profile } from '../../data/content'
import { useAnchorNav } from '../../hooks/useAnchorNav'

export function Hero() {
  const go = useAnchorNav()

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      data-panel=""
      className="relative flex min-h-screen items-center px-5 pb-16 pt-28 md:px-16"
    >
      <div data-card="" className="max-w-3xl">
        <p className="eyebrow">Portfolio &middot; Software Engineering</p>
        <h1 id="hero-title" className="mt-4 text-6xl leading-[0.95] md:text-8xl">
          {profile.name}
        </h1>
        <p className="mt-3 font-display text-2xl italic text-gold md:text-3xl">{profile.role}</p>
        <p className="mt-6 max-w-xl text-xl text-fg md:text-2xl">{profile.headline}</p>
        <p className="mt-3 max-w-xl text-muted">{profile.subheadline}</p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Core technologies">
          {['Java', 'Spring Boot', 'Angular', 'Cloud & AI'].map((t) => (
            <li key={t} className="chip pointer-events-auto">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" className="btn btn-solid" onClick={() => go('projects')}>
            View Projects
          </button>
          <a className="btn" href={profile.resumeHref} download>
            Download R&eacute;sum&eacute;
          </a>
          <button type="button" className="btn" onClick={() => go('contact')}>
            Contact Me
          </button>
        </div>
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.3em] text-muted" aria-hidden="true">
          Scroll to ascend &darr;
        </p>
      </div>
    </section>
  )
}
