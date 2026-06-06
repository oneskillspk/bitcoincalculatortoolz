import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  H1,
  H2,
  H3,
  H4,
  Lead,
  Body,
  Muted,
  Small,
  Eyebrow,
  Label,
  List,
  ListItem,
} from '@/components/ui/typography';

type Scale = 100 | 125 | 150;

const SCALES: Scale[] = [100, 125, 150];

export default function TypographyPreview() {
  const [scale, setScale] = useState<Scale>(100);

  return (
    <>
      <Helmet>
        <title>Typography Preview · Internal QA</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <main className="min-h-dvh bg-background">
        <div className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-6 py-4">
            <div>
              <Eyebrow>Internal · QA</Eyebrow>
              <H3 className="mt-1">Typography Preview</H3>
            </div>
            <div className="flex items-center gap-2">
              <Small className="mr-2">Text scale:</Small>
              {SCALES.map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={scale === s ? 'default' : 'outline'}
                  onClick={() => setScale(s)}
                  aria-pressed={scale === s}
                >
                  {s}%
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="container mx-auto px-6 py-10"
          style={{ fontSize: `${scale}%` }}
        >
          <section className="mb-12 space-y-6">
            <Eyebrow>Tokens</Eyebrow>
            <H2>Type scale specimen</H2>
            <Muted>
              Every calculator page should compose from these primitives. Sizes use
              <code className="mx-1 rounded bg-muted px-1 py-0.5 text-small">clamp()</code>
              so they stay readable on mobile and never go below 15px body / 13px
              small.
            </Muted>

            <Card>
              <CardContent className="space-y-6 p-8">
                <div>
                  <Caption label="H1 · display" />
                  <H1>The quick brown fox jumps over the lazy dog</H1>
                </div>
                <div>
                  <Caption label="H2" />
                  <H2>The quick brown fox jumps over the lazy dog</H2>
                </div>
                <div>
                  <Caption label="H3" />
                  <H3>The quick brown fox jumps over the lazy dog</H3>
                </div>
                <div>
                  <Caption label="H4" />
                  <H4>The quick brown fox jumps over the lazy dog</H4>
                </div>
                <div>
                  <Caption label="Lead" />
                  <Lead>
                    A short, slightly larger intro sentence that orients the
                    reader before the body copy begins.
                  </Lead>
                </div>
                <div>
                  <Caption label="Body · 15px min" />
                  <Body>
                    Paragraph body copy at the default size. Line-height is 1.65 so
                    multi-line content stays comfortable to read on phones and
                    laptops alike.
                  </Body>
                </div>
                <div>
                  <Caption label="Muted · AA contrast" />
                  <Muted>
                    Supporting copy uses the muted-foreground token which meets
                    WCAG AA against card and background surfaces.
                  </Muted>
                </div>
                <div>
                  <Caption label="Small · 13px min" />
                  <Small>Labels, footnotes, and chips.</Small>
                </div>
                <div>
                  <Caption label="List" />
                  <List>
                    <ListItem tone="positive">Reduces timing risk</ListItem>
                    <ListItem tone="positive">Smooths out volatility</ListItem>
                    <ListItem tone="warning">May miss early gains</ListItem>
                  </List>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12 space-y-6">
            <Eyebrow>Section sample</Eyebrow>
            <H2>Strategy card preview</H2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {['Lump Sum', 'Dollar Cost Averaging', 'Dollar Value Averaging'].map(
                (name) => (
                  <Card key={name}>
                    <CardContent className="space-y-5 p-7">
                      <div>
                        <H3>{name}</H3>
                        <Muted className="mt-1">
                          One-line description that explains the strategy in plain
                          language.
                        </Muted>
                      </div>
                      <div>
                        <Label>Advantages</Label>
                        <List className="mt-2">
                          <ListItem tone="positive">Maximum time in market</ListItem>
                          <ListItem tone="positive">Simple execution</ListItem>
                        </List>
                      </div>
                      <div>
                        <Label>Considerations</Label>
                        <List className="mt-2">
                          <ListItem tone="warning">Higher timing risk</ListItem>
                        </List>
                      </div>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </section>

          <section className="mb-12 space-y-6">
            <Eyebrow>Section sample</Eyebrow>
            <H2>Hero preview</H2>
            <Card>
              <CardContent className="space-y-4 p-10 text-center">
                <Eyebrow>Bitcoin · Calculator</Eyebrow>
                <H1 className="mx-auto max-w-3xl">
                  Lump Sum vs Dollar Cost Averaging
                </H1>
                <Lead className="mx-auto max-w-2xl text-muted-foreground">
                  Compare two investing strategies side by side with real
                  historical Bitcoin data.
                </Lead>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </>
  );
}

function Caption({ label }: { label: string }) {
  return (
    <div className="mb-2 text-small uppercase tracking-[0.18em] text-muted-foreground">
      {label}
    </div>
  );
}
