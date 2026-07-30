import '@testing-library/jest-dom';
import { expect } from 'vitest';

// Snapshot serializer: scrub non-deterministic UUIDs so click_id-bearing
// affiliate URLs snapshot cleanly across runs.
const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
expect.addSnapshotSerializer({
  serialize(val, config, indentation, depth, refs, printer) {
    const scrubbed = typeof val === 'string' ? val.replace(UUID_RE, '<uuid>') : val;
    return printer(scrubbed, config, indentation, depth, refs);
  },
  test(val) {
    return typeof val === 'string' && UUID_RE.test(val);
  },
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
} as any;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

global.scrollTo = () => {};

const rafImpl = ((cb: FrameRequestCallback) =>
  setTimeout(() => cb(performance.now()), 0) as unknown as number) as typeof requestAnimationFrame;
const cafImpl = ((id: number) =>
  clearTimeout(id as unknown as NodeJS.Timeout)) as typeof cancelAnimationFrame;
Object.defineProperty(globalThis, 'requestAnimationFrame', { value: rafImpl, configurable: true, writable: true });
Object.defineProperty(globalThis, 'cancelAnimationFrame', { value: cafImpl, configurable: true, writable: true });

const _origConsoleWarn = console.warn.bind(console);
const _origConsoleError = console.error.bind(console);
const _silencePatterns = [
  /width\(0\) and height\(0\) of chart/,
  /requestAnimationFrame is not defined/,
  /cancelAnimationFrame is not defined/,
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

if (typeof (globalThis as { indexedDB?: unknown }).indexedDB === 'undefined') {
  (globalThis as { indexedDB: unknown }).indexedDB = {
    open: () => {
      const req: Record<string, unknown> = {
        result: { objectStoreNames: { contains: () => false } },
        onerror: null,
        onsuccess: null,
        onupgradeneeded: null,
      };
      setTimeout(() => {
        const fn = req.onsuccess as ((e: unknown) => void) | null;
        if (fn) fn({ target: req });
      }, 0);
      return req;
    },
  };
}
