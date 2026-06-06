import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Blocks, AlertTriangle, Compass } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { HalvingCountdownService } from '@/services/halvingCountdownService';
import { useLanguage } from '@/contexts/LanguageContext';

export const HalvingCountdownTimer: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const { data: countdown, isLoading, isError } = useQuery({
    queryKey: ['halving-countdown-block-height'],
    queryFn: async () => {
      const height = await HalvingCountdownService.getCurrentBlockHeight();
      return HalvingCountdownService.calculateCountdown(height);
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });

  useEffect(() => {
    if (!countdown) return;
    const updateTimer = () => {
      const now = Date.now();
      const diff = countdown.estimatedDate.getTime() - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const timeUnits = [
    { value: timeLeft.days, label: tr ? 'Gün' : 'Days' },
    { value: timeLeft.hours, label: tr ? 'Saat' : 'Hours' },
    { value: timeLeft.minutes, label: tr ? 'Dakika' : 'Minutes' },
    { value: timeLeft.seconds, label: tr ? 'Saniye' : 'Seconds' },
  ];

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-card">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 mx-auto bg-muted rounded" />
            <div className="flex justify-center gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-20 w-20 bg-muted rounded-xl" />)}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden">
      {isError && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-4 h-4" />
          <span>{tr ? 'Tahmini veriler kullanılıyor — canlı blok verisi geçici olarak kullanılamıyor' : 'Using estimated data — live block data temporarily unavailable'}</span>
        </div>
      )}
      <CardContent className="p-6 sm:p-8 lg:p-10">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium border border-primary/20">
              <Clock className="w-3.5 h-3.5" />
              {tr ? 'Yarılanma #5 Geri Sayım' : 'Halving #5 Countdown'}
            </div>
            <p className="text-sm text-muted-foreground">
              {tr ? 'Tahmini: ' : 'Estimated: '}{countdown?.estimatedDate.toLocaleDateString(tr ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-5 lg:gap-6">
            {timeUnits.map((unit) => (
              <div key={unit.label} className="flex flex-col items-center">
                <div className="w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl bg-background border border-border/50 flex items-center justify-center shadow-sm">
                  <span className="text-2xl sm:text-3xl lg:text-5xl font-bold font-mono text-foreground tabular-nums">
                    {String(unit.value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 font-medium uppercase tracking-wider">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          {countdown && (
            <div className="max-w-lg mx-auto space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Blocks className="w-3.5 h-3.5" />
                  <span>{tr ? 'Blok' : 'Block'} {countdown.currentBlockHeight.toLocaleString(getCurrentIntlLocale())}</span>
                </div>
                <span>{countdown.blocksRemaining.toLocaleString(getCurrentIntlLocale())} {tr ? 'blok kaldı' : 'blocks remaining'}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-1000"
                  style={{ width: `${countdown.epochProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{tr ? 'Blok' : 'Block'} 840,000</span>
                <span className="font-semibold text-primary">%{countdown.epochProgress.toFixed(1)} {tr ? 'tamamlandı' : 'complete'}</span>
                <span>{tr ? 'Blok' : 'Block'} 1,050,000</span>
              </div>
            </div>
          )}

          {countdown && (
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="p-3 rounded-lg bg-muted/50 border border-border/30 text-center">
                <p className="text-xs text-muted-foreground mb-0.5">{tr ? 'Güncel Ödül' : 'Current Reward'}</p>
                <p className="text-lg font-bold text-foreground">{countdown.currentReward} BTC</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-center">
                <p className="text-xs text-muted-foreground mb-0.5">{tr ? 'Yarılanma Sonrası' : 'After Halving'}</p>
                <p className="text-lg font-bold text-primary">{countdown.nextReward} BTC</p>
              </div>
            </div>
          )}

          {countdown && (() => {
            const progress = countdown.epochProgress;
            const era = Math.floor(countdown.currentBlockHeight / 210000) + 1;
            const phase =
              progress < 25 ? { label: tr ? 'Erken Döngü' : 'Early Cycle', tone: 'bg-blue-500/10 text-blue-500 border-blue-500/20' } :
              progress < 50 ? { label: tr ? 'Birikim' : 'Accumulation', tone: 'bg-success/10 text-success border-success/20' } :
              progress < 75 ? { label: tr ? 'Döngü Ortası' : 'Mid Cycle', tone: 'bg-amber-500/10 text-amber-500 border-amber-500/20' } :
                              { label: tr ? 'Geç Döngü' : 'Late Cycle', tone: 'bg-orange-500/10 text-orange-500 border-orange-500/20' };
            const yearsIn = (progress / 100 * 4).toFixed(1);
            const yearsLeft = ((100 - progress) / 100 * 4).toFixed(1);

            const radius = 26;
            const circumference = 2 * Math.PI * radius;
            const dashOffset = circumference * (1 - Math.min(progress, 100) / 100);

            return (
              <div className="max-w-lg mx-auto rounded-xl border border-border/40 bg-muted/30 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{tr ? 'Döngü Konumu' : 'Cycle Position'}</span>
                  </div>
                  <span className={`text-[10px] sm:text-xs font-medium uppercase tracking-wider px-2 py-1 rounded-full border ${phase.tone}`}>
                    {phase.label}
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative shrink-0" style={{ width: 64, height: 64 }}>
                    <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
                      <circle cx="32" cy="32" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
                      <circle
                        cx="32" cy="32" r={radius}
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-foreground tabular-nums">{progress.toFixed(0)}%</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-snug">
                    {tr ? (
                      <>
                        Nisan 2024 yarılanmasında başlayan{' '}
                        <span className="font-semibold text-foreground">Dönem {era}</span>'nin{' '}
                        <span className="font-bold text-foreground">%{progress.toFixed(1)}</span>'indeyiz.
                      </>
                    ) : (
                      <>
                        We're <span className="font-bold text-foreground">{progress.toFixed(1)}%</span> through{' '}
                        <span className="font-semibold text-foreground">Era {era}</span> — the four-year cycle that began at the April 2024 halving.
                      </>
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-background/60 border border-border/30 text-center">
                    <p className="text-muted-foreground mb-0.5">{tr ? 'Geçen süre' : 'Time elapsed'}</p>
                    <p className="font-bold text-foreground">~{yearsIn} {tr ? 'yıl' : 'years'}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-background/60 border border-border/30 text-center">
                    <p className="text-muted-foreground mb-0.5">{tr ? 'Kalan süre' : 'Time remaining'}</p>
                    <p className="font-bold text-foreground">~{yearsLeft} {tr ? 'yıl' : 'years'}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </CardContent>
    </Card>
  );
};
