import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isWebGLAvailable } from './webgl-check';

describe('isWebGLAvailable', () => {
  const originalWindow = globalThis.window;
  const originalWebGLRenderingContext = globalThis.WebGLRenderingContext;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.window = originalWindow;
    globalThis.WebGLRenderingContext = originalWebGLRenderingContext;
  });

  it('should return false if window is undefined (SSR context)', () => {
    // @ts-ignore
    delete globalThis.window;
    expect(isWebGLAvailable()).toBe(false);
  });

  it('should return false if WebGLRenderingContext is missing', () => {
    // Ensure window is defined but WebGLRenderingContext is not
    globalThis.window = {} as any;
    // @ts-ignore
    delete globalThis.WebGLRenderingContext;
    expect(isWebGLAvailable()).toBe(false);
  });

  it('should return true if WebGL context can be created', () => {
    globalThis.window = {
      WebGLRenderingContext: {}
    } as any;

    const mockContext = {};
    const mockCanvas = {
      getContext: vi.fn().mockImplementation((type) => {
        if (type === 'webgl' || type === 'experimental-webgl') {
          return mockContext;
        }
        return null;
      }),
    };

    globalThis.document = {
      createElement: vi.fn().mockReturnValue(mockCanvas)
    } as any;

    expect(isWebGLAvailable()).toBe(true);
    expect(mockCanvas.getContext).toHaveBeenCalledWith('webgl');
  });

  it('should return false if WebGL context creation fails', () => {
    globalThis.window = {
      WebGLRenderingContext: {}
    } as any;

    const mockCanvas = {
      getContext: vi.fn().mockImplementation(() => {
        return null;
      }),
    };

    globalThis.document = {
      createElement: vi.fn().mockReturnValue(mockCanvas)
    } as any;

    expect(isWebGLAvailable()).toBe(false);
  });

  it('should return false if document.createElement throws', () => {
    globalThis.window = {
      WebGLRenderingContext: {}
    } as any;

    globalThis.document = {
      createElement: vi.fn().mockImplementation(() => {
        throw new Error('Canvas not supported');
      })
    } as any;

    expect(isWebGLAvailable()).toBe(false);
  });
});
