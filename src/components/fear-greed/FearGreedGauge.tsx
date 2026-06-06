import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getColor, getClassification } from '@/services/fearGreedService';
import { TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface FearGreedGaugeProps {
  value: number;
  previousValue?: number;
  lastUpdated?: string;
}

export const FearGreedGauge: React.FC<FearGreedGaugeProps> = ({
  value,
  previousValue,
  lastUpdated,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedValue(value), 150);
    return () => clearTimeout(timeout);
  }, [value]);

  const classification = getClassification(value);
  const color = getColor(value);
  const delta = previousValue !== undefined ? value - previousValue : null;

  const cx = 150;
  const cy = 140;
  const r = 110;
  const strokeW = 18;
  const needleAngle = Math.PI - (animatedValue / 100) * Math.PI;

  const segments = [
    { start: 0, end: 0.24, color: '#ea384c' },
    { start: 0.24, end: 0.44, color: '#f59e0b' },
    { start: 0.44, end: 0.56, color: '#eab308' },
    { start: 0.56, end: 0.76, color: '#22c55e' },
    { start: 0.76, end: 1, color: '#16a34a' },
  ];

  const describeArc = (startPct: number, endPct: number): string => {
    const a1 = Math.PI - startPct * Math.PI;
    const a2 = Math.PI - endPct * Math.PI;
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy - r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy - r * Math.sin(a2);
    const largeArc = endPct - startPct > 0.5 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const needleLen = r - 20;
  const needleX = cx + needleLen * Math.cos(needleAngle);
  const needleY = cy - needleLen * Math.sin(needleAngle);

  return (
    <Card className="border-border/20 bg-gradient-to-b from-card to-card/80 shadow-lg">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[300px] sm:max-w-[380px]">
            <svg viewBox="0 0 300 170" className="w-full" style={{ overflow: 'hidden' }}>
              {segments.map((seg, i) => (
                <path
                  key={i}
                  d={describeArc(seg.start, seg.end)}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeW}
                  strokeLinecap="butt"
                  opacity={0.3}
                />
              ))}

              {animatedValue > 0 && (
                <path
                  d={describeArc(0, Math.min(animatedValue / 100, 0.999))}
                  fill="none"
                  stroke={color}
                  strokeWidth={strokeW - 4}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              )}

              {[0, 25, 50, 75, 100].map((tick) => {
                const angle = Math.PI - (tick / 100) * Math.PI;
                const innerR = r + strokeW / 2 + 3;
                const outerR = innerR + 5;
                return (
                  <line
                    key={tick}
                    x1={cx + innerR * Math.cos(angle)}
                    y1={cy - innerR * Math.sin(angle)}
                    x2={cx + outerR * Math.cos(angle)}
                    y2={cy - outerR * Math.sin(angle)}
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="1.5"
                    opacity={0.4}
                  />
                );
              })}

              <line
                x1={cx}
                y1={cy}
                x2={needleX}
                y2={needleY}
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <circle cx={cx} cy={cy} r="7" fill={color} className="transition-colors duration-700" opacity={0.9} />
              <circle cx={cx} cy={cy} r="3.5" fill="hsl(var(--card))" />

              <text
                x={cx}
                y={cy - 28}
                textAnchor="middle"
                className="fill-foreground"
                style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'system-ui', letterSpacing: '-2px' }}
              >
                {value}
              </text>

              <text x="30" y="158" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: '10px', fontWeight: 600 }}>
                {tr ? 'Korku' : 'Fear'}
              </text>
              <text x="270" y="158" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: '10px', fontWeight: 600 }}>
                {tr ? 'Açgözlülük' : 'Greed'}
              </text>
            </svg>
          </div>

          <div
            className="mt-1 px-6 py-2.5 rounded-full text-base sm:text-lg font-bold tracking-tight"
            style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}
          >
            {classification}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-sm text-muted-foreground">
            {delta !== null && (
              <div className={cn(
                'flex items-center gap-1.5 font-semibold px-3 py-1 rounded-full',
                delta > 0 ? 'text-success bg-success/10' : delta < 0 ? 'text-destructive bg-destructive/10' : 'text-muted-foreground bg-muted/30'
              )}>
                {delta > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : delta < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                {delta > 0 ? '+' : ''}{delta} {tr ? 'dünden' : 'from yesterday'}
              </div>
            )}
            {lastUpdated && (
              <span className="flex items-center gap-1.5 text-xs">
                <Clock className="w-3 h-3" />
                {new Date(lastUpdated).toLocaleDateString(tr ? 'tr-TR' : undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
