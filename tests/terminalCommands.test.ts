import { describe, expect, it } from 'vitest'
import { credentials, profile, projects } from '../src/data/content'
import { runCommand, suggest } from '../src/universe/terminalCommands'
import { chapterIndex } from '../src/universe/universeMap'

describe('terminal commands', () => {
  it('ignores empty input', () => {
    expect(runCommand('   ').lines).toEqual([])
  })

  it('help lists the main commands', () => {
    const text = runCommand('help').lines.join('\n')
    for (const word of ['about', 'skills', 'projects', 'goto', 'mood', 'sound']) expect(text).toContain(word)
  })

  it('opens a project by number or slug and closes the terminal', () => {
    const byNumber = runCommand('project 3')
    expect(byNumber.action).toEqual({ type: 'open', slug: projects[2].slug })
    expect(byNumber.close).toBe(true)
    expect(runCommand('project edu-eats').action).toEqual({ type: 'open', slug: 'edu-eats' })
  })

  it('rejects unknown projects and chapters without an action', () => {
    expect(runCommand('project 99').action).toBeUndefined()
    expect(runCommand('goto nowhere').action).toBeUndefined()
  })

  it('goto resolves chapter names and aliases', () => {
    expect(runCommand('goto skills').action).toEqual({ type: 'goto', chapter: chapterIndex('skills') })
    expect(runCommand('goto work').action).toEqual({ type: 'goto', chapter: chapterIndex('journey') })
  })

  it('skills <group> shows only that group', () => {
    const result = runCommand('skills backend')
    expect(result.lines.join(' ')).toContain('Spring Boot')
    expect(result.action).toEqual({ type: 'goto', chapter: 1, item: 0 })
  })

  it('answers only from the content file', () => {
    expect(runCommand('contact').lines.join('\n')).toContain(profile.email)
    expect(runCommand('credentials').lines.filter((l) => l.startsWith('- '))).toHaveLength(credentials.length)
  })

  it('mood accepts a known palette and rejects unknown ones', () => {
    expect(runCommand('mood solar').action).toEqual({ type: 'mood', mood: 2 })
    expect(runCommand('mood plaid').action).toBeUndefined()
  })

  it('supports clear / exit and suggests close matches', () => {
    expect(runCommand('clear').clear).toBe(true)
    expect(runCommand('exit').close).toBe(true)
    expect(suggest('projcts')).toBe('projects')
    expect(runCommand('projcts').lines[0]).toContain('Did you mean "projects"')
  })
})
