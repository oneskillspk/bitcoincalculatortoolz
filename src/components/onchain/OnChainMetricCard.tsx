import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

interface OnChainMetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  change?: number | null;
  signal?: string;
  signalColor?: string;
  signalBg?: string;
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
  loading?: boolean;
}

/**
 * Rich on-chain metric tile. Uses the shared `calc-surface-subtle` token so it
 * composes with the results-panel design system (spec §3) instead of a bespoke
 * `glass-morphism-card` shell.
 */
export const OnChainMetricCard = ({
  label,
  value,
  subValue,
  change,
  signal,
  signalColor,
  signalBg,
  icon: Icon,
  iconColor = "text-primary",
  description,
  loading = false,
}: OnChainMetricCardProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const changePositive = change !== null && change !== undefined && change > 0;
  const changeNegative = change !== null && change !== undefined && change < 0;

  return (
    <div className="calc-surface-subtle p-5">
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", signalBg || "bg-primary/10")}>
                <Icon className={cn("w-4 h-4", iconColor)} />
              </div>
              <span className="calc-text-label text-muted-foreground truncate">
                {label}
              </span>
            </div>
            {signal && (
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full shrink-0", signalBg, signalColor)}>
                {signal}
              </span>
            )}
          </div>

          <div>
            <div className="calc-text-mono text-2xl font-bold tabular-nums text-foreground break-words">{value}</div>
            {subValue && (
              <div className="calc-text-small text-muted-foreground mt-0.5">{subValue}</div>
            )}
          </div>

          {change !== null && change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              changePositive ? "text-success" : changeNegative ? "text-destructive" : "text-muted-foreground"
            )}>
              {changePositive ? <TrendingUp className="w-3 h-3" /> :
                changeNegative ? <TrendingDown className="w-3 h-3" /> :
                <Minus className="w-3 h-3" />}
              {change > 0 ? '+' : ''}{change.toFixed(1)}% ({tr ? '30g' : '30d'})
            </div>
          )}

          {description && (
            <p className="calc-text-small text-muted-foreground border-t border-border/20 pt-2">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
