import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-5">
        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-7 bg-muted rounded w-32" />
            <div className="h-3 bg-muted rounded w-20" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", signalBg || "bg-primary/10")}>
                  <Icon className={cn("w-4 h-4", iconColor)} />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {label}
                </span>
              </div>
              {signal && (
                <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", signalBg, signalColor)}>
                  {signal}
                </span>
              )}
            </div>

            <div>
              <div className="text-2xl font-bold text-foreground">{value}</div>
              {subValue && (
                <div className="text-xs text-muted-foreground mt-0.5">{subValue}</div>
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
              <p className="text-xs text-muted-foreground border-t border-border/20 pt-2">
                {description}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
