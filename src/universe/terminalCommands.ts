import {
  achievements,
  credentials,
  education,
  experience,
  profile,
  projects,
  skillGroups,
  stats,
} from '../data/content'
import type { UniverseAction } from './actions'
import { MOODS } from './palettes'
import { CHAPTERS, chapterIndex, type ChapterId } from './universeMap'

export interface TerminalResult {
  lines: string[]
  action?: UniverseAction
  /** Clear the screen before printing. */
  clear?: boolean
  /** Close the terminal after running. */
  close?: boolean
}

const HELP = [
  'Available commands',
  '  about              who I am',
  '  skills [group]     my toolbox, or one group (backend, frontend, ...)',
  '  projects           what I have built',
  '  project <n|slug>   open a project case study',
  '  experience         where I have worked',
  '  education          degrees and scores',
  '  credentials        courses, simulations and programs',
  '  achievements       highlights',
  '  contact            get in touch',
  '  resume             open my resume',
  '  goto <chapter>     fly there (origin, skills, projects, journey, archive, contact)',
  '  mood [name]        change the palette (aurora, nebula, solar)',
  '  sound              toggle ambient sound',
  '  worlds             other versions of this portfolio',
  '  clear              clear the screen',
  '  exit               close the terminal',
]

const COMMANDS = [
  'help', 'about', 'whoami', 'skills', 'projects', 'project', 'experience', 'education',
  'credentials', 'achievements', 'contact', 'resume', 'goto', 'mood', 'sound', 'worlds', 'clear', 'exit',
]

function distance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)] as number[])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
  }
  return dp[a.length][b.length]
}

export function suggest(cmd: string): string | undefined {
  const best = COMMANDS.map((c) => ({ c, d: distance(cmd, c) })).sort((x, y) => x.d - y.d)[0]
  return best && best.d <= 2 ? best.c : undefined
}

function findChapter(arg: string): number {
  const q = arg.toLowerCase()
  const byId = chapterIndex(q as ChapterId)
  if (byId >= 0) return byId
  const alias: Record<string, ChapterId> = {
    home: 'origin', top: 'origin', about: 'origin', experience: 'journey', work: 'journey', credentials: 'archive',
    education: 'archive', end: 'contact', finale: 'contact',
  }
  return alias[q] ? chapterIndex(alias[q]) : -1
}

function findProject(arg: string) {
  const n = Number(arg)
  if (Number.isInteger(n) && n >= 1 && n <= projects.length) return projects[n - 1]
  const q = arg.toLowerCase()
  return projects.find((p) => p.slug === q || p.slug.includes(q) || p.title.toLowerCase().includes(q))
}

/** Pure, rule-based command interpreter. Every answer comes from `data/content.ts`. */
export function runCommand(input: string): TerminalResult {
  const trimmed = input.trim()
  if (!trimmed) return { lines: [] }
  const [head, ...rest] = trimmed.split(/\s+/)
  const cmd = head.toLowerCase()
  const arg = rest.join(' ')

  switch (cmd) {
    case 'help':
    case '?':
      return { lines: HELP }
    case 'about':
    case 'whoami':
      return { lines: [`${profile.name} - ${profile.role}`, profile.stackLine, '', ...profile.summary.slice(0, 2)] }
    case 'skills': {
      if (arg) {
        const group = skillGroups.find((g) => g.name.toLowerCase().includes(arg.toLowerCase()))
        if (!group) return { lines: [`No skill group matching "${arg}". Groups: ${skillGroups.map((g) => g.name).join(', ')}.`] }
        return { lines: [`${group.name}:`, `  ${group.skills.join(' · ')}`], action: { type: 'goto', chapter: 1, item: skillGroups.indexOf(group) } }
      }
      return {
        lines: skillGroups.map((g) => `${g.name.padEnd(22)} ${g.skills.join(', ')}`),
        action: { type: 'goto', chapter: 1 },
      }
    }
    case 'projects':
      return {
        lines: [...projects.map((p, i) => `${i + 1}. ${p.title}  [${p.status}]`), '', 'Use "project <n>" to open one.'],
        action: { type: 'goto', chapter: 2 },
      }
    case 'project': {
      if (!arg) return { lines: ['Usage: project <n|slug>. Try "projects" first.'] }
      const p = findProject(arg)
      if (!p) return { lines: [`No project matching "${arg}".`] }
      return { lines: [`Opening ${p.title} ...`, p.tagline], action: { type: 'open', slug: p.slug }, close: true }
    }
    case 'experience':
    case 'work':
      return {
        lines: experience.map((e) => `${e.role} @ ${e.org}  (${e.period})`),
        action: { type: 'goto', chapter: 3 },
      }
    case 'education':
      return {
        lines: education.map((e) => `${e.level} - ${e.institution}  [${e.score}]`),
        action: { type: 'goto', chapter: 4, item: 1 },
      }
    case 'credentials':
      return {
        lines: [...credentials.map((c) => `- ${c.title} (${c.issuer})`), '', 'Titles are pending verification against the certificates.'],
        action: { type: 'goto', chapter: 4, item: 0 },
      }
    case 'achievements':
      return { lines: achievements.map((a) => `- ${a.title}: ${a.body}`), action: { type: 'goto', chapter: 4, item: 2 } }
    case 'stats':
      return { lines: stats.map((s) => `${s.value.padEnd(7)} ${s.label}`) }
    case 'contact':
      return {
        lines: [`Email:    ${profile.email}`, ...profile.links.map((l) => `${l.label.padEnd(9)} ${l.href}`)],
        action: { type: 'goto', chapter: CHAPTERS.length - 1 },
      }
    case 'resume':
    case 'cv':
      return { lines: ['Opening resume ...'], action: { type: 'link', href: profile.resumeHref } }
    case 'goto':
    case 'cd': {
      if (!arg) return { lines: [`Usage: goto <chapter>. Chapters: ${CHAPTERS.map((c) => c.id).join(', ')}.`] }
      const i = findChapter(arg)
      if (i < 0) return { lines: [`Unknown chapter "${arg}". Chapters: ${CHAPTERS.map((c) => c.id).join(', ')}.`] }
      return { lines: [`Flying to ${CHAPTERS[i].label} ...`], action: { type: 'goto', chapter: i } }
    }
    case 'mood': {
      if (!arg) return { lines: [`Palettes: ${MOODS.map((m) => m.id).join(', ')}.`], action: { type: 'mood' } }
      const idx = MOODS.findIndex((m) => m.id === arg.toLowerCase())
      if (idx < 0) return { lines: [`Unknown mood "${arg}". Palettes: ${MOODS.map((m) => m.id).join(', ')}.`] }
      return { lines: [`Mood set to ${MOODS[idx].label}.`], action: { type: 'mood', mood: idx } }
    }
    case 'sound':
      return { lines: ['Toggling ambient sound ...'], action: { type: 'sound' } }
    case 'worlds':
      return {
        lines: ['/statue  The original scroll-built statue', '/city    A neon car drive through the city', 'Type "open statue" or "open city".'],
      }
    case 'open': {
      const target = arg.toLowerCase()
      if (target === 'statue') return { lines: ['Entering the statue world ...'], action: { type: 'route', path: '/statue' } }
      if (target === 'city') return { lines: ['Starting the city drive ...'], action: { type: 'route', path: '/city' } }
      const p = findProject(arg)
      if (p) return { lines: [`Opening ${p.title} ...`], action: { type: 'open', slug: p.slug }, close: true }
      return { lines: ['Usage: open <statue|city|project>.'] }
    }
    case 'clear':
    case 'cls':
      return { lines: [], clear: true }
    case 'exit':
    case 'quit':
      return { lines: [], close: true }
    case 'sudo':
      return { lines: ['Nice try. This portfolio runs with least privilege.'] }
    case 'hire':
      return { lines: ['Great idea. Opening contact ...'], action: { type: 'goto', chapter: CHAPTERS.length - 1 } }
    default: {
      const s = suggest(cmd)
      return { lines: [`command not found: ${cmd}.${s ? ` Did you mean "${s}"?` : ''} Type "help".`] }
    }
  }
}
