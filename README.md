# 3D Interactive Developer Portfolio

An immersive, futuristic interactive 3D workstation built using React, Three.js, React Three Fiber (R3F), and `@react-three/drei`.

## Features
- **Interactive Workstation**: Seamlessly pan/rotate/zoom around a desk scene with OrbitControls.
- **OS Terminal Simulator**: Click the monitor screen to type and run mock developer console interactive shell utilities.
- **Skill Matrix Mechanical Keyboard**: Inspect customized technologies breakdown based on color-coded mechanical keys categories.
- **Live Build Project Server Rack**: Check individual server units drawer elements to preview logs and repository descriptors.
- **Robust Failure Resilience**: Full layout-level React Error Boundary and browser WebGL capability checker integrated.

## Getting Started

### Prerequisites
Make sure you have [Bun](https://bun.sh) installed.

### Installation
Clone repository and fetch dependency modules:
```bash
bun install
```

### Dev Mode
Execute real-time development pipeline server:
```bash
bun run dev
```

### Verification Checks
Validate system compilation and routing constraints:
```bash
# Type Check
bun run type-check

# Linting Checks
bun run lint

# Run Unit Tests
bun run test

# Production Compiling
bun run build
```

## Technologies Stack
- **Library/Framework**: React 18, TypeScript
- **Runtime Compiler**: Vite
- **Graphics Rendering**: Three.js, React Three Fiber, Drei helpers
- **Animations Interp**: Maath lerp damping
- **Styles**: CSS variables matching Tailwind colors
