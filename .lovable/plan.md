## Homepage Animation System — "Instrument Panel, In Motion"

Goal: layer cinematic, restrained, $100M-SaaS-grade motion across the homepage without changing layout, copy, or the Instrument Panel visual language. Motion serves the data — it never decorates.

### 1. Motion design principles (the bar)

- **Restraint over spectacle.** One hero moment per section. Everything else is supporting micro-motion ≤ 240ms.
- **Physics-based, not linear.** Spring + custom cubic-bezier (`cubic-bezier(0.22, 1, 0.36, 1)` "expo-out"; `cubic-bezier(0.83, 0, 0.17, 1)` "expo-in-out").
- **Choreographed, not random.** Stagger children 40–60ms; never reveal more than 6 elements at once.
- **GPU-only properties.** `transform` + `opacity`. No `width/height/top/left` animation.
- **60fps budget.** Mobile drops parallax + heavy filters; respects `prefers-reduced-motion` and `Save-Data`.
- **Sound of silence.** Whitespace and pauses are part of the choreography.

### 2. Shared motion tokens (new file)

`src/styles/motion-tokens.css` + `src/lib/motion.ts`

Tokens (CSS vars + TS constants):
- Durations: `--mo-1` 120ms (taps), `--mo-2` 220ms (UI), `--mo-3` 420ms (reveals), `--mo-4` 720ms (hero), `--mo-5` 1200ms (cinematic).
- Easings: `--ease-expo-out`, `--ease-expo-in-out`, `--ease-spring` (framer spring preset `{ stiffness: 260, damping: 30, mass: 0.9 }`).
- Stagger: `--stagger-tight` 40ms, `--stagger-base` 60ms, `--stagger-loose` 100ms.
- Reveal distance: `--reveal-y` 16px desktop / 10px mobile.

Shared helpers:
- `<Reveal>` — IntersectionObserver, runs once, supports `delay`, `y`, `blur`, `stagger`. Replaces ad-hoc fade-ups.
- `<StaggerGroup>` — orchestrates children via CSS variable delays (no JS per-child).
- `useMagnetic(ref, strength)` — pointer-tracked translate for primary CTAs (already partially in `MagneticButton`, generalize).
- `useTilt(ref)` — 3D perspective tilt with damped spring; opt-in per card.
- `useScrollProgress(ref)` — returns 0–1 for section, used for parallax / scrubbed timelines.
- `useReducedMotion()` — central gate. Every helper above no-ops when true.

### 3. Per-section choreography

**Header / FloatingNavigation**
- Mount: nav drops 8px + fades over 420ms expo-out; ember dot on active link does a 600ms `scale 0→1` with spring after route settles.
- Scroll: backdrop-blur ramps 0→16px between 0–120px scroll (scrubbed, not toggled).
- Hover: link underline grows from left, 220ms; magnetic pull on the search `kbd` button (strength 0.15).
- Mobile drawer: terminal strip types in (`NAV · MENU` char-by-char, 18ms/char), items stagger 50ms.

**ProfessionalHeroSection**
- Headline: word-by-word reveal (`WordReveal`) with 60ms stagger, mask-clip from bottom, 720ms expo-out. Last word gets a 1px ember underline that draws L→R over 600ms after the word lands.
- Sub-headline + CTA cluster: fade + 10px rise, 200ms after headline finishes.
- Live BTC price ticker: digits flip on update (3D rotateX 90° → 0°, 320ms spring); ember dot pulses 1.6s loop only when price moves.
- Background: subtle parallax grid (translateY at 0.15 scroll factor), ember scan-line sweeps top→bottom every 9s (opacity 0.04).
- CTAs: magnetic pull (strength 0.2) + on-press scale 0.97 with spring rebound.

**LiveCalculationDemo**
- Terminal header `CALC-LIVE · BTC/USD`: caret blink (1s steps), `LIVE` badge dot breathes (opacity 0.6→1, 1.4s).
- Investment cycler: cross-fade with 6px y-slide, 320ms; numbers count up (rAF, 600ms expo-out, monospace tabular-nums to prevent layout shift).
- Footer rail links: arrow `→` translates 4px on hover, 200ms.

**EditorialStatement**
- Parallax grid: scroll-linked translateY (factor 0.2), masked by section bounds.
- Statement text: line-by-line clip-reveal as the section enters 60% viewport (700ms expo-out, 80ms stagger).
- Module strip: counter increments from 0 to its real value, 900ms.

**PremiumCalculatorCards**
- Card grid intro: 60ms stagger, 16px rise + opacity, blur 6px→0.
- Hover: tilt (max 6°) + ember border-glow fade-in (200ms), inner icon does 4px lift, mono metadata slides in from right (8px, 220ms). Cursor magnetic pull on primary card CTA only.
- Active-state ember dot pulses on focus.

**CalculatorGrid (explore section)**
- Filter chips: layout animation via `FLIP` (measure → invert → play) when filtering — 280ms spring.
- Card mount: 40ms stagger, masked rise. New rows fade in without pushing existing cards (FLIP).
- Empty state: terminal-style typing of "NO RESULTS".

**CalculationFlowAnimation**
- Scroll-scrubbed timeline: as the section progresses 0→100%, each `STEP-0N` tile activates in sequence (ember dot lights, connector line draws L→R via `stroke-dashoffset`).
- Active tile gets a subtle 1.02 scale + shadow lift; previous tiles dim to 0.6 opacity.
- Numbers inside each step count up when their step activates.

**UltraModernAssetComparison**
- Header `COMP-01`: types in once.
- Rows enter with 50ms stagger; BTC row gets ember underline draw L→R (500ms) on entry.
- Bar widths animate from 0 → value with expo-out, 800ms, scrubbed if section is partially visible.
- Hover row: hairline column rules brighten 0.6→1, mono metadata reveals delta with `+/−` count.

**FAQSection**
- Row mount: 40ms stagger, 8px rise.
- Toggle: `+` rotates to `×` via 180° rotate spring (260ms); answer reveals via `grid-template-rows: 0fr → 1fr` trick (no height animation, GPU-safe) + opacity 0→1.
- "Next" nav: arrow slides 6px + ember dot ping on click.

**NewsletterSection (SIGNAL-01)**
- Card enters with 12px rise + 4px blur clear (520ms).
- Input focus: hairline border thickens to ember, label floats up 4px, 200ms.
- Submit: button press → spinner morph (text fades, dot expands into ring), then ember checkmark draws (SVG `stroke-dashoffset`, 380ms). Success state pulses once.

**Footer**
- Column headings: `COL-0N` strip fades in on first scroll-in, 40ms stagger.
- App promo card: magnetic hover, ember dot orbit micro-animation (12s loop, very low opacity).
- Back-to-top button: appears after 60% scroll with spring; on click, scroll uses `scrollTo({ behavior: 'smooth' })` wrapped in rAF easing for true expo curve.

### 4. Cross-section choreography

- **Section transitions:** as each section enters viewport at 75%, its terminal strip plays a 220ms "boot" (dot blinks twice, mono id types in). Only the first time per session (sessionStorage flag) to keep repeat scrolls calm.
- **Ember thread:** a single 1px ember vertical line runs down the left gutter on desktop (≥1280px); it grows in length scroll-linked, tying all modules together. Hidden on mobile.
- **Cursor:** custom 6px ember dot follower with 120ms lag spring on desktop only; expands to 24px ring over interactive elements. Disabled on touch and reduced-motion.
- **Page load:** brief 320ms ember "scan" sweeps top→bottom once, then dissolves — sets the cinematic tone without blocking LCP (runs after `requestIdleCallback`).

### 5. Performance + accessibility budget

- All scroll-linked work via single rAF scheduler in `useScrollProgress`; no per-component scroll listeners.
- `IntersectionObserver` for reveal triggers, `rootMargin: '0px 0px -10% 0px'`.
- Respect `prefers-reduced-motion: reduce` → all helpers degrade to instant opacity 0→1 only.
- Mobile (`<768px`): disable cursor follower, tilt, magnetic, parallax grid, ember thread; keep reveals + counters.
- `Save-Data` header / `connection.saveData` → reveals only, no counters or scrubbed timelines.
- LCP guard: hero text uses pure CSS animation (no JS), not framer-motion, so it doesn't wait for hydration.
- No layout-shifting animations; reserve space via `min-height` on dynamic content.

### 6. Technical details

- Library: keep `framer-motion` (already installed) for orchestration; keep `gsap` only where currently used (`useGsapScrollTrigger`, `ScrollScene`, `ScrollZoomImage`). No new deps.
- New files:
  - `src/styles/motion-tokens.css`
  - `src/lib/motion.ts` (constants, springs, easings)
  - `src/components/motion/Reveal.tsx`
  - `src/components/motion/StaggerGroup.tsx`
  - `src/components/motion/CountUp.tsx`
  - `src/components/motion/MagneticCTA.tsx` (generalized from `MagneticButton`)
  - `src/components/motion/CursorFollower.tsx` (mounted once in `App.tsx`)
  - `src/components/motion/EmberThread.tsx` (mounted on Index only, desktop-gated)
  - `src/hooks/useReducedMotion.ts`, `useScrollProgress.ts`, `useTilt.ts`, `useMagnetic.ts`, `useTypewriter.ts`
- Edited files (presentation only, no logic changes):
  - `src/index.css` (import motion tokens)
  - `src/pages/Index.tsx` (mount `EmberThread`)
  - `src/App.tsx` (mount `CursorFollower`)
  - Each homepage section listed in §3 — swap ad-hoc fades for `<Reveal>` / `<StaggerGroup>` and wire the section-specific moment.

### 7. Out of scope

- Calculator pages, admin pages, auth flows.
- Copy, layout, color tokens, data sources.
- New animation libraries.
- Sound design.

### 8. QA pass

- 60fps check at 375 / 768 / 1280 / 1920 via Chrome perf panel.
- Reduced-motion screencap for every section.
- LCP delta target: ≤ +50ms vs current build.
- Visual QA at the three breakpoints to confirm no overflow from transforms.
