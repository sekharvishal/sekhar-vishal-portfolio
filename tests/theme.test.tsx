import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '../src/app/ThemeProvider'
import { THEME_STORAGE_KEY } from '../src/app/theme'
import { ThemeToggle } from '../src/ui/ThemeToggle'

function mockSystemTheme(light: boolean) {
  vi.stubGlobal(
    'matchMedia',
    (query: string) =>
      ({
        matches: query.includes('prefers-color-scheme: light') ? light : false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  )
  window.matchMedia = globalThis.matchMedia
}

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )
}

describe('theme', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('defaults to the system preference (dark)', () => {
    mockSystemTheme(false)
    renderToggle()
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('defaults to the system preference (light)', () => {
    mockSystemTheme(true)
    renderToggle()
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('toggle sets data-theme and persists to localStorage', () => {
    mockSystemTheme(false)
    renderToggle()
    fireEvent.click(screen.getByRole('button'))
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
    fireEvent.click(screen.getByRole('button'))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('stored choice wins over the system preference', () => {
    mockSystemTheme(true)
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    renderToggle()
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
