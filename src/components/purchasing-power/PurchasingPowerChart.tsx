import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import { formatGroupedDecimal, formatGroupedInt } from '@/utils/numberFormat';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PurchasingPowerResult,
  getLocalizedCategory,
} from "@/services/purchasingPowerCalculator";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { PieChart as PieIcon, BarChart3, Inbox } from "lucide-react";
import {
  chartTooltipStyle,
  chartTooltipLabelStyle,
  chartTooltipItemStyle,
} from '@/components/calculator/chartTokens';
import { useLanguage } from '@/contexts/LanguageContext';

interface PurchasingPowerChartProps {
  result: PurchasingPowerResult | null;
  currencySymbol: string;
  loading?: boolean;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
];

// Unified tooltip wrapper: same surface, label weight, and item type
// across both charts.
const TooltipShell = ({
  label,
  rows,
}: {
  label: string;
  rows: { text: string; muted?: boolean }[];
}) => (
  <div style={chartTooltipStyle} role="tooltip">
    <p style={chartTooltipLabelStyle}>{label}</p>
    {rows.map((r, i) => (
      <p
        key={i}
        style={{
          ...chartTooltipItemStyle,
          opacity: r.muted ? 0.75 : 1,
        }}
      >
        {r.text}
      </p>
    ))}
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div
    className="flex flex-col items-center justify-center text-center gap-2 py-8 text-muted-foreground"
    role="status"
  >
    <Inbox className="w-6 h-6" aria-hidden="true" />
    <p className="text-sm">{message}</p>
  </div>
);

export const PurchasingPowerChart = ({
  result,
  currencySymbol,
  loading = false,
}: PurchasingPowerChartProps) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const locale = getCurrentIntlLocale();
  const totalValue = result
    ? Object.values(result.categoryBreakdown).reduce((sum, d) => sum + d.total, 0) || 1
    : 1;

  const categoryData = result
    ? Object.entries(result.categoryBreakdown)
        .map(([category, data], index) => ({
          name: getLocalizedCategory(category, language),
          rawName: category,
          value: data.total,
          count: data.count,
          pct: (data.total / totalValue) * 100,
          fill: COLORS[index % COLORS.length],
        }))
        .sort((a, b) => b.value - a.value)
    : [];

  const topItemsData = result
    ? result.topItems.slice(0, 10).map((item, index) => ({
        name: item.name.length > 18 ? item.name.substring(0, 18) + '…' : item.name,
        fullName: item.name,
        quantity: item.quantity,
        fill: COLORS[index % COLORS.length],
      }))
    : [];

  // Standardized number formatting shared by both tooltips.
  const fmtMoney = (n: number) =>
    `${currencySymbol}${formatGroupedInt(n, locale)}`;
  const fmtQty = (n: number) => `${formatGroupedInt(n, locale)}×`;
  const unitItems = isTr ? 'ürün' : 'items';
  const labelValue = isTr ? 'Değer' : 'Value';
  const labelQty = isTr ? 'Adet' : 'Quantity';

  const CategoryTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload;
    return (
      <TooltipShell
        label={p.name}
        rows={[
          { text: `${labelValue}: ${fmtMoney(p.value)}` },
          { text: `${formatGroupedInt(p.count, locale)} ${unitItems} · ${formatGroupedDecimal(p.pct, 1, locale)}%`, muted: true },
        ]}
      />
    );
  };

  const BarTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload;
    return (
      <TooltipShell
        label={p.fullName}
        rows={[{ text: `${labelQty}: ${fmtQty(payload[0].value)}` }]}
      />
    );
  };

  // Plain-text summaries used for screen-reader chart descriptions.
  const categoryAria = result
    ? (isTr
        ? `Kategori dağılımı grafiği. ${categoryData
            .map((c) => `${c.name} ${c.pct.toFixed(0)} yüzde`)
            .join(', ')}.`
        : `Category distribution chart. ${categoryData
            .map((c) => `${c.name} ${c.pct.toFixed(0)} percent`)
            .join(', ')}.`)
    : '';
  const topItemsAria = result
    ? (isTr
        ? `En iyi ürünler grafiği. ${topItemsData
            .map((i) => `${i.fullName} ${i.quantity} adet`)
            .join(', ')}.`
        : `Top items chart. ${topItemsData
            .map((i) => `${i.fullName} ${i.quantity} units`)
            .join(', ')}.`)
    : '';

  const cardCls = "bg-card border-border/60 shadow-sm h-full flex flex-col";
  const headerCls = "pb-3 border-b border-border/40";
  const titleRowCls = "flex items-center gap-2.5";
  const iconWrapCls =
    "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0";
  const titleCls = "text-base sm:text-lg font-semibold tracking-tight";
  const subtitleCls = "text-xs text-muted-foreground mt-1";

  const pieHeight = 'clamp(220px, 26vw, 300px)';
  const barHeight = 'clamp(280px, 30vw, 360px)';

  const showPieEmpty = !loading && result && categoryData.length === 0;
  const showBarEmpty = !loading && result && topItemsData.length === 0;
  const emptyMsg = isTr
    ? 'Görüntülenecek veri yok'
    : 'No data to display';


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Category Distribution */}
      <Card className={cardCls}>
        <CardHeader className={headerCls}>
          <div className={titleRowCls}>
            <span className={iconWrapCls} aria-hidden="true">
              <PieIcon className="w-4 h-4 text-primary" />
            </span>
            <div className="min-w-0">
              <CardTitle className={titleCls}>
                {isTr ? 'Kategori Dağılımı' : 'Category Distribution'}
              </CardTitle>
              <p className={subtitleCls}>
                {isTr
                  ? 'Satın alma gücünüzün kategorilere göre dağılımı'
                  : 'How your purchasing power splits across categories'}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5 flex-1 flex flex-col">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center flex-1">
              <div className="w-full flex items-center justify-center" style={{ height: pieHeight }}>
                <Skeleton className="rounded-full aspect-square h-full max-h-full" />
              </div>
              <div className="space-y-2 sm:min-w-[160px]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          ) : showPieEmpty ? (
            <EmptyState message={emptyMsg} />
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center flex-1"
              role="img"
              aria-label={categoryAria}
            >
              <div className="w-full" style={{ height: pieHeight }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius="55%"
                      outerRadius="90%"
                      paddingAngle={2}
                      dataKey="value"
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                      isAnimationActive={false}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CategoryTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul
                role="list"
                aria-label={isTr ? 'Kategori göstergesi' : 'Category legend'}
                className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2 sm:min-w-[160px] text-sm"
              >
                {categoryData.map((c) => (
                  <li
                    key={c.rawName}
                    className="flex items-center gap-2 min-w-0"
                    tabIndex={0}
                    aria-label={`${c.name}: ${formatGroupedInt(c.pct, locale)}%, ${fmtMoney(c.value)}`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: c.fill }}
                      aria-hidden="true"
                    />
                    <span className="truncate text-foreground/90">{c.name}</span>
                    <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                      {formatGroupedInt(c.pct, locale)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Items by Quantity */}
      <Card className={cardCls}>
        <CardHeader className={headerCls}>
          <div className={titleRowCls}>
            <span className={iconWrapCls} aria-hidden="true">
              <BarChart3 className="w-4 h-4 text-primary" />
            </span>
            <div className="min-w-0">
              <CardTitle className={titleCls}>
                {isTr ? 'Adede Göre En İyi Ürünler' : 'Top Items by Quantity'}
              </CardTitle>
              <p className={subtitleCls}>
                {isTr
                  ? 'Bitcoin\'inizle alabileceğiniz en fazla 10 ürün'
                  : 'Top 10 items you could buy with your Bitcoin'}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5 flex-1 flex">
          {loading ? (
            <div className="w-full flex items-end gap-2 sm:gap-3" style={{ height: barHeight }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="flex-1 rounded-md"
                  style={{ height: `${30 + ((i * 17) % 60)}%` }}
                />
              ))}
            </div>
          ) : showBarEmpty ? (
            <EmptyState message={emptyMsg} />
          ) : (
            <div
              className="w-full"
              style={{ height: barHeight }}
              role="img"
              aria-label={topItemsAria}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topItemsData}
                  margin={{ top: 8, right: 12, left: 0, bottom: 60 }}
                >
                  <CartesianGrid
                    strokeDasharray="2 4"
                    vertical={false}
                    stroke="hsl(var(--border))"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    angle={-35}
                    textAnchor="end"
                    height={70}
                    interval={0}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={48}
                  />
                  <Tooltip
                    content={<BarTooltip />}
                    cursor={{ fill: 'hsl(var(--muted) / 0.4)' }}
                  />
                  <Bar dataKey="quantity" radius={[6, 6, 0, 0]} maxBarSize={48} isAnimationActive={false}>
                    {topItemsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
