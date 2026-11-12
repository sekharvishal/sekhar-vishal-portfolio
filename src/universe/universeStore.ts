import { useSyncExternalStore } from 'react'

/**
 * Per-frame, NON-reactive state. Written by DOM listeners and the render loop,
 * read in `useFrame`. Never put these in React state.
 */
export const universe = {
  /** Page scroll progress, 0..1 (mirrors Lenis). */
  progress: 0,
  /** Extra-damped progress that the camera and chapter visuals follow. */
  smooth: 0,
  /** Scroll velocity, px / frame. */
  velocity: 0,
  /** Raw pointer in NDC (-1..1), written by the page's pointermove listener. */
  pointerX: 0,
  pointerY: 0,
  /** Last touch point in NDC. `tapPending` is consumed by the Sky shader to start a ripple. */
  tapX: 0,
  tapY: 0,
  tapPending: false,
  /** Smoothed pointer in NDC (-1..1). */
  mouseX: 0,
  mouseY: 0,
  /** Where the camera currently is in the story (derived from `smooth`). */
  chapter: 0,
  item: 0,
  local: 0,
  /** Fractional chapter used to blend palettes (2.5 = halfway between 2 and 3). */
  chapterF: 0,
  /** 0..1: the name's particles forming out of the galaxy (driven by the intro). */
  morph: 0,
  /** 0..1: camera dolly-in at the end of the intro. */
  dolly: 0,
  /** Hovered 3D nodes (-1 = none). Chips in the overlay write these too. */
  hoverSkillGroup: -1,
  hoverSkillIndex: -1,
  hoverProject: -1,
  hoverCredential: -1,
  /** Camera world position, copied each frame for the HUD. */
  camX: 0,
  camY: 0,
  camZ: 0,
}

export interface UiState {
  introDone: boolean
  sceneReady: boolean
  paletteOpen: boolean
  terminalOpen: boolean
  /** Slug of the project whose case-study takeover is open. */
  project: string | null
  sound: boolean
  mood: number
  cursorLabel: string | null
}

type Listener = () => void

function createStore<T extends object>(initial: T) {
  let state = initial
  const listeners = new Set<Listener>()
  return {
    get: () => state,
    set(patch: Partial<T>) {
      state = { ...state, ...patch }
      listeners.forEach((l) => l())
    },
    subscribe(listener: Listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

export const uiStore = createStore<UiState>({
  introDone: false,
  sceneReady: false,
  paletteOpen: false,
  terminalOpen: false,
  project: null,
  sound: false,
  mood: 0,
  cursorLabel: null,
})

/** Sets the custom cursor's label only when it actually changes (cheap to call on every pointer move). */
export function setCursorLabel(label: string | null): void {
  if (uiStore.get().cursorLabel !== label) uiStore.set({ cursorLabel: label })
}

/** Select a primitive (or stable) slice of the UI state. */
export function useUi<S>(selector: (state: UiState) => S): S {
  return useSyncExternalStore(uiStore.subscribe, () => selector(uiStore.get()))
}

export function resetUniverse(): void {
  universe.progress = 0
  universe.smooth = 0
  universe.velocity = 0
  universe.chapter = 0
  universe.item = 0
  universe.local = 0
  universe.chapterF = 0
  universe.hoverSkillGroup = -1
  universe.hoverSkillIndex = -1
  universe.hoverProject = -1
  universe.hoverCredential = -1
}
