# Living AI Neural Network Developer Portfolio

An interactive, highly optimized 3D Digital Brain developer portfolio powered by Next.js, React Three Fiber, Framer Motion, Tailwind CSS, and Vitest.

## Features

- **3D Living AI Neural Network**: Dynamic interactive node-graph representing skills, archive, projects, and contacts with cursor physics repulsion.
- **Scroll Synchronization Spline**: CSS pages scrolling translates to a smooth 3D camera flight path down the network pathways.
- **Robust SSR Hydration Safety**: Dynamically imports WebGL canvas to avoid hydration mismatches.
- **Seamless 2D Fallback**: If WebGL/GPU acceleration is unavailable or a crash triggers, gracefully rolls back to a fully structured 2D alternative representation.
- **Instanced Mesh Optimization**: Uses React Three Fiber instanced meshes to keep GPU vertex bounds optimal.

## Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh/) installed.

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

### Production Build

```bash
bun run build
```

### Testing & Verification

Run the test suite using Vitest:

```bash
bun run test
```

For TS type checks:

```bash
bun run type-check
```

## Architectural Design

- **States Coordinator**: Managed in React Context under `src/context/NeuralStateContext.tsx` syncing both scroll positions and layout categories.
- **WebGL Checker**: Verification utility in `src/utils/webgl-check.ts` that safely determines rendering layers.
- **ErrorBoundary**: Error isolation component (`src/components/ErrorBoundary.tsx`) featuring a physical bypass button to force-load the 2D layout if renderer errors trigger.
