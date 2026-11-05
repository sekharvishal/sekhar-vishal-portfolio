#!/usr/bin/env node
/**
 * Compresses a statue .glb for the web with Meshopt + vertex quantization.
 *
 *   npm run compress-glb -- path/to/statue-source.glb public/models/statue.glb
 *
 * Why Meshopt (not Draco): it decodes much faster in the browser, keeps vertex
 * order cache-friendly, and also compresses animation / morph data. Quantization
 * (KHR_mesh_quantization) stores positions / normals / UVs as 8-16 bit integers,
 * which cuts download size AND the VRAM used on the GPU.
 *
 * Requirements: the source model must contain nodes named exactly
 *   Base, Torso, LeftArm, RightArm, Head
 * Then set VITE_STATUE_GLB_URL=/models/statue.glb in .env.local.
 *
 * Uses @gltf-transform/cli through npx, so nothing is added to package.json.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const [input, output = 'public/models/statue.glb'] = process.argv.slice(2)

if (!input) {
  console.error('Usage: npm run compress-glb -- <input.glb> [output.glb]')
  process.exit(1)
}
if (!existsSync(input)) {
  console.error(`Input file not found: ${input}`)
  process.exit(1)
}

mkdirSync(dirname(resolve(output)), { recursive: true })

const args = [
  '--yes',
  '@gltf-transform/cli',
  'optimize',
  input,
  output,
  '--compress',
  'meshopt', // EXT_meshopt_compression
  '--texture-compress',
  'webp', // textures are usually the biggest VRAM consumers
  '--simplify',
  'false', // keep the authored silhouette
]

console.log(`> npx ${args.join(' ')}`)
const result = spawnSync('npx', args, { stdio: 'inherit', shell: process.platform === 'win32' })
process.exit(result.status ?? 1)
