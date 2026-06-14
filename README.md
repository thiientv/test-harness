# TOONHUB - Figurine Carousel Hero Section

A modern, immersive, and interactive full-viewport 3D figurine carousel hero section. Developed using React, TypeScript, Tailwind CSS, and Vite.

## Highlights
- **Interactive 3D Carousel**: 4 unique figurines (Cyber Neon Kat, Lego Cosmic Cadet, Funk Vortex Boy, Retro Chrome Bot) with dynamic background transitions and accent colors.
- **Micro-interactions**: Circle glass platter card layout, hover accent glows, navigation animation locks (650ms), and custom grain texture overlay.
- **Responsive Design**: Auto-resizes slide offsets for screens below `640px` (mobile viewport mode).
- **Environment**: Built and tested via **Bun**.

## Development
```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Run test suite
bun test
```

## Structure
- `src/App.tsx`: Main component housing state tracker, preload effects, layout configuration, and styles.
- `src/App.test.tsx`: Carousel state/event tests.
- `src/setup-dom.ts`: Bootstrappes Happy DOM globals.
