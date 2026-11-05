/**
 * Mutable, NON-reactive store. Written by Lenis / GSAP callbacks, read inside
 * `useFrame` and GSAP tweens. Never put this in React state: updating state
 * 60 times a second would re-render the tree on every frame.
 */
export const scrollStore = {
  /** Lenis-smoothed page scroll progress, 0..1. */
  progress: 0,
  /** Lenis scroll velocity (px / frame); 0 when the page is idle. */
  velocity: 0,
  /** Progress after extra damping, owned by CameraRig (used by DoF / effects). */
  smooth: 0,
  /** True on detail routes: the camera parks and ignores page scroll. */
  parked: false,
}

/**
 * Offsets applied on top of the spline pose for the Grand Finale. GSAP tweens
 * these plain numbers; CameraRig reads them in useFrame, so GSAP never fights
 * the render loop for control of the camera.
 */
export const finaleState = {
  /** Distance the camera retreats along its view axis. */
  pullBack: 0,
  /** 0..1 blend of the view direction toward the statue's centre. */
  focus: 0,
  /** Field-of-view delta in degrees. */
  fov: 0,
}
