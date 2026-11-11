import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ToolkitPage } from '../src/pages/ToolkitPage'

describe('ToolkitPage', () => {
  it('presents the added tools with context while linking back to the original skills', () => {
    render(
      <MemoryRouter>
        <ToolkitPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /The tools behind the work/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AWS cloud & analytics' })).toBeInTheDocument()
    expect(screen.getByText('Amazon Athena')).toBeInTheDocument()
    expect(screen.getByText('Atlassian documentation tools')).toBeInTheDocument()
    expect(screen.getByText(/not a description of a single deployed system/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Original skills section' })).toHaveAttribute('href', '/statue#skills')
  })
})
