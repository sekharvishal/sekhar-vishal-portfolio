import { useEffect } from 'react'
import { blip, setAmbientChapter, setAmbientEnergy } from '../ambientAudio'
import { usePlace } from '../hooks'
import { universe, useUi } from '../universeStore'

/** Feeds scroll energy, chapter changes and hover blips into the ambient engine (no-ops while muted). */
export function AudioBridge() {
  const { chapter } = usePlace()
  const sound = useUi((s) => s.sound)
  const label = useUi((s) => s.cursorLabel)

  useEffect(() => {
    setAmbientChapter(chapter)
  }, [chapter, sound])

  useEffect(() => {
    if (!sound) return
    const id = window.setInterval(() => setAmbientEnergy(Math.min(Math.abs(universe.velocity) / 60, 1)), 120)
    return () => window.clearInterval(id)
  }, [sound])

  useEffect(() => {
    if (label) blip(420 + (label.length % 7) * 70)
  }, [label])

  return null
}
