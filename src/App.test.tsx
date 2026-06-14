import { describe, test, expect, beforeAll, beforeEach, afterEach } from 'bun:test';
import './setup-dom.ts';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Set up globals before running tests
beforeAll(() => {
  // Ensure document and window have basic specs set up
  window.innerWidth = 1024;
  window.innerHeight = 768;
});

describe('Lithos Hero Section', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('renders logo, text headings and layers list structure', async () => {
    const root = createRoot(container);
    root.render(<App />);

    // Wait short tick for React re-render
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Logo validation
    const logo = container.querySelector('[data-testid="lithos-logo"]');
    expect(logo).not.toBeNull();

    // Brand naming text validation
    const headerText = container.textContent;
    expect(headerText).toContain('LITHOS');
    
    // Check main titles are present
    expect(headerText).toContain('Layers Hold');
    expect(headerText).toContain('t a l e s   o f   t i m e');

    // Desktop nav menu presence verification
    expect(headerText).toContain('Explore Folds');
    expect(headerText).toContain('Stratigraphy');
  });

  test('applies correct custom staggered animation delays in heading spans', async () => {
    const root = createRoot(container);
    root.render(<App />);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const span1 = container.querySelector('.animate-hero-fade-up[style*="animation-delay"]');
    expect(span1).not.toBeNull();
  });

  test('toggles mobile menu drawer on menu click', async () => {
    const root = createRoot(container);
    root.render(<App />);

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Initially mobile menu is closed, let's find the toggle button
    const toggleBtn = container.querySelector('button[aria-label="Toggle menu"]');
    expect(toggleBtn).not.toBeNull();

    // Click to open mobile menu
    toggleBtn?.dispatchEvent(new window.Event('click', { bubbles: true }));

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Verify it is interactive or updates layout
    const drawerNav = container.querySelector('.md\\:hidden nav');
    expect(drawerNav).not.toBeNull();
  });

  test('verifies custom canvas context fallback and coordinates update', async () => {
    let mockContextCreated = false;

    // Redefine prototype on test run to trace calls
    HTMLCanvasElement.prototype.getContext = (() => {
      mockContextCreated = true;
      return {
        clearRect: () => {},
        createRadialGradient: () => ({
          addColorStop: () => {}
        }),
        beginPath: () => {},
        arc: () => {},
        fill: () => {}
      } as any;
    }) as any;

    const root = createRoot(container);
    root.render(<App />);

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Dispatch mousemove event on the main hero container
    const heroContainer = container.querySelector('.relative.w-full.h-\\[100dvh\\]');
    expect(heroContainer).not.toBeNull();

    heroContainer?.dispatchEvent(
      new window.MouseEvent('mousemove', {
        clientX: 400,
        clientY: 300,
        bubbles: true
      })
    );

    // Let the smooth lerp tick trigger a draft update
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockContextCreated).toBe(true);
  });
});
