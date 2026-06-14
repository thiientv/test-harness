# CLAUDE.md

## Build & Test Commands
* Run development server: `bun run dev`
* Run type checker: `bun run type-check`
* Run build: `bun run build`
* Run tests: `bun test`

## Setup & Testing Guidelines
* The test suite uses Bun's test runner (`bun:test`) alongside `@testing-library/react`.
* DOM environments must be set up by importing `./setup-dom` prior to importing `@testing-library/react`. This bootstraps Happy DOM globals to prevent hoisted module warnings.
* Keep carousel actions responsive (handles width thresholds for mobile styling config).
