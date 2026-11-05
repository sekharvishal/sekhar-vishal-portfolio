/**
 * Optional `.glb` vehicle model, swapped in for the procedural car.
 * Set `VITE_VEHICLE_GLB_URL=/models/vehicle.glb` in `.env.local` to use it;
 * if it fails to load, the procedural car is used instead.
 */
export const VEHICLE_GLB_URL: string | undefined = import.meta.env.VITE_VEHICLE_GLB_URL || undefined
