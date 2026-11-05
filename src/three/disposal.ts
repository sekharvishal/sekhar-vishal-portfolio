import type { BufferGeometry, Material, Mesh, Object3D, Texture } from 'three'

/**
 * WebGL resources live outside JS garbage collection: dropping a reference does
 * not free the GPU buffers, programs or textures. These helpers release them
 * explicitly in `useEffect` cleanups.
 */

function isTexture(value: unknown): value is Texture {
  return typeof value === 'object' && value !== null && (value as Texture).isTexture === true
}

/** Disposes a material and every texture it references (map, normalMap, envMap...). */
export function disposeMaterial(material: Material | Material[]): void {
  if (Array.isArray(material)) {
    material.forEach(disposeMaterial)
    return
  }
  for (const value of Object.values(material)) {
    if (isTexture(value)) value.dispose()
  }
  material.dispose()
}

export function disposeGeometry(geometry: BufferGeometry | Iterable<BufferGeometry>): void {
  if ('dispose' in geometry && typeof geometry.dispose === 'function') {
    geometry.dispose()
    return
  }
  for (const g of geometry as Iterable<BufferGeometry>) g.dispose()
}

/** Traverses an object tree and disposes all geometries, materials and textures. */
export function disposeObject(root: Object3D): void {
  root.traverse((node) => {
    const mesh = node as Mesh
    if (mesh.geometry) mesh.geometry.dispose()
    if (mesh.material) disposeMaterial(mesh.material)
  })
}
