import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { Header } from '../src/ui/Header'

vi.mock('../src/hooks/useAnchorNav', () => ({
  useAnchorNav: () => vi.fn(),
}))

vi.mock('../src/ui/ThemeToggle', () => ({
  ThemeToggle: () => <button type="button" aria-label="Toggle theme" />,
}))

describe('Header world navigation', () => {
  it('keeps the other portfolio worlds reachable from the compact menu', () => {
    render(
      <MemoryRouter initialEntries={['/statue']}>
        <Header />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('Menu'))
    const menu = within(screen.getByText('Menu').closest('details') as HTMLDetailsElement)
    expect(menu.getByRole('link', { name: 'Universe' })).toHaveAttribute('href', '/')
    expect(menu.getByRole('link', { name: 'Neon Run' })).toHaveAttribute('href', '/city')
    expect(menu.getByRole('link', { name: 'Portfolio · career constellation' })).toHaveAttribute('href', '/nexus')
    expect(menu.getByRole('link', { name: 'Frontier · technology field guide' })).toHaveAttribute('href', '/frontier')
  })

  it('closes the compact menu when a world is selected', () => {
    render(
      <MemoryRouter initialEntries={['/city']}>
        <Header />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('Menu'))
    const menu = within(screen.getByText('Menu').closest('details') as HTMLDetailsElement)
    fireEvent.click(menu.getByRole('link', { name: 'The Monument' }))

    expect(screen.getByText('Menu').closest('details')).not.toHaveAttribute('open')
  })
})
