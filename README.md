# Sekhar Vishal: Cinematic 3D Portfolio

A scroll-triggered 3D portfolio. Scrolling flies a virtual camera up a spiral spline around a statue that assembles itself floor by floor. At the end the camera pulls back (the "Grand Finale") and a permanent dashboard summarises the profile.

Two themes, switchable from the header: **Obsidian & Gold** (dark) and **Ivory & Ink** (light). The choice is stored in `localStorage`; the first visit follows the system preference.

> This is a standalone project. It contains no company code, screenshots or confidential architecture.

## Stack

React 18 · TypeScript (strict) · Vite · Tailwind CSS · Three.js · React Three Fiber · drei · `@react-three/postprocessing` · GSAP + ScrollTrigger · Lenis · React Router · Vitest

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc -b
npm run lint       # eslint
npm test           # vitest
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

Append `?debug` to the URL to draw the camera flight path in the scene.

## How it works

| Piece | File | Notes |
|-------|------|-------|
| Smooth scroll | `src/app/SmoothScroll.tsx` | Lenis with `autoRaf: false`, driven by the GSAP ticker; `lagSmoothing(0)`; `lenis.on('scroll', ScrollTrigger.update)` |
| Shared state | `src/state/scrollStore.ts` | Mutable, non-reactive progress / velocity. Read in `useFrame`; never in React state |
| Camera path | `src/three/cameraPath.ts` | 10-point spiral, `CatmullRomCurve3` (tension 0.5), Frenet-style frame, degenerate-tangent guard |
| Camera rig | `src/three/CameraRig.tsx` | Pose per frame, slerp smoothing, idle breathing, GSAP finale tween at progress >= 0.95 (hysteresis 0.93) |
| Statue | `src/three/AvatarStatue.tsx` | Base / Torso / LeftArm / RightArm / Head, ScrollTrigger-scrubbed opacity + `scale.y`; optional clipping-plane mode; optional `.glb` |
| Dust | `src/three/ParticleField.tsx` | One `InstancedMesh`, one draw call |
| Post-processing | `src/three/Effects.tsx` | Bloom (1.5 / 0.8), spline-ahead depth of field, velocity-driven chromatic aberration |
| Memory | `src/three/disposal.ts` | Explicit `.dispose()` for geometries, materials, textures in `useEffect` cleanups |
| Overlay | `src/ui/Overlay.tsx` | `pointer-events: none` root; glass cards re-enable pointer events; scrubbed fades per section |
| Dashboard | `src/ui/Dashboard.tsx` | Revealed at finale and kept; in-flow in static mode |

### Statue assembly ranges

Base 0.0-0.2 · Torso 0.2-0.45 · LeftArm 0.45-0.6 · RightArm 0.6-0.75 · Head 0.8-0.9 (`src/state/scrollMap.ts`).

### Quality tiers and fallbacks

- `useDeviceTier` classifies the device: **high** (DoF + bloom + shadows, 1500 dust), **medium** (no DoF), **low** (no post-processing or shadows, 300 dust). DPR is capped at 1.75.
- **`prefers-reduced-motion`** or **no WebGL**: no canvas, no camera flight, no scroll animations. The same content renders as plain sections over a static gradient, with the dashboard in normal flow.
- Detail routes (`/projects/:slug`) keep the canvas mounted; the camera parks at a dim idle pose.

## Editing content

All copy lives in `src/data/content.ts` (types in `src/data/types.ts`).

- Replace the placeholder email and profile URLs in `profile` (search for `TODO`).
- Replace `public/resume.pdf` with your real résumé.
- Add a `verifyUrl` and set `verified: true` on a credential once its exact title is confirmed.
- Add `links.repo` / `links.demo` to a project when public.
- Fill in a case study's `result` only with real evidence. Nothing is invented.
- Update `index.html` (`canonical`, `og:image`) and the Open Graph image `public/og.png` before deploying.

## Theming

Palettes are CSS variables in `src/index.css` (`:root[data-theme='dark' | 'light']`). Scene values (background, fog, lights, statue material, bloom) are in `src/app/theme.ts` (`SCENE_THEMES`) so the 3D scene follows the UI theme.

## Using your own statue model (optional)

1. Author a model with nodes named exactly `Base`, `Torso`, `LeftArm`, `RightArm`, `Head`.
2. Compress it: `npm run compress-glb -- path/to/source.glb public/models/statue.glb` (Meshopt + quantization through `@gltf-transform/cli`).
3. Create `.env.local` with `VITE_STATUE_GLB_URL=/models/statue.glb`.

If the file fails to load, the procedural statue is used. To try the shader clipping-plane reveal instead of opacity + scale, set `USE_CLIP_PLANE = true` in `src/three/statueConfig.ts`.

## Deploy

**Vercel**: import the repo; framework preset *Vite*; build `npm run build`; output `dist`. Add a rewrite so deep links work:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

**Netlify**: build `npm run build`, publish `dist`, and add `public/_redirects` containing `/* /index.html 200`.

## Alternate scene: the City Drive (`/city`)

A second, independent 3D experience lives at `/city`, picked from the header's **City Drive** / **Statue mode** toggle (next to the theme switch) -- pick whichever fits your mood. It never touches the statue scene: everything lives in new files (`src/three-city/`, `src/state/scrollMapCity.ts`, `src/state/scrollStoreCity.ts`, `src/ui/OverlayCity.tsx`, `src/pages/HomePageCity.tsx`), with only four pure-additive edits to existing files (`routes.tsx` gains a route, `Header.tsx` gains the toggle link, `Layout.tsx` mounts `SceneCity` instead of `Scene` on `/city`, `useAnchorNav` also scrolls in place on `/city`).

Scrolling drives a neon car along a winding road through a small city, past four hero buildings, followed by a GTA-style chase camera:

| Piece | File | Notes |
|-------|------|-------|
| Road | `src/three-city/roadPath.ts` | 12-point winding XZ-plane spline, `CatmullRomCurve3` (tension 0.5), `frameAt(t)` (Frenet-style tangent/normal/binormal -> quaternion, degenerate-tangent guard), `buildRoadGeometry` |
| Scroll stops | `src/state/scrollMapCity.ts` | `STOPS` at t = 0.22 / 0.46 / 0.70 / 0.95, each with a dwell window; `remap(p)` holds the car at each stop and advances it in between |
| City | `src/three-city/cityLayout.ts` + `CityScape.tsx` | Seeded, deterministic background-building + street-lamp placement (kept clear of the road corridor), rendered as two `InstancedMesh`es with a canvas-generated emissive window texture |
| Hero buildings | `src/three-city/HeroBuildings.tsx` | SecureW2 tower, Skills Matrix cube-grid, Edu Eats campus, Grand Finale palace-tower, placed at the four stops, alternating sides of the road |
| Car | `src/three-city/VehicleRig.tsx` | Procedural neon car (chassis, cabin, spinning wheels, headlights/taillights); position from `curve.getPointAt(remap(progress))`, orientation from the road frame, arcade-style body roll on turns; optional `.glb` slot |
| Chase camera | `src/three-city/CameraRigCity.tsx` + `chaseCamera.ts` | Trails behind and above the car (`computeChaseTarget`, pure and unit-tested), `MathUtils.damp` smoothing, look-ahead target, speed-based FOV, GSAP pull-back-and-up at the Grand Finale |
| Overlay | `src/ui/OverlayCity.tsx` | Same `pointer-events: none` + per-panel scroll-scrubbed fade mechanism as `Overlay.tsx`, reusing every existing section component and `Dashboard.tsx` unchanged, grouped under four "Stop 0N" chapter markers |

**Adding a `vehicle.glb`**: author it facing local -Z, then set `VITE_VEHICLE_GLB_URL=/models/vehicle.glb` in `.env.local` (same convention as the statue's `VITE_STATUE_GLB_URL`). If it fails to load, the procedural car is used instead.

**Editing the stops or hero buildings**: change `STOPS` in `src/state/scrollMapCity.ts` (progress + dwell window) and the matching `placementAt(...)` call in `HeroBuildings.tsx`'s `HeroBuildings` component. To change the road shape itself, edit the control points in `roadPath.ts` (`ROAD_POINTS`); everything downstream (geometry, layout, buildings, camera) re-derives from the curve.

## Facts to verify before publishing

- [ ] Exact titles (and IDs / URLs) of all 9 credentials, then set `verified: true`.
- [ ] Whether "Tata Cybersecurity / Security Analyst" and "TCS IAM" are the same or separate programs.
- [ ] Student Information Management System: technologies used (currently `TODO: confirm`), your contribution and one real challenge.
- [ ] Which Edu Eats features are implemented (currently labelled **In Development**).
- [ ] E-Doctor Appointment System: repository / demo links, if public.
- [ ] AI Agent Memory: keep as **Technical Exploration** unless a working system exists; add notes if you ran experiments.
- [ ] SecureW2 case studies: keep generic (problem, approach, result). No proprietary code, screenshots or architecture.
- [ ] Email, LinkedIn, GitHub URLs and the résumé file.
- [ ] Stats ("~1 yr", "6 mo", "3 projects", "9 credentials") still match reality on the day you publish.
