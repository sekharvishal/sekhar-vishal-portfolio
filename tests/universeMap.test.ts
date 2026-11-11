import { describe, expect, it } from 'vitest'
import { experience, projects, skillGroups } from '../src/data/content'
import {
  CHAPTERS,
  TOTAL_VH,
  chapterEnd,
  chapterIndex,
  chapterStart,
  itemProgress,
  locate,
  progressOf,
} from '../src/universe/universeMap'

describe('universeMap', () => {
  it('chapters tile the 0..1 range without gaps', () => {
    expect(chapterStart(0)).toBe(0)
    for (let i = 0; i < CHAPTERS.length - 1; i++) {
      expect(chapterEnd(i)).toBeCloseTo(chapterStart(i + 1), 10)
    }
    expect(chapterEnd(CHAPTERS.length - 1)).toBeCloseTo(1, 10)
  })

  it('item counts follow the content file', () => {
    expect(CHAPTERS[chapterIndex('skills')].items).toBe(skillGroups.length)
    expect(CHAPTERS[chapterIndex('projects')].items).toBe(projects.length)
    expect(CHAPTERS[chapterIndex('journey')].items).toBe(experience.length)
  })

  it('locate() inverts progressOf() and itemProgress()', () => {
    const place = locate(progressOf('projects', 0.5))
    expect(place.chapter).toBe(chapterIndex('projects'))
    expect(place.local).toBeCloseTo(0.5, 6)

    projects.forEach((_, i) => {
      const at = locate(itemProgress('projects', i))
      expect(at.chapter).toBe(chapterIndex('projects'))
      expect(at.item).toBe(i)
      expect(at.itemLocal).toBeCloseTo(0.5, 6)
    })
  })

  it('clamps out-of-range progress to the first / last stop', () => {
    expect(locate(-1).chapter).toBe(0)
    expect(locate(2).chapter).toBe(CHAPTERS.length - 1)
    expect(locate(1).item).toBe(CHAPTERS[CHAPTERS.length - 1].items - 1)
  })

  it('has a sensible scroll length', () => {
    expect(TOTAL_VH).toBeGreaterThan(CHAPTERS.length * 100)
  })
})
