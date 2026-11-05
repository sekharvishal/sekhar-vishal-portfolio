import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ProjectPage } from '../src/pages/ProjectPage'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="projects/:slug" element={<ProjectPage />} />
        <Route path="*" element={<p>fallback</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProjectPage', () => {
  it('shows the In Development badge and planned features for Edu Eats', () => {
    renderAt('/projects/edu-eats')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Edu Eats')
    expect(screen.getByText('In Development')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Planned features' })).toBeInTheDocument()
  })

  it('shows Technical Exploration for AI Agent Memory', () => {
    renderAt('/projects/ai-agent-memory')
    expect(screen.getByText('Technical Exploration', { selector: 'span' })).toBeInTheDocument()
  })

  it('renders the problem / contribution / challenge / result structure', () => {
    renderAt('/projects/e-doctor-appointment')
    for (const label of ['Problem', 'My contribution', 'Challenge', 'Result']) {
      expect(screen.getByRole('heading', { name: label })).toBeInTheDocument()
    }
  })

  it('shows a visible TODO marker for the unconfirmed stack', () => {
    renderAt('/projects/student-information-management')
    expect(screen.getByText('TODO: confirm')).toBeInTheDocument()
  })

  it('falls back to the not-found page for unknown slugs', () => {
    renderAt('/projects/nope')
    expect(screen.getByText(/This floor does not exist/)).toBeInTheDocument()
  })
})
