# CLAUDE.md Guide

System details and styling conventions for this project.

## Development Commands
- **Initialize dev environment**: `bun install`
- **Start dev server**: `bun run dev`
- **Run Type Checks**: `bun run type-check`
- **Run Code Linter**: `bun run lint`
- **Verify Unit Tests**: `bun run test`
- **Build assets**: `bun run build`

## Codebase Principles
- **Clean Structure**: Modular component organization inside `src/components/`.
- **Pure Helpers**: Write testable helper modules without React Hooks ties when possible (e.g. `src/utils/terminalEvaluator.ts`).
- **WebGL Color Resolution**: Always use color hex configurations matching the Tailwind theme (`src/constants/theme.ts`) in pointLight/meshBasic/StandardMaterials.
- **Camera Controls Tween**: Toggle OrbitControls state when starting and completing camera lerp animations to prevent user interaction fights.
