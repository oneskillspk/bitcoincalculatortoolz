import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { formatROI } from '@/utils/formatters';
import { useLanguage } from '@/contexts/LanguageContext';

interface ROIGaugeProps {
  percentage: number;
  size?: number;
}

export const ROIGauge = ({ percentage, size = 160 }: ROIGaugeProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  const isPositive = percentage >= 0;
  const displayPercentage = Math.abs(percentage);

  const normalizedPercentage = Math.min(displayPercentage, 500);
  const progress = (normalizedPercentage / 500) * 100;

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const getPerformanceLabel = () => {
    if (displayPercentage === 0) return tr ? 'Başa Baş' : 'Break Even';
    if (displayPercentage < 50) return isPositive ? (tr ? 'İyi' : 'Good') : (tr ? 'Zayıf' : 'Poor');
    if (displayPercentage < 100) return isPositive ? (tr ? 'Harika' : 'Great') : (tr ? 'Kötü' : 'Bad');
    if (displayPercentage < 300) return isPositive ? (tr ? 'Mükemmel' : 'Excellent') : (tr ? 'Berbat' : 'Terrible');
    return isPositive ? (tr ? 'Olağanüstü' : 'Exceptional') : (tr ? 'Kritik' : 'Critical');
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isPositive ? "hsl(142 76% 36%)" : "hsl(0 84% 60%)"}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-all duration-1000 ease-out",
            isPositive ? "drop-shadow-[0_0_6px_hsl(142_76%_36%_/_0.4)]" : "drop-shadow-[0_0_6px_hsl(0_84%_60%_/_0.4)]"
          )}
          style={{ transitionDelay: '0.2s' }}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - 6}
          stroke={isPositive ? "hsl(142 76% 36% / 0.2)" : "hsl(0 84% 60% / 0.2)"}
          strokeWidth={2}
          fill="transparent"
          className="animate-pulse"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className={cn(
          "text-3xl font-bold font-mono transition-all duration-700",
          isPositive ? "text-success" : "text-destructive"
        )}>
          {formatROI(animatedPercentage, 1)}
        </div>
        <div className="text-xs text-foreground/60 font-medium mt-1">
          ROI
        </div>
        <div className={cn(
          "mt-2 px-2 py-1 rounded-full text-xs font-semibold",
          isPositive
            ? "bg-success/20 text-success border border-success/30"
            : "bg-destructive/20 text-destructive border border-destructive/30"
        )}>
          {getPerformanceLabel()}
        </div>
      </div>

      <div className={cn(
        "absolute inset-0 rounded-full transition-all duration-1000",
        isPositive
          ? "bg-success/5 animate-pulse"
          : "bg-destructive/5 animate-pulse"
      )} />
    </div>
  );
};
