import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
} as any;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock scrollTo
global.scrollTo = () => {};

// Provide rAF/cAF as setTimeout-based polyfills. Configurable so vitest's
// jsdom env teardown can delete them; a fresh setupFile run re-installs them
// for the next test file.
const rafImpl = ((cb: FrameRequestCallback) =>
  setTimeout(() => cb(performance.now()), 0) as unknown as number) as typeof requestAnimationFrame;
const cafImpl = ((id: number) =>
  clearTimeout(id as unknown as NodeJS.Timeout)) as typeof cancelAnimationFrame;
Object.defineProperty(globalThis, 'requestAnimationFrame', { value: rafImpl, configurable: true, writable: true });
Object.defineProperty(globalThis, 'cancelAnimationFrame', { value: cafImpl, configurable: true, writable: true });

// Filter known noisy library warnings that don't represent real test failures.
// - Recharts logs "width(0) and height(0)" because jsdom has no layout engine.
// - gsap ScrollTrigger can throw `requestAnimationFrame is not defined` from a
//   pending rAF callback that fires after jsdom teardown of a prior test file.
const _origConsoleWarn = console.warn.bind(console);
const _origConsoleError = console.error.bind(console);
const _silencePatterns = [
  /width\(0\) and height\(0\) of chart/,
  /requestAnimationFrame is not defined/,
  /window is not defined/,
];
console.warn = (...args: unknown[]) => {
  const msg = String(args[0] ?? '');
  if (_silencePatterns.some((p) => p.test(msg))) return;
  _origConsoleWarn(...args);
};
console.error = (...args: unknown[]) => {
  const msg = String(args[0] ?? '');
  if (_silencePatterns.some((p) => p.test(msg))) return;
  _origConsoleError(...args);
};
process.on('uncaughtException', (err) => {
  if (_silencePatterns.some((p) => p.test(String(err?.message ?? '')))) return;
  throw err;
});

// Stub indexedDB so offlineManager initialisation doesn't reject during tests
if (typeof (globalThis as { indexedDB?: unknown }).indexedDB === 'undefined') {
  (globalThis as { indexedDB: unknown }).indexedDB = {
    open: () => {
      const req: Record<string, unknown> = {
        result: { objectStoreNames: { contains: () => false } },
        onerror: null,
        onsuccess: null,
        onupgradeneeded: null,
      };
      // Resolve asynchronously but never actually do anything.
      setTimeout(() => {
        const fn = req.onsuccess as ((e: unknown) => void) | null;
        if (fn) fn({ target: req });
      }, 0);
      return req;
    },
  };
}