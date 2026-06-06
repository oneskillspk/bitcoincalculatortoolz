/**
 * Tiny hand-authored Lottie animations — kept inline so we don't
 * depend on any external CDN and so the JSON is tree-shaken when
 * not used. Use with <LazyLottie animationData={...} />.
 *
 * Authored to Lottie schema v5.7. Brand color: ember #E85D3A.
 */

/** Slow concentric pulse ring — ~2s loop, ember tinted. */
export const emberPulse = {
  v: "5.7.0",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "EmberPulse",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "ring",
      sr: 1,
      ks: {
        o: { a: 1, k: [
          { t: 0,  s: [70] },
          { t: 30, s: [25] },
          { t: 60, s: [0]  }
        ]},
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [
          { t: 0,  s: [40, 40, 100] },
          { t: 60, s: [180, 180, 100] }
        ]},
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [60, 60] },
              p: { a: 0, k: [0, 0] },
              nm: "ellipse"
            },
            {
              ty: "st",
              c: { a: 0, k: [0.910, 0.365, 0.227, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 2 },
              lc: 2,
              lj: 2,
              nm: "stroke"
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 }
            }
          ],
          nm: "ring-group"
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "dot",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [
          { t: 0,  s: [100, 100, 100] },
          { t: 30, s: [115, 115, 100] },
          { t: 60, s: [100, 100, 100] }
        ]}
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [32, 32] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.910, 0.365, 0.227, 1] },
              o: { a: 0, k: 100 }
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 }
            }
          ]
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    }
  ],
  markers: []
} as const;

/* ─────────────────────────────────────────────────────────────
 * dotsWave — three ember dots pulsing in sequence. ~1.2s loop.
 * Used for "calculating…" moments. 60×20 viewBox.
 * ──────────────────────────────────────────────────────────── */
const emberRGBA = [0.910, 0.365, 0.227, 1];

const buildDot = (ind: number, cx: number, phaseOffset: number) => ({
  ddd: 0,
  ind,
  ty: 4,
  nm: `dot${ind}`,
  sr: 1,
  ks: {
    o: { a: 1, k: [
      { t: 0 + phaseOffset,  s: [40] },
      { t: 12 + phaseOffset, s: [100] },
      { t: 24 + phaseOffset, s: [40] },
    ]},
    r: { a: 0, k: 0 },
    p: { a: 0, k: [cx, 10, 0] },
    a: { a: 0, k: [0, 0, 0] },
    s: { a: 1, k: [
      { t: 0 + phaseOffset,  s: [70, 70, 100] },
      { t: 12 + phaseOffset, s: [110, 110, 100] },
      { t: 24 + phaseOffset, s: [70, 70, 100] },
    ]},
  },
  ao: 0,
  shapes: [{
    ty: "gr",
    it: [
      { d: 1, ty: "el", s: { a: 0, k: [10, 10] }, p: { a: 0, k: [0, 0] } },
      { ty: "fl", c: { a: 0, k: emberRGBA }, o: { a: 0, k: 100 } },
      { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
    ],
  }],
  ip: 0,
  op: 36,
  st: 0,
  bm: 0,
});

export const dotsWave = {
  v: "5.7.0",
  fr: 30,
  ip: 0,
  op: 36,
  w: 60,
  h: 20,
  nm: "DotsWave",
  ddd: 0,
  assets: [],
  layers: [
    buildDot(1, 10, 0),
    buildDot(2, 30, 4),
    buildDot(3, 50, 8),
  ],
  markers: [],
} as const;

/* ─────────────────────────────────────────────────────────────
 * successCheck — single-stroke ember checkmark + scale-in ring.
 * Plays once over ~0.6s. 80×80 viewBox.
 * ──────────────────────────────────────────────────────────── */
export const successCheck = {
  v: "5.7.0",
  fr: 30,
  ip: 0,
  op: 30,
  w: 80,
  h: 80,
  nm: "SuccessCheck",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0, ind: 1, ty: 4, nm: "ring", sr: 1,
      ks: {
        o: { a: 1, k: [
          { t: 0,  s: [0] },
          { t: 8,  s: [100] },
          { t: 30, s: [100] },
        ]},
        r: { a: 0, k: 0 },
        p: { a: 0, k: [40, 40, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [
          { t: 0,  s: [40, 40, 100] },
          { t: 12, s: [110, 110, 100] },
          { t: 18, s: [100, 100, 100] },
        ]},
      },
      ao: 0,
      shapes: [{
        ty: "gr",
        it: [
          { d: 1, ty: "el", s: { a: 0, k: [60, 60] }, p: { a: 0, k: [0, 0] } },
          { ty: "st", c: { a: 0, k: emberRGBA }, o: { a: 0, k: 100 }, w: { a: 0, k: 3 }, lc: 2, lj: 2 },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
        ],
      }],
      ip: 0, op: 30, st: 0, bm: 0,
    },
    {
      ddd: 0, ind: 2, ty: 4, nm: "check", sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [40, 40, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [{
        ty: "gr",
        it: [
          {
            ty: "sh",
            ks: { a: 0, k: {
              i: [[0,0],[0,0],[0,0]],
              o: [[0,0],[0,0],[0,0]],
              v: [[-14, 2], [-4, 12], [16, -10]],
              c: false,
            }},
          },
          { ty: "st", c: { a: 0, k: emberRGBA }, o: { a: 0, k: 100 }, w: { a: 0, k: 4 }, lc: 2, lj: 2 },
          {
            ty: "tm",
            s: { a: 0, k: 0 },
            e: { a: 1, k: [
              { t: 8,  s: [0] },
              { t: 22, s: [100] },
            ]},
            o: { a: 0, k: 0 },
            m: 1,
          },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
        ],
      }],
      ip: 0, op: 30, st: 0, bm: 0,
    },
  ],
  markers: [],
} as const;

/* ─────────────────────────────────────────────────────────────
 * softSparkle — four 1px ember ticks rising in sequence over
 * ~500ms. One-shot. Decorative accent for result hero numbers.
 * 80×24 viewBox.
 * ──────────────────────────────────────────────────────────── */
const buildTick = (ind: number, x: number, phaseOffset: number) => ({
  ddd: 0,
  ind,
  ty: 4,
  nm: `tick${ind}`,
  sr: 1,
  ks: {
    o: { a: 1, k: [
      { t: 0 + phaseOffset,  s: [0] },
      { t: 4 + phaseOffset,  s: [80] },
      { t: 12 + phaseOffset, s: [0] },
    ]},
    r: { a: 0, k: 0 },
    p: { a: 1, k: [
      { t: 0 + phaseOffset,  s: [x, 18, 0] },
      { t: 12 + phaseOffset, s: [x, 6, 0]  },
    ]},
    a: { a: 0, k: [0, 0, 0] },
    s: { a: 0, k: [100, 100, 100] },
  },
  ao: 0,
  shapes: [{
    ty: "gr",
    it: [
      {
        ty: "sh",
        ks: { a: 0, k: {
          i: [[0, 0], [0, 0]],
          o: [[0, 0], [0, 0]],
          v: [[0, 0], [0, 6]],
          c: false,
        }},
      },
      { ty: "st", c: { a: 0, k: emberRGBA }, o: { a: 0, k: 100 }, w: { a: 0, k: 1.2 }, lc: 2, lj: 2 },
      { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
    ],
  }],
  ip: 0,
  op: 18,
  st: 0,
  bm: 0,
});

export const softSparkle = {
  v: "5.7.0",
  fr: 30,
  ip: 0,
  op: 18,
  w: 80,
  h: 24,
  nm: "SoftSparkle",
  ddd: 0,
  assets: [],
  layers: [
    buildTick(1, 12, 0),
    buildTick(2, 32, 2),
    buildTick(3, 52, 4),
    buildTick(4, 72, 6),
  ],
  markers: [],
} as const;

/* ─────────────────────────────────────────────────────────────
 * chartReveal — thin ember line that traces left→right across
 * a 240×60 area over ~1.2s. One-shot. Pairs with a soft fill.
 * Available for result panel chart slots (opt-in).
 * ──────────────────────────────────────────────────────────── */
export const chartReveal = {
  v: "5.7.0",
  fr: 30,
  ip: 0,
  op: 36,
  w: 240,
  h: 60,
  nm: "ChartReveal",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0, ind: 1, ty: 4, nm: "line", sr: 1,
      ks: {
        o: { a: 0, k: 70 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [0, 0, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [{
        ty: "gr",
        it: [
          {
            ty: "sh",
            ks: { a: 0, k: {
              i: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
              o: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
              v: [[0, 44], [48, 34], [96, 40], [144, 22], [192, 28], [240, 12]],
              c: false,
            }},
          },
          { ty: "st", c: { a: 0, k: emberRGBA }, o: { a: 0, k: 100 }, w: { a: 0, k: 1.25 }, lc: 2, lj: 2 },
          {
            ty: "tm",
            s: { a: 0, k: 0 },
            e: { a: 1, k: [
              { t: 0,  s: [0]   },
              { t: 30, s: [100] },
            ]},
            o: { a: 0, k: 0 },
            m: 1,
          },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
        ],
      }],
      ip: 0, op: 36, st: 0, bm: 0,
    },
  ],
  markers: [],
} as const;

