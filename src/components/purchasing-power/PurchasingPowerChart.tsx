import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchasingPowerResult } from "@/services/purchasingPowerCalculator";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import { chartTooltipStyle, chartTooltipLabelStyle, chartTooltipItemStyle } from '@/components/calculator/chartTokens';
import { useLanguage } from '@/contexts/LanguageContext';

interface PurchasingPowerChartProps {
  result: PurchasingPowerResult | null;
  currencySymbol: string;
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

export const PurchasingPowerChart = ({ result, currencySymbol }: PurchasingPowerChartProps) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  if (!result) return null;


  // Prepare data for pie chart
  const categoryData = Object.entries(result.categoryBreakdown).map(([category, data], index) => ({
    name: category,
    value: data.total,
    count: data.count,
    fill: COLORS[index % COLORS.length]
  }));

  // Prepare data for bar chart (top 10 items)
  const topItemsData = result.topItems.slice(0, 10).map((item, index) => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
    quantity: item.quantity,
    fill: COLORS[index % COLORS.length]
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={chartTooltipStyle}>
          <p style={chartTooltipLabelStyle}>{payload[0].name}</p>
          <p style={chartTooltipItemStyle}>
            Value: {currencySymbol}{payload[0].value.toLocaleString(getCurrentIntlLocale())}
          </p>
          {payload[0].payload.count && (
            <p style={chartTooltipItemStyle}>
              {payload[0].payload.count} items
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={chartTooltipStyle}>
          <p style={chartTooltipLabelStyle}>{payload[0].payload.name}</p>
          <p style={chartTooltipItemStyle}>
            {isTr ? 'Adet' : 'Quantity'}: {payload[0].value.toLocaleString(getCurrentIntlLocale())}×
          </p>

        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Distribution */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <CardTitle>{isTr ? 'Kategori Dağılımı' : 'Category Distribution'}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ height: "clamp(195px, 120px + 28vw, 300px)" }}><ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="hsl(var(--chart-1))"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer></div>
        </CardContent>
      </Card>

      {/* Top Items by Quantity */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>{isTr ? 'Adede Göre En İyi Ürünler' : 'Top Items by Quantity'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: "clamp(260px, 160px + 28vw, 400px)" }}><ResponsiveContainer width="100%" height="100%">
            <BarChart data={topItemsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="quantity" radius={[8, 8, 0, 0]}>
                {topItemsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer></div>
        </CardContent>
      </Card>
    </div>
  );
};
