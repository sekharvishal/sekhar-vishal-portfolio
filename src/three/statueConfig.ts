/**
 * Optional `.glb` with nodes named Base / Torso / LeftArm / RightArm / Head.
 * Set `VITE_STATUE_GLB_URL=/models/statue.glb` in `.env.local` to use it.
 */
export const STATUE_GLB_URL: string | undefined = import.meta.env.VITE_STATUE_GLB_URL || undefined

/** Flag: use the shader clipping plane instead of per-part opacity + scale.y. */
export const USE_CLIP_PLANE = false
