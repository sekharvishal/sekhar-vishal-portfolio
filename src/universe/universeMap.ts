import { credentials, experience, projects, skillGroups } from '../data/content'

/**
 * The Universe is one long scroll divided into weighted chapters. Everything
 * (camera, overlay copy, rail, audio) derives from this table, so adding a
 * chapter or resizing one is a one-line change.
 */
export type ChapterId = 'origin' | 'skills' | 'projects' | 'journey' | 'archive' | 'contact'

export interface Chapter {
  id: ChapterId
  label: string
  /** Relative scroll length. One unit = one viewport height of scrolling. */
  weight: number
  /** Number of "stops" (skill groups, projects, ...) inside the chapter. */
  items: number
}

export const ARCHIVE_ITEMS = ['Credentials', 'Education', 'Achievements'] as const

export const CHAPTERS: readonly Chapter[] = [
  { id: 'origin', label: 'Origin', weight: 2.2, items: 1 },
  { id: 'skills', label: 'Skills', weight: 2.8, items: skillGroups.length },
  { id: 'projects', label: 'Projects', weight: 3.4, items: projects.length },
  { id: 'journey', label: 'Journey', weight: 3.4, items: experience.length },
  { id: 'archive', label: 'Archive', weight: 2.4, items: ARCHIVE_ITEMS.length },
  { id: 'contact', label: 'Contact', weight: 2, items: 1 },
]

export const TOTAL_WEIGHT = CHAPTERS.reduce((sum, c) => sum + c.weight, 0)
/** Height of the invisible scroll spacer, in viewport heights. */
export const TOTAL_VH = Math.round(TOTAL_WEIGHT * 100)

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

export function chapterIndex(id: ChapterId): number {
  return CHAPTERS.findIndex((c) => c.id === id)
}

export function chapterStart(index: number): number {
  let acc = 0
  for (let i = 0; i < index; i++) acc += CHAPTERS[i].weight
  return acc / TOTAL_WEIGHT
}

export function chapterEnd(index: number): number {
  return chapterStart(index) + CHAPTERS[index].weight / TOTAL_WEIGHT
}

/** Global progress (0..1) of a point `local` (0..1) inside a chapter. */
export function progressOf(id: ChapterId, local: number): number {
  const i = chapterIndex(id)
  return chapterStart(i) + clamp01(local) * (CHAPTERS[i].weight / TOTAL_WEIGHT)
}

/** Global progress at the centre of stop `item` of a chapter. */
export function itemProgress(id: ChapterId, item: number): number {
  const count = CHAPTERS[chapterIndex(id)].items
  return progressOf(id, (item + 0.5) / count)
}

export interface Place {
  chapter: number
  /** 0..1 inside the chapter. */
  local: number
  item: number
  /** 0..1 inside the item. */
  itemLocal: number
}

export function locate(progress: number): Place {
  const p = clamp01(progress)
  let chapter = CHAPTERS.length - 1
  for (let i = 0; i < CHAPTERS.length; i++) {
    if (p < chapterEnd(i)) {
      chapter = i
      break
    }
  }
  const start = chapterStart(chapter)
  const span = CHAPTERS[chapter].weight / TOTAL_WEIGHT
  const local = clamp01((p - start) / span)
  const count = CHAPTERS[chapter].items
  const scaled = local * count
  const item = Math.min(count - 1, Math.floor(scaled))
  return { chapter, local, item, itemLocal: clamp01(scaled - item) }
}

/** Counts used by 3D nodes that must stay in sync with the content file. */
export const CONTENT_COUNTS = {
  skillGroups: skillGroups.length,
  projects: projects.length,
  experience: experience.length,
  credentials: credentials.length,
}
