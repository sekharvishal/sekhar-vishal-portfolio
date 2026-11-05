import { createContext, useContext } from 'react'

export type Theme = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'sv-theme'

/** Values consumed by the 3D scene so it follows the UI theme. */
export interface SceneTheme {
  background: string
  fog: string
  fogNear: number
  fogFar: number
  envIntensity: number
  keyLight: string
  keyLightIntensity: number
  ambient: number
  statueColor: string
  statueMetalness: number
  statueRoughness: number
  statueEmissive: string
  statueEmissiveIntensity: number
  dust: string
  bloomIntensity: number
  bloomThreshold: number
}

export const SCENE_THEMES: Record<Theme, SceneTheme> = {
  dark: {
    background: '#0a0a0b',
    fog: '#0a0a0b',
    fogNear: 8,
    fogFar: 34,
    envIntensity: 0.55,
    keyLight: '#ffd9a0',
    keyLightIntensity: 2.4,
    ambient: 0.15,
    statueColor: '#c9a24b',
    statueMetalness: 0.92,
    statueRoughness: 0.32,
    statueEmissive: '#ffb347',
    statueEmissiveIntensity: 2.6,
    dust: '#e8c97a',
    bloomIntensity: 1.5,
    bloomThreshold: 0.8,
  },
  light: {
    background: '#f6f2ea',
    fog: '#f6f2ea',
    fogNear: 10,
    fogFar: 40,
    envIntensity: 1,
    keyLight: '#fff4dc',
    keyLightIntensity: 2.8,
    ambient: 0.55,
    statueColor: '#d9d2c3',
    statueMetalness: 0.15,
    statueRoughness: 0.45,
    statueEmissive: '#9a7420',
    statueEmissiveIntensity: 0.6,
    dust: '#9a7420',
    bloomIntensity: 0.6,
    bloomThreshold: 0.9,
  },
}

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function readStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return value === 'dark' || value === 'light' ? value : null
  } catch {
    return null
  }
}

export function resolveInitialTheme(): Theme {
  return readStoredTheme() ?? getSystemTheme()
}

export interface ThemeContextValue {
  theme: Theme
  sceneTheme: SceneTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
