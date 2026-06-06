import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getColor, getClassification, type FGDataPoint } from '@/services/fearGreedService';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface FearGreedTimelineProps {
  data: FGDataPoint[];
}

export const FearGreedTimeline: React.FC<FearGreedTimelineProps> = ({ data }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [viewDays, setViewDays] = useState<7 | 30>(7);

  const timelineData = data.slice(0, viewDays).reverse();

  return (
    <Card className="border-border/20 bg-card shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2.5 text-foreground">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-primary" />
            </div>
            {tr ? 'Son Zaman Tüneli' : 'Recent Timeline'}
          </CardTitle>
          <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
            <Button
              variant={viewDays === 7 ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-3 text-xs font-medium"
              onClick={() => setViewDays(7)}
            >
              {tr ? '7 Gün' : '7 Days'}
            </Button>
            <Button
              variant={viewDays === 30 ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-3 text-xs font-medium"
              onClick={() => setViewDays(30)}
            >
              {tr ? '30 Gün' : '30 Days'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="overflow-x-auto -mx-2 px-2 pb-2 scrollbar-thin">
          <div className="flex gap-2 min-w-max">
            {timelineData.map((d, i) => {
              const isToday = i === timelineData.length - 1;
              const color = getColor(d.value);
              const dateObj = new Date(d.date);
              const dayLabel = dateObj.toLocaleDateString(tr ? 'tr-TR' : 'en-US', { weekday: 'short' });
              const dateLabel = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

              return (
                <div
                  key={d.date}
                  className="flex flex-col items-center gap-1.5 group cursor-default"
                  title={`${d.date}: ${d.value} — ${getClassification(d.value)}`}
                >
                  <div
                    className={cn(
                      'w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                      isToday && 'ring-2 ring-primary ring-offset-2 ring-offset-card scale-110',
                      'group-hover:scale-110 group-hover:shadow-lg'
                    )}
                    style={{
                      backgroundColor: `${color}20`,
                      color,
                      boxShadow: isToday ? `0 0 12px ${color}30` : undefined,
                    }}
                  >
                    {d.value}
                  </div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                    {isToday ? (tr ? 'Bugün' : 'Today') : dayLabel}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground/70">{dateLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
