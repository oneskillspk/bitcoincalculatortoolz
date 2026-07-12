# P1 Panel Screenshot Regression

Automated visual snapshots for the six migrated P1 result panels
(Accumulation Score, CAGR, HODL, Inflation, Purchasing Power, Zakat) at
mobile (390×844) and desktop (1280×1800) viewports.

## Run

```bash
# Dev server must be running on :8080 (Lovable preview already does this)
python3 scripts/screenshot-p1-panels.py

# Only a subset
python3 scripts/screenshot-p1-panels.py --only cagr,hodl

# Against a deployed URL
python3 scripts/screenshot-p1-panels.py --base-url https://bitcoincalculatortoolz.lovable.app
```

Screenshots are written to `/tmp/browser/p1-regression/<slug>/<viewport>.png`.

## How to review

1. Run the script after any change touching `ResultPanel`, `ResultsGrid`,
   `ResultCard`, `ResultHero`, or any of the six panel files.
2. Compare the new PNGs against the previously saved baseline (copy the
   previous run somewhere before rerunning if you want a diff).
3. Look for: text overflow, badge/title collisions, uneven card heights,
   loading/empty state regressions, unreadable compact numbers.

## Adding a panel

Append a `(slug, route)` tuple to `PANELS` in `screenshot-p1-panels.py`.
