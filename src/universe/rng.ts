/** Small deterministic PRNG so the world looks the same on every visit. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Evenly spread points on a unit sphere (Fibonacci lattice). */
export function fibonacciSphere(count: number): [number, number, number][] {
  const golden = Math.PI * (3 - Math.sqrt(5))
  const out: [number, number, number][] = []
  for (let i = 0; i < count; i++) {
    const y = count === 1 ? 0 : 1 - ((i + 0.5) / count) * 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const phi = i * golden
    out.push([Math.cos(phi) * r, y, Math.sin(phi) * r])
  }
  return out
}
