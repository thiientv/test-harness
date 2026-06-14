import './setup-dom';

import { expect, test, describe, beforeAll, afterEach } from "bun:test";
import { render, fireEvent, act } from "@testing-library/react";
import App, { IMAGES } from "./App";

// Track preloaded image URLs
let instantiatedSrcs: string[] = [];

// Custom mock Image constructor to test preloading
class MockImage {
  private _src: string = '';
  public onload: (() => void) | null = null;
  public onerror: (() => void) | null = null;

  constructor() {
    // track creation
  }

  set src(val: string) {
    this._src = val;
    instantiatedSrcs.push(val);
    // Asynchronously call onload to simulate image loaded event
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 10);
  }

  get src() {
    return this._src;
  }
}

// Override Image for preloading check
globalThis.Image = MockImage as any;
if (globalThis.window) {
  globalThis.window.Image = MockImage as any;
}

// Helper to wait for animations or simulated events
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe("TOONHUB Carousel Hero Section Tests", () => {
  beforeAll(() => {
    // Setup default viewport size
    if (globalThis.window) {
      (globalThis.window as any).innerWidth = 1024;
      (globalThis.window as any).innerHeight = 768;
    }
  });

  afterEach(() => {
    instantiatedSrcs = [];
  });

  test("preloads all 4 images on mount", async () => {
    render(<App />);

    // Wait dynamic mount and preload cycle
    await act(async () => {
      await sleep(50);
    });

    expect(instantiatedSrcs.length).toBe(4);
    expect(instantiatedSrcs).toContain(IMAGES[0].imageUrl);
    expect(instantiatedSrcs).toContain(IMAGES[1].imageUrl);
    expect(instantiatedSrcs).toContain(IMAGES[2].imageUrl);
    expect(instantiatedSrcs).toContain(IMAGES[3].imageUrl);
  });

  test("renders all carousel UI elements correctly", async () => {
    const { getByText, getByLabelText, getByRole, getByTestId } = render(<App />);

    await act(async () => {
      await sleep(50);
    });

    // Check brand header logo
    expect(getByText("TOONHUB")).toBeTruthy();

    // Check background ghost text backdrop
    expect(getByText("3D SHAPE")).toBeTruthy();

    // Check current active figurine details
    // Active index defaults to 0 -> IMAGES[0] is "CYBER NEON KAT"
    const activeFigurine = IMAGES[0];
    expect(getByText(activeFigurine.name)).toBeTruthy();
    expect(getByText(activeFigurine.description)).toBeTruthy();
    expect(getByText(activeFigurine.category)).toBeTruthy();

    // Check button navigation controls
    expect(getByLabelText("Previous Figurine")).toBeTruthy();
    expect(getByLabelText("Next Figurine")).toBeTruthy();

    // Check outbound Discover Link
    const discoverLink = getByRole("link", { name: /DISCOVER IT/i });
    expect(discoverLink).toBeTruthy();
    expect(discoverLink.getAttribute("href")).toBe("https://toonhub.example.com/discover");

    // Check all four figurine card containers exist
    IMAGES.forEach((item) => {
      const card = getByTestId(`figurine-card-${item.id}`);
      expect(card).toBeTruthy();
    });
  });

  test("handles index roles and transitions correct styles", async () => {
    const { getByTestId } = render(<App />);

    await act(async () => {
      await sleep(50);
    });

    // 0 is active (center), 1 is right, 2 is back, 3 is left
    const card0 = getByTestId("figurine-card-1");
    const card1 = getByTestId("figurine-card-2");
    const card2 = getByTestId("figurine-card-3");
    const card3 = getByTestId("figurine-card-4");

    expect(card0.getAttribute("data-role")).toBe("center");
    expect(card1.getAttribute("data-role")).toBe("right");
    expect(card2.getAttribute("data-role")).toBe("back");
    expect(card3.getAttribute("data-role")).toBe("left");

    // Check styles for center role card0
    const style0 = card0.getAttribute("style") || "";
    expect(style0).toContain("scale(1)");
    expect(style0).toContain("opacity: 1");

    // Check styles for left role card3
    const style3 = card3.getAttribute("style") || "";
    expect(style3).toContain("scale(0.75)"); // Desktop left style
    expect(style3).toContain("translateX(-220px)");
    expect(style3).toContain("blur(2px)");
  });

  test("can navigate backward and wraps around active image index from 0 to last image index", async () => {
    const { getByText, getByLabelText } = render(<App />);

    await act(async () => {
      await sleep(50);
    });

    const prevBtn = getByLabelText("Previous Figurine");

    await act(async () => {
      fireEvent.click(prevBtn);
    });

    // Wraps around to the final image item at index 3
    expect(getByText(IMAGES[3].name)).toBeTruthy();
  });

  test("recovers and transitions layout opacity even if imagery fails to load", async () => {
    const originalImage = globalThis.Image;

    // Class simulating connection errors
    class MockFailingImage {
      public onerror: (() => void) | null = null;
      set src(_val: string) {
        setTimeout(() => {
          if (this.onerror) this.onerror();
        }, 10);
      }
    }
    globalThis.Image = MockFailingImage as any;

    const { getByTestId } = render(<App />);

    await act(async () => {
      await sleep(50);
    });

    const container = getByTestId("hero-container");
    expect(container.className).toContain("opacity-100");

    globalThis.Image = originalImage;
  });

  test("forces layout loading transition after 3-second fail-safe timeout is reached", async () => {
    const originalImage = globalThis.Image;
    class MockHangingImage {
      set src(_val: string) {} // Never load
    }
    globalThis.Image = MockHangingImage as any;

    const originalSetTimeout = globalThis.setTimeout;
    globalThis.setTimeout = function(cb: Function, ms: number) {
      if (ms === 3000) return originalSetTimeout(cb, 0); // speed up
      return originalSetTimeout(cb, ms);
    } as any;

    const { getByTestId } = render(<App />);

    await act(async () => {
      await sleep(20);
    });

    const container = getByTestId("hero-container");
    expect(container.className).toContain("opacity-100");

    globalThis.Image = originalImage;
    globalThis.setTimeout = originalSetTimeout;
  });

  test("locks navigation during animation and works afterwards", async () => {
    const { getByText, getByLabelText } = render(<App />);

    await act(async () => {
      await sleep(50);
    });

    const nextBtn = getByLabelText("Next Figurine");

    // Click next once
    await act(async () => {
      fireEvent.click(nextBtn);
    });

    // Now active index should be 1 (Lego Cosmic Cadet)
    expect(getByText(IMAGES[1].name)).toBeTruthy();

    // Click next again immediately while animating (isAnimating is true)
    await act(async () => {
      fireEvent.click(nextBtn);
    });

    // Active index should STILL be 1 because of navigation lock
    expect(getByText(IMAGES[1].name)).toBeTruthy();

    // Wait for animation to finish (650ms)
    await act(async () => {
      await sleep(700);
    });

    // Click next again after animation duration
    await act(async () => {
      fireEvent.click(nextBtn);
    });

    // Active index should now advance to 2
    expect(getByText(IMAGES[2].name)).toBeTruthy();
  });

  test("responds to screen resizing below 640px threshold", async () => {
    const { getByTestId } = render(<App />);

    await act(async () => {
      await sleep(50);
    });

    // Resize screen to mobile width
    act(() => {
      if (globalThis.window) {
        (globalThis.window as any).innerWidth = 480;
        globalThis.window.dispatchEvent(new window.Event("resize"));
      }
    });

    // Force a small wait to let resize observer react
    await act(async () => {
      await sleep(50);
    });

    const leftCard = getByTestId("figurine-card-4"); // Role left
    const style = leftCard.getAttribute("style") || "";

    // Mobile width style should contain: translateX(-80px) and scale(0.65)
    expect(style).toContain("translateX(-80px)");
    expect(style).toContain("scale(0.65)");
  });
});
