# CLAUDE.md Coding Guidelines

## Naming Conventions
- React components must be exported as `default` function components.
- File names for UI elements and components use PascalCase (e.g., `NeuralCanvas.tsx`).
- File names for utilities and helpers use kebab-case (e.g., `webgl-check.ts`).
- Hooks use camelCase (e.g., `useNeuralState.ts`).

## Architecture Constraints
- Dynamic 3D graphics elements using React Three Fiber must be loaded dynamically in client-side packages with `{ ssr: false }` to prevent hydration mismatches.
- GPU Instanced rendering (`THREE.InstancedMesh`) must be preferred over individual meshes where node counts exceed 50 items.
- Avoid large local or remote assets (.gltf, .obj) in favor of mathematical vertex clusters and procedural models.
- Damping logic should utilize delta time buffers for frame-rate independence.

## Styling Rules
- Primary colors are based on the neon network spectrum:
  - Dark Core Background: `#010103` (CSS/Tailwind: `darkBg`)
  - Electric Synaptic Blue: `#00f0ff` (CSS/Tailwind: `neonCyan`)
  - Volumetric Purple: `#bd00ff` (CSS/Tailwind: `neonPurple`)
  - Signal White: `#ffffff`
- Standard layout sections require glassmorphic card configurations with backdrop blurs.

## Commands
- Run development server: `bun run dev`
- Build production bundle: `bun run build`
- Type-check compilation: `bun run type-check`
- Execute test suites: `bun run test`
