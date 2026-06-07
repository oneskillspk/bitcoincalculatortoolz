## Goal

Create a **visual design board** the user can actually see: one PNG/PDF-style board with **3 side-by-side redesign concepts** for:

- The 3 featured calculator cards
- The “Explore by Calculator” section header
- The calculator grid beneath it

This replaces the broken clickable prototype picker.

## Output

Generate a downloadable visual artifact:

```text
/mnt/documents/cards-explore-3-styles.png
```

The board will contain three labeled options:

### Option 1 — Editorial Index
Premium Swiss/editorial look:
- Numbered cards: 01 / 02 / 03
- Hairline rules
- Generous whitespace
- Private-bank / luxury research report feel
- Best if the goal is ultra high-end minimalism

### Option 2 — Instrument Panel
Enterprise SaaS / data terminal look:
- Denser layout
- Mono metadata
- Grid feels like Bloomberg + Linear + Vercel
- Calculator cards read like precise product modules
- Best if the goal is serious SaaS utility

### Option 3 — Atelier Bento
Most visually distinctive:
- One larger hero card plus two supporting cards
- Asymmetric bento composition
- Refined premium emphasis
- More memorable and less conventional
- Best if the goal is visual impact while staying elegant

## Visual constraints

All three options will stay locked to the hero redesign taste:

- Light paper/cream background
- Near-black text
- Single ember accent
- Hairline borders
- Rounded-2xl card geometry
- No purple gradients
- No generic crypto/neon style
- No dark-mode styling
- No decorative orbs

## How it will be made

1. Use the current preview screenshots as the source context.
2. Create one polished canvas with all three design directions side by side.
3. Keep the artifact mostly visual with minimal labels.
4. QA the final image for:
   - no clipped text
   - no overlap
   - clear spacing
   - readable labels
   - consistent visual scale

## After the user chooses

Implement the selected option in:

- `src/components/PremiumCalculatorCards.tsx`
- `src/components/CalculatorGrid.tsx`

No other page sections will be changed.