import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { JourneyRail, type JourneyStop } from '../src/ui/JourneyRail'

const { go } = vi.hoisted(() => ({ go: vi.fn() }))

vi.mock('../src/hooks/useAnchorNav', () => ({
  useAnchorNav: () => go,
}))

const stops: readonly JourneyStop[] = [
  { id: 'experience', number: '01', label: 'Career', landmark: 'SecureW2 Tower' },
  { id: 'projects', number: '02', label: 'Projects', landmark: 'Edu Eats Campus' },
]

function renderJourneyRail() {
  return render(
    <>
      <section id="experience" />
      <section id="projects" />
      <JourneyRail title="Neon Run route" stops={stops} />
    </>,
  )
}

describe('JourneyRail', () => {
  beforeEach(() => {
    go.mockReset()
    vi.unstubAllGlobals()
  })

  it('shows desktop and mobile navigation and marks the first stage as current', () => {
    renderJourneyRail()

    const desktopNav = within(screen.getByRole('navigation', { name: 'Neon Run route' }))
    const mobileNav = within(screen.getByRole('navigation', { name: 'Neon Run route quick navigation' }))
    expect(desktopNav.getByRole('button', { name: /01 Career — SecureW2 Tower/ })).toHaveAttribute('aria-current', 'location')
    expect(mobileNav.getByRole('button', { name: /01 Career — SecureW2 Tower/ })).toHaveAttribute('aria-current', 'location')
    expect(desktopNav.getByRole('button', { name: /02 Projects — Edu Eats Campus/ })).not.toHaveAttribute('aria-current')
  })

  it('uses the shared anchor navigation when a mobile stage is selected', () => {
    renderJourneyRail()

    const mobileNav = within(screen.getByRole('navigation', { name: 'Neon Run route quick navigation' }))
    fireEvent.click(mobileNav.getByRole('button', { name: /02 Projects — Edu Eats Campus/ }))

    expect(go).toHaveBeenCalledWith('projects')
  })

  it('updates the active stage when its section enters the reading area', () => {
    let notify: IntersectionObserverCallback | undefined
    const observe = vi.fn()
    const disconnect = vi.fn()
    class TestIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        notify = callback
      }
      observe = observe
      disconnect = disconnect
    }
    vi.stubGlobal('IntersectionObserver', TestIntersectionObserver)

    const { container, unmount } = renderJourneyRail()
    expect(observe).toHaveBeenCalledTimes(2)
    const projects = container.querySelector('#projects')
    expect(projects).not.toBeNull()
    const entry = { isIntersecting: true, intersectionRatio: 1, target: projects } as IntersectionObserverEntry
    act(() => notify?.([entry], {} as IntersectionObserver))

    const mobileNav = within(screen.getByRole('navigation', { name: 'Neon Run route quick navigation' }))
    expect(mobileNav.getByRole('button', { name: /02 Projects — Edu Eats Campus/ })).toHaveAttribute('aria-current', 'location')
    expect(mobileNav.getByRole('button', { name: /01 Career — SecureW2 Tower/ })).not.toHaveAttribute('aria-current')

    unmount()
    expect(disconnect).toHaveBeenCalledOnce()
  })
})
