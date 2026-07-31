# Centered, lightweight first-paint loader

## Problem

The "splash" is a small Bitcoin glyph hard-pinned to the top-left corner of
`index.html` (`position:fixed;top:24px;left:24px`). It exists only to make First
Contentful Paint fire early, but visually it reads as a stray, broken icon in the
corner while the app boots.

## What to build

Replace the corner glyph with a centered, self-removing boot loader that keeps the
same FCP benefit and adds zero runtime cost.

- Centered container inside `#root`: fixed, full-viewport, flex-centered, page
  background from the already-inlined `--background` token.
- Content: the same Bitcoin glyph at ~40px in the ember brand color, plus a thin
  progress hairline underneath. No text, no external assets, no extra requests.
- Motion: one CSS `@keyframes` (soft pulse + hairline sweep), ~1.4s loop,
  GPU-friendly (`opacity` / `transform` only), wrapped in a
  `prefers-reduced-motion` guard that freezes it to a static glyph.
- Removal: `createRoot()` already replaces `#root`'s children on mount, so the
  loader disappears on hydrate with no JS teardown needed. A short fade-out via
  animation delay avoids a hard pop.
- Accessibility: `aria-hidden="true"` on the visual, `role="status"` +
  visually-hidden "Loading" label so screen readers aren't left silent.

## Technical notes

- All markup and CSS stay inline in `index.html` (no new files, no bundle impact).
  The loader CSS goes in the existing critical `<style>` block.
- Total added payload: well under 1KB, no layout shift (loader is `position:fixed`,
  outside document flow).
- Nothing else changes — the token block, JSON-LD, and module script stay as-is.

## Verification

- Playwright screenshot of the pre-hydrate paint (throttled) to confirm the loader
  renders centered, then verify it is gone after mount.
- Confirm `#root` first paint still contains contentful pixels (FCP unchanged).
