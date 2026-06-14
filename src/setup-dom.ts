import { Window } from 'happy-dom';

const windowInstance = new Window();
const documentInstance = windowInstance.document;

// Attach mock globals
globalThis.window = windowInstance as any;
globalThis.document = documentInstance as any;
globalThis.navigator = windowInstance.navigator as any;
globalThis.HTMLCanvasElement = windowInstance.HTMLCanvasElement as any;
globalThis.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0) as any;
};
globalThis.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

// Mock canvas API
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = (() => {
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

  HTMLCanvasElement.prototype.toDataURL = (() => {
    return 'data:image/png;base64,mocked';
  }) as any;
}
