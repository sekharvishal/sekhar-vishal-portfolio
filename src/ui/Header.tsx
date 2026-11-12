import { Link, useLocation } from 'react-router-dom'
import { profile } from '../data/content'
import { useAnchorNav } from '../hooks/useAnchorNav'
import { NAV_ITEMS } from './nav'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const go = useAnchorNav()
  const { pathname } = useLocation()
  const inCity = pathname === '/city'
  const inToolkit = pathname === '/toolkit'
  const inNexus = pathname === '/nexus'
  const inFrontier = pathname === '/frontier'
  const worlds = [
    { to: '/', label: 'Universe' },
    { to: inCity ? '/statue' : '/city', label: inCity ? 'The Monument' : 'Neon Run' },
  ]

  return (
    <header
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-5 py-4 md:px-10${inNexus ? ' nexus-header' : ''}${inFrontier ? ' frontier-header' : ''}`}
    >
      <Link
        to="/"
        className="pointer-events-auto font-display text-xl tracking-wide text-fg"
        aria-label={`${profile.name} - home`}
      >
        Sekhar <span className="text-gold">Vishal</span>
      </Link>

      {!inToolkit && !inNexus && (
        <nav aria-label="Primary" className="pointer-events-auto glass hidden rounded-full px-2 py-1 lg:block">
          <ul className="flex items-center">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => go(item.id)}
                  className="rounded-full px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted transition hover:text-gold"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="flex items-center gap-2">
        {worlds.map((w) => (
          <Link
            key={w.to}
            to={w.to}
            className="glass pointer-events-auto hidden items-center rounded-full px-4 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted transition hover:text-gold sm:flex"
          >
            {w.label}
          </Link>
        ))}
        <Link
          to="/toolkit"
          aria-current={inToolkit ? 'page' : undefined}
          className="glass pointer-events-auto hidden items-center rounded-full px-4 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-gold transition hover:bg-gold/10 sm:flex"
        >
          Toolkit
        </Link>
        <Link
          to="/nexus"
          aria-current={inNexus ? 'page' : undefined}
          className="glass pointer-events-auto hidden items-center rounded-full px-4 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-gold transition hover:bg-gold/10 sm:flex"
        >
          Portfolio
        </Link>
        <details className="pointer-events-auto relative lg:hidden">
          <summary className="glass flex h-10 cursor-pointer list-none items-center rounded-full px-4 font-mono text-xs uppercase tracking-[0.2em] text-fg">
            Menu
          </summary>
          <ul className="glass absolute right-0 mt-2 w-52 rounded-2xl p-2">
            {!inToolkit && !inNexus &&
              NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={(e) => {
                      go(item.id)
                      ;(e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open')
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left font-mono text-xs uppercase tracking-[0.16em] text-fg hover:text-gold"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            <li aria-hidden="true" className="my-1 border-t border-line/15" />
            <li>
              <Link
                to="/toolkit"
                onClick={(e) => {
                  ;(e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open')
                }}
                className="block rounded-xl px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-gold hover:bg-white/5"
              >
                Engineering toolkit
              </Link>
            </li>
            <li>
              <Link
                to="/nexus"
                onClick={(e) => {
                  ;(e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open')
                }}
                className="block rounded-xl px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-gold hover:bg-white/5"
              >
                Portfolio · career constellation
              </Link>
            </li>
            {worlds.map((w) => (
              <li key={w.to}>
                <Link
                  to={w.to}
                  onClick={(e) => {
                    ;(e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open')
                  }}
                  className="block rounded-xl px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-gold hover:bg-white/5"
                >
                  {w.label}
                </Link>
              </li>
            ))}
          </ul>
        </details>
        <ThemeToggle />
      </div>
    </header>
  )
}
