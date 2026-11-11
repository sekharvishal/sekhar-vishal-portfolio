import { Quaternion, Vector3 } from 'three'

/**
 * Mutable, NON-reactive store for the Neon Run variant. Mirrors `scrollStore.ts`
 * but is kept entirely separate so the two experiences never share mutable
 * per-frame state (written by `HomePageCity`'s scroll bridge, read inside `useFrame`).
 */
export const scrollStoreCity = {
  /** Lenis-smoothed page scroll progress, 0..1. */
  progress: 0,
  /** Lenis scroll velocity (px / frame); 0 when the page is idle. */
  velocity: 0,
  /** Progress after extra damping, owned by VehicleRig (used by DoF / effects). */
  smooth: 0,
  /** Reserved for future detail routes: parks the car and ignores page scroll. */
  parked: false,
}

/**
 * Grand Finale chase-camera offsets. GSAP tweens these plain numbers;
 * CameraRigCity reads them in useFrame, so GSAP never fights the render loop.
 */
export const carFinaleState = {
  /** Extra distance the camera retreats behind the car. */
  pullBack: 0,
  /** Extra height the camera lifts above the car. */
  liftUp: 0,
  /** 0..1 blend of the look target toward the car (vs. the look-ahead point). */
  focus: 0,
  /** Field-of-view delta in degrees. */
  fov: 0,
}

/**
 * Mutable world-space pose of the car, written by `VehicleRig` and read every
 * frame by the chase camera and the post-processing focus target.
 */
export const carPose = {
  position: new Vector3(),
  /** Pure heading/tangent orientation -- deliberately roll-free, so the chase camera never inherits the car's visual lean. */
  quaternion: new Quaternion(),
  /** Smoothed 0..1, drives wheel spin, FOV and chromatic aberration. */
  speed: 0,
}
