import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  SCENE_THEMES,
  THEME_STORAGE_KEY,
  ThemeContext,
  resolveInitialTheme,
  type Theme,
  type ThemeContextValue,
} from './theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(resolveInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', SCENE_THEMES[theme].background)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      /* storage unavailable (private mode): theme still applies for this session */
    }
  }, [])

  const toggleTheme = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, sceneTheme: SCENE_THEMES[theme], setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
