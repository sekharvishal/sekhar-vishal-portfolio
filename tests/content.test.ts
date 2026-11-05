import { describe, expect, it } from 'vitest'
import { credentials, getProject, projects, stats } from '../src/data/content'

describe('content honesty rules', () => {
  it('labels Edu Eats as in development', () => {
    expect(getProject('edu-eats')?.status).toBe('in-development')
  })

  it('labels AI Agent Memory as a technical exploration', () => {
    expect(getProject('ai-agent-memory')?.status).toBe('exploration')
  })

  it('marks the Student Information Management System stack as TODO: confirm', () => {
    expect(getProject('student-information-management')?.stack).toEqual(['TODO: confirm'])
  })

  it('flags every certification as unverified until confirmed', () => {
    expect(credentials.every((c) => c.verified === false || c.verifyUrl)).toBe(true)
  })

  it('does not invent results for case studies', () => {
    for (const p of projects) expect(p.caseStudy?.result).toBeUndefined()
  })

  it('uses only the supplied facts for stats', () => {
    const byLabel = Object.fromEntries(stats.map((s) => [s.label, s.value]))
    expect(byLabel['Professional experience']).toBe('~1 yr')
    expect(byLabel['SecureW2 internship']).toBe('6 mo')
    expect(byLabel['Documented projects']).toBe(String(projects.filter((p) => p.status !== 'exploration').length))
    expect(byLabel['Credentials & programs']).toBe(String(credentials.length))
  })

  it('has unique project slugs', () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length)
  })
})
