import { useTheme } from '../app/theme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isLight}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      className="pointer-events-auto glass inline-flex h-10 items-center gap-2 rounded-full px-4 font-mono text-xs uppercase tracking-[0.2em] text-fg transition hover:shadow-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      <span aria-hidden="true" className="inline-block h-3 w-3 rounded-full border border-gold bg-gold/80" />
      {isLight ? 'Ivory' : 'Obsidian'}
    </button>
  )
}
