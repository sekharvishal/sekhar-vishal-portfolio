import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { startAmbient, stopAmbient } from './ambientAudio'
import { MOODS } from './palettes'
import { CHAPTERS, itemProgress } from './universeMap'
import { uiStore } from './universeStore'

/** Everything the command palette, terminal and rail can ask the Universe to do. */
export type UniverseAction =
  | { type: 'goto'; chapter: number; item?: number }
  | { type: 'open'; slug: string }
  | { type: 'mood'; mood?: number }
  | { type: 'sound' }
  | { type: 'route'; path: string }
  | { type: 'link'; href: string }
  | { type: 'terminal' }
  | { type: 'palette' }

export function progressForChapter(chapter: number, item = 0): number {
  const c = CHAPTERS[Math.min(Math.max(chapter, 0), CHAPTERS.length - 1)]
  return itemProgress(c.id, Math.min(item, c.items - 1))
}

export function toggleSound(): void {
  const next = !uiStore.get().sound
  uiStore.set({ sound: next })
  if (next) startAmbient()
  else stopAmbient()
}

export function useActionRunner(): (action: UniverseAction) => void {
  const lenis = useLenis()
  const navigate = useNavigate()

  return useCallback(
    (action: UniverseAction) => {
      switch (action.type) {
        case 'goto': {
          const max = document.documentElement.scrollHeight - window.innerHeight
          const y = progressForChapter(action.chapter, action.item) * max
          uiStore.set({ paletteOpen: false, project: null })
          if (lenis) lenis.scrollTo(y, { duration: 2.6, force: true })
          else window.scrollTo({ top: y, behavior: 'smooth' })
          break
        }
        case 'open':
          uiStore.set({ project: action.slug, paletteOpen: false })
          break
        case 'mood': {
          const current = uiStore.get().mood
          uiStore.set({ mood: action.mood ?? (current + 1) % MOODS.length })
          break
        }
        case 'sound':
          toggleSound()
          break
        case 'route':
          navigate(action.path)
          break
        case 'link':
          if (action.href.startsWith('mailto:')) window.location.href = action.href
          else window.open(action.href, '_blank', 'noopener,noreferrer')
          break
        case 'terminal':
          uiStore.set({ terminalOpen: !uiStore.get().terminalOpen, paletteOpen: false })
          break
        case 'palette':
          uiStore.set({ paletteOpen: !uiStore.get().paletteOpen })
          break
      }
    },
    [lenis, navigate],
  )
}
