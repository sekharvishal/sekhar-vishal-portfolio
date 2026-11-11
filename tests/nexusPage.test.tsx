import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NexusPage } from '../src/pages/NexusPage'

describe('NexusPage portfolio experience', () => {
  it('presents Sekhar’s résumé and provides interactive career sections', () => {
    render(<NexusPage />)

    expect(screen.getByRole('heading', { name: /Sekhar Vishal/ })).toBeInTheDocument()
    expect(screen.getAllByText('Full Stack Java Developer')).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: /^Explore .* technologies$/ })).toHaveLength(7)
    expect(document.querySelector('.orbit-system-links')).toBeInTheDocument()
    expect(document.querySelector('.project-visual-e-doctor-appointment svg')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Email me ↗' })).toHaveAttribute('href', 'mailto:vishal944170@gmail.com')
    expect(screen.queryByText('Small things, extraordinary bonds')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /AI and Cloud Intern/ }))
    expect(screen.getByText(/Completed AI and cloud-oriented learning/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /IAM \/ Security Analyst virtual experience/ }))
    expect(screen.queryByText(/TODO:/i)).not.toBeInTheDocument()
    expect(screen.getByText(/Specific simulation task details are omitted until confirmed/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Edu Eats/ }))
    expect(screen.getByText(/Currently in development/)).toBeInTheDocument()
    expect(document.querySelector('.project-visual-edu-eats svg')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Explore AWS cloud & analytics technologies' }))
    expect(screen.getByText(/managed relational database service/)).toBeInTheDocument()
    expect(screen.getByText('Amazon Athena')).toBeInTheDocument()
  })

  it('lets visitors pick a skill planet from the animated galaxy', () => {
    render(<NexusPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Explore Containers & delivery technologies' }))
    expect(screen.getByRole('heading', { name: 'Containers & delivery' })).toBeInTheDocument()
    expect(screen.getByText('Kubernetes')).toBeInTheDocument()
  })

  it('keeps unresolved project placeholders out of the public project view', () => {
    render(<NexusPage />)

    fireEvent.click(screen.getByRole('button', { name: /Student Information Management System/ }))
    const projectSection = screen.getByRole('heading', { name: 'Student Information Management System' }).closest('article')
    expect(projectSection).not.toBeNull()
    expect(projectSection?.textContent).not.toMatch(/TODO:/i)
  })
})
