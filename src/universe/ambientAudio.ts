/**
 * Procedural ambient sound (no audio files): a slowly breathing chord whose
 * root follows the chapter and whose brightness follows scroll speed.
 * Off by default; only started from a user gesture.
 */
const ROOTS = [55, 61.74, 65.41, 73.42, 82.41, 49]

interface Voice {
  osc: OscillatorNode
  mult: number
}

let ctx: AudioContext | null = null
let master: GainNode | null = null
let filter: BiquadFilterNode | null = null
let voices: Voice[] = []
let lfo: OscillatorNode | null = null
let running = false
let chapter = 0

export function isAmbientRunning(): boolean {
  return running
}

export function startAmbient(): void {
  if (running || typeof window === 'undefined') return
  const Ctor = window.AudioContext
  if (!Ctor) return
  ctx = ctx ?? new Ctor()
  void ctx.resume()

  master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 520
  filter.Q.value = 4
  filter.connect(master)

  const make = (type: OscillatorType, mult: number, detune: number, gain: number) => {
    const osc = ctx!.createOscillator()
    osc.type = type
    osc.frequency.value = ROOTS[chapter % ROOTS.length] * mult
    osc.detune.value = detune
    const g = ctx!.createGain()
    g.gain.value = gain
    osc.connect(g)
    g.connect(filter!)
    osc.start()
    voices.push({ osc, mult })
  }
  make('sawtooth', 1, -6, 0.16)
  make('sawtooth', 1, 7, 0.16)
  make('sine', 1.5, 0, 0.22)
  make('triangle', 2, 3, 0.12)
  make('sine', 3, 0, 0.05)

  lfo = ctx.createOscillator()
  lfo.frequency.value = 0.07
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 160
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)
  lfo.start()

  master.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 2.5)
  running = true
}

export function stopAmbient(): void {
  if (!running || !ctx || !master) return
  const fadeEnd = ctx.currentTime + 0.8
  master.gain.cancelScheduledValues(ctx.currentTime)
  master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
  master.gain.linearRampToValueAtTime(0, fadeEnd)
  const toStop = [...voices.map((v) => v.osc), ...(lfo ? [lfo] : [])]
  const node = master
  window.setTimeout(() => {
    toStop.forEach((o) => {
      try {
        o.stop()
      } catch {
        /* already stopped */
      }
    })
    node.disconnect()
  }, 900)
  voices = []
  lfo = null
  running = false
}

export function setAmbientChapter(index: number): void {
  chapter = index
  if (!running || !ctx) return
  const root = ROOTS[index % ROOTS.length]
  voices.forEach((v) => v.osc.frequency.setTargetAtTime(root * v.mult, ctx!.currentTime, 1.2))
}

/** 0..1 scroll energy: opens the filter while the visitor is moving. */
export function setAmbientEnergy(energy: number): void {
  if (!running || !ctx || !filter) return
  filter.frequency.setTargetAtTime(380 + energy * 1800, ctx.currentTime, 0.3)
}

export function blip(freq = 660): void {
  if (!running || !ctx || !master) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.0001, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22)
  osc.connect(gain)
  gain.connect(master)
  osc.start()
  osc.stop(ctx.currentTime + 0.25)
}
