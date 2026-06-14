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
  let originalGetContext: any;
  let originalToDataURL: any;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    // Keep reference to restore prototypes
    originalGetContext = HTMLCanvasElement.prototype.getContext;
    originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
  });

  afterEach(() => {
    document.body.removeChild(container);
    // Restore original prototype methods to prevent test leakage
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    HTMLCanvasElement.prototype.toDataURL = originalToDataURL;
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

  test('toggles mobile menu drawer on menu click and handles close links', async () => {
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

    // Medium Issue 3: Untested Mobile Menu Close Action
    const foldsLink = container.querySelector('.md\\:hidden nav a[href="#folds"]');
    expect(foldsLink).not.toBeNull();
    foldsLink?.dispatchEvent(new window.Event('click', { bubbles: true }));

    await new Promise((resolve) => setTimeout(resolve, 50));

    // The drawer nav should no longer be present or rendered because isMobileMenuOpen is false
    const drawerNavClosed = container.querySelector('.md\\:hidden nav');
    expect(drawerNavClosed).toBeNull();
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

  test('does not crash and activates fallback when canvas context throws (Error Handling / High Issue 5)', async () => {
    const originalWarn = console.warn;
    let warnMockCalled = false;
    console.warn = () => {
      warnMockCalled = true;
    };

    HTMLCanvasElement.prototype.getContext = () => {
      throw new Error('Canvas execution error simulation');
    };

    const root = createRoot(container);
    root.render(<App />);

    // Trigger updateMask via lifecycle mount
    await new Promise((resolve) => setTimeout(resolve, 50));

    const heroContainer = container.querySelector('.relative.w-full.h-\\[100dvh\\]');
    expect(heroContainer).not.toBeNull();
    
    // Check if canvas-failed data attribute is correctly set to true
    expect(heroContainer?.getAttribute('data-canvas-failed')).toBe('true');
    expect(warnMockCalled).toBe(true);

    console.warn = originalWarn;
  });

  test('updates active simulation layer preset on button toggle (Medium Issue 2)', async () => {
    const root = createRoot(container);
    root.render(<App />);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const heroContainer = container.querySelector('.relative.w-full.h-\\[100dvh\\]');
    expect(heroContainer).not.toBeNull();
    expect(heroContainer?.getAttribute('data-active-index')).toBe('0');

    // Find Probe System desktop action button
    const probeBtn = [...container.querySelectorAll('button')].find(
      (btn) => btn.textContent?.trim() === 'Probe System'
    );
    expect(probeBtn).toBeDefined();

    // Click it to toggle
    probeBtn?.dispatchEvent(new window.Event('click', { bubbles: true }));

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(heroContainer?.getAttribute('data-active-index')).toBe('1');
  });

  test('handles canvas mouse leave transition behavior (Low Issue 3)', async () => {
    const root = createRoot(container);
    root.render(<App />);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const heroContainer = container.querySelector('.relative.w-full.h-\\[100dvh\\]');
    expect(heroContainer).not.toBeNull();

    // Move mouse to custom coords first
    heroContainer?.dispatchEvent(
      new window.MouseEvent('mousemove', {
        clientX: 200,
        clientY: 200,
        bubbles: true
      })
    );
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Leaving container should revert target coordinates back to center (innerWidth / 2 = 512)
    heroContainer?.dispatchEvent(
      new window.MouseEvent('mouseleave', {
        bubbles: true
      })
    );
    // Let lerp tick settle
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Check footer coords text is centered (approx 512)
    const footerSpan = container.querySelector('footer span');
    expect(footerSpan).not.toBeNull();
    // It should be near 512 due to center alignment
    const xVal = Number(footerSpan?.textContent);
    expect(xVal).toBeGreaterThan(500);
    expect(xVal).toBeLessThan(525);
  });
});
