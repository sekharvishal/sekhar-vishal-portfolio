import { describe, expect, it } from 'vitest'
import { credentials, getProject, projects, skillGroups, stats, toolkitSkillGroups } from '../src/data/content'

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

  it('adds the requested cloud, delivery, and collaboration tools without duplicate skills', () => {
    const skills = toolkitSkillGroups.flatMap((group) => group.skills)
    for (const skill of [
      'Microservices',
      'AWS Cloud',
      'Amazon RDS',
      'Amazon Athena',
      'Amazon Redshift',
      'Docker',
      'Kubernetes',
      'Jenkins',
      'Jira',
      'Atlassian documentation tools',
    ]) {
      expect(skills).toContain(skill)
    }
    expect(new Set(skills).size).toBe(skills.length)
  })

  it('provides contextual descriptions for every skill group', () => {
    expect(toolkitSkillGroups.every((group) => group.description?.trim().length)).toBeTruthy()
    expect(toolkitSkillGroups.find((group) => group.name === 'Planning & documentation')?.description).not.toContain('Confluence')
  })

  it('keeps the original skill matrix unchanged', () => {
    expect(skillGroups).toHaveLength(5)
    expect(skillGroups[0].skills).toContain('Spring Boot')
    expect(skillGroups[0].skills).not.toContain('Microservices')
    expect(skillGroups[3].skills).toContain('AWS Lambda')
    expect(skillGroups[4].skills).toContain('Agile')
  })
})
